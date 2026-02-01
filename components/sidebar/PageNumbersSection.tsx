'use client';
import React from 'react';
import { useProjectStore } from '@/lib/store';

export function PageNumbersSection() {
    const settings = useProjectStore(s => s.printSettings.pageNumbers);
    const updateSettings = useProjectStore(s => s.updatePrintSettings);

    const update = (partial: any) => {
        updateSettings({ pageNumbers: { ...settings, ...partial } });
    };

    return (
        <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded border">
                <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={e => update({ enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-sm text-gray-700">Enable Page Numbers</span>
            </label>

            {settings.enabled && (
                <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">POSITION</label>
                        <select
                            value={settings.position}
                            onChange={e => update({ position: e.target.value })}
                            className="w-full p-2 border rounded text-sm bg-white"
                        >
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-outer">Bottom Outer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">STYLE</label>
                        <select
                            value={settings.style}
                            onChange={e => update({ style: e.target.value })}
                            className="w-full p-2 border rounded text-sm bg-white"
                        >
                            <option value="simple">Simple Number</option>
                            <option value="with-divider">With Divider Line</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">SIZE</label>
                        <div className="flex gap-2">
                            {['S', 'M', 'L'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => update({ size })}
                                    className={`flex-1 py-1 text-xs border rounded ${settings.size === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
