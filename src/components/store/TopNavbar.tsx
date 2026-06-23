import React from 'react';
import { Phone, Heart } from 'lucide-react';
import Link from 'next/link';
import { SiteSettings } from '@/app/actions/settings';
import { formatWhatsAppNumber } from '@/lib/utils';

export default function TopNavbar({ settings }: { settings: SiteSettings }) {
    return (
        <div className="w-full bg-[#FCD201] text-[#1a1a1a] py-2 px-4 sm:px-6 lg:px-8 border-b border-black/5 relative overflow-hidden" dir="rtl">
            {/* Subtle background pattern/texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white rounded-full blur-xl"></div>
            </div>

            <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">

                {/* Right: Phone Number */}
                <div className="flex items-center gap-4">
                    <a
                        href={`tel:${settings.phone}`}
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-black hover:opacity-70 transition-opacity"
                    >
                        <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center outline-none">
                            <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span className="mt-1" dir="ltr">{settings.phone || '0123 456 7890'}</span>
                    </a>
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold bg-black/5 px-3 py-1 rounded-full">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span>أهلاً بكم في متجر ليو</span>
                    </div>
                </div>

                {/* Left: Social Media */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <span className="hidden md:block text-[11px] font-black uppercase tracking-wider opacity-60">تابعونا على:</span>
                    <div className="flex items-center gap-2">
                        {settings.facebook_url && (
                            <Link
                                href={settings.facebook_url}
                                target="_blank"
                                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-sm"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </Link>
                        )}
                        {settings.instagram_url && (
                            <Link
                                href={settings.instagram_url}
                                target="_blank"
                                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-sm"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </Link>
                        )}
                        {settings.whatsapp && (
                            <Link
                                href={`https://wa.me/${formatWhatsAppNumber(settings.whatsapp)}`}
                                target="_blank"
                                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-sm"
                                aria-label="WhatsApp"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
