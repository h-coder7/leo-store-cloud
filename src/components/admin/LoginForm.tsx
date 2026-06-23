'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(login, null);

    return (
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-2xl shadow border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
                <p className="text-gray-500 text-sm">أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>

            <form action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FCD201] focus:border-transparent outline-none transition-all"
                            placeholder="admin@example.com"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FCD201] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                        {state.error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 bg-[#FCD201] hover:bg-[#ebd201] text-[#1a1a1a] rounded-lg transition-colors flex justify-center items-center font-bold"
                    disabled={pending}
                >
                    {pending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'دخول'
                    )}
                </Button>
            </form>
        </div>
    );
}
