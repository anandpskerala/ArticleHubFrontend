import React, { useState } from 'react'
import * as yup from 'yup';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Sparkles, Lock, EyeOff, Eye } from 'lucide-react';
import { ValidationError } from 'yup';
import { loginUser } from '../store/actions/auth/loginUser';

type FormData = {
    emailOrPhone: string;
    password: string;
};

const loginSchema = yup.object().shape({
    emailOrPhone: yup.string().trim().required("Email or phone is required"),
    password: yup.string().trim().required("Password is required")
})

const LoginPage = () => {
    const [formData, setFormData] = useState<FormData>({
        emailOrPhone: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});

            const res = await dispatch(loginUser(formData));
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
                        <div className="lg:w-3/5 bg-gradient-to-br from-black to-yellow-500 p-8 lg:p-12 flex flex-col justify-center text-white">
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200 mb-2">Email or Phone</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            name="emailOrPhone"
                                            value={formData.emailOrPhone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            placeholder="email or phone"
                                        />
                                    </div>
                                    {errors.emailOrPhone && <p className="text-red-400 text-sm">{errors.emailOrPhone}</p>}
                                </div>


                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200 mb-2">Password</label>
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



                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full cursor-pointer bg-gradient-to-r from-yellow-300 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Logging in...</span>
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </button>

                                <p className="text-center text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage