import React from 'react';
import Link from 'next/link';
import type { Section } from '@/lib/supabase/types';
import { ArrowLeft, User, Tag } from 'lucide-react';
import Image from 'next/image';

const parentLabels: Record<string, { label: string; icon: React.ReactNode; pill: string; pillText: string }> = {
    boy: {
        label: 'أولاد',
        icon: <User className="w-3.5 h-3.5" />,
        pill: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        pillText: '#ffffff',
    },
    girl: {
        label: 'بنات',
        icon: <User className="w-3.5 h-3.5" />,
        pill: 'linear-gradient(135deg, #f472b6, #ec4899)',
        pillText: '#ffffff',
    },
    offers: {
        label: 'عروض',
        icon: <Tag className="w-3.5 h-3.5" />,
        pill: 'linear-gradient(135deg, #FCD201, #FFA000)',
        pillText: '#1a1a1a',
    },
};

interface Props {
    section: Section;
}

export default function SectionCard({ section }: Props) {
    const parent = section.parent ? parentLabels[section.parent] : null;

    return (
        <Link
            href={`/products?section=${section.id}`}
            className="group block relative w-full aspect-[4/5] overflow-hidden transition-all duration-500 hover:-translate-y-2"
            style={{
                borderRadius: '2rem',
                boxShadow: '0 6px 28px rgba(252,210,1,0.12), 0 1px 4px rgba(0,0,0,0.08)',
                border: '2px solid rgba(252,210,1,0.2)',
            }}
        >
            {/* Hover border glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
                style={{
                    borderRadius: '2rem',
                    boxShadow: 'inset 0 0 0 2.5px #FCD201, 0 12px 40px rgba(252,210,1,0.25)',
                }}
            />

            {/* Background Image */}
            {section.image_url ? (
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={section.image_url}
                        alt={section.name}
                        fill
                        quality={65}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #FFF9C4, #FFF3E0)' }}
                />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65 group-hover:to-black/80 transition-colors duration-500 z-10" />

            {/* Parent badge */}
            {parent && (
                <div className="absolute top-3.5 right-3.5 z-20">
                    <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                        style={{ background: parent.pill, color: parent.pillText }}
                    >
                        {parent.icon}
                        {parent.label}
                    </span>
                </div>
            )}

            {/* Bottom content */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                <div
                    className="flex items-center justify-between p-3.5 relative overflow-hidden transition-all duration-500"
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}
                >
                    {/* Sweep on hover */}
                    <div
                        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                        style={{
                            background: 'linear-gradient(135deg, #FCD201, #FFA000)',
                            borderRadius: '1.5rem',
                        }}
                    />

                    <div className="relative z-10 flex-1 min-w-0">
                        <h3 className="text-white font-black text-base drop-shadow-md group-hover:text-slate-900 transition-colors duration-300 line-clamp-1">
                            {section.name}
                        </h3>
                        <p className="text-white/70 text-[11px] font-semibold mt-0.5 group-hover:text-slate-800/70 transition-colors duration-300">
                            اكتشف التشكيلة
                        </p>
                    </div>

                    <div
                        className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 group-hover:-rotate-45 ml-2"
                        style={{ background: 'rgba(255,255,255,0.25)' }}
                    >
                        <ArrowLeft className="w-4 h-4 text-white group-hover:text-slate-900 transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
