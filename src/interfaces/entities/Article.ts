export interface Article {
    id: string;
    title: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
    authorId: string;
    likes: string[];
    dislikes: string[];
    blockedBy: string[];
    createdAt: string;
}