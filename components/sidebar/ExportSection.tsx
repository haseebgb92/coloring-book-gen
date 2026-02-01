'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { Download, Loader2, Cloud, Share, Copy, CheckCircle2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { BookDocument } from '../pdf/BookDocument';

export function ExportSection() {
    const state = useProjectStore(s => s);
    const validationErrors = useProjectStore(s => s.validationErrors);
    const hardErrors = validationErrors.filter(e => e.severity === 'error');
    const [isExporting, setIsExporting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [lastSynced, setLastSynced] = useState<number | null>(null);

    const handleExport = async () => {
        if (isExporting) return;

        setIsExporting(true);
        console.log('Generating PDF...');

        try {
            // Generate the PDF as a blob on demand
            // This ensures all current state changes are captured
            const doc = <BookDocument state={state} />;
            const blob = await pdf(doc).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileName = (state.name || 'coloring-book').replace(/\s+/g, '-').toLowerCase();
            link.download = `${fileName}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            setTimeout(() => URL.revokeObjectURL(url), 100);
            console.log('PDF Downloaded successfully.');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate PDF. Please check your scenes and images.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleCloudSave = async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            const response = await fetch('/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            });
            const data = await response.json();
            if (data.success) {
                setShareUrl(data.url);
                setLastSynced(Date.now());
            } else {
                throw new Error(data.error || 'Failed to sync');
            }
        } catch (error: any) {
            console.error('Sync failed:', error);
            alert(error.message || 'Failed to sync with cloud. Please ensure KV is configured on Vercel.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 flex gap-3">
                <div className="shrink-0 mt-0.5"><Download className="w-5 h-5 opacity-50" /></div>
                <div>
                    <p className="font-bold">Finalize Your Book</p>
                    <p className="text-xs opacity-80 mt-1">This will generate a high-quality PDF ready for Amazon KDP.</p>
                </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg text-sm text-emerald-800 border border-emerald-100 space-y-3">
                <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5"><Cloud className="w-5 h-5 opacity-50" /></div>
                    <div>
                        <p className="font-bold text-emerald-900">Cloud Sync & Backup</p>
                        <p className="text-[11px] opacity-80 mt-0.5">Save your project to the server to access it from anywhere.</p>
                    </div>
                </div>

                {shareUrl ? (
                    <div className="space-y-2">
                        <div className="bg-white/80 p-2 rounded border border-emerald-200 flex items-center justify-between gap-2 overflow-hidden">
                            <span className="text-[10px] font-mono truncate text-emerald-700">{shareUrl}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    alert('Link copied to clipboard!');
                                }}
                                className="p-1 hover:bg-emerald-100 rounded"
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Last synced: {new Date(lastSynced!).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ) : null}

                <button
                    onClick={handleCloudSave}
                    disabled={isSyncing}
                    className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:bg-emerald-300 flex items-center justify-center gap-2"
                >
                    {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
                    {isSyncing ? 'Syncing...' : 'Sync to Cloud'}
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Pre-flight Checklist</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${state.scenes.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{state.scenes.length} Scenes included</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>Trim: {state.printSettings.trimSize}</span>
                    </div>
                </div>
            </div>

            {hardErrors.length > 0 ? (
                <div className="bg-red-50 p-3 rounded-lg text-red-700 text-xs border border-red-100">
                    <strong className="block mb-1">Cannot Export: {hardErrors.length} Errors Found</strong>
                    <p className="opacity-80">Please resolve all critical issues in the Validation tab before generating the PDF.</p>
                </div>
            ) : (
                <button
                    onClick={handleExport}
                    disabled={isExporting || hardErrors.length > 0}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 flex items-center justify-center gap-3"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Download Print-Ready PDF
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
