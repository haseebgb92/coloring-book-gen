'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { PrintSettings } from '@/lib/types';

export function PrintSettingsSection() {
    const settings = useProjectStore(s => s.printSettings);
    const update = useProjectStore(s => s.updatePrintSettings);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">TRIM SIZE</label>
                <select
                    value={settings.trimSize}
                    onChange={(e) => update({ trimSize: e.target.value as any })}
                    className="w-full p-2 border rounded text-sm"
                >
                    <option value="6x9">6 x 9 inches</option>
                    <option value="8x10">8 x 10 inches</option>
                    <option value="8.5x11">8.5 x 11 inches</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                    {settings.trimSize === '6x9' && 'After-Trim: 6.25 × 9.25 in'}
                    {settings.trimSize === '8x10' && 'After-Trim: 8.25 × 10.25 in'}
                    {settings.trimSize === '8.5x11' && 'After-Trim: 8.75 × 11.25 in'}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Bleed (0.125")</label>
                <input
                    type="checkbox"
                    checked={settings.bleed}
                    onChange={(e) => update({ bleed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">MARGINS (inches)</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-[10px] uppercase text-gray-400">Top</span>
                        <input
                            type="number" step="0.125"
                            value={settings.margins.top}
                            onChange={(e) => update({ margins: { ...settings.margins, top: parseFloat(e.target.value) } })}
                            className="w-full p-1 border rounded text-sm"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-gray-400">Bottom</span>
                        <input
                            type="number" step="0.125"
                            value={settings.margins.bottom}
                            onChange={(e) => update({ margins: { ...settings.margins, bottom: parseFloat(e.target.value) } })}
                            className="w-full p-1 border rounded text-sm"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-gray-400">Inner</span>
                        <input
                            type="number" step="0.125"
                            value={settings.margins.inner}
                            onChange={(e) => update({ margins: { ...settings.margins, inner: parseFloat(e.target.value) } })}
                            className="w-full p-1 border rounded text-sm"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-gray-400">Outer</span>
                        <input
                            type="number" step="0.125"
                            value={settings.margins.outer}
                            onChange={(e) => update({ margins: { ...settings.margins, outer: parseFloat(e.target.value) } })}
                            className="w-full p-1 border rounded text-sm"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">FLATTEN PDF</label>
                <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                    <input
                        type="checkbox"
                        checked={settings.flatten}
                        onChange={(e) => update({ flatten: e.target.checked })}
                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="text-xs text-yellow-800">
                        <span className="font-semibold block">Enable Flattening</span>
                        {settings.flatten
                            ? "Output will be flattened (reduced editability). May increase file size."
                            : "Text will be selectable. Fonts embedded."}
                    </div>
                </div>
            </div>
        </div>
    );
}
