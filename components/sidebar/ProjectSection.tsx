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

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                    <span>Project Info</span>
                </div>

                <div className="bg-gray-100/50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 font-medium">Last Modified:</span>
                        <span className="text-gray-700 font-mono">{new Date(state.lastModified).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 font-medium">Scenes Count:</span>
                        <span className="text-gray-700 font-mono font-bold">{state.scenes.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 font-medium">Total Pages:</span>
                        <span className="text-gray-700 font-mono font-bold">~{state.scenes.length * 2 + state.frontMatter.length + state.endingPages.length}</span>
                    </div>
                </div>

                <div className="text-[10px] text-gray-400 bg-white p-2 rounded border border-gray-100 italic text-center">
                    Changes are automatically saved to your browser's local storage.
                </div>
            </div>
        </div>
    );
}
