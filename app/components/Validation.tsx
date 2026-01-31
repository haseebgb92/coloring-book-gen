"use client";

import { CheckCircle2, AlertTriangle, XCircle, Info, Image as ImageIcon, Type } from "lucide-react";
import { ProjectState } from "../types";

interface ValidationProps {
    project: ProjectState;
}

export default function Validation({ project }: ValidationProps) {
    const checks = [
        {
            id: 'images',
            name: 'Illustrations',
            desc: 'Every story must have a matching illustration file.',
            status: project.stories.every(s => !!s.image_path) ? 'pass' : 'fail',
            count: `${project.stories.filter(s => !!s.image_path).length}/${project.stories.length} mapped`,
            icon: ImageIcon
        },
        {
            id: 'words',
            name: 'Writing Words',
            desc: '4–5 words required per story for tracing practice.',
            status: project.stories.every(s => s.writing_words.length >= 4 && s.writing_words.length <= 5) ? 'pass' : 'fail',
            count: `${project.stories.filter(s => s.writing_words.length >= 4 && s.writing_words.length <= 5).length}/${project.stories.length} correct`,
            icon: Type
        },
        {
            id: 'margins',
            name: 'KDP Print Safety',
            desc: 'Content will be automatically centered within safe zones.',
            status: 'pass',
            count: 'Automatic',
            icon: Info
        }
    ];

    const totalErrors = checks.filter(c => c.status === 'fail').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">Pre-Export Validation</h2>

            {totalErrors > 0 ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                    <XCircle size={24} />
                    <div>
                        <p className="font-bold">Errors Found</p>
                        <p className="text-sm">Please resolve {totalErrors} issues before exporting your PDF.</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-600">
                    <CheckCircle2 size={24} />
                    <div>
                        <p className="font-bold">Everything Looks Great!</p>
                        <p className="text-sm">Your book meets all KDP and project requirements.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {checks.map((check) => {
                    const Icon = check.icon;
                    return (
                        <div key={check.id} className="p-6 bg-white rounded-2xl border shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${check.status === 'pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">{check.name}</h3>
                                    <p className="text-sm text-gray-500">{check.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-mono text-sm font-bold ${check.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                    {check.count}
                                </p>
                                <div className="flex items-center gap-1 justify-end mt-1">
                                    {check.status === 'pass' ? (
                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Pass</span>
                                    ) : (
                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Fail</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl flex gap-4">
                <AlertTriangle className="text-blue-500 shrink-0" size={24} />
                <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">A Note on Pagination</p>
                    <p>Illustrations will always be placed on LEFT pages and stories on RIGHT pages. We will automatically insert blank pages where necessary to maintain this pairing from start to finish.</p>
                </div>
            </div>
        </div>
    );
}
