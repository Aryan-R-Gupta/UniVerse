
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { CheckCircle, XCircle, CameraOff, User, Ticket, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import QrScanner from 'qr-scanner';

type RegistrationDetails = {
    id: string;
    eventTitle: string;
    firstName: string;
    lastName: string;
    studentId: string;
    registeredAt: Date;
};

export default function EventCheckInPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<RegistrationDetails | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const videoElem = videoRef.current;
    
    if (!videoElem) {
      return;
    }

    const startScanner = async () => {
      try {
        if (!await QrScanner.hasCamera()) {
          throw new Error('No camera found.');
        }
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        const qrScanner = new QrScanner(
          videoElem,
          result => {
            qrScanner.stop();
            handleScan(result.data);
          },
          {
            onDecodeError: error => {
              
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = qrScanner;

        if (isScanning) {
          await qrScanner.start();
        }
      } catch (error: any) {
        console.error('Error accessing camera or starting scanner:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: error.message || 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    if (isScanning && !scannerRef.current) {
      startScanner();
    }

    return () => {
        if (scannerRef.current) {
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
    };
  }, [isScanning, toast]);


  const handleScan = async (data: string) => {
    setIsScanning(false);
    setIsInvalid(false);
    setScanResult(null);

    try {
      const parsedData = JSON.parse(data);
      if (!parsedData.registrationId) {
        throw new Error('Invalid QR code format.');
      }

      const db = getFirestore(app);
      const docRef = doc(db, 'event-registrations', parsedData.registrationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const regData = docSnap.data();
        setScanResult({
            id: docSnap.id,
            eventTitle: regData.eventTitle,
            firstName: regData.firstName,
            lastName: regData.lastName,
            studentId: regData.studentId,
            registeredAt: regData.registeredAt.toDate(),
        });
      } else {
        setIsInvalid(true);
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setIsInvalid(true);
    }
  };


  const handleReset = () => {
    setIsScanning(true);
    setScanResult(null);
    setIsInvalid(false);
    
    if (scannerRef.current && videoRef.current) {
        scannerRef.current.start().catch(err => {
            console.error("Failed to restart scanner", err);
            toast({
                variant: 'destructive',
                title: 'Scanner Error',
                description: 'Could not restart the scanner.'
            });
        });
    } else {
         
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Event Check-in</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Point a student's QR code ticket at the camera.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center relative">
                <video ref={videoRef} className="w-full h-full object-cover rounded-md" playsInline />
                {hasCameraPermission === null && <p>Checking for camera...</p>}
                {hasCameraPermission === false && (
                    <Alert variant="destructive" className="absolute">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                {!isScanning && hasCameraPermission && (
                    <div className="absolute inset-0 bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
                        <p className="font-semibold mb-4">Scan complete. See result on the right.</p>
                        <Button onClick={handleReset}>Scan Next Ticket</Button>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Verification Result</CardTitle>
                <CardDescription>Details of the scanned ticket will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
                 {!isScanning && scanResult && (
                    <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <AlertTitle className="font-bold text-green-700 dark:text-green-300">Ticket Verified</AlertTitle>
                        <AlertDescription className="space-y-3 mt-4">
                           <div className="flex items-center gap-3">
                              <User className="h-4 w-4" />
                              <p><span className="font-semibold">{scanResult.firstName} {scanResult.lastName}</span> ({scanResult.studentId})</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Ticket className="h-4 w-4" />
                                <p>Event: <span className="font-semibold">{scanResult.eventTitle}</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4" />
                                <p>Registered: <span className="font-semibold">{format(scanResult.registeredAt, 'PPp')}</span></p>
                            </div>
                        </AlertDescription>
                    </Alert>
                 )}
                 {!isScanning && isInvalid && (
                     <Alert variant="destructive">
                        <XCircle className="h-5 w-5" />
                        <AlertTitle className="font-bold">Invalid Ticket</AlertTitle>
                        <AlertDescription>
                            This QR code is not valid for any event or has already been used.
                        </AlertDescription>
                    </Alert>
                 )}
                 {isScanning && (
                     <div className="text-center text-muted-foreground p-8">
                        <p>Awaiting scan...</p>
                    </div>
                 )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
