
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { doc, getDoc, getFirestore, collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, MessageCircle, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type ForumPost, type ForumComment } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addComment, upvotePost, type AddCommentState, type UpvoteState } from '../../actions';
import { userProfileData } from '@/lib/data';

async function getPost(postId: string): Promise<ForumPost | null> {
    const db = getFirestore(app);
    const postRef = doc(db, 'forum-posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
        return null;
    }

    const data = postSnap.data();
    return {
        id: postSnap.id,
        title: data.title,
        content: data.content,
        channel: data.channel,
        authorName: data.authorName,
        createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
        upvotes: data.upvotes ?? 0,
        commentCount: data.commentCount ?? 0,
    };
}

async function getComments(postId: string): Promise<ForumComment[]> {
    const db = getFirestore(app);
    const commentsCol = collection(db, 'forum-comments');
    const q = query(commentsCol, where('postId', '==', postId), orderBy('createdAt', 'asc'));
    const commentsSnapshot = await getDocs(q);

    return commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            postId: data.postId,
            authorName: data.authorName,
            content: data.content,
            createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
        };
    });
}

function UpvoteButton({ initialUpvotes }: { initialUpvotes: number }) {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" size="sm" className="flex items-center gap-1" type="submit" disabled={pending}>
            <ThumbsUp className="h-4 w-4" /> 
            {pending ? 'Upvoting...' : `${initialUpvotes} Upvotes`}
        </Button>
    )
}

export default function PostPage({ params }: { params: { postId: string } }) {
    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const addCommentWithPostId = addComment.bind(null, params.postId);
    const initialCommentState: AddCommentState = { message: null, errors: null };
    const [commentState, commentDispatch] = useActionState(addCommentWithPostId, initialCommentState);
    
    const upvotePostWithId = upvotePost.bind(null, params.postId);
    const initialUpvoteState: UpvoteState = {};
    const [upvoteState, upvoteDispatch] = useActionState(upvotePostWithId, initialUpvoteState);


    async function fetchData() {
        setLoading(true);
        try {
            const [postData, commentsData] = await Promise.all([
                getPost(params.postId),
                getComments(params.postId)
            ]);
            setPost(postData);
            setComments(commentsData);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: "Could not load post data." });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [params.postId]);
    
    useEffect(() => {
        if (commentState.message) {
            if(commentState.errors) {
                 toast({ variant: 'destructive', title: 'Error', description: commentState.message });
            } else {
                 toast({ title: 'Success', description: commentState.message });
                 formRef.current?.reset();
                 fetchData(); // Refetch data to show the new comment
            }
        }
    }, [commentState, toast]);

    useEffect(() => {
        if (upvoteState.message && !upvoteState.error) {
            fetchData(); // Refetch data to show new upvote count
        } else if (upvoteState.error) {
            toast({ variant: 'destructive', title: 'Error', description: upvoteState.error });
        }
    }, [upvoteState, toast]);


    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <div className="space-y-3 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                 <div className="pt-8 space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </div>
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold text-primary">#{post.channel}</p>
                <h1 className="text-3xl font-bold mt-1">{post.title}</h1>
                <p className="text-muted-foreground mt-2">
                    Posted by {post.authorName} &bull; {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mt-6 border-t pt-4">
                        <form action={upvoteDispatch}>
                            <UpvoteButton initialUpvotes={post.upvotes} />
                        </form>
                         <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" /> {comments.length} Comments
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Comments</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>Leave a comment</CardTitle>
                    </CardHeader>
                     <form action={commentDispatch} ref={formRef}>
                        <CardContent className="space-y-2">
                            <Label htmlFor="comment" className="sr-only">Comment</Label>
                            <Textarea id="comment" name="comment" placeholder={`Replying as ${userProfileData.name}...`} required />
                            {commentState.errors?.comment && <p className="text-sm text-destructive">{commentState.errors.comment[0]}</p>}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit">Post Comment</Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <Card key={comment.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                     <p className="text-sm">{comment.content}</p>
                                     <p className="text-xs text-muted-foreground mt-2">
                                        {comment.authorName} &bull; {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                     </p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-8">Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

