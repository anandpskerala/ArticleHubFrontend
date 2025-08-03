import React, { useState } from 'react';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { signupUser } from '../store/actions/auth/signupUser';
import { Link, useNavigate } from 'react-router-dom';

const registrationSchema = yup.object().shape({
    firstName: yup
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .required('First name is required'),

    lastName: yup
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .required('Last name is required'),

    email: yup
        .string()
        .email('Please enter a valid email address')
        .required('Email is required'),

    phone: yup
        .string()
        .matches(/^\+?[\d\s\-()]{10,}$/, 'Please enter a valid phone number')
        .required('Phone number is required'),

    dob: yup
        .string()
        .test(
            'age-range',
            'You must be between 13 and 120 years old',
            (value) => {
                if (!value) return false;
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 13 && age <= 120;
            }
        )
        .required('Date of birth is required'),

    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain uppercase, lowercase, number, and special character'
        )
        .required('Password is required'),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords don’t match')
        .required('Please confirm your password'),

    interests: yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one article preference'),
});

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
    confirmPassword: string;
    interests: string[];
};

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: new Date(),
        password: '',
        confirmPassword: '',
        interests: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const articleOptions = [
        'Technology', 'Health & Wellness', 'Business',
        'Sports', 'Entertainment', 'Politics', 'Travel', 'Food & Cooking', 'Fashion'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'dob' ? new Date(value) : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (preference: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(preference)
                ? prev.interests.filter(p => p !== preference)
                : [...prev.interests, preference]
        }));

        if (errors.interests) {
            setErrors(prev => ({ ...prev, interests: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await registrationSchema.validate(formData, { abortEarly: false });
            setErrors({});

            const res = await dispatch(signupUser(formData));
            if (res.meta.requestStatus === "fulfilled") {
                navigate("/");
            }

        } catch (err) {
            if (err instanceof ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-2/5 bg-gradient-to-br from-black to-yellow-500 p-8 lg:p-12 flex flex-col justify-center text-white">
                            <div className="mb-8">
                                <Sparkles className="w-12 h-12 mb-4 text-yellow-300" />
                                <h1 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Community</h1>
                                <p className="text-purple-100 text-lg">Create your account and get access to personalized articles and exclusive content.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                    <span>Personalized article recommendations</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                    <span>Access to premium content</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                    <span>Community discussions</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-3/5 p-8 lg:p-12">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-gray-300">Fill in your details to get started</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="Doe"
                                            />
                                        </div>
                                        {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob.toISOString().split('T')[0]}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            />
                                        </div>
                                        {errors.dob && <p className="text-red-400 text-sm">{errors.dob}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-200">Interests</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {articleOptions.map((option) => (
                                            <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interests.includes(option)}
                                                    onChange={() => handleCheckboxChange(option)}
                                                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.articlePreferences && <p className="text-red-400 text-sm">{errors.interests}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full cursor-pointer bg-gradient-to-r from-yellow-300 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creating Account...</span>
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>

                                <p className="text-center text-gray-400 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        Sign in here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;