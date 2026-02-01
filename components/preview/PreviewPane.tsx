'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useProjectStore } from '@/lib/store';
import { BookDocument } from '../pdf/BookDocument';
import { LivePreview } from './LivePreview';
import { Download } from 'lucide-react';

// Use dynamic imports to avoid SSR issues with react-pdf

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false,
    loading: () => <span className="text-xs text-gray-400">Loading...</span>
});

export function PreviewPane() {
    const projectState = useProjectStore((state) => state);
    // Selecting full state ensures re-render on any change.
    // Performance note: In a real large app, specific selectors are better.

    // Need to recreate document instance when state changes? 
    // ReactPDF re-renders when props change.

    return (
        <div className="h-full w-full bg-gray-200 p-4 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white p-2 rounded-t-lg border-b border-gray-200 flex justify-between items-center text-xs shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-2 px-2">
                    <span className="font-semibold text-gray-700">Preview Mode</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">{projectState.scenes.length} Scenes</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">{projectState.printSettings.trimSize}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-400 italic">Centralized export in Sidebar</span>
                </div>
            </div>
            <div className="flex-1 bg-gray-500 rounded-b-lg overflow-hidden shadow-lg relative border border-gray-300">
                <LivePreview state={projectState} />
            </div>
        </div>
    );
}
