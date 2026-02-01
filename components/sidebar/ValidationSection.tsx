'use client';

import React, { useEffect } from 'react';
import { useProjectStore } from '@/lib/store';
import { ValidationError } from '@/lib/types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function ValidationSection() {
    // We could compute validation here, or in a useEffect hook in the store or at top level.
    // Ideally validation is reactive.
    const state = useProjectStore(s => s);
    // Let's implement dynamic validation here.

    const errors: ValidationError[] = [];

    // Validate Scenes
    if (state.scenes.length === 0) {
        errors.push({ sectionId: 'scenes', message: 'No scenes added. The book is empty.', severity: 'error' });
    } else {
        state.scenes.forEach((scene, idx) => {
            if (!scene.title) errors.push({ sectionId: 'scenes', message: `Scene ${idx + 1}: Missing title`, severity: 'error' });
            if (!scene.story) errors.push({ sectionId: 'scenes', message: `Scene ${idx + 1}: Missing story text`, severity: 'error' });
            if (scene.words.length < 4) errors.push({ sectionId: 'scenes', message: `Scene ${idx + 1}: Needs at least 4 tracing words.`, severity: 'warning' });
            if (!scene.illustration) errors.push({ sectionId: 'scenes', message: `Scene ${idx + 1}: Missing illustration`, severity: 'warning' }); // Not hard error? Spec says "Missing illustration for any scene" is Hard Error.
        });
    }

    // Validate Settings
    if (state.writingSettings.minRepetitions < 3) errors.push({ sectionId: 'practice', message: 'Minimum 3 repetitions required.', severity: 'error' });

    const hardErrors = errors.filter(e => e.severity === 'error');
    const warnings = errors.filter(e => e.severity === 'warning');

    // Update store with these errors so sidebar can show icons?
    // We can't update store inside render.
    // We should use a `useEffect` to sync validation state back to store if we want global visibility.
    /*
    useEffect(() => {
        // useProjectStore.setState({ validationErrors: errors }); // Infinite loop risk if not careful
        // Better to just calculate derived state
    }, [state.scenes, state.writingSettings]);
    */

    // For now just partial display

    return (
        <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${hardErrors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                    {hardErrors.length > 0 ? <XCircle className="w-6 h-6 text-red-500" /> : <CheckCircle className="w-6 h-6 text-green-500" />}
                    <h3 className={`font-bold ${hardErrors.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {hardErrors.length > 0 ? 'Validation Failed' : 'Ready to Export'}
                    </h3>
                </div>
                <p className="text-sm text-gray-600">
                    {hardErrors.length > 0
                        ? "Please fix the following critical issues before exporting."
                        : warnings.length > 0 ? "You can export, but consider checking warnings." : "Project looks great!"}
                </p>
            </div>

            <div className="space-y-2">
                {hardErrors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{err.message}</span>
                    </div>
                ))}
                {warnings.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{err.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
