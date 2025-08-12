import type { Article } from "../entities/Article";
import type { UserData } from "../entities/User";

export interface ArticleWithMetadata extends Omit<Article, 'authorId'> {
    authorId: UserData;
}

export interface ArticleCardProps {
    article: ArticleWithMetadata;
    isLiked: boolean;
    isDisliked: boolean;
    openArticle: (article: ArticleWithMetadata) => void;
    getTagColor: (tag: string) => string;
    handleBlock: (articleId: string) => void;
    handleDislike: (articleId: string) => void;
    handleLike: (articleId: string) => void;
}