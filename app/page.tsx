'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { ProjectState, Story, TrimSize } from './types';
import { KDP_PRESETS } from './lib/kdp-helper';
import { BUILT_IN_TEMPLATES } from './lib/templates';
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
    const [storyForm, setStoryForm] = useState({ title: '', text: '', words: '' });

    const addStory = () => {
        if (!storyForm.title || !storyForm.text) return;

        const words = storyForm.words.split(',').map(w => w.trim()).filter(w => w);
        const newStory: Story = {
            order: Date.now(),
            title: storyForm.title,
            story_text: storyForm.text,
            writing_words: words,
            lesson: ''
        };

        setProject({ ...project, stories: [...project.stories, newStory] });
        setStoryForm({ title: '', text: '', words: '' });
    };

    const removeStory = (index: number) => {
        setProject({ ...project, stories: project.stories.filter((_, i) => i !== index) });
    };

    const handleExport = async () => {
        setIsGenerating(true);
        setProgress(0);
        try {
            const pdfBlob = await generateColoringBookPDF(project, (p) => setProgress(p));
            saveAs(pdfBlob, `${project.title.replace(/\s+/g, '_')}_KDP.pdf`);
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    const totalSpreads = Math.max(1, Math.ceil((project.stories.length * 2 + 4) / 2));

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900">
            {/* MODERN TOP BAR */}
            <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative overflow-hidden shadow-sm z-20">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 animate-float">
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

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
                {/* MODERN SIDEBAR - LIGHT THEME */}
                <aside className="w-96 bg-white border-r border-slate-200 overflow-y-auto z-10 shadow-sm">
                    <Accordion type="multiple" defaultValue={['content', 'design', 'printing']} className="w-full">

                        {/* CONTENT SECTION */}
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
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Story Title
                                    </Label>
                                    <Input
                                        value={storyForm.title}
                                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                        placeholder="The Brave Lion"
                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Story Text
                                    </Label>
                                    <Textarea
                                        rows={4}
                                        value={storyForm.text}
                                        onChange={(e) => setStoryForm({ ...storyForm, text: e.target.value })}
                                        placeholder="Once upon a time, there was a brave little lion..."
                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl resize-none"
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Short, positive, age-appropriate (ages 2-7)</p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Writing Practice Words
                                    </Label>
                                    <Input
                                        value={storyForm.words}
                                        onChange={(e) => setStoryForm({ ...storyForm, words: e.target.value })}
                                        placeholder="Lion, Brave, Jungle, King, Friend"
                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 rounded-xl"
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Comma-separated vocabulary words</p>
                                </div>

                                <Button
                                    onClick={addStory}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-md shadow-indigo-100 smooth-transition"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Story
                                </Button>

                                {/* STORY LIST */}
                                <div className="pt-4 space-y-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Added Stories</p>
                                    {project.stories.length === 0 && (
                                        <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <Book className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                                            <p className="text-xs text-slate-400">No stories yet</p>
                                        </div>
                                    )}
                                    {project.stories.map((story, i) => (
                                        <div key={i} className="group bg-white hover:bg-slate-50 rounded-xl p-4 smooth-transition border border-slate-200 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-slate-200 text-slate-500">
                                                            Story #{i + 1}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-900 truncate">{story.title}</p>
                                                    <p className="text-xs text-slate-500 truncate mt-1">{story.story_text}</p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 smooth-transition text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removeStory(i)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* IMAGES SECTION */}
                        <AccordionItem value="images" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <ImageIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-slate-800">Illustrations</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <p className="text-sm text-slate-600">Upload coloring illustrations for each story</p>
                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                                    <p className="text-xs text-slate-500">📁 Supported: PNG, JPG, WEBP</p>
                                    <p className="text-xs text-slate-500">📝 File names should match story titles</p>
                                    <p className="text-xs text-slate-500">✅ Case-insensitive matching</p>
                                </div>
                                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-11 rounded-xl">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Illustrations
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                        {/* DESIGN SECTION */}
                        <AccordionItem value="design" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <Palette className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <span className="font-bold text-slate-800">Design & Templates</span>
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
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* TYPOGRAPHY SECTION */}
                        <AccordionItem value="typography" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Type className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <span className="font-bold text-slate-800">Writing Practice</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-700">✍️ Dotted Tracing Font</p>
                                    <p className="text-xs text-slate-500">Automatically applied to practice words</p>
                                    <p className="text-xs text-slate-500">3+ repetitions per word</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* PRINTING SECTION */}
                        <AccordionItem value="printing" className="border-b border-slate-100">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-slate-50 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Printer className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <span className="font-bold text-slate-800">KDP Print Settings</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trim Size</Label>
                                    <select
                                        value={project.config.trimSize}
                                        onChange={(e) => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none smooth-transition"
                                    >
                                        <option value="6x9">6 x 9 in (6.25 x 9.25 with bleed)</option>
                                        <option value="8x10">8 x 10 in (8.25 x 10.25 with bleed)</option>
                                        <option value="8.5x11">8.5 x 11 in (8.75 x 11.25 with bleed)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={project.config.hasBleed}
                                        onChange={(e) => setProject({ ...project, config: { ...project.config, hasBleed: e.target.checked } })}
                                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Include Bleed (0.125")</p>
                                        <p className="text-xs text-slate-500">Required for full-page illustrations</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </aside>

                {/* MODERN PREVIEW AREA */}
                <main className="flex-1 overflow-hidden flex flex-col relative bg-slate-100">

                    {/* Preview Controls */}
                    <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))}
                                disabled={currentSpread === 0}
                                className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 disabled:opacity-30 smooth-transition text-slate-600"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                                <span className="text-sm font-mono font-bold text-slate-600">
                                    Spread {currentSpread + 1} / {totalSpreads}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setCurrentSpread(Math.min(totalSpreads - 1, currentSpread + 1))}
                                disabled={currentSpread >= totalSpreads - 1}
                                className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 disabled:opacity-30 smooth-transition text-slate-600"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>

                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 px-4 py-2 font-mono">
                            {project.config.trimSize} • {project.config.hasBleed ? 'With Bleed' : 'No Bleed'}
                        </Badge>
                    </div>

                    {/* Book Preview */}
                    <div className="flex-1 overflow-auto p-12 flex items-center justify-center relative z-0">
                        {project.stories.length === 0 ? (
                            <div className="text-center animate-float">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                                    <Book className="h-12 w-12 text-indigo-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Stories Yet</h3>
                                <p className="text-slate-500">Add stories from the sidebar to see your book preview</p>
                            </div>
                        ) : (
                            <div className="flex gap-1 shadow-2xl rounded-sm overflow-hidden bg-slate-800 p-1" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                                {/* Left Page - Illustration */}
                                <div
                                    className="bg-white flex items-center justify-center relative overflow-hidden"
                                    style={{
                                        width: '400px',
                                        aspectRatio: project.config.trimSize.replace('x', '/'),
                                    }}
                                >
                                    <div className="w-full h-full p-8 flex items-center justify-center relative z-10">
                                        <div className="w-full h-full border-4 border-dashed border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center">
                                            <div className="text-center text-slate-300">
                                                <ImageIcon className="h-16 w-16 mx-auto mb-3" strokeWidth={1.5} />
                                                <p className="text-sm font-bold uppercase tracking-wider">Illustration</p>
                                                {currentSpread > 0 && currentSpread - 1 < project.stories.length && (
                                                    <p className="text-xs mt-2 text-slate-400 max-w-[150px] mx-auto truncate">
                                                        {project.stories[currentSpread - 1].title}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Page - Story + Writing Practice */}
                                <div
                                    className="bg-white flex items-start justify-center relative overflow-hidden"
                                    style={{
                                        width: '400px',
                                        aspectRatio: project.config.trimSize.replace('x', '/'),
                                    }}
                                >
                                    {currentSpread === 0 ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                                                <Sparkles className="h-8 w-8 text-indigo-500" />
                                            </div>
                                            <h1 className="text-4xl font-black mb-4 text-slate-900">{project.title}</h1>
                                            <div className="w-20 h-1 bg-indigo-600 rounded-full mb-6"></div>
                                            <p className="text-sm text-slate-500 font-medium">A Story & Coloring Book</p>
                                            <p className="text-xs text-slate-400 mt-2">Ages 2-7</p>
                                        </div>
                                    ) : currentSpread - 1 < project.stories.length ? (
                                        <div className="w-full h-full p-10 space-y-6 overflow-hidden relative z-10">
                                            <h2 className="text-2xl font-black border-b-2 border-slate-100 pb-3 text-slate-900">
                                                {project.stories[currentSpread - 1].title}
                                            </h2>
                                            <p className="text-sm leading-relaxed text-slate-700 line-clamp-[8] font-serif">
                                                {project.stories[currentSpread - 1].story_text}
                                            </p>
                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                                    ✍️ Writing Practice
                                                </p>
                                                {project.stories[currentSpread - 1].writing_words.slice(0, 4).map((word, idx) => (
                                                    <div key={idx} className="border-b border-dashed border-slate-300 pb-4 pt-2">
                                                        <span className="text-3xl text-slate-300 tracking-[0.2em] block text-center opacity-50" style={{ fontFamily: 'Raleway Dots, cursive' }}>
                                                            {word}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 relative z-10">
                                            <p className="text-sm">End Matter</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
