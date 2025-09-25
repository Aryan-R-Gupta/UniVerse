
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCopy, PlusCircle, Loader2, User, Library } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { listBook, type BookListState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

type Book = {
  id: string;
  title: string;
  author: string;
  condition: string;
  listedBy: string;
  status: 'Available' | 'Requested';
  createdAt: Date;
};

async function getBooks(): Promise<Book[]> {
  const db = getFirestore(app);
  const booksCol = collection(db, 'book-exchange');
  const q = query(booksCol, orderBy('createdAt', 'desc'));
  const booksSnapshot = await getDocs(q);
  const booksList = booksSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      author: data.author,
      condition: data.condition,
      listedBy: data.listedByName,
      status: data.status,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
  });
  return booksList;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Listing Book...
        </>
      ) : (
        'List My Book'
      )}
    </Button>
  );
}

export default function BookExchangePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const initialState: BookListState = { message: null, errors: null };
  const [state, dispatch] = useActionState(listBook, initialState);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load books.' });
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      } else {
        toast({ title: 'Success', description: state.message });
        getBooks().then(setBooks); // Re-fetch books
        dialogCloseRef.current?.click(); // Close dialog
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Book Exchange</h1>
          <p className="text-muted-foreground">Lend and borrow textbooks with fellow students.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              List a Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>List Your Textbook</DialogTitle>
              <DialogDescription>
                Fill in the details of the book you want to lend or sell.
              </DialogDescription>
            </DialogHeader>
            <form action={dispatch} ref={formRef}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Introduction to Algorithms" required />
                  {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" name="author" placeholder="e.g., Thomas H. Cormen" required />
                   {state.errors?.author && <p className="text-sm text-destructive">{state.errors.author[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Input id="condition" name="condition" placeholder="e.g., Like New, Good, Used" required />
                  {state.errors?.condition && <p className="text-sm text-destructive">{state.errors.condition[0]}</p>}
                </div>
              </div>
              <DialogFooter>
                <SubmitButton />
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
              <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))
        ) : books.length > 0 ? (
          books.map(book => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle className="truncate">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{book.condition}</Badge>
                  <Badge variant={book.status === 'Available' ? 'default' : 'secondary'} className={book.status === 'Available' ? 'bg-emerald-600' : ''}>
                    {book.status}
                  </Badge>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Listed by {book.listedBy}</span>
                 </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Library className="h-4 w-4" />
                    <span className="text-sm">Posted {formatDistanceToNow(book.createdAt, { addSuffix: true })}</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={book.status !== 'Available'}>
                  Request to Borrow
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Books Listed Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to list a book for exchange!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

    