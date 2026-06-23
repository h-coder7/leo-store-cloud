"use client";

import React, { useState } from 'react';
import { updateSettings, SiteSettings } from '@/app/actions/settings';
import { toast } from 'sonner';
import { Phone, MessageSquare, MapPin, Send, Save, Loader2, Wallet, Smartphone } from 'lucide-react';

export default function SettingsClient({ initialSettings }: { initialSettings: SiteSettings }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await updateSettings(formData);
            toast.success("تم حفظ الإعدادات بنجاح");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء حفظ الإعدادات");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8" dir="rtl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">إعدادات الموقع</h1>
                <p className="text-slate-500 mt-2 font-bold">تحكم في بيانات التواصل وروابط السوشيال ميديا</p>
            </div>

            <form 
                key={JSON.stringify(initialSettings)}
                onSubmit={handleSubmit} 
                className="space-y-6"
            >
                {/* Contact Info Section */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow border border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                        <Phone className="w-6 h-6 text-primary" />
                        بيانات التواصل
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">رقم الهاتف</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="phone"
                                    type="text"
                                    defaultValue={initialSettings.phone}
                                    placeholder="01xxxxxxxxx"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">رقم الواتساب</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="whatsapp"
                                    type="text"
                                    defaultValue={initialSettings.whatsapp}
                                    placeholder="01xxxxxxxxx"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">العنوان</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="address"
                                    type="text"
                                    defaultValue={initialSettings.address}
                                    placeholder="العنوان بالتفصيل"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Info Section */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow border border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-primary" />
                        بيانات الدفع
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">رقم فودافون كاش</label>
                            <div className="relative">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="vodafone_cash"
                                    type="text"
                                    defaultValue={initialSettings.vodafone_cash}
                                    placeholder="01xxxxxxxxx"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">رقم إنستا باي</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="instapay_number"
                                    type="text"
                                    defaultValue={initialSettings.instapay_number}
                                    placeholder="01xxxxxxxxx"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow border border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary fill-current" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        روابط التواصل الاجتماعي
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">فيسبوك</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <input
                                    name="facebook_url"
                                    type="url"
                                    defaultValue={initialSettings.facebook_url}
                                    placeholder="https://facebook.com/..."
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">انستجرام</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <input
                                    name="instagram_url"
                                    type="url"
                                    defaultValue={initialSettings.instagram_url}
                                    placeholder="https://instagram.com/..."
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">تليجرام</label>
                            <div className="relative">
                                <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="telegram_url"
                                    type="url"
                                    defaultValue={initialSettings.telegram_url}
                                    placeholder="https://t.me/..."
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-3 px-12 py-5 bg-primary hover:opacity-90 text-primary-foreground font-black text-xl rounded-[2rem] transition-all shadow shadow-primary/20 active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>جاري الحفظ...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-6 h-6" />
                                <span>حفظ كافة التغييرات</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
