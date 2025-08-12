import { Ban, Heart, ThumbsDown, User } from 'lucide-react';
import React from 'react'
import type { ArticleCardProps } from '../interfaces/props/ArticleCardProps';

export const ArticleCard: React.FC<ArticleCardProps> = ({article, isLiked, isDisliked, openArticle, getTagColor, handleLike, handleDislike, handleBlock}) => {
    return (
        <div
            key={article.id}
            className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer border border-gray-700 hover:border-gray-600"
            onClick={() => openArticle(article)}
        >
            <div className="relative">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getTagColor(tag)}`}
                        >
                            {tag}
                        </span>
                    ))}
                    {article.tags.length > 2 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/80 text-gray-300 backdrop-blur-sm border border-gray-600/50">
                            +{article.tags.length - 2}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="text-gray-400">{article.authorId.firstName} {article.authorId.lastName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike(article.id);
                            }}
                            className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{article.likes.length}</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDislike(article.id);
                            }}
                            className={`p-1 rounded-full transition-colors ${isDisliked ? 'text-red-400 bg-red-900/20' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <ThumbsDown className="w-4 h-4" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(article.id);
                            }}
                            className="p-1 rounded-full text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors"
                        >
                            <Ban className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
