
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Loader2, Tag, Mail, ShoppingBag, Trash2, Pencil, Search } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { listItem, updateItem, deleteItem, type ListItemState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { marketplaceCategories } from './data';
import { userProfileData } from '@/lib/data';

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  contact: string;
  sellerName: string;
  sellerEmail: string;
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
      sellerEmail: data.sellerEmail,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
  return itemsList;
}

function ListItemSubmitButton({ isUpdate = false }: { isUpdate?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isUpdate ? 'Updating...' : 'Listing...'}
        </>
      ) : (
        isUpdate ? 'Save Changes' : 'List My Item'
      )}
    </Button>
  );
}

function DeleteButton({ itemId }: { itemId: string }) {
    const { pending } = useFormStatus();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={pending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your item listing.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={deleteItem}>
                        <input type="hidden" name="itemId" value={itemId} />
                        <AlertDialogAction type="submit" className="bg-destructive hover:bg-destructive/90">
                           {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState<MarketplaceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { toast } = useToast();
  const listFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const listDialogCloseRef = useRef<HTMLButtonElement>(null);
  const editDialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const initialListState: ListItemState = { message: null, errors: null };
  const [listState, listDispatch] = useActionState(listItem, initialListState);
  const [editState, editDispatch] = useActionState(updateItem, initialListState);


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
        fetchItems(); 
        listDialogCloseRef.current?.click(); 
        listFormRef.current?.reset();
      }
    }
  }, [listState, toast]);

  useEffect(() => {
    if (editState.message) {
        if (editState.errors) {
            toast({ variant: 'destructive', title: 'Error', description: editState.message });
        } else {
            toast({ title: 'Success', description: editState.message });
            fetchItems();
            editDialogCloseRef.current?.click();
        }
    }
  }, [editState, toast])

  const handleEditClick = (item: MarketplaceItem) => {
    setCurrentItem(item);
    setIsEdit(true);
  }

  const ItemForm = ({ isUpdate = false, item, formRef, dispatch }: { isUpdate?: boolean, item?: MarketplaceItem | null, formRef: React.RefObject<HTMLFormElement>, dispatch: (payload: FormData) => void }) => {
    const state = isUpdate ? editState : listState;
    return (
         <form action={dispatch} ref={formRef} className="space-y-4">
            {isUpdate && <input type="hidden" name="itemId" value={item?.id} />}
            <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input id="title" name="title" defaultValue={item?.title} placeholder="e.g., Scientific Calculator" required />
                {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={item?.description} placeholder="e.g., Casio FX-991EX, barely used" required />
                {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" defaultValue={item?.price} placeholder="e.g., 800" required />
                    {state.errors?.price && <p className="text-sm text-destructive">{state.errors.price[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={item?.category} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {marketplaceCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact">Contact Details</Label>
                <Input id="contact" name="contact" defaultValue={item?.contact} placeholder="e.g., Email or Phone Number" required />
                {state.errors?.contact && <p className="text-sm text-destructive">{state.errors.contact[0]}</p>}
            </div>
            <DialogFooter>
                <ListItemSubmitButton isUpdate={isUpdate} />
            </DialogFooter>
        </form>
    )
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
                          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell second-hand items within the campus.</p>
        </div>
        <Dialog onOpenChange={(open) => !open && listFormRef.current?.reset()}>
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
            <ItemForm formRef={listFormRef} dispatch={listDispatch} />
            <DialogClose ref={listDialogCloseRef} />
          </DialogContent>
        </Dialog>
      </div>

       <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
           <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {marketplaceCategories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="shrink-0"
            >
              {cat.name}
            </Button>
          ))}
        </div>
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
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
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
              <CardFooter className="p-2 bg-muted/50 mt-4 flex items-center justify-between">
                 <div className="w-full">
                    <p className="text-sm font-medium">{item.sellerName}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{item.contact}</span>
                    </div>
                </div>
                 {item.sellerEmail === userProfileData.email && (
                    <div className="flex items-center">
                        <Dialog onOpenChange={(open) => { if(!open) setIsEdit(false); }}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Your Listing</DialogTitle>
                                    <DialogDescription>
                                        Update the details of your item for sale.
                                    </DialogDescription>
                                </DialogHeader>
                                {isEdit && <ItemForm isUpdate={true} item={currentItem} formRef={editFormRef} dispatch={editDispatch} />}
                                <DialogClose ref={editDialogCloseRef} />
                            </DialogContent>
                        </Dialog>
                        <DeleteButton itemId={item.id} />
                    </div>
                 )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Items Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
