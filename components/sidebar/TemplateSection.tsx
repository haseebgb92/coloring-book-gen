'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function TemplateSection() {
    const currentTemplate = useProjectStore(s => s.template);
    const setTemplate = useProjectStore(s => s.setTemplate);

    return (
        <div className="space-y-4">
            <p className="text-xs text-gray-500">Choose a starting style. You can customize colors afterwards.</p>
            <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={cn(
                            "relative p-3 rounded-lg border-2 text-left transition-all",
                            currentTemplate.id === t.id
                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <div
                            className="w-full h-12 rounded mb-2 border border-gray-100 shadow-sm flex flex-col justify-center"
                            style={{ background: t.colors.background }}
                        >
                            <div className="h-1.5 w-1/2 mx-2 mb-1 rounded-full" style={{ background: t.colors.heading }}></div>
                            <div className="h-1 w-3/4 mx-2 rounded-full" style={{ background: t.colors.storyText }}></div>
                        </div>
                        <div className="text-xs font-medium text-gray-900">{t.name}</div>
                        {currentTemplate.id === t.id && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
