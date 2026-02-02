'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { Trash2, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';
import { getImageSrc } from '@/lib/utils';

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
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex justify-between items-center">
                                    <span>PRACTICE WORDS</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Min 4 words recommended</span>
                                </label>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-lg bg-gray-50/30">
                                        {scene.words.map((word, wIdx) => (
                                            <span key={wIdx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded text-xs transition-all hover:border-blue-300">
                                                {word}
                                                <button
                                                    onClick={() => {
                                                        const newWords = [...scene.words];
                                                        newWords.splice(wIdx, 1);
                                                        updateScene(scene.id, { words: newWords });
                                                    }}
                                                    className="hover:text-red-500 text-blue-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        {scene.words.length === 0 && <span className="text-xs text-gray-400 italic py-1">No words added yet...</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add word..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = (e.target as HTMLInputElement).value.trim();
                                                    if (val) {
                                                        updateScene(scene.id, { words: [...scene.words, val] });
                                                        (e.target as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                            className="flex-1 p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <button
                                            onClick={(e) => {
                                                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                                const val = input.value.trim();
                                                if (val) {
                                                    updateScene(scene.id, { words: [...scene.words, val] });
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-3 bg-blue-50 text-blue-600 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 active:scale-95 transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">ILLUSTRATION</label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {scene.illustration ? (
                                            <div className="relative w-16 h-16 border rounded bg-gray-100 shrink-0">
                                                <img src={getImageSrc(scene.illustration)} alt="preview" className={`w-full h-full rounded ${scene.illustrationFit === 'cover' ? 'object-cover' : 'object-contain'}`} />
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
                                                        reader.onload = async (ev) => {
                                                            if (ev.target?.result) {
                                                                try {
                                                                    const { compressImage } = await import('@/lib/image-utils');
                                                                    const compressed = await compressImage(ev.target.result as string);
                                                                    updateScene(scene.id, { illustration: compressed });
                                                                } catch (err) {
                                                                    console.error('Compression failed', err);
                                                                    updateScene(scene.id, { illustration: ev.target.result as string });
                                                                }
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {scene.illustration && (
                                        <div className="space-y-4 pt-2 border-t border-gray-50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Fit & Framing</span>
                                                <button
                                                    onClick={() => updateScene(scene.id, {
                                                        illustrationScale: 1.05,
                                                        illustrationPositionX: 0,
                                                        illustrationPositionY: 0,
                                                        illustrationFit: 'cover'
                                                    })}
                                                    className="text-[10px] text-blue-500 hover:text-blue-700 font-medium"
                                                >
                                                    Reset
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex bg-gray-100 p-0.5 rounded-md w-full">
                                                    <button
                                                        onClick={() => updateScene(scene.id, { illustrationFit: 'cover' })}
                                                        className={`flex-1 px-3 py-1 text-[10px] rounded transition-all ${scene.illustrationFit === 'cover' || !scene.illustrationFit ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                                                    >
                                                        Cover (Fill)
                                                    </button>
                                                    <button
                                                        onClick={() => updateScene(scene.id, { illustrationFit: 'contain' })}
                                                        className={`flex-1 px-3 py-1 text-[10px] rounded transition-all ${scene.illustrationFit === 'contain' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                                                    >
                                                        Contain
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <label className="text-[10px] text-gray-500 font-medium uppercase">Zoom ({Math.round((scene.illustrationScale || 1.05) * 100)}%)</label>
                                                    </div>
                                                    <input
                                                        type="range" min="0.5" max="3" step="0.05"
                                                        value={scene.illustrationScale || 1.05}
                                                        onChange={(e) => updateScene(scene.id, { illustrationScale: parseFloat(e.target.value) })}
                                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 font-medium uppercase mb-1">X Offset ({scene.illustrationPositionX || 0}%)</label>
                                                        <input
                                                            type="range" min="-100" max="100" step="1"
                                                            value={scene.illustrationPositionX || 0}
                                                            onChange={(e) => updateScene(scene.id, { illustrationPositionX: parseInt(e.target.value) })}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 font-medium uppercase mb-1">Y Offset ({scene.illustrationPositionY || 0}%)</label>
                                                        <input
                                                            type="range" min="-100" max="100" step="1"
                                                            value={scene.illustrationPositionY || 0}
                                                            onChange={(e) => updateScene(scene.id, { illustrationPositionY: parseInt(e.target.value) })}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                        />
                                                    </div>
                                                </div>
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
