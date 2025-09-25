
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, PlusCircle, Loader2, ThumbsUp, MessageCircle, ZoomIn } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { createPost, type CreatePostState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { type ForumPost } from './types';
import { forumChannels } from './data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


async function getPosts(): Promise<ForumPost[]> {
  const db = getFirestore(app);
  const postsCol = collection(db, 'forum-posts');
  const q = query(postsCol, orderBy('createdAt', 'desc'));
  const postsSnapshot = await getDocs(q);
  const postsList = postsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      channel: data.channel,
      authorName: data.authorName,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      upvotes: data.upvotes ?? 0,
      commentCount: data.commentCount ?? 0,
    };
  });
  return postsList;
}

function CreatePostSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Post'
      )}
    </Button>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const initialFormState: CreatePostState = { message: null, errors: null };
  const [formState, formDispatch] = useActionState(createPost, initialFormState);


  async function fetchPosts() {
    try {
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load forum posts.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    if (formState.message) {
      if (formState.errors) {
        toast({ variant: 'destructive', title: 'Error Creating Post', description: formState.message });
      } else {
        toast({ title: 'Success', description: formState.message });
        fetchPosts();
        dialogCloseRef.current?.click();
        formRef.current?.reset();
      }
    }
  }, [formState, toast]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Discuss topics with the campus community.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>
                Choose a channel and share your thoughts with the community.
              </DialogDescription>
            </DialogHeader>
            <form action={formDispatch} ref={formRef}>
              <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Select name="channel" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                        <SelectContent>
                            {forumChannels.map(channel => (
                                <SelectItem key={channel.id} value={channel.id}>{channel.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formState.errors?.channel && <p className="text-sm text-destructive">{formState.errors.channel[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Best places to study on campus?" required />
                  {formState.errors?.title && <p className="text-sm text-destructive">{formState.errors.title[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" placeholder="Share more details here..." required rows={5}/>
                   {formState.errors?.content && <p className="text-sm text-destructive">{formState.errors.content[0]}</p>}
                </div>
              </div>
              <DialogFooter>
                <CreatePostSubmitButton />
              </DialogFooter>
            </form>
             <DialogClose ref={dialogCloseRef} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </CardContent>
            </Card>
          ))
        ) : posts.length > 0 ? (
          posts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-primary mb-1">#{post.channel}</p>
                        <Link href={`/forum/post/${post.id}`} className="hover:underline">
                            <h3 className="text-lg font-bold">{post.title}</h3>
                        </Link>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <ZoomIn className="h-5 w-5" />
                                <span className="sr-only">View Post</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{post.title}</DialogTitle>
                                <DialogDescription>
                                    in #{post.channel} by {post.authorName} &bull; {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 whitespace-pre-wrap text-sm">
                                {post.content}
                            </div>
                            <DialogFooter>
                                <Button asChild>
                                    <Link href={`/forum/post/${post.id}`}>View Comments</Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                    <p>by {post.authorName} &bull; {formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" /> {post.upvotes}
                        </span>
                         <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" /> {post.commentCount}
                        </span>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Posts Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to start a conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
