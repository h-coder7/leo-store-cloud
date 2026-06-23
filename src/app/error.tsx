"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">عذراً، حدث خطأ غير متوقع!</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium text-lg leading-relaxed">
                نعتذر عن هذا الخلل. فريقنا يعمل على حله بأسرع وقت ممكن. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="w-full sm:w-auto px-8 py-4 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] font-black rounded-2xl transition-all shadow-lg shadow-[#FCD201]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                    <RefreshCcw className="w-5 h-5" />
                    إعادة المحاولة
                </button>
                <Link
                    href="/"
                    className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Home className="w-5 h-5" />
                    العودة للرئيسية
                </Link>
            </div>
        </div>
    );
}
