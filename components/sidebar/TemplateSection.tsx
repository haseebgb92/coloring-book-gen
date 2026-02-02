'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function TemplateSection() {
    const currentTemplate = useProjectStore(s => s.template);
    const writingSettings = useProjectStore(s => s.writingSettings);
    const setTemplate = useProjectStore(s => s.setTemplate);

    const updateLayout = useProjectStore(s => s.updateTemplateLayout);
    const updateWriting = useProjectStore(s => s.updateWritingSettings);

    return (
        <div className="space-y-6">
            <section>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 block">Base Style</label>
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
                                className="w-full h-12 rounded mb-2 border border-gray-100 shadow-sm flex flex-col justify-center overflow-hidden"
                                style={{ background: t.colors.background }}
                            >
                                <div className="h-1.5 w-1/2 mx-2 mb-1 rounded-full" style={{ background: t.colors.heading }}></div>
                                <div className="h-1 w-3/4 mx-2 rounded-full" style={{ background: t.colors.storyText }}></div>
                            </div>
                            <div className="text-[10px] font-medium text-gray-900 truncate">{t.name}</div>
                            {currentTemplate.id === t.id && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Fine-Tune Typography</label>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600">Heading Size</span>
                            <span className="text-xs font-mono text-blue-600">{currentTemplate.layout.headingSize}px</span>
                        </div>
                        <input
                            type="range" min="12" max="72" step="1"
                            value={currentTemplate.layout.headingSize}
                            onChange={(e) => updateLayout({ headingSize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600">Body Size</span>
                            <span className="text-xs font-mono text-blue-600">{currentTemplate.layout.bodySize}px</span>
                        </div>
                        <input
                            type="range" min="8" max="32" step="1"
                            value={currentTemplate.layout.bodySize}
                            onChange={(e) => updateLayout({ bodySize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600">Practice Word Size</span>
                            <span className="text-xs font-mono text-blue-600">{writingSettings.practiceFontSize || 28}px</span>
                        </div>
                        <input
                            type="range" min="12" max="64" step="1"
                            value={writingSettings.practiceFontSize || 28}
                            onChange={(e) => updateWriting({ practiceFontSize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-700">Show Unique Ornaments</span>
                        <button
                            onClick={() => updateLayout({ showIcon: !currentTemplate.layout.showIcon })}
                            className={cn(
                                "w-10 h-5 rounded-full transition-colors relative",
                                currentTemplate.layout.showIcon ? "bg-blue-500" : "bg-gray-300"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                currentTemplate.layout.showIcon ? "left-6" : "left-1"
                            )} />
                        </button>
                    </div>

                    {currentTemplate.layout.showIcon && (
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-600">Ornament Transparency</span>
                                <span className="text-xs font-mono text-blue-600">{Math.round((currentTemplate.layout.iconOpacity ?? 0.2) * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0.05" max="0.8" step="0.05"
                                value={currentTemplate.layout.iconOpacity ?? 0.2}
                                onChange={(e) => updateLayout({ iconOpacity: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
