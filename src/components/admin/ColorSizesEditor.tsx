"use client";

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PRODUCT_SIZES } from '@/lib/product/variants';

interface ColorSizesEditorProps {
    colorSizes: Record<string, string[]>;
    onChange: (next: Record<string, string[]>) => void;
}

export default function ColorSizesEditor({ colorSizes, onChange }: ColorSizesEditorProps) {
    const [newColorInput, setNewColorInput] = useState('');
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [inputError, setInputError] = useState<string | null>(null);

    const addedColors = Object.keys(colorSizes);

    const handleAddColor = () => {
        const name = newColorInput.trim();
        setInputError(null);

        if (!name) {
            setInputError('اكتب اسم اللون أولاً');
            return;
        }
        if (colorSizes[name]) {
            setInputError('هذا اللون مضاف بالفعل');
            return;
        }

        onChange({ ...colorSizes, [name]: [] });
        setNewColorInput('');
        setActiveColor(name);
    };

    const handleRemoveColor = (color: string) => {
        const next = { ...colorSizes };
        delete next[color];
        onChange(next);
        if (activeColor === color) setActiveColor(null);
    };

    const toggleSize = (color: string, size: string) => {
        const current = colorSizes[color] || [];
        const nextSizes = current.includes(size)
            ? current.filter((s) => s !== size)
            : [...current, size];
        onChange({ ...colorSizes, [color]: nextSizes });
    };

    return (
        <div>
            <p className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 mr-1">
                الألوان والمقاسات
            </p>
            <p className="block text-xs text-slate-400 mb-4 mr-1">
                أضف اللون بالاسم، ثم اختر المقاسات المتاحة له. إن لم تختر مقاسات يكون اللون متاحاً لكل مقاسات المنتج.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    value={newColorInput}
                    onChange={(e) => {
                        setNewColorInput(e.target.value);
                        setInputError(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddColor();
                        }
                    }}
                    placeholder="مثال: بينك، أزرق فاتح، موف..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                />
                <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    إضافة لون
                </button>
            </div>

            {inputError && (
                <p className="text-xs font-bold text-rose-500 mb-3 mr-1">{inputError}</p>
            )}

            {addedColors.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {addedColors.map((color) => {
                        const selectedSizes = colorSizes[color] || [];
                        const sizeLabel =
                            selectedSizes.length === 0
                                ? 'كل المقاسات'
                                : `${selectedSizes.length} مقاسات`;

                        return (
                            <div
                                key={color}
                                onClick={() => setActiveColor(color)}
                                className="cursor-pointer flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-primary bg-primary/5 text-primary dark:border-primary transition-all select-none min-w-[140px]"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-black">{color}</span>
                                    <span className="text-[10px] opacity-80 font-bold mt-0.5">{sizeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveColor(color);
                                    }}
                                    className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors shrink-0"
                                    title="حذف اللون"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-xs text-slate-400 font-bold mr-1">لم تُضف ألوان بعد</p>
            )}

            {activeColor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setActiveColor(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>مقاسات اللون:</span>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">{activeColor}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setActiveColor(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mb-5">
                            اترك المقاسات بدون تحديد ليكون اللون متاحاً لكل مقاسات المنتج
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-6 max-h-[40vh] overflow-y-auto p-1">
                            {PRODUCT_SIZES.map((size) => {
                                const isSelected = colorSizes[activeColor]?.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(activeColor, size)}
                                        className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all select-none text-center
                                            ${isSelected
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    handleRemoveColor(activeColor);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                                إزالة اللون
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveColor(null)}
                                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs transition-all hover:scale-105 active:scale-95 shadow"
                            >
                                تأكيد
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
