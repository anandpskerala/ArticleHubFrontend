import { useRef, useState } from "react";
import type { Article } from "../interfaces/entities/Article";
import { ArrowLeft, Edit3, Folder, Tag, Image, X, Save, Upload } from "lucide-react";
import type { User } from "../interfaces/entities/User";
import { NavBar } from "./NavBar";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const ArticleEditPage: React.FC<{
    user?: User | null;
    article: Article;
    onSave: (article: Article) => void;
    onCancel: () => void
}> = ({ user, article, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Article>({ ...article });
    const [newTag, setNewTag] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = [
        'Technology', 'Science', 'Health', 'Business', 'Entertainment',
        'Sports', 'Politics', 'Travel', 'Food', 'Lifestyle', 'Education', 'Other'
    ];

    const handleInputChange = (field: keyof Article, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            handleInputChange('tags', [...formData.tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = (files: FileList | null) => {
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target?.result as string;
                    handleInputChange('image', imageUrl);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const handleRemoveImage = () => {
        handleInputChange('image', '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('title', formData.title || '');
        form.append('content', formData.content || '');
        form.append('category', formData.category || '');
        form.append('tags', JSON.stringify(formData.tags || []));
        if (fileInputRef.current?.files?.[0]) {
            form.append('image', fileInputRef.current.files[0]);
        }
        try {
            console.log(formData)
            const res = await axiosInstance.patch(`/article/${formData.id}`, form);

            const data = await res.data;
            if (data.article) {
                onSave(data.article);
                toast.success(data.message);
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            const error = err instanceof AxiosError ? err.response?.data.message: "Failed to edit article";
            toast.error(error)
            console.error('Failed to edit article:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <NavBar user={user} />
            <div className="max-w-4xl mt-15 mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCancel}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Edit3 className="text-blue-400" />
                                Edit Article
                            </h1>
                        </div>
                        <div className="text-sm text-gray-400">
                            <div>Created: {new Date(article.createdAt!).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Article Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="Enter article title..."
                                required
                            />
                        </div>

                        {/* Description */}

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => handleInputChange('content', e.target.value)}
                                rows={12}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                                placeholder="Write your article content here..."
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Folder className="inline w-4 h-4 mr-1" />
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Tag className="inline w-4 h-4 mr-1" />
                                Tags
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Add a tag..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-300 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Image className="inline w-4 h-4 mr-1" />
                                Images
                            </label>

                            {/* Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                    ? 'border-blue-400 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-300 mb-2">Drag and drop images here, or</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Browse Files
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                    className="hidden"
                                />
                            </div>

                            {/* Image Preview */}

                            <img
                                src={formData.image}
                                alt={`Upload image`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage()}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>


                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-700">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                                >
                                    <Save size={20} />
                                    Update Article
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
