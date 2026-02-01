'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { Download } from 'lucide-react';

export function ExportSection() {
    const validationErrors = useProjectStore(s => s.validationErrors);
    const hardErrors = validationErrors.filter(e => e.severity === 'error');

    const handleExport = async () => {
        // This will trigger the PDF generation which we will implement with @react-pdf/renderer
        // Ideally this opens a blob URL or downloads it.
        console.log('Exporting...');
        alert('PDF Generation will be handled by the preview pane download button for now, or unified here.');
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                <p>Ready to create your book?</p>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-gray-500">
                    <li>Check all scenes are correct</li>
                    <li>Verify print settings</li>
                    <li>Review Validation tab for errors</li>
                </ul>
            </div>

            {hardErrors.length > 0 ? (
                <div className="bg-red-50 p-3 rounded text-red-700 text-xs border border-red-100">
                    <strong>{hardErrors.length} Critical Issues Found:</strong>
                    <ul className="list-disc pl-4 mt-1">
                        {hardErrors.slice(0, 3).map((e, i) => <li key={i}>{e.message}</li>)}
                        {hardErrors.length > 3 && <li>...and more</li>}
                    </ul>
                    <p className="mt-2 text-[10px] text-red-600">Please fix errors in Validation tab before exporting.</p>
                </div>
            ) : (
                validationErrors.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded text-yellow-700 text-xs border border-yellow-100">
                        <strong>Warnings Found:</strong>
                        <p>You can export, but review the Validation tab.</p>
                    </div>
                )
            )}

            <button
                onClick={handleExport}
                disabled={hardErrors.length > 0}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-sm hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Download className="w-5 h-5" />
                Export PDF
            </button>
        </div>
    );
}
