import { useEffect, useState } from 'react';
import { Heart, ThumbsDown, Ban, X, Calendar, User } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppSelector, type RootState } from '../store';
import { NavBar } from '../components/NavBar';
import axiosInstance from '../utils/axiosInstance';
import Pagination from '../components/Pagination';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ArticleWithMetadata } from '../interfaces/props/ArticleCardProps';
import { ArticleCard } from '../components/ArticleCard';



const HomePage = () => {
    const { user } = useAppSelector((state: RootState) => state.auth)
    const currentUserId = user?.id as string;
    const [selectedArticle, setSelectedArticle] = useState<ArticleWithMetadata | null>(null);
    const [articles, setArticles] = useState<ArticleWithMetadata[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const handleLike = async (articleId: string) => {
        try {
            const article = articles.find(a => a.id === articleId);
            if (!article) return;

            const hasLiked = article.likes.includes(currentUserId);
            const hasDisliked = article.dislikes.includes(currentUserId);

            if (hasLiked) {
                await axiosInstance.delete(`/like/${articleId}`);
            } else {
                await axiosInstance.patch(`/like/${articleId}`);
            }

            const updatedArticles = articles.map(article => {
                if (article.id !== articleId) return article;

                return {
                    ...article,
                    likes: hasLiked
                        ? article.likes.filter(id => id !== currentUserId)
                        : [...article.likes, currentUserId],
                    dislikes: hasDisliked
                        ? article.dislikes.filter(id => id !== currentUserId)
                        : article.dislikes,
                };
            });

            setArticles(updatedArticles);

            if (selectedArticle?.id === articleId) {
                const updated = updatedArticles.find(a => a.id === articleId);
                if (updated) setSelectedArticle(updated);
            }

        } catch (error) {
            toast.error(
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Something went wrong"
            );
        }
    };


    const handleDislike = async (articleId: string) => {
        try {
            const article = articles.find(a => a.id === articleId);
            if (!article) return;

            const hasDisliked = article.dislikes.includes(currentUserId);
            const hasLiked = article.likes.includes(currentUserId);

            if (hasLiked) {
                await axiosInstance.delete(`/like/${articleId}`);
            } else {
                await axiosInstance.patch(`/like/${articleId}`);
            }

            const updatedArticles = articles.map(article => {
                if (article.id !== articleId) return article;

                return {
                    ...article,
                    dislikes: hasDisliked
                        ? article.dislikes.filter(id => id !== currentUserId)
                        : [...article.dislikes, currentUserId],
                    likes: hasLiked
                        ? article.likes.filter(id => id !== currentUserId)
                        : article.likes,
                };
            });

            setArticles(updatedArticles);

            if (selectedArticle?.id === articleId) {
                const updated = updatedArticles.find(a => a.id === articleId);
                if (updated) setSelectedArticle(updated);
            }

        } catch (error) {
            toast.error(
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Something went wrong"
            );
        }
    };

    const handleBlock = async (articleId: string) => {
        try {
            const targetArticle = articles.find(article => article.id === articleId);
            if (!targetArticle) return;

            const isCurrentlyBlocked = targetArticle.blockedBy.includes(currentUserId);

            if (isCurrentlyBlocked) {
                await axiosInstance.delete(`/block/${articleId}`);
            } else {
                await axiosInstance.patch(`/block/${articleId}`);
            }

            setArticles(prev =>
                prev.map(article => {
                    if (article.id === articleId) {
                        const updatedBlockedBy = isCurrentlyBlocked
                            ? article.blockedBy.filter(userId => userId !== currentUserId)
                            : [...article.blockedBy, currentUserId];

                        return { ...article, blockedBy: updatedBlockedBy };
                    }
                    return article;
                })
            );

            if (selectedArticle?.id === articleId) {
                const updatedBlockedBy = isCurrentlyBlocked
                    ? selectedArticle.blockedBy.filter(id => id !== currentUserId)
                    : [...selectedArticle.blockedBy, currentUserId];

                setSelectedArticle({ ...selectedArticle, blockedBy: updatedBlockedBy });
            }

        } catch (error) {
            toast.error(
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Something went wrong"
            );
        }
    };


    const openArticle = (article: ArticleWithMetadata) => {
        if (!article.blockedBy.includes(currentUserId)) {
            setSelectedArticle(article);
        }
    };

    const closeArticle = () => {
        setSelectedArticle(null);
    };

    const getTagColor = (tag: string) => {
        const colors: { [key: string]: string } = {
            'Technology': 'bg-blue-900/30 text-blue-300 border border-blue-700/50',
            'Healthcare': 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50',
            'AI': 'bg-purple-900/30 text-purple-300 border border-purple-700/50',
            'Environment': 'bg-green-900/30 text-green-300 border border-green-700/50',
            'Lifestyle': 'bg-indigo-900/30 text-indigo-300 border border-indigo-700/50',
            'Sustainability': 'bg-teal-900/30 text-teal-300 border border-teal-700/50',
            'Career': 'bg-orange-900/30 text-orange-300 border border-orange-700/50',
            'Remote Work': 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/50',
            'Productivity': 'bg-amber-900/30 text-amber-300 border border-amber-700/50',
            'Psychology': 'bg-pink-900/30 text-pink-300 border border-pink-700/50',
            'Self-Improvement': 'bg-rose-900/30 text-rose-300 border border-rose-700/50',
            'Decision Making': 'bg-violet-900/30 text-violet-300 border border-violet-700/50',
            'Food': 'bg-red-900/30 text-red-300 border border-red-700/50',
            'Culture': 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50',
            'Travel': 'bg-lime-900/30 text-lime-300 border border-lime-700/50',
            'Minimalism': 'bg-slate-700/30 text-slate-300 border border-slate-600/50'
        };
        return colors[tag] || 'bg-gray-700/30 text-gray-300 border border-gray-600/50';
    };

    const visibleArticles = articles.filter(article => !article.blockedBy.includes(currentUserId));
    const blockedCount = articles.filter(article => article.blockedBy.includes(currentUserId)).length;

    useEffect(() => {
        const fetchRequest = async (pageNumber = 1, limit: number = 10) => {
            const res = await axiosInstance.get(`/articles?page=${pageNumber}&limit=${limit}`);
            if (res.data) {
                setArticles(res.data.articles);
                setPage(Number(res.data.page));
                setPages(Number(res.data.pages));
            }
        };

        fetchRequest(page, 10);
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-900">
            <NavBar user={user} />
            <main className="mt-15 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Your Dashboard</h2>
                    <p className="text-gray-400">Discover articles tailored to your interests</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleArticles.map((article) => {
                        const isLiked = article.likes.includes(currentUserId);
                        const isDisliked = article.dislikes.includes(currentUserId);

                        return (
                            <ArticleCard 
                                key={article.id}
                                article={article} 
                                isLiked={isLiked} 
                                isDisliked={isDisliked}
                                openArticle={() => openArticle(article)}
                                getTagColor={getTagColor}
                                handleLike={() => handleLike(article.id)}
                                handleDislike={() => handleDislike(article.id)}
                                handleBlock={() => handleBlock(article.id)}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setPage}
                    />
                </div>
            </main>

            {selectedArticle && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="relative">
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl" />
                            <button
                                onClick={closeArticle}
                                className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-900 backdrop-blur-sm rounded-full p-2 transition-all"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {selectedArticle.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${getTagColor(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-4">
                                {selectedArticle.title}
                            </h1>

                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-300 font-medium">{selectedArticle.authorId.firstName} {selectedArticle.authorId.lastName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleLike(selectedArticle.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${selectedArticle.likes.includes(currentUserId)
                                            ? 'bg-red-900/30 text-red-400 border border-red-700/50'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${selectedArticle.likes.includes(currentUserId) ? 'fill-current' : ''}`} />
                                        <span>{selectedArticle.likes.length}</span>
                                    </button>

                                    <button
                                        onClick={() => handleDislike(selectedArticle.id)}
                                        className={`p-2 rounded-full transition-colors ${selectedArticle.dislikes.includes(currentUserId)
                                            ? 'bg-red-900/30 text-red-400 border border-red-700/50'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <ThumbsDown className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleBlock(selectedArticle.id);
                                            closeArticle();
                                        }}
                                        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                                    >
                                        <Ban className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <span className="text-gray-300 leading-relaxed text-lg">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {selectedArticle.content}
                                    </ReactMarkdown>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {blockedCount > 0 && (
                <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg shadow-xl">
                    {blockedCount} article(s) blocked
                </div>
            )}
        </div>
    );
}

export default HomePage