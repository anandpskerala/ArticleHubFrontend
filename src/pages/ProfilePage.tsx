import { useState } from 'react';
import * as yup from 'yup';
import { User, Lock, Bookmark, Eye, EyeOff, Save, Check } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { useAppSelector, type RootState } from '../store';
import type { UserData } from '../interfaces/entities/User';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { changeUserDetails } from '../store/actions/profile/changeDetails';


interface ArticlePreferences {
    categories: string[];
}

const userInfoSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().min(10).required('Phone number is required'),
});

const passwordChangeSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});


const ProfilePage = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const [userData, setUserData] = useState<UserData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        interests: []
    });

    const [articlePrefs, setArticlePrefs] = useState<ArticlePreferences>({
        categories: user?.interests || [],
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const availableCategories = [
        'Technology', 'Science', 'Business', 'Sports', 'Entertainment',
        'Politics', 'Health', 'Travel', 'Food', 'Fashion', 'Art', 'Music'
    ];
    const dispatch = useAppDispatch();

    const handleUserDataChange = (field: keyof UserData, value: string) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategoryToggle = (category: string) => {
        setArticlePrefs(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        setFormErrors({});
        try {
            await userInfoSchema.validate(userData, { abortEarly: false });

            const isPasswordSectionUsed = userData.currentPassword || userData.newPassword || userData.confirmPassword;
            if (isPasswordSectionUsed) {
                await passwordChangeSchema.validate(userData, { abortEarly: false });
            }

            setSaveStatus('saving');

            const response = await dispatch(changeUserDetails({
                ...userData,
                interests: articlePrefs.categories
            }))

            if (response.meta.requestStatus === 'fulfilled') {
                setSaveStatus('saved');
            }
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                err.inner.forEach((e: yup.ValidationError) => {
                    if (e.path) errors[e.path] = e.message;
                });

                setFormErrors(errors);
            } else {
                console.error('Unexpected error:', err);
            }
        } finally {
            setSaveStatus('idle');
            if (userData.currentPassword !== "") {
                setUserData({
                    ...userData,
                    newPassword: '',
                    currentPassword: '',
                    confirmPassword: ''
                })
            }
        }
    };

    const isFormValid = userData.firstName && userData.lastName && userData.email && userData.phone;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar user={user} />
            <div className="max-w-4xl mt-15 mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account and preferences</p>
                </div>

                <div className="flex w-full space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex w-full justify-center items-center px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'personal'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <User className="hidden md:flex w-4 h-4 mr-2" />
                        Personal Information
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`flex w-full justify-center items-center px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'preferences'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <Bookmark className="hidden md:flex w-4 h-4 mr-2" />
                        Article Preferences
                    </button>
                </div>

                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.firstName}
                                        onChange={(e) => handleUserDataChange('firstName', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                    />
                                    {formErrors.firstName && <p className="text-red-500">{formErrors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.lastName}
                                        onChange={(e) => handleUserDataChange('lastName', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                    />
                                    {formErrors.lastName && <p className="text-red-500">{formErrors.lastName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={userData.email}
                                        disabled={true}
                                        readOnly={true}
                                        onChange={(e) => handleUserDataChange('email', e.target.value)}
                                        className="w-full cursor-not-allowed px-3 py-2 text-gray-300 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.phone}
                                        onChange={(e) => handleUserDataChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                    />
                                    {formErrors.phone && <p className="text-red-500">{formErrors.phone}</p>}
                                </div>
                            </div>
                        </div>


                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <Lock className="w-5 h-5 mr-2" />
                                Change Password
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={userData.currentPassword}
                                            onChange={(e) => handleUserDataChange('currentPassword', e.target.value)}
                                            className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={userData.newPassword}
                                            onChange={(e) => handleUserDataChange('newPassword', e.target.value)}
                                            className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {userData.newPassword && userData.newPassword.length < 8 && (
                                        <p className="text-red-400 text-sm mt-1">Password must be at least 8 characters</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={userData.confirmPassword}
                                            onChange={(e) => handleUserDataChange('confirmPassword', e.target.value)}
                                            className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {userData.confirmPassword && userData.newPassword !== userData.confirmPassword && (
                                        <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <Bookmark className="w-5 h-5 mr-2" />
                                Content Categories
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {availableCategories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryToggle(category)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${articlePrefs.categories.includes(category)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid || saveStatus === 'saving'}
                        className={`flex items-center px-6 py-2 rounded-md font-medium transition-all ${saveStatus === 'saved'
                            ? 'bg-green-600 text-white'
                            : saveStatus === 'saving'
                                ? 'bg-blue-500 text-white cursor-not-allowed'
                                : isFormValid
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {saveStatus === 'saving' ? (
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : saveStatus === 'saved' ? (
                            <Check className="w-4 h-4 mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage