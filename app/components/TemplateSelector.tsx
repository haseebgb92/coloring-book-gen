"use client";

import { BUILT_IN_TEMPLATES } from "../lib/templates";
import { ProjectState, Template } from "../types";
import { Check, Settings2, Image as ImageIcon, Type, Square, FileText } from "lucide-react";

interface TemplateSelectorProps {
    project: ProjectState;
    setProject: (project: ProjectState) => void;
}

export default function TemplateSelector({ project, setProject }: TemplateSelectorProps) {
    const selectTemplate = (template: Template) => {
        setProject({ ...project, template });
    };

    const updateTemplate = (updates: Partial<Template>) => {
        setProject({
            ...project,
            template: { ...project.template, ...updates }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">Choose a Template</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BUILT_IN_TEMPLATES.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => selectTemplate(t)}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${project.template.id === t.id
                            ? 'border-accent bg-accent/5 ring-4 ring-accent/10'
                            : 'border-gray-200 bg-white/30 hover:border-accent/40'
                            }`}
                    >
                        {project.template.id === t.id && (
                            <div className="absolute top-4 right-4 bg-accent text-white p-1 rounded-full">
                                <Check size={16} />
                            </div>
                        )}
                        <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg mb-4 flex items-center justify-center border group-hover:border-accent/30 transition-colors">
                            <div className="text-center">
                                <div className="w-12 h-1 bg-gray-300 mx-auto mb-2 rounded shadow-sm"></div>
                                <div className="w-16 h-1 bg-gray-300 mx-auto mb-6 rounded shadow-sm opacity-60"></div>
                                <div className="w-20 h-20 border-2 border-gray-300 mx-auto rounded-lg flex items-center justify-center opacity-40">
                                    <ImageIcon size={32} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <h3 className="font-bold text-center">{t.name}</h3>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Settings2 size={24} className="text-accent" />
                    Customize Your Selection
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2"><Type size={16} /> Heading Size</label>
                        <div className="flex gap-2">
                            {['S', 'M', 'L'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => updateTemplate({ headingSize: size as any })}
                                    className={`flex-1 py-2 rounded-lg border font-bold transition-all ${project.template.headingSize === size ? 'bg-accent text-white border-accent' : 'bg-white hover:border-accent/50'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2"><Square size={16} /> Border</label>
                        <button
                            onClick={() => updateTemplate({ hasBorder: !project.template.hasBorder })}
                            className={`w-full py-2 rounded-lg border font-bold transition-all ${project.template.hasBorder ? 'bg-accent text-white border-accent' : 'bg-white hover:border-accent/50'
                                }`}
                        >
                            {project.template.hasBorder ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2"><ImageIcon size={16} /> Image Fit</label>
                        <div className="flex gap-2">
                            {['contain', 'cover'].map(fit => (
                                <button
                                    key={fit}
                                    onClick={() => updateTemplate({ imageFit: fit as any })}
                                    className={`flex-1 py-1 rounded-lg border text-xs font-bold capitalize transition-all ${project.template.imageFit === fit ? 'bg-accent text-white border-accent' : 'bg-white hover:border-accent/50'
                                        }`}
                                >
                                    {fit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2"><FileText size={16} /> Page Numbers</label>
                        <button
                            onClick={() => updateTemplate({ pageNumbers: !project.template.pageNumbers })}
                            className={`w-full py-2 rounded-lg border font-bold transition-all ${project.template.pageNumbers ? 'bg-accent text-white border-accent' : 'bg-white hover:border-accent/50'
                                }`}
                        >
                            {project.template.pageNumbers ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
