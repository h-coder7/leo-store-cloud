import Link from 'next/link';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { SiteSettings } from '@/app/actions/settings';

export default function Footer({ settings }: { settings: SiteSettings }) {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8" id="footer" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & About */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow shadow-primary/20">
                                <span className="text-primary-foreground font-black text-xl">L</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                ليو <span className="text-primary">ستور</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            وجهتك الأولى للتسوق الإلكتروني. نقدم لك أحدث صيحات الموضة وأفضل المنتجات بأعلى جودة وأسعار تنافسية لتجربة تسوق لا تُنسى.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 relative inline-block">
                            روابط هامة
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'الرئيسية', href: '/' },
                                { name: 'تصفح المنتجات', href: '/products' },
                                // { name: 'الأقسام', href: '/categories' },
                                // { name: 'أحدث العروض', href: '/offers' },
                                { name: 'عربة التسوق', href: '/cart' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 relative inline-block">
                            تواصل معنا
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm">{settings.address || 'دمياط الجديدة'}</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm" dir="ltr">{settings.phone || '+20 123 456 7890'}</span>
                            </li>
                            {/* <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm">support@leostore.com</span>
                            </li> */}
                        </ul>
                    </div>

                    {/* Social Media & Newsletter */}
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 relative inline-block">
                            تابعنا
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <div className="flex gap-4 mb-8">
                            {settings.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-primary-foreground hover:shadow hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                            )}
                            {settings.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-primary-foreground hover:shadow hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                            )}
                            {settings.telegram_url && (
                                <a href={settings.telegram_url} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-primary-foreground hover:shadow hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                    <Send className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} ليو ستور.
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
