'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { parseScenesInput } from '@/lib/parser';

export function PasteScenesSection() {
    const [text, setText] = useState('');
    const addScene = useProjectStore(s => s.addScene);
    const setScenes = useProjectStore(s => s.setScenes);
    const setActiveSection = useProjectStore(s => s.setActiveSection);

    const handleParse = () => {
        try {
            const parsed = parseScenesInput(text);
            if (parsed.length > 0) {
                // Simple logic: if existing scenes, ask user (using window.confirm not ideal but quick)
                // Better: just append or have toggle. Using append by default if not strictly replacing.
                // Spec says "No JSON import...".
                // Let's just setScenes for now to keep it clean, or append.
                // Logic: if current scenes > 0, append.
                // Actually, let's just use append for safety.

                parsed.forEach(s => addScene(s));

                setActiveSection('scenes');
                setText('');
                alert(`Successfully added ${parsed.length} scenes.`);
            } else {
                alert('No scenes found. Please check the format matches the requirements.');
            }
        } catch (e) {
            console.error(e);
            alert('Error parsing text.');
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500">PASTE TEXT</label>
                <textarea
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder={`Scene Title: The Magic Forest
Story:
The bunny hopped through the green grass.
Words:
- bunny
- hop
- grass
- green`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button
                onClick={handleParse}
                disabled={!text.trim()}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Parse Scenes
            </button>
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="font-semibold mb-1 text-blue-800">Format Guide:</p>
                <pre className="whitespace-pre-wrap font-mono text-[10px] text-blue-900">
                    {`Scene Title: [Title]
Story:
[Story text...]
Words:
- [word1]
- [word2]`}
                </pre>
            </div>
        </div>
    );
}
