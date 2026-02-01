'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
    Folder, FileText, Layers, Settings, Palette, Type,
    BookOpen, FileOutput, CheckCircle, AlertTriangle, Layout, Hash
} from 'lucide-react';
import { ProjectSection } from './ProjectSection';
import { PasteScenesSection } from './PasteScenesSection';
import { ScenesSection } from './ScenesSection';
import { PrintSettingsSection } from './PrintSettingsSection';
import { TemplateSection } from './TemplateSection';
import { ColorsSection } from './ColorsSection';
import { PracticeSection } from './PracticeSection';
import { ExportSection } from './ExportSection';
import { PageNumbersSection } from './PageNumbersSection';

export function Sidebar({ className }: { className?: string }) {
    const activeSection = useProjectStore((state) => state.activeSection);
    const setActiveSection = useProjectStore((state) => state.setActiveSection);
    const validationErrors = useProjectStore((state) => state.validationErrors);

    const sections = [
        { id: 'project', label: 'Project', icon: Folder },
        { id: 'paste', label: 'Paste Scenes', icon: FileText },
        { id: 'scenes', label: 'Scenes', icon: Layers },
        { id: 'print', label: 'Print Settings', icon: Settings },
        { id: 'template', label: 'Template', icon: Layout },
        { id: 'colors', label: 'Colors', icon: Palette },
        { id: 'practice', label: 'Writing Practice', icon: Type },
        { id: 'front-matter', label: 'Front Matter', icon: BookOpen },
        { id: 'ending-pages', label: 'Ending Pages', icon: BookOpen },
        { id: 'page-numbers', label: 'Page Numbers', icon: Hash },
        { id: 'validation', label: 'Validation', icon: CheckCircle },
        { id: 'export', label: 'Export', icon: FileOutput },
    ];

    return (
        <aside className={cn("flex flex-col text-sm h-full", className)}>
            {sections.map((section) => {
                const hasError = validationErrors.some(e => e.sectionId === section.id && e.severity === 'error');
                const hasWarning = validationErrors.some(e => e.sectionId === section.id && e.severity === 'warning');

                return (
                    <div key={section.id} className="border-b border-gray-100 last:border-0">
                        <button
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left focus:outline-none",
                                activeSection === section.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className="w-5 h-5 shrink-0" />
                                <span>{section.label}</span>
                            </div>
                            {hasError && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </button>
                        {activeSection === section.id && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100 shadow-inner animate-in slide-in-from-top-2 duration-200">
                                <SectionContent id={section.id} />
                            </div>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}

function SectionContent({ id }: { id: string }) {
    // We'll import these separately to avoid huge file, but for now placeholders or imports
    switch (id) {
        case 'project': return <ProjectSection />;
        case 'paste': return <PasteScenesSection />;
        case 'scenes': return <ScenesSection />;
        case 'print': return <PrintSettingsSection />;
        case 'template': return <TemplateSection />;
        case 'colors': return <ColorsSection />;
        case 'practice': return <PracticeSection />;
        case 'page-numbers': return <PageNumbersSection />;
        case 'export': return <ExportSection />;
        default: return <div className="text-gray-500 italic">Work in progress...</div>;
    }
}
