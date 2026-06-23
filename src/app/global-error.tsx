"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">خطأ في النظام الرئيسي!</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium text-lg leading-relaxed">
                        حدث خطأ فادح في النظام. يرجى تحديث الصفحة والمحاولة مرة أخرى.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] font-black rounded-2xl transition-all shadow-lg shadow-[#FCD201]/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        تحديث الصفحة
                    </button>
                </div>
            </body>
        </html>
    );
}
