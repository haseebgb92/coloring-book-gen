'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { Trash2, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';

export function ScenesSection() {
    const scenes = useProjectStore(s => s.scenes);
    const removeScene = useProjectStore(s => s.removeScene);
    const reorderScenes = useProjectStore(s => s.reorderScenes);
    const updateScene = useProjectStore(s => s.updateScene);

    // Simplified editor: Expandable items? Or just list and click to edit in modal?
    // Accordion inside accordion might be much.
    // Let's list titles and have an expand.

    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    if (scenes.length === 0) {
        return <div className="text-gray-500 text-center py-8">No scenes yet. Paste some text!</div>;
    }

    return (
        <div className="space-y-4">
            {scenes.map((scene, index) => (
                <div key={scene.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <div
                        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => setExpandedId(expandedId === scene.id ? null : scene.id)}
                    >
                        <span className="font-medium text-sm truncate w-32">{index + 1}. {scene.title}</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); if (index > 0) reorderScenes(index, index - 1); }}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                                <MoveUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); if (index < scenes.length - 1) reorderScenes(index, index + 1); }}
                                disabled={index === scenes.length - 1}
                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                                <MoveDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) removeScene(scene.id); }}
                                className="p-1 hover:bg-red-100 text-red-500 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {expandedId === scene.id && (
                        <div className="p-3 space-y-3 bg-white border-t border-gray-100">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">TITLE</label>
                                <input
                                    value={scene.title}
                                    onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                                    className="w-full p-2 border rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">STORY</label>
                                <textarea
                                    rows={4}
                                    value={scene.story}
                                    onChange={(e) => updateScene(scene.id, { story: e.target.value })}
                                    className="w-full p-2 border rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">WORDS (one per line)</label>
                                <textarea
                                    rows={4}
                                    value={scene.words.join('\n')}
                                    onChange={(e) => updateScene(scene.id, { words: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full p-2 border rounded text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">ILLUSTRATION</label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {scene.illustration ? (
                                            <div className="relative w-16 h-16 border rounded bg-gray-100 shrink-0">
                                                <img src={scene.illustration} alt="preview" className={`w-full h-full rounded ${scene.illustrationFit === 'cover' ? 'object-cover' : 'object-contain'}`} />
                                                <button
                                                    onClick={() => updateScene(scene.id, { illustration: null })}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 border border-dashed rounded bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            if (ev.target?.result) updateScene(scene.id, { illustration: ev.target.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {scene.illustration && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Fit Mode:</span>
                                            <div className="flex bg-gray-100 p-0.5 rounded-md">
                                                <button
                                                    onClick={() => updateScene(scene.id, { illustrationFit: 'cover' })}
                                                    className={`px-3 py-1 text-[10px] rounded ${scene.illustrationFit === 'cover' || !scene.illustrationFit ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                                                >
                                                    Cover (Crop)
                                                </button>
                                                <button
                                                    onClick={() => updateScene(scene.id, { illustrationFit: 'contain' })}
                                                    className={`px-3 py-1 text-[10px] rounded ${scene.illustrationFit === 'contain' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                                                >
                                                    Contain
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
