import { useEffect, useState } from "react";
import type { Article } from "../interfaces/entities/Article";
import { FileText, Folder, Edit3, Trash2, X } from "lucide-react";
import { ArticleCreatePage } from "../components/ArticleCreatePage";
import { ArticleEditPage } from "../components/ArticleEditPage";
import { NavBar } from "../components/NavBar";
import { useAppSelector, type RootState } from "../store";
import Pagination from "../components/Pagination";
import axiosInstance from "../utils/axiosInstance";

const ArticleListPage = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const [currentPage, setCurrentPage] = useState<'list' | 'create' | 'edit'>('list');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState<Article | undefined>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        show: boolean;
        article: Article | null;
    }>({ show: false, article: null });

    const handleSave = (article: Article) => {
        console.log(article);
        if (currentPage === 'edit') {
            setArticles(prev => prev.map(a => a.id === article.id ? article : a));
        } else {
            setArticles(prev => [...prev, article]);
        }
        setCurrentPage('list');
        setSelectedArticle(undefined);
    };

    const handleCancel = () => {
        setCurrentPage('list');
        setSelectedArticle(undefined);
    };

    const handleEdit = (article: Article) => {
        setSelectedArticle(article);
        setCurrentPage('edit');
    };

    const handleDeleteClick = (article: Article) => {
        setDeleteConfirmation({ show: true, article });
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmation.article) {
            try {
                await axiosInstance.delete(`/article/${deleteConfirmation.article.id}`);
                
                setArticles(prev => prev.filter(a => a.id !== deleteConfirmation.article!.id));
                setDeleteConfirmation({ show: false, article: null });
            } catch (error) {
                console.error('Failed to delete article:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ show: false, article: null });
    };

    useEffect(() => {
        const fetchRequest = async (pageNumber = 1, limit: number = 10) => {
            const res = await axiosInstance.get(`/articles?page=${pageNumber}&limit=${limit}&isCreator=true`);
            if (res.data) {
                setArticles(res.data.articles);
                setPage(Number(res.data.page));
                setPages(Number(res.data.pages));
            }
        };

        fetchRequest(page);
    }, [page]);

    if (currentPage === 'create') {
        return <ArticleCreatePage user={user} onSave={handleSave} onCancel={handleCancel} />;
    }

    if (currentPage === 'edit' && selectedArticle) {
        return <ArticleEditPage user={user} article={selectedArticle} onSave={handleSave} onCancel={handleCancel} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
            <NavBar user={user} />
            <div className="max-w-6xl mt-15 mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">My Articles</h1>
                    <button
                        onClick={() => setCurrentPage('create')}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FileText size={20} />
                        <span className="sm:inline">Create New Article</span>
                    </button>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {articles.map(article => (
                        <div key={article.id} className="bg-gray-800 rounded-lg p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-semibold mb-2 break-words">{article.title}</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Folder size={14} />
                                            <span className="truncate">{article.category}</span>
                                        </span>
                                        <span className="text-xs sm:text-sm">
                                            Created: {new Date(article.createdAt!).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(article)}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <Edit3 size={16} />
                                        <span className="hidden xs:inline sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(article)}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden xs:inline sm:inline">Delete</span>
                                    </button>
                                </div>
                            </div>

                            {article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {article.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4 sm:mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setPage}
                    />
                </div>

                {deleteConfirmation.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Confirm Delete</h3>
                                <button
                                    onClick={handleDeleteCancel}
                                    className="text-gray-400 hover:text-white p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <p className="text-gray-300 mb-6 text-sm sm:text-base">
                                Are you sure you want to delete the article "{deleteConfirmation.article?.title}"? 
                                This action cannot be undone.
                            </p>
                            
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleListPage;