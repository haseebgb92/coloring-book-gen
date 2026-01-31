"use client";

import { Download, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ProjectState } from "../types";
import { generateColoringBookPDF } from "../lib/pdf-engine";
import confetti from "canvas-confetti";
import { saveAs } from "file-saver";

interface ExportButtonProps {
    project: ProjectState;
}

export default function ExportButton({ project }: ExportButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);

    const handleExport = async () => {
        setIsGenerating(true);
        setIsDone(false);
        setProgress(0);

        try {
            const pdfBlob = await generateColoringBookPDF(project, (p) => setProgress(p));
            saveAs(pdfBlob, `${project.title.replace(/\s+/g, '_')}_KDP_Interior.pdf`);

            setIsDone(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#2c3e50', '#ffffff']
            });
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to generate PDF. Check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {isGenerating ? (
                <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between text-sm font-bold mb-1">
                        <span className="text-accent flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            Generating PDF...
                        </span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 text-center uppercase tracking-widest font-bold">
                        Assembling layouts & embedding fonts
                    </p>
                </div>
            ) : isDone ? (
                <div className="text-center space-y-6">
                    <div className="flex flex-col items-center gap-2 text-green-600">
                        <CheckCircle size={48} />
                        <p className="text-xl font-bold">Download Started!</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="text-accent font-bold hover:underline flex items-center gap-2 mx-auto"
                    >
                        <Download size={16} />
                        Generate Again
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleExport}
                    className="btn-primary flex items-center gap-3 text-lg px-12 py-5 shadow-xl shadow-primary/20 hover:shadow-primary/40 transform hover:scale-105 transition-all"
                >
                    <Sparkles size={24} />
                    Assemble & Download PDF
                </button>
            )}
        </div>
    );
}
