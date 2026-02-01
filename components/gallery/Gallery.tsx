'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Book, Clock, Trash2, ArrowRight, RotateCcw } from 'lucide-react';
import { useProjectStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProjectMetadata {
    id: string;
    name: string;
    lastModified: number;
    sceneCount: number;
    templateId: string;
    colors: any;
}

export function Gallery({ onSelect }: { onSelect: (id: string) => void }) {
    const [projects, setProjects] = useState<ProjectMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const resetProject = useProjectStore(s => s.resetProject);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/project?list=true');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            } else {
                const errData = await res.json();
                setError(errData.error || 'Failed to fetch project list');
            }
        } catch (err: any) {
            console.error('Failed to fetch projects', err);
            setError('Could not connect to the database. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const deleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project and all its history?')) return;

        try {
            const res = await fetch(`/api/project?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchProjects();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-500 font-medium tracking-tight">Syncing with Upstash Cloud...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Connection Error</h3>
                <p className="text-red-700/70 text-sm mt-1">{error}</p>
                <button
                    onClick={fetchProjects}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Coloring Books</h1>
                    <p className="text-gray-500 mt-1">Manage and edit your cloud-synced projects</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchProjects}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Refresh Library"
                    >
                        <RotateCcw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => { resetProject(); onSelect('new'); }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Book
                    </button>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Book className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No books found</h3>
                    <p className="text-gray-400 mt-2 max-w-sm">You haven't saved any books to the cloud yet. Create a new one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => onSelect(p.id)}
                            className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer overflow-hidden flex flex-col"
                        >
                            {/* Thumbnail Preview Area */}
                            <div className="relative aspect-[3/4] p-6 bg-gray-50 group-hover:bg-white transition-colors">
                                <div
                                    className="w-full h-full rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden transform group-hover:scale-[1.02] group-hover:-rotate-1 transition-all duration-300"
                                    style={{ background: p.colors?.background || '#ffffff' }}
                                >
                                    {/* Mini Header */}
                                    <div className="h-10 mt-4 mx-4 rounded-lg opacity-20" style={{ background: p.colors?.heading || '#000' }}></div>
                                    {/* Mini Content Lines */}
                                    <div className="space-y-2 mt-4 mx-4">
                                        <div className="h-2 w-3/4 rounded opacity-10" style={{ background: p.colors?.storyText || '#000' }}></div>
                                        <div className="h-2 w-1/2 rounded opacity-10" style={{ background: p.colors?.storyText || '#000' }}></div>
                                        <div className="h-2 w-2/3 rounded opacity-10" style={{ background: p.colors?.storyText || '#000' }}></div>
                                    </div>
                                    {/* Mini Ornament */}
                                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full opacity-10" style={{ background: p.colors?.accent || '#000' }}></div>

                                    <div className="mt-auto p-4 bg-black/5 flex items-center justify-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Sample Page</p>
                                    </div>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-blue-600 font-bold scale-90 group-hover:scale-100 transition-all">
                                        Open Builder <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-6">
                                <h3 className="font-bold text-gray-900 truncate text-lg">{p.name}</h3>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Layers className="w-3.5 h-3.5" />
                                        {p.sceneCount} Scenes
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(p.lastModified).toLocaleDateString()}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => deleteProject(e, p.id)}
                                    className="mt-6 w-full py-2 flex items-center justify-center gap-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-transparent hover:border-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { Layers } from 'lucide-react';
