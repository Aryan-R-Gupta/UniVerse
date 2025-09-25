
export type ForumPost = {
  id: string;
  title: string;
  content: string;
  channel: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
  commentCount: number;
};

export type ForumComment = {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: Date;
};
