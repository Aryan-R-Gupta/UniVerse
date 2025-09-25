'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { reportLostItem, reportFoundItem, type ReportState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const itemCategories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'stationery', name: 'Stationery & Books' },
    { id: 'apparel', name: 'Apparel & Accessories' },
    { id: 'keys', name: 'Keys & ID Cards' },
    { id: 'other', name: 'Other' },
];

type FoundItem = {
  id: string;
  description: string;
  location: string;
  category: string;
  reportedByName: string;
  reportedAt: Date;
};

async function getFoundItems(): Promise<FoundItem[]> {
  const db = getFirestore(app);
  const itemsCol = collection(db, 'lost-and-found-items');
  const q = query(itemsCol, where('status', '==', 'found'), orderBy('reportedAt', 'desc'));
  const itemsSnapshot = await getDocs(q);
  return itemsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      description: data.description,
      location: data.location,
      category: data.category,
      reportedByName: data.reportedByName,
      reportedAt: (data.reportedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
}

function ReportSubmitButton({ pendingText }: { pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        'Submit Report'
      )}
    </Button>
  );
}

const ReportForm = ({ action, state, formRef, pendingText }: { action: (payload: FormData) => void, state: ReportState, formRef: React.RefObject<HTMLFormElement>, pendingText: string }) => {
    return (
        <form action={action} ref={formRef} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="description">Item Description</Label>
                <Textarea id="description" name="description" placeholder="e.g., Black leather wallet with a university ID inside." required rows={3} />
                {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Last Seen / Found At</Label>
                    <Input id="location" name="location" placeholder="e.g., Library, 2nd floor" required />
                    {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {itemCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
                </div>
            </div>
             <CardFooter className="px-0 pt-4">
                <ReportSubmitButton pendingText={pendingText} />
            </CardFooter>
        </form>
    );
};


export default function LostAndFoundPage() {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const lostFormRef = useRef<HTMLFormElement>(null);
  const foundFormRef = useRef<HTMLFormElement>(null);
  
  const initialLostState: ReportState = { message: null, errors: null, success: false };
  const [lostState, lostDispatch] = useActionState(reportLostItem, initialLostState);
  
  const initialFoundState: ReportState = { message: null, errors: null, success: false };
  const [foundState, foundDispatch] = useActionState(reportFoundItem, initialFoundState);
  
  async function fetchFoundItems() {
    try {
      const itemsData = await getFoundItems();
      setFoundItems(itemsData);
    } catch (error) {
      console.error("Failed to fetch found items:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load found items.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchFoundItems();
  }, []);

  const handleState = (state: ReportState, formRef: React.RefObject<HTMLFormElement>) => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Success', description: state.message });
        formRef.current?.reset();
        fetchFoundItems(); // Refetch on new 'found' item
      } else {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      }
    }
  };

  useEffect(() => handleState(lostState, lostFormRef), [lostState]);
  useEffect(() => handleState(foundState, foundFormRef), [foundState]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lost & Found</h1>
        <p className="text-muted-foreground">Report lost items or post items you've found on campus.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Found Items</h2>
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-md bg-muted/50">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                          ))
                        ) : foundItems.length > 0 ? (
                            foundItems.map(item => (
                                <div key={item.id} className="p-4 rounded-md bg-muted/50">
                                    <p className="font-semibold text-primary">{itemCategories.find(c => c.id === item.category)?.name || item.category}</p>
                                    <p className="mt-1">{item.description}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Found near {item.location} by {item.reportedByName} &bull; {formatDistanceToNow(item.reportedAt, { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Items Reported Yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                Be the first to report a found item!
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-4">Report an Item</h2>
            <Tabs defaultValue="lost" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="lost">I Lost Something</TabsTrigger>
                    <TabsTrigger value="found">I Found Something</TabsTrigger>
                </TabsList>
                <TabsContent value="lost">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report a Lost Item</CardTitle>
                            <CardDescription>Fill in the details of the item you've lost. We'll notify you if a match is found.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReportForm action={lostDispatch} state={lostState} formRef={lostFormRef} pendingText="Submitting..." />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="found">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report a Found Item</CardTitle>
                            <CardDescription>Thank you for being a good samaritan! Your report will appear in the "Found Items" feed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReportForm action={foundDispatch} state={foundState} formRef={foundFormRef} pendingText="Reporting..." />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}