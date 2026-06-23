import React from 'react';
import { getSettings } from '@/app/actions/settings';
import { Phone, MessageSquare, MapPin, Send, Mail } from 'lucide-react';
import Link from 'next/link';
import { formatWhatsAppNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export default async function ContactPage() {
    const settings = await getSettings();

    const contactMethods = [
        {
            title: 'اتصل بنا',
            value: settings.phone || '+20 123 456 7890',
            icon: Phone,
            href: `tel:${settings.phone}`,
            color: 'bg-blue-500',
        },
        {
            title: 'واتساب',
            value: 'تواصل معنا عبر واتساب',
            icon: MessageSquare,
            href: `https://wa.me/${formatWhatsAppNumber(settings.whatsapp)}`,
            color: 'bg-green-500',
        },
        {
            title: 'فيسبوك',
            value: 'تابعنا على فيسبوك',
            icon: FacebookIcon,
            href: settings.facebook_url,
            color: 'bg-[#1877F2]',
        },
        {
            title: 'انستجرام',
            value: 'تابعنا على انستجرام',
            icon: InstagramIcon,
            href: settings.instagram_url,
            color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
        },
    ];


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">اتصل بنا</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-bold">نحن هنا للإجابة على استفساراتكم في أي وقت</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactMethods.map((method, i) => (
                        <a
                            key={i}
                            href={method.href}
                            target="_blank"
                            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow hover:shadow transition-all hover:-translate-y-2 text-center group border border-slate-100 dark:border-slate-700"
                        >
                            <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow text-white group-hover:scale-110 transition-transform`}>
                                <method.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{method.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">{method.value}</p>
                        </a>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow border border-slate-100 dark:border-slate-700 text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <MapPin className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">موقعنا</h2>
                    </div>
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-bold mb-8">
                        {settings.address || 'دمياط الجديدة'}
                    </p>

                    <hr className="my-10 border-slate-100 dark:border-slate-700" />

                    <div className="flex flex-col items-center gap-6">
                        <h3 className="text-lg font-black text-slate-500 uppercase tracking-widest">المزيد من طرق التواصل</h3>
                        <div className="flex gap-8">
                            {settings.telegram_url && (
                                <a
                                    href={settings.telegram_url}
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 font-bold transition-all hover:scale-105"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>تليجرام</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
