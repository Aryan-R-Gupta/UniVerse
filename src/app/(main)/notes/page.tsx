
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, PlusCircle, Loader2, User, Book, Clock } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { uploadNote, type UploadNoteState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

type Note = {
  id: string;
  title: string;
  content: string;
  course: string;
  authorName: string;
  createdAt: Date;
};

async function getNotes(): Promise<Note[]> {
  const db = getFirestore(app);
  const notesCol = collection(db, 'notes');
  const q = query(notesCol, orderBy('createdAt', 'desc'));
  const notesSnapshot = await getDocs(q);
  const notesList = notesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      course: data.course,
      authorName: data.authorName,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
  return notesList;
}

function UploadNoteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        'Upload Note'
      )}
    </Button>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const initialState: UploadNoteState = { message: null, errors: null };
  const [state, dispatch] = useActionState(uploadNote, initialState);


  async function fetchNotes() {
    try {
      const notesData = await getNotes();
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load notes.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchNotes();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ variant: 'destructive', title: 'Error Uploading Note', description: state.message });
      } else {
        toast({ title: 'Success', description: state.message });
        fetchNotes();
        dialogCloseRef.current?.click();
        formRef.current?.reset();
      }
    }
  }, [state, toast]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Note Sharing</h1>
          <p className="text-muted-foreground">Share and discover notes from your peers.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload a New Note</DialogTitle>
              <DialogDescription>
                Share your knowledge with the community. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <form action={dispatch} ref={formRef}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Note Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Chapter 5: Advanced Algorithms Summary" required />
                  {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="course">Course Name</Label>
                  <Input id="course" name="course" placeholder="e.g., Data Structures" required />
                  {state.errors?.course && <p className="text-sm text-destructive">{state.errors.course[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Note Content</Label>
                  <Textarea id="content" name="content" placeholder="Paste or write your note content here..." required rows={8}/>
                   {state.errors?.content && <p className="text-sm text-destructive">{state.errors.content[0]}</p>}
                </div>
              </div>
              <DialogFooter>
                <UploadNoteSubmitButton />
              </DialogFooter>
            </form>
             <DialogClose ref={dialogCloseRef} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full mt-2" />
                     <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-4 pt-2">
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </CardContent>
            </Card>
          ))
        ) : notes.length > 0 ? (
          notes.map(note => (
            <Card key={note.id}>
                <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>
                        <div className="flex items-center gap-4 text-xs">
                             <span className="flex items-center gap-1"><Book className="h-3 w-3" /> {note.course}</span>
                             <span className="flex items-center gap-1"><User className="h-3 w-3" /> {note.authorName}</span>
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(note.createdAt, { addSuffix: true })}</span>
                        </div>
                    </CardDescription>
                </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
              </CardContent>
              <CardFooter>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">View Full Note</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-5/6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{note.title}</DialogTitle>
                            <DialogDescription>
                                For {note.course} by {note.authorName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto pr-4 -mr-6">
                            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        </div>
                    </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Notes Available Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to upload a note and help your peers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
