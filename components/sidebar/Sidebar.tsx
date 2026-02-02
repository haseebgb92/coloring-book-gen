'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
    Folder, FileText, Layers, Settings, Palette, Type,
    BookOpen, FileOutput, CheckCircle, AlertTriangle, Layout, Hash,
    Save, Upload, Loader2, Cloud, CheckCircle2, History, RotateCcw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProjectSection } from './ProjectSection';
import { PasteScenesSection } from './PasteScenesSection';
import { ScenesSection } from './ScenesSection';
import { PrintSettingsSection } from './PrintSettingsSection';
import { TemplateSection } from './TemplateSection';
import { ColorsSection } from './ColorsSection';
import { PracticeSection } from './PracticeSection';
import { ExportSection } from './ExportSection';
import { PageNumbersSection } from './PageNumbersSection';

export function Sidebar({ className }: { className?: string }) {
    const activeSection = useProjectStore((state) => state.activeSection);
    const setActiveSection = useProjectStore((state) => state.setActiveSection);
    const validationErrors = useProjectStore((state) => state.validationErrors);
    const resetProject = useProjectStore(s => s.resetProject);
    const state = useProjectStore(s => s);
    const [isSaving, setIsSaving] = useState(false);
    const [showSavedMsg, setShowSavedMsg] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const loadProject = useProjectStore(s => s.loadProject);

    const handleFetchHistory = async () => {
        if (!state.id) return;
        setLoadingHistory(true);
        setShowHistory(true);
        try {
            const res = await fetch(`/api/project?id=${state.id}&listHistory=true`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleRestore = async (version: number) => {
        if (!confirm('Restore this version? current unsaved changes will be replaced.')) return;
        try {
            const res = await fetch(`/api/project?id=${state.id}&version=${version}`);
            if (res.ok) {
                const data = await res.json();
                loadProject(data);
                setShowHistory(false);
                alert('Version restored!');
            }
        } catch (err) {
            alert('Failed to restore version');
        }
    };

    const handleCloudSave = async () => {
        if (isSaving) return;

        const payload = JSON.stringify(state);
        const sizeInMb = payload.length / (1024 * 1024);

        if (sizeInMb > 4.5) {
            alert(`Project is too large (${sizeInMb.toFixed(1)}MB). Vercel limits are 4.5MB. Please remove some large images or reduce their count before saving.`);
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });

            // Check for non-JSON or error status before parsing
            if (response.status === 413) {
                throw new Error('Project is too large to save to the cloud. Try removing large images.');
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (pErr) {
                console.error('Raw response:', text);
                throw new Error('Server returned an invalid response. Your project might be too large.');
            }

            if (data.success) {
                setShowSavedMsg(true);
                setTimeout(() => setShowSavedMsg(false), 3000);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err: any) {
            console.error('Cloud save failed:', err);
            alert('Cloud Save Failed: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                if (ev.target?.result) {
                    const data = JSON.parse(ev.target.result as string);
                    if (data.scenes && data.printSettings) {
                        useProjectStore.setState(data);
                        alert('Project loaded successfully!');
                    } else {
                        alert('Invalid project file.');
                    }
                }
            } catch (err) {
                alert('Failed to parse project file.');
            }
        };
        reader.readAsText(file);
    };

    const sections = [
        { id: 'project', label: 'Project', icon: Folder },
        { id: 'paste', label: 'Paste Scenes', icon: FileText },
        { id: 'scenes', label: 'Scenes', icon: Layers },
        { id: 'print', label: 'Print Settings', icon: Settings },
        { id: 'template', label: 'Template', icon: Layout },
        { id: 'colors', label: 'Colors', icon: Palette },
        { id: 'practice', label: 'Writing Practice', icon: Type },
        { id: 'front-matter', label: 'Front Matter', icon: BookOpen },
        { id: 'ending-pages', label: 'Ending Pages', icon: BookOpen },
        { id: 'page-numbers', label: 'Page Numbers', icon: Hash },
        { id: 'validation', label: 'Validation', icon: CheckCircle },
        { id: 'export', label: 'Export', icon: FileOutput },
    ];

    return (
        <aside className={cn("flex flex-col text-sm h-full", className)}>
            {/* Quick Actions Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Actions</span>
                    <span className="text-[10px] text-green-600 flex items-center gap-1 font-medium italic">
                        {showSavedMsg ? (
                            <><CheckCircle2 className="w-3 h-3" /> Saved to Cloud</>
                        ) : (
                            <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Autosaved</>
                        )}
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => { if (confirm('Start a new book? All unsaved changes will be lost.')) resetProject(); }}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all group"
                        title="New Book"
                    >
                        <Folder className="w-4 h-4 text-gray-400 group-hover:text-red-500 mb-1" />
                        <span className="text-[10px] text-gray-600 group-hover:text-red-700">New</span>
                    </button>
                    <button
                        onClick={handleCloudSave}
                        disabled={isSaving}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                        title="Sync to Cloud (Keeps last 3 versions)"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin mb-1" />
                        ) : (
                            <Cloud className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 mb-1" />
                        )}
                        <span className="text-[10px] text-gray-600 group-hover:text-emerald-700">Save</span>
                    </button>
                    <div className="relative group/load">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportJSON}
                            className="absolute inset-x-0 top-0 h-1/2 opacity-0 cursor-pointer z-10"
                        />
                        <div className="grid grid-rows-2 h-full">
                            <button
                                className="flex flex-col items-center justify-center p-1 bg-white border border-gray-200 rounded-t-lg pointer-events-none group-hover/load:bg-amber-50 group-hover/load:border-amber-200 transition-all"
                                title="Import JSON File"
                            >
                                <Upload className="w-3 h-3 text-gray-400 group-hover/load:text-amber-500" />
                                <span className="text-[8px] text-gray-600">File</span>
                            </button>
                            <button
                                onClick={handleFetchHistory}
                                className="flex flex-col items-center justify-center p-1 bg-white border border-t-0 border-gray-200 rounded-b-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                                title="Cloud History"
                            >
                                <History className="w-3 h-3 text-gray-400 group-hover:text-indigo-500" />
                                <span className="text-[8px] text-gray-600">Cloud</span>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveSection('export')}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all group"
                        title="Export PDF"
                    >
                        <FileOutput className="w-4 h-4 text-gray-400 group-hover:text-green-500 mb-1" />
                        <span className="text-[10px] text-gray-600 group-hover:text-green-700">Export</span>
                    </button>
                </div>

                {/* Cloud History Overlay */}
                {showHistory && (
                    <div className="absolute top-[160px] left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <History className="w-3 h-3 text-indigo-500" /> Recent Cloud Versions
                            </h4>
                            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                        </div>

                        <div className="space-y-2">
                            {loadingHistory ? (
                                <div className="flex items-center justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /></div>
                            ) : history.length === 0 ? (
                                <p className="text-[10px] text-gray-400 italic text-center py-2">No history found for this project ID.</p>
                            ) : (
                                history.map((v, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 group">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-700">{i === 0 ? 'Current / Latest' : `Version ${i + 1}`}</p>
                                            <p className="text-[9px] text-gray-400">{new Date(v.lastModified).toLocaleString()}</p>
                                            <p className="text-[8px] text-indigo-500 font-medium">{v.sceneCount} Scenes</p>
                                        </div>
                                        <button
                                            onClick={() => handleRestore(v.version)}
                                            className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            Restore
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <p className="text-[8px] text-gray-400 text-center mt-3 border-t pt-2 italic">Keeps up to 3 most recent saves</p>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {sections.map((section) => {
                    const hasError = validationErrors.some(e => e.sectionId === section.id && e.severity === 'error');
                    const hasWarning = validationErrors.some(e => e.sectionId === section.id && e.severity === 'warning');

                    return (
                        <div key={section.id} className="border-b border-gray-100 last:border-0">
                            <button
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left focus:outline-none",
                                    activeSection === section.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <section.icon className="w-5 h-5 shrink-0" />
                                    <span>{section.label}</span>
                                </div>
                                {hasError && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            </button>
                            {activeSection === section.id && (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 shadow-inner animate-in slide-in-from-top-2 duration-200">
                                    <SectionContent id={section.id} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

import { FrontMatterSection } from './FrontMatterSection';
import { EndingPagesSection } from './EndingPagesSection';
import { ValidationSection } from './ValidationSection';

function SectionContent({ id }: { id: string }) {
    switch (id) {
        case 'project': return <ProjectSection />;
        case 'paste': return <PasteScenesSection />;
        case 'scenes': return <ScenesSection />;
        case 'print': return <PrintSettingsSection />;
        case 'template': return <TemplateSection />;
        case 'colors': return <ColorsSection />;
        case 'practice': return <PracticeSection />;
        case 'page-numbers': return <PageNumbersSection />;
        case 'front-matter': return <FrontMatterSection />;
        case 'ending-pages': return <EndingPagesSection />;
        case 'validation': return <ValidationSection />;
        case 'export': return <ExportSection />;
        default: return <div className="text-gray-500 italic">Work in progress...</div>;
    }
}
