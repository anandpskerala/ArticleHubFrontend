import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');

    const loadingSteps = [
        { text: 'Initializing...', duration: 800 },
        { text: 'Loading articles...', duration: 1200 },
        { text: 'Preparing interface...', duration: 900 },
        { text: 'Almost ready...', duration: 600 }
    ];

    useEffect(() => {
        let currentStep = 0;
        let progressInterval: ReturnType<typeof setInterval>;
        let textTimeout: ReturnType<typeof setTimeout>;

        const updateProgress = () => {
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
        };

        const updateText = () => {
            if (currentStep < loadingSteps.length) {
                setLoadingText(loadingSteps[currentStep].text);
                textTimeout = setTimeout(() => {
                    currentStep++;
                    updateText();
                }, loadingSteps[currentStep].duration);
            }
        };

        updateProgress();
        updateText();

        return () => {
            clearInterval(progressInterval);
            clearTimeout(textTimeout);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 text-center px-8 max-w-md w-full">
                <div className="mb-12">
                    <div className="relative">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                            Article<span className="text-blue-400">Hub</span>
                        </h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                </div>
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                        {progress}% Complete
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-gray-300 text-lg font-medium animate-pulse">
                        {loadingText}
                    </p>
                </div>


                <div className="space-y-2 text-gray-500 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        <span>Real-time article updates</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <span>Smart categorization</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <span>Personalized recommendations</span>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 animate-pulse"></div>
        </div>
    );
};

export default LoadingScreen;