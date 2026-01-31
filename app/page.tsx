'use client';

import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/app/components/ui/accordion';
import {
    Book,
    FileText,
    Image as ImageIcon,
    Palette,
    Type,
    Printer,
    Plus,
    Trash2,
    Download,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Zap,
    Upload,
    CheckCircle2,
    Paperclip,
    X
} from 'lucide-react';
import { ProjectState, Story, TrimSize } from './types';
import { KDP_PRESETS } from './lib/kdp-helper';
import { BUILT_IN_TEMPLATES } from './lib/templates';
import { GOOGLE_FONTS, PREVIEW_FONTS_LINK } from './lib/fonts';
import { generateColoringBookPDF } from './lib/pdf-engine';
import { saveAs } from 'file-saver';

export default function ColoringBookStudio() {
    const [project, setProject] = useState<ProjectState>({
        title: "My Coloring Book",
        config: KDP_PRESETS['8.5x11'],
        stories: [],
        template: BUILT_IN_TEMPLATES[0],
        frontMatter: ['title-page', 'copyright'],
        endMatter: ['certificate'],
    });

    const [currentSpread, setCurrentSpread] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Story form state
    const [storyForm, setStoryForm] = useState({ title: '', text: '', words: '' });
    const [isEditing, setIsEditing] = useState<number | null>(null);

    // File inputs
    const bulkInputRef = useRef<HTMLInputElement>(null);
    const singleInputRef = useRef<HTMLInputElement>(null);
    const [attachingToId, setAttachingToId] = useState<number | null>(null);

    // Manage illustrations mapping: { storyIndex: dataUrl }
    const [illustrations, setIllustrations] = useState<Record<number, string>>({});

    const addOrUpdateStory = () => {
        if (!storyForm.title || !storyForm.text) return;

        // Preserve formatting by keeping newlines
        const words = storyForm.words.split(',').map(w => w.trim()).filter(w => w);

        // Create new story object
        const newStory: Story = {
            order: isEditing !== null ? project.stories[isEditing].order : Date.now(),
            title: storyForm.title,
            story_text: storyForm.text,
            writing_words: words,
            lesson: ''
        };

        if (isEditing !== null) {
            // Update existing
            const updatedStories = [...project.stories];
            updatedStories[isEditing] = newStory;
            setProject({ ...project, stories: updatedStories });
            setIsEditing(null);
        } else {
            // Add new
            setProject({ ...project, stories: [...project.stories, newStory] });
        }

        // Reset form
        setStoryForm({ title: '', text: '', words: '' });
    };

    const editStory = (index: number) => {
        const story = project.stories[index];
        setStoryForm({
            title: story.title,
            text: story.story_text,
            words: story.writing_words.join(', ')
        });
        setIsEditing(index);
    };

    const removeStory = (index: number) => {
        setProject({ ...project, stories: project.stories.filter((_, i) => i !== index) });
        if (isEditing === index) {
            setIsEditing(null);
            setStoryForm({ title: '', text: '', words: '' });
        }
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                // Try to match file name to story title
                const fileName = file.name.toLowerCase().replace(/\.[^/.]+$/, ""); // remove extension

                const matchedIndex = project.stories.findIndex(s =>
                    s.title.toLowerCase().trim() === fileName.trim() ||
                    fileName.includes(s.title.toLowerCase().trim())
                );

                if (matchedIndex !== -1) {
                    setIllustrations(prev => ({ ...prev, [matchedIndex]: dataUrl }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (attachingToId === null || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setIllustrations(prev => ({ ...prev, [attachingToId]: dataUrl }));
            setAttachingToId(null); // Reset
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeImage = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newIll = { ...illustrations };
        delete newIll[index];
        setIllustrations(newIll);
    };

    const handleExport = async () => {
        setIsGenerating(true);
        setProgress(0);
        try {
            const projectWithImages = {
                ...project,
                stories: project.stories.map((s, i) => ({
                    ...s,
                    illustration: illustrations[i]
                }))
            };

            const pdfBlob = await generateColoringBookPDF(projectWithImages, (p) => setProgress(p));
            saveAs(pdfBlob, `${project.title.replace(/\s+/g, '_')}_KDP.pdf`);
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    const totalSpreads = Math.max(1, Math.ceil((project.stories.length * 2 + 4) / 2));
    const fontFamilyStyle = project.template.fontFamily || 'Helvetica, sans-serif';

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900">
            {/* Load Fonts for Preview */}
            <link href={PREVIEW_FONTS_LINK} rel="stylesheet" />

            {/* Hidden Inputs */}
            <input
                type="file"
                multiple
                accept="image/*"
                ref={bulkInputRef}
                className="hidden"
                onChange={handleBulkUpload}
            />
            <input
                type="file"
                accept="image/*"
                ref={singleInputRef}
                className="hidden"
                onChange={handleManualUpload}
            />

            {/* HEADER */}
            <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative overflow-hidden shadow-sm z-20">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Coloring Book Studio</h1>
                        <p className="text-xs text-slate-500 font-medium">Story-Based Coloring Books for Ages 2-7</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 px-4 py-2 font-mono">
                        <Book className="h-3 w-3 mr-2" />
                        {project.stories.length} Stories
                    </Badge>
                    <Button
                        onClick={handleExport}
                        disabled={project.stories.length === 0 || isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-indigo-200 smooth-transition"
                    >
                        {isGenerating ? (
                            <>
                                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                                Generating {progress}%
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="flex-1 flex overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-96 bg-white border-r border-slate-200 overflow-y-auto z-10 shadow-sm">
                    <Accordion type="multiple" defaultValue={['content', 'design']} className="w-full">

                        {/* CONTENT */}
                        <AccordionItem value="content" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-slate-800">Story Content</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-5">
                                {/* Form */}
                                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Title</Label>
                                        <Input
                                            value={storyForm.title}
                                            onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                            placeholder="e.g. The Happy Elephant"
                                            className="bg-white border-slate-200 h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Story Text</Label>
                                        <Textarea
                                            rows={4}
                                            value={storyForm.text}
                                            onChange={(e) => setStoryForm({ ...storyForm, text: e.target.value })}
                                            placeholder="Paste text here..."
                                            className="bg-white border-slate-200 resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Practice Words</Label>
                                        <Input
                                            value={storyForm.words}
                                            onChange={(e) => setStoryForm({ ...storyForm, words: e.target.value })}
                                            placeholder="elephant, happy, water"
                                            className="bg-white border-slate-200 h-10"
                                        />
                                    </div>
                                    <Button
                                        onClick={addOrUpdateStory}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 rounded-lg"
                                    >
                                        {isEditing !== null ? 'Update Story' : 'Add Story'}
                                    </Button>
                                </div>

                                {/* Story List */}
                                <div className="space-y-3">
                                    {project.stories.map((story, i) => (
                                        <div
                                            key={i}
                                            className={`relative group rounded-xl p-3 border cursor-pointer smooth-transition ${isEditing === i ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'
                                                }`}
                                            onClick={() => editStory(i)}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5">#{i + 1}</Badge>
                                                        <span className="font-bold text-sm text-slate-900 truncate">{story.title}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{story.story_text}</p>

                                                    {/* Image Indicator / Upload Button */}
                                                    <div className="mt-3 flex items-center gap-2">
                                                        {illustrations[i] ? (
                                                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 text-xs font-medium">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Image Attached
                                                                <button
                                                                    onClick={(e) => removeImage(e, i)}
                                                                    className="ml-1 hover:text-green-900"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs border-slate-200 hover:bg-slate-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAttachingToId(i);
                                                                    singleInputRef.current?.click();
                                                                }}
                                                            >
                                                                <Paperclip className="h-3 w-3 mr-1" />
                                                                Attach Image
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeStory(i);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* DESIGN */}
                        <AccordionItem value="design" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <Palette className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <span className="font-bold text-slate-800">Design & Template</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Style</Label>
                                    <select
                                        value={project.template.id}
                                        onChange={(e) => setProject({ ...project, template: BUILT_IN_TEMPLATES.find(t => t.id === e.target.value)! })}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none smooth-transition"
                                    >
                                        {BUILT_IN_TEMPLATES.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.fontFamily})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                                    <p>Selected Format: {project.template.description}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* PRINTING (Collapsed default) */}
                        <AccordionItem value="printing" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Printer className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <span className="font-bold text-slate-800">Print Settings</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6">
                                <select
                                    value={project.config.trimSize}
                                    onChange={(e) => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm mb-3"
                                >
                                    <option value="6x9">6 x 9 in</option>
                                    <option value="8x10">8 x 10 in</option>
                                    <option value="8.5x11">8.5 x 11 in</option>
                                </select>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={project.config.hasBleed}
                                        onChange={(e) => setProject({ ...project, config: { ...project.config, hasBleed: e.target.checked } })}
                                        className="rounded border-slate-300 text-indigo-600"
                                    />
                                    <span className="text-sm">Include Bleed</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </aside>

                {/* PREVIEW */}
                <main className="flex-1 overflow-hidden flex flex-col relative bg-slate-100">
                    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))}>
                                <ChevronLeft className="h-5 w-5 text-slate-600" />
                            </Button>
                            <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded">
                                Spread {currentSpread + 1} / {totalSpreads}
                            </span>
                            <Button size="icon" variant="ghost" onClick={() => setCurrentSpread(Math.min(totalSpreads - 1, currentSpread + 1))}>
                                <ChevronRight className="h-5 w-5 text-slate-600" />
                            </Button>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                            {project.config.trimSize} • {project.template.name}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                        {project.stories.length > 0 ? (
                            <div className="flex bg-slate-800 p-1 shadow-2xl rounded-sm">

                                {/* LEFT: STORY */}
                                <div className="bg-white flex flex-col p-8 overflow-hidden relative" style={{ width: '400px', aspectRatio: project.config.trimSize.replace('x', '/') }}>
                                    {currentSpread > 0 && currentSpread - 1 < project.stories.length ? (
                                        <>
                                            <h2 className="text-xl font-bold mb-4 text-center text-slate-900" style={{ fontFamily: fontFamilyStyle }}>
                                                {project.stories[currentSpread - 1].title}
                                            </h2>
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed mb-8 flex-1 text-slate-900" style={{ fontFamily: fontFamilyStyle }}>
                                                {project.stories[currentSpread - 1].story_text}
                                            </div>
                                            <div className="mt-auto border-t border-dashed border-slate-200 pt-4">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 text-center mb-3">Writing Practice</p>
                                                {project.stories[currentSpread - 1].writing_words.slice(0, 5).map((w, i) => (
                                                    <div key={i} className="flex justify-between mb-2">
                                                        {[1, 2, 3].map(n => (
                                                            <span key={n} className="text-xl text-slate-400 font-dotted opacity-70 tracking-widest">{w}</span>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : currentSpread === 0 ? (
                                        <div className="flex items-center justify-center h-full flex-col">
                                            <Sparkles className="h-12 w-12 text-indigo-500 mb-4" />
                                            <h1 className="text-2xl font-bold text-center text-slate-900" style={{ fontFamily: fontFamilyStyle }}>{project.title}</h1>
                                        </div>
                                    ) : null}
                                </div>

                                {/* RIGHT: ILLUSTRATION */}
                                <div className="bg-white flex items-center justify-center relative" style={{ width: '400px', aspectRatio: project.config.trimSize.replace('x', '/') }}>
                                    {currentSpread > 0 && currentSpread - 1 < project.stories.length ? (
                                        <div className="border-[3px] border-slate-900 w-[85%] h-[85%] flex items-center justify-center p-2">
                                            {illustrations[currentSpread - 1] ? (
                                                <img src={illustrations[currentSpread - 1]} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <div className="text-center text-slate-300">
                                                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                                                    <span className="text-xs font-bold uppercase">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Book className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">Add stories to begin</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <style jsx>{`
        .font-dotted {
          font-family: 'Raleway Dots', cursive;
        }
      `}</style>
        </div>
    );
}
