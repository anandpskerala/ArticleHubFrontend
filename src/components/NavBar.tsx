import { ChevronDown, LogOut } from 'lucide-react';
import React, { useState } from 'react'
import type { NavBarProps } from '../interfaces/props/NavBarProps';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/actions/auth/logout';

export const NavBar: React.FC<NavBarProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="text-2xl font-bold">ArticleHub</Link>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-md"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                {user?.firstName.substring(0, 2).toUpperCase() || "GT"}
                            </div>
                            <span className="font-medium">{user?.firstName || "Guest"} {user?.lastName}</span>
                            <ChevronDown size={16} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/articles"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Articles
                                </Link>
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
