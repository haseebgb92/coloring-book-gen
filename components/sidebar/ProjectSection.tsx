'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';

export function ProjectSection() {
    const name = useProjectStore(s => s.name);
    const setName = useProjectStore(s => s.setName);
    const reset = useProjectStore(s => s.resetProject);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">PROJECT NAME</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <button
                onClick={() => { if (confirm('Are you sure? This will clear all data.')) reset(); }}
                className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors"
            >
                Reset Project
            </button>
        </div>
    );
}
