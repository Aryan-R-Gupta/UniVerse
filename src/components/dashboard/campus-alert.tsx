
'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type CampusAlert = {
    message: string;
    createdAt: Date;
};

async function getLatestAlert(): Promise<CampusAlert | null> {
    const db = getFirestore(app);
    const alertsCol = collection(db, 'campus-alerts');
    const q = query(alertsCol, orderBy('createdAt', 'desc'), limit(1));
    const alertSnapshot = await getDocs(q);

    if (alertSnapshot.empty) {
        return null;
    }

    const latestDoc = alertSnapshot.docs[0];
    const data = latestDoc.data();
    return {
        message: data.message,
        createdAt: (data.createdAt as Timestamp).toDate(),
    };
}

export function CampusAlert() {
    const [alert, setAlert] = useState<CampusAlert | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlert() {
            try {
                const latestAlert = await getLatestAlert();
                // Show only alerts from the last 24 hours
                if (latestAlert && (new Date().getTime() - latestAlert.createdAt.getTime()) < 24 * 60 * 60 * 1000) {
                    setAlert(latestAlert);
                }
            } catch (error) {
                console.error("Failed to fetch campus alert:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAlert();
    }, []);

    if (loading) {
        return <Skeleton className="h-20 w-full" />;
    }

    if (!alert) {
        return null; // Don't render anything if there's no recent alert
    }

    return (
        <Alert className="bg-primary/10 border-primary/20">
            <Megaphone className="h-4 w-4 text-primary" />
            <AlertTitle className="font-bold text-primary">Campus Announcement</AlertTitle>
            <AlertDescription>
                {alert.message}
            </AlertDescription>
        </Alert>
    );
}
