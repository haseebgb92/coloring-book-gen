'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';

export function PracticeSection() {
    const settings = useProjectStore(s => s.writingSettings);
    const update = useProjectStore(s => s.updateWritingSettings);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">REPETITIONS PER WORD</label>
                <div className="flex items-center gap-3">
                    <input
                        type="range" min="3" max="8" step="1"
                        value={settings.minRepetitions}
                        onChange={(e) => update({ minRepetitions: parseInt(e.target.value) })}
                        className="w-full"
                    />
                    <span className="font-medium text-sm w-6 text-center">{settings.minRepetitions}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Minimum 3 repetitions recommended for practice.</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">WRITING GUIDELINES</label>
                <div className="space-y-2 bg-white p-2 border rounded">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.guidelines.showTop}
                            onChange={(e) => update({ guidelines: { ...settings.guidelines, showTop: e.target.checked } })}
                            className="rounded text-blue-600"
                        />
                        <span className="text-sm">Show Headline (Top)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.guidelines.showMid}
                            onChange={(e) => update({ guidelines: { ...settings.guidelines, showMid: e.target.checked } })}
                            className="rounded text-blue-600"
                        />
                        <span className="text-sm">Show Midline (Dashed)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.guidelines.showBase}
                            onChange={(e) => update({ guidelines: { ...settings.guidelines, showBase: e.target.checked } })}
                            className="rounded text-blue-600"
                        />
                        <span className="text-sm">Show Baseline (Bottom)</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">SPACING SCALE</label>
                <div className="flex items-center gap-3">
                    <input
                        type="range" min="0.8" max="1.5" step="0.1"
                        value={settings.spacingScale}
                        onChange={(e) => update({ spacingScale: parseFloat(e.target.value) })}
                        className="w-full"
                    />
                    <span className="font-semibold text-xs py-1 px-2 bg-gray-100 rounded">{settings.spacingScale}x</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Adjust if words are too cramped or spaced out.</p>
            </div>
        </div>
    );
}
