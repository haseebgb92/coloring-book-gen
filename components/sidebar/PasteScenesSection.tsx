'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { parseScenesInput } from '@/lib/parser';
import { PlusCircle, ClipboardList } from 'lucide-react';

export function PasteScenesSection() {
    const [mode, setMode] = useState<'manual' | 'bulk'>('manual');
    const [bulkText, setBulkText] = useState('');

    // Manual fields
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [words, setWords] = useState('');

    const addScene = useProjectStore(s => s.addScene);
    const setActiveSection = useProjectStore(s => s.setActiveSection);

    const handleBulkParse = () => {
        try {
            const parsed = parseScenesInput(bulkText);
            if (parsed.length > 0) {
                parsed.forEach(s => addScene(s));
                setActiveSection('scenes');
                setBulkText('');
                alert(`Successfully added ${parsed.length} scenes.`);
            } else {
                alert('No scenes found. Please check the format matches the requirements.');
            }
        } catch (e) {
            console.error(e);
            alert('Error parsing text.');
        }
    };

    const handleManualAdd = () => {
        if (!title.trim() || !story.trim()) {
            alert('Title and Story are required.');
            return;
        }

        const wordList = words.split('\n').map(w => w.trim()).filter(Boolean);

        addScene({
            title: title.trim(),
            story: story.trim(),
            words: wordList,
            illustration: null,
            illustrationFit: 'cover',
            illustrationScale: 1.05,
            illustrationPositionX: 0,
            illustrationPositionY: 0
        });

        // Reset
        setTitle('');
        setStory('');
        setWords('');
        setActiveSection('scenes');
    };

    return (
        <div className="space-y-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Manual Add
                </button>
                <button
                    onClick={() => setMode('bulk')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'bulk' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Bulk Paste
                </button>
            </div>

            {mode === 'manual' ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Scene Title</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. The Magic Forest"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Story Text</label>
                        <textarea
                            className="w-full h-32 p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Type or paste the story here..."
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Words to Practice (one per line)</label>
                        <textarea
                            className="w-full h-24 p-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="bunny&#10;hop&#10;grass&#10;green"
                            value={words}
                            onChange={(e) => setWords(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleManualAdd}
                        disabled={!title.trim() || !story.trim()}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        Add Scene
                    </button>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bulk Paste (Strict Format)</label>
                        <textarea
                            className="w-full h-80 p-3 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder={`Scene Title: The Magic Forest\nStory:\nThe bunny hopped through the green grass.\nWords:\n- bunny\n- hop\n- grass\n- green`}
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleBulkParse}
                        disabled={!bulkText.trim()}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                        Parse & Add Scenes
                    </button>
                    <div className="text-[11px] text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <p className="font-bold mb-1 text-blue-800">Format Guide:</p>
                        <pre className="whitespace-pre-wrap font-mono text-[10px] text-blue-900 opacity-80">
                            {`Scene Title: [Title]\nStory:\n[Story text...]\nWords:\n- [word1]\n- [word2]`}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
