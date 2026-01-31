"use client";

import { Check, Grab } from "lucide-react";

interface PageSelectorProps {
    title: string;
    options: { id: string, name: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function PageSelector({ title, options, selected, onChange }: PageSelectorProps) {
    const togglePage = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter(item => item !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500 -mt-4">Select the pages you want to include in your book. You can reorder them later.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => togglePage(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${selected.includes(option.id)
                                ? 'border-accent bg-accent/5 ring-2 ring-accent/10'
                                : 'border-gray-100 bg-white/50 hover:border-accent/40'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.includes(option.id) ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {selected.includes(option.id) ? <Check size={18} /> : null}
                            </div>
                            <span className={`font-semibold ${selected.includes(option.id) ? 'text-gray-900' : 'text-gray-500'}`}>
                                {option.name}
                            </span>
                        </div>
                        {selected.includes(option.id) && <Grab size={16} className="text-gray-300" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
