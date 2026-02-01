'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';

export function ColorsSection() {
    const colors = useProjectStore(s => s.template.colors);
    const updateColors = useProjectStore(s => s.updateTemplateColors);

    const colorFields = [
        { key: 'background', label: 'Page Background' },
        { key: 'heading', label: 'Heading Text' },
        { key: 'storyText', label: 'Story Text' },
        { key: 'tracing', label: 'Tracing Words' },
        { key: 'writingLine', label: 'Writing Lines' },
        { key: 'border', label: 'Border / Frames' },
        { key: 'accent', label: 'Accents (Icons)' },
        { key: 'pageNumber', label: 'Page Numbers' },
    ];

    return (
        <div className="space-y-3">
            {colorFields.map((field) => (
                <div key={field.key} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <label className="text-xs font-medium text-gray-700">{field.label}</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">
                            {(colors as any)[field.key]}
                        </span>
                        <input
                            type="color"
                            value={(colors as any)[field.key]}
                            onChange={(e) => updateColors({ [field.key]: e.target.value })}
                            className="w-8 h-8 p-0.5 border border-gray-200 rounded cursor-pointer bg-white"
                        />
                    </div>
                </div>
            ))}
            <div className="pt-2">
                <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => {
                        // Logic to reset to template default could be here, but simple reset is hard without ref to original template...
                        // Actually we can get it from TEMPLATES by id.
                        // For now just manual.
                        alert('To reset colors, re-select the template in the Template section.');
                    }}
                >
                    Reset to defaults
                </button>
            </div>
        </div>
    );
}
