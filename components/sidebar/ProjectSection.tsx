'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';
import { INITIAL_PROJECT_STATE } from '@/lib/templates';

export function ProjectSection() {
    const state = useProjectStore(s => s);
    const resetProject = useProjectStore(s => s.resetProject);
    const setName = useProjectStore(s => s.setName);

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${state.name.replace(/\s+/g, '-').toLowerCase()}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                if (ev.target?.result) {
                    const data = JSON.parse(ev.target.result as string);
                    // Basic validation?
                    if (data.scenes && data.printSettings) {
                        // We can just hydrate the store.
                        // Since we don't have a single "hydrate" action, we set fields.
                        // Or we can add a 'setState' to the store, but for now let's just reset then setScenes/etc? 
                        // Actually, if we just want to load, we properly need a loadProject action.
                        // But for now, let's warn user this is a bit hacky unless we add loadProject.
                        // Let's go add loadProject to store.
                        // But wait, we can't edit store.ts easily if it's huge? 
                        // It's not huge yet.

                        // Actually, let's just use localStorage hack or assume we reload page? No, that's bad.
                        // Let's add loadProject action to store in next step if needed.
                        // For now, let's assume we can just confirm and then say "Import functionality pending store update"
                        // OR, we can do it manually:
                        /*
                        useProjectStore.setState(data); // This works if we import the store instance, but we used the hook.
                        */

                        // We can't access `useProjectStore.setState` here directly easily without import check.
                        // Ah, zustand default export?
                        // We imported useProjectStore.
                        useProjectStore.setState(data);
                        alert('Project loaded successfully!');
                    } else {
                        alert('Invalid project file.');
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Failed to parse project file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">PROJECT NAME</label>
                <input
                    type="text"
                    value={state.name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="mt-1 flex items-center justify-end">
                    <span className="text-[10px] text-green-600 flex items-center gap-1">
                        <Save className="w-3 h-3" /> Autosaved locally
                    </span>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-500">ACTIONS</label>

                <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Save Project to File
                </button>

                <div className="relative">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors pointer-events-none"
                    >
                        <Upload className="w-4 h-4" />
                        Load Project from File
                    </button>
                </div>

                <button
                    onClick={() => { if (confirm('Are you sure? This will delete all scenes and settings.')) resetProject(); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors mt-4"
                >
                    <RotateCcw className="w-3 h-3" />
                    Start New Book (Reset)
                </button>
            </div>
        </div>
    );
}
