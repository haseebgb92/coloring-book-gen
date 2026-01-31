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
        <div className="h-screen flex flex-col overflow-hidden">
            {/* MODERN TOP BAR */}
            <header className="h-20 glass-strong border-b border-white/10 flex items-center justify-between px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 animate-pulse"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center glow-purple-strong animate-float">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black gradient-text">Coloring Book Studio</h1>
                        <p className="text-xs text-white/50 font-medium">Story-Based Coloring Books for Ages 2-7</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <Badge className="bg-white/10 text-white border-white/20 font-mono backdrop-blur-xl px-4 py-2">
                        <Book className="h-3 w-3 mr-2" />
                        {project.stories.length} Stories
                    </Badge>
                    <Button
                        onClick={handleExport}
                        disabled={project.stories.length === 0 || isGenerating}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 h-11 rounded-xl glow-purple smooth-transition shadow-2xl"
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
                {/* MODERN SIDEBAR */}
                <aside className="w-96 glass border-r border-white/10 overflow-y-auto">
                    <Accordion type="multiple" defaultValue={['content', 'design', 'printing']} className="w-full">

                        {/* CONTENT SECTION */}
                        <AccordionItem value="content" className="border-b border-white/10">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-white/5 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <span className="font-bold text-white">Story Content</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                                        Story Title
                                    </Label>
                                    <Input
                                        value={storyForm.title}
                                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                        placeholder="The Brave Lion"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-purple-500/20 h-11 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                                        Story Text
                                    </Label>
                                    <Textarea
                                        rows={4}
                                        value={storyForm.text}
                                        onChange={(e) => setStoryForm({ ...storyForm, text: e.target.value })}
                                        placeholder="Once upon a time, there was a brave little lion..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                                    />
                                    <p className="text-[10px] text-white/40 italic">Short, positive, age-appropriate (ages 2-7)</p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                                        Writing Practice Words (4-5 words)
                                    </Label>
                                    <Input
                                        value={storyForm.words}
                                        onChange={(e) => setStoryForm({ ...storyForm, words: e.target.value })}
                                        placeholder="Lion, Brave, Jungle, King, Friend"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-purple-500/20 h-11 rounded-xl"
                                    />
                                    <p className="text-[10px] text-white/40 italic">Comma-separated vocabulary words for tracing practice</p>
                                </div>

                                <Button
                                    onClick={addStory}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold h-11 rounded-xl glow-purple smooth-transition"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Story
                                </Button>

                                {/* STORY LIST */}
                                <div className="pt-4 space-y-3">
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Added Stories</p>
                                    {project.stories.length === 0 && (
                                        <div className="text-center py-8 px-4 glass rounded-xl border border-white/10">
                                            <Book className="h-10 w-10 mx-auto mb-3 text-white/20" />
                                            <p className="text-xs text-white/40">No stories yet</p>
                                        </div>
                                    )}
                                    {project.stories.map((story, i) => (
                                        <div key={i} className="group glass hover:bg-white/10 rounded-xl p-4 smooth-transition border border-white/10">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-[10px] px-2 py-0.5">
                                                            Story #{i + 1}
                                                        </Badge>
                                                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-[10px] px-2 py-0.5">
                                                            {story.writing_words.length} words
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-bold text-white truncate">{story.title}</p>
                                                    <p className="text-xs text-white/50 truncate mt-1">{story.story_text}</p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 smooth-transition hover:bg-red-500/20 hover:text-red-400"
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
                        <AccordionItem value="images" className="border-b border-white/10">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-white/5 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                                        <ImageIcon className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <span className="font-bold text-white">Illustrations</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <p className="text-sm text-white/60">Upload coloring illustrations for each story</p>
                                <div className="glass rounded-xl border border-white/10 p-4 space-y-2">
                                    <p className="text-xs text-white/50">📁 Supported: PNG, JPG, WEBP</p>
                                    <p className="text-xs text-white/50">📝 File names should match story titles</p>
                                    <p className="text-xs text-white/50">✅ Case-insensitive matching</p>
                                </div>
                                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-11 rounded-xl">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Illustrations
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                        {/* DESIGN SECTION */}
                        <AccordionItem value="design" className="border-b border-white/10">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-white/5 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex items-center justify-center">
                                        <Palette className="h-5 w-5 text-pink-400" />
                                    </div>
                                    <span className="font-bold text-white">Design & Templates</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-white/70 uppercase tracking-wider">Template Style</Label>
                                    <select
                                        value={project.template.id}
                                        onChange={(e) => setProject({ ...project, template: BUILT_IN_TEMPLATES.find(t => t.id === e.target.value)! })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none smooth-transition"
                                    >
                                        {BUILT_IN_TEMPLATES.map(t => (
                                            <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* TYPOGRAPHY SECTION */}
                        <AccordionItem value="typography" className="border-b border-white/10">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-white/5 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 flex items-center justify-center">
                                        <Type className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <span className="font-bold text-white">Writing Practice</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-4">
                                <div className="glass rounded-xl border border-white/10 p-4 space-y-2">
                                    <p className="text-xs font-bold text-white">✍️ Dotted Tracing Font</p>
                                    <p className="text-xs text-white/50">Automatically applied to practice words</p>
                                    <p className="text-xs text-white/50">3+ repetitions per word</p>
                                    <p className="text-xs text-white/50">Large spacing for crayons</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* PRINTING SECTION */}
                        <AccordionItem value="printing" className="border-b border-white/10">
                            <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-white/5 smooth-transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center">
                                        <Printer className="h-5 w-5 text-green-400" />
                                    </div>
                                    <span className="font-bold text-white">KDP Print Settings</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-white/70 uppercase tracking-wider">Trim Size</Label>
                                    <select
                                        value={project.config.trimSize}
                                        onChange={(e) => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none smooth-transition"
                                    >
                                        <option value="6x9" className="bg-slate-900">6 x 9 in (6.25 x 9.25 with bleed)</option>
                                        <option value="8x10" className="bg-slate-900">8 x 10 in (8.25 x 10.25 with bleed)</option>
                                        <option value="8.5x11" className="bg-slate-900">8.5 x 11 in (8.75 x 11.25 with bleed)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 p-4 glass rounded-xl border border-white/10">
                                    <input
                                        type="checkbox"
                                        checked={project.config.hasBleed}
                                        onChange={(e) => setProject({ ...project, config: { ...project.config, hasBleed: e.target.checked } })}
                                        className="w-5 h-5 rounded bg-white/5 border-white/20 text-purple-600 focus:ring-purple-500/20"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Include Bleed (0.125")</p>
                                        <p className="text-xs text-white/50">Required for full-page illustrations</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </aside>

                {/* MODERN PREVIEW AREA */}
                <main className="flex-1 overflow-hidden flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-slate-900/20"></div>

                    {/* Preview Controls */}
                    <div className="h-20 glass-strong border-b border-white/10 flex items-center justify-between px-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))}
                                disabled={currentSpread === 0}
                                className="h-10 w-10 rounded-xl border-white/20 hover:bg-white/10 disabled:opacity-30 smooth-transition"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="px-4 py-2 glass rounded-xl border border-white/20">
                                <span className="text-sm font-mono font-bold text-white">
                                    Spread {currentSpread + 1} / {totalSpreads}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setCurrentSpread(Math.min(totalSpreads - 1, currentSpread + 1))}
                                disabled={currentSpread >= totalSpreads - 1}
                                className="h-10 w-10 rounded-xl border-white/20 hover:bg-white/10 disabled:opacity-30 smooth-transition"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>

                        <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-xl px-4 py-2 font-mono">
                            {project.config.trimSize} • {project.config.hasBleed ? 'With Bleed' : 'No Bleed'}
                        </Badge>
                    </div>

                    {/* Book Preview */}
                    <div className="flex-1 overflow-auto p-12 flex items-center justify-center relative z-10">
                        {project.stories.length === 0 ? (
                            <div className="text-center animate-float">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center glow-purple">
                                    <Book className="h-12 w-12 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Stories Yet</h3>
                                <p className="text-white/50">Add stories from the sidebar to see your book preview</p>
                            </div>
                        ) : (
                            <div className="flex gap-2 book-shadow rounded-2xl overflow-hidden" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                                {/* Left Page - Illustration */}
                                <div
                                    className="book-page flex items-center justify-center relative overflow-hidden"
                                    style={{
                                        width: '400px',
                                        aspectRatio: project.config.trimSize.replace('x', '/'),
                                    }}
                                >
                                    <div className="absolute inset-0 shimmer"></div>
                                    <div className="w-full h-full p-10 flex items-center justify-center relative z-10">
                                        <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                                            <div className="text-center text-slate-300">
                                                <ImageIcon className="h-20 w-20 mx-auto mb-3" strokeWidth={1.5} />
                                                <p className="text-sm font-bold uppercase tracking-wider">Coloring Illustration</p>
                                                {currentSpread > 0 && currentSpread - 1 < project.stories.length && (
                                                    <p className="text-xs mt-2 text-slate-400">{project.stories[currentSpread - 1].title}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Page - Story + Writing Practice */}
                                <div
                                    className="book-page flex items-start justify-center relative overflow-hidden"
                                    style={{
                                        width: '400px',
                                        aspectRatio: project.config.trimSize.replace('x', '/'),
                                    }}
                                >
                                    <div className="absolute inset-0 shimmer"></div>
                                    {currentSpread === 0 ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 glow-purple">
                                                <Sparkles className="h-8 w-8 text-white" />
                                            </div>
                                            <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{project.title}</h1>
                                            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6"></div>
                                            <p className="text-sm text-slate-500 font-medium">A Story & Coloring Book</p>
                                            <p className="text-xs text-slate-400 mt-2">Ages 2-7</p>
                                        </div>
                                    ) : currentSpread - 1 < project.stories.length ? (
                                        <div className="w-full h-full p-10 space-y-5 overflow-hidden relative z-10">
                                            <h2 className="text-2xl font-black border-b-2 border-purple-600 pb-3 text-slate-900">
                                                {project.stories[currentSpread - 1].title}
                                            </h2>
                                            <p className="text-sm leading-relaxed text-slate-700 line-clamp-[8]">
                                                {project.stories[currentSpread - 1].story_text}
                                            </p>
                                            <div className="space-y-3 pt-4">
                                                <p className="text-xs font-black text-purple-600 uppercase tracking-widest">
                                                    ✍️ Writing Practice
                                                </p>
                                                {project.stories[currentSpread - 1].writing_words.slice(0, 4).map((word, idx) => (
                                                    <div key={idx} className="border-b-2 border-slate-200 pb-2">
                                                        <span className="text-xl text-slate-400 tracking-widest" style={{ fontFamily: 'Raleway Dots, cursive' }}>
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
