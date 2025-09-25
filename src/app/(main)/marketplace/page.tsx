
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Loader2, Tag, Mail, ShoppingBag } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { listItem, type ListItemState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { marketplaceCategories } from './data';

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  contact: string;
  sellerName: string;
  createdAt: Date;
};

async function getItems(): Promise<MarketplaceItem[]> {
  const db = getFirestore(app);
  const itemsCol = collection(db, 'marketplace-items');
  const q = query(itemsCol, orderBy('createdAt', 'desc'));
  const itemsSnapshot = await getDocs(q);
  const itemsList = itemsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      contact: data.contact,
      sellerName: data.sellerName,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
  return itemsList;
}

function ListItemSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Listing Item...
        </>
      ) : (
        'List My Item'
      )}
    </Button>
  );
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const initialListState: ListItemState = { message: null, errors: null };
  const [listState, listDispatch] = useActionState(listItem, initialListState);

  async function fetchItems() {
    try {
      const itemsData = await getItems();
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to fetch marketplace items:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load marketplace items.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, []);

  useEffect(() => {
    if (listState.message) {
      if (listState.errors) {
        toast({ variant: 'destructive', title: 'Error', description: listState.message });
      } else {
        toast({ title: 'Success', description: listState.message });
        fetchItems(); // Re-fetch items
        dialogCloseRef.current?.click(); // Close dialog
        formRef.current?.reset();
      }
    }
  }, [listState, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell second-hand items within the campus.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              List an Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>List an Item for Sale</DialogTitle>
              <DialogDescription>
                Fill in the details of the item you want to sell.
              </DialogDescription>
            </DialogHeader>
            <form action={listDispatch} ref={formRef} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input id="title" name="title" placeholder="e.g., Scientific Calculator" required />
                {listState.errors?.title && <p className="text-sm text-destructive">{listState.errors.title[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="e.g., Casio FX-991EX, barely used" required />
                {listState.errors?.description && <p className="text-sm text-destructive">{listState.errors.description[0]}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" placeholder="e.g., 800" required />
                    {listState.errors?.price && <p className="text-sm text-destructive">{listState.errors.price[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                     <Select name="category" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {marketplaceCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {listState.errors?.category && <p className="text-sm text-destructive">{listState.errors.category[0]}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Details</Label>
                <Input id="contact" name="contact" placeholder="e.g., Email or Phone Number" required />
                {listState.errors?.contact && <p className="text-sm text-destructive">{listState.errors.contact[0]}</p>}
              </div>
              <DialogFooter>
                <ListItemSubmitButton />
              </DialogFooter>
            </form>
            <DialogClose ref={dialogCloseRef} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))
        ) : items.length > 0 ? (
          items.map(item => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate text-lg">{item.title}</CardTitle>
                <p className="font-bold text-primary text-xl">₹{item.price}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                 <div className="flex items-center gap-2 text-muted-foreground text-xs pt-2 mt-2 border-t">
                    <Tag className="h-3 w-3" />
                    <span>{marketplaceCategories.find(c => c.id === item.category)?.name || item.category}</span>
                 </div>
              </CardContent>
              <CardFooter className="p-4 bg-muted/50 mt-4">
                 <div className="w-full">
                    <p className="text-sm font-medium">{item.sellerName}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{item.contact}</span>
                    </div>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Marketplace is Empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to list an item for sale!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
