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
  Settings,
  Printer,
  Plus,
  Trash2,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
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

  // Story form state
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
    <div className="h-screen flex flex-col bg-slate-50">
      {/* TOP BAR */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Book className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Coloring Book Studio</h1>
            <p className="text-xs text-slate-500">KDP Print-Ready Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono">
            {project.stories.length} Stories
          </Badge>
          <Button
            onClick={handleExport}
            disabled={project.stories.length === 0 || isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold"
          >
            {isGenerating ? (
              <>Generating {progress}%</>
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
        {/* LEFT SIDEBAR */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <Accordion type="multiple" defaultValue={['content', 'design', 'printing']} className="w-full">

            {/* CONTENT SECTION */}
            <AccordionItem value="content">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold">Content</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="story-title" className="text-xs font-bold text-slate-600 uppercase">
                    Story Title
                  </Label>
                  <Input
                    id="story-title"
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    placeholder="The Brave Lion"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="story-text" className="text-xs font-bold text-slate-600 uppercase">
                    Story Text
                  </Label>
                  <Textarea
                    id="story-text"
                    rows={4}
                    value={storyForm.text}
                    onChange={(e) => setStoryForm({ ...storyForm, text: e.target.value })}
                    placeholder="Once upon a time..."
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="practice-words" className="text-xs font-bold text-slate-600 uppercase">
                    Practice Words
                  </Label>
                  <Input
                    id="practice-words"
                    value={storyForm.words}
                    onChange={(e) => setStoryForm({ ...storyForm, words: e.target.value })}
                    placeholder="Lion, Brave, Jungle, King"
                  />
                  <p className="text-[10px] text-slate-400">Comma-separated, 4-5 words recommended</p>
                </div>

                <Button onClick={addStory} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Story
                </Button>

                {/* STORY LIST */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs font-bold text-slate-600 uppercase">Added Stories</p>
                  {project.stories.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No stories yet</p>
                  )}
                  {project.stories.map((story, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{story.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{story.story_text}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={() => removeStory(i)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* IMAGES SECTION */}
            <AccordionItem value="images">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold">Images</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 space-y-4">
                <p className="text-sm text-slate-600">Upload illustrations for your stories</p>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* DESIGN SECTION */}
            <AccordionItem value="design">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold">Design</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Template</Label>
                  <select
                    value={project.template.id}
                    onChange={(e) => setProject({ ...project, template: BUILT_IN_TEMPLATES.find(t => t.id === e.target.value)! })}
                    className="w-full p-2 bg-slate-50 border rounded-md text-sm"
                  >
                    {BUILT_IN_TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* TYPOGRAPHY SECTION */}
            <AccordionItem value="typography">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold">Typography</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 space-y-4">
                <p className="text-sm text-slate-600">Font customization options</p>
              </AccordionContent>
            </AccordionItem>

            {/* PRINTING SECTION */}
            <AccordionItem value="printing">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold">Printing</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase">KDP Trim Size</Label>
                  <select
                    value={project.config.trimSize}
                    onChange={(e) => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                    className="w-full p-2 bg-slate-50 border rounded-md text-sm"
                  >
                    <option value="6x9">6 x 9 in</option>
                    <option value="8x10">8 x 10 in</option>
                    <option value="8.5x11">8.5 x 11 in</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Bleed</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={project.config.hasBleed}
                      onChange={(e) => setProject({ ...project, config: { ...project.config, hasBleed: e.target.checked } })}
                      className="rounded"
                    />
                    <span className="text-sm">Include 0.125" bleed</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* RIGHT PREVIEW AREA */}
        <main className="flex-1 bg-slate-100 overflow-hidden flex flex-col">
          {/* Preview Controls */}
          <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))}
                disabled={currentSpread === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono font-bold">
                Spread {currentSpread + 1} / {totalSpreads}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentSpread(Math.min(totalSpreads - 1, currentSpread + 1))}
                disabled={currentSpread >= totalSpreads - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Badge variant="secondary">
              {project.config.trimSize} • {project.config.hasBleed ? 'With Bleed' : 'No Bleed'}
            </Badge>
          </div>

          {/* Book Preview */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            {project.stories.length === 0 ? (
              <div className="text-center text-slate-400">
                <Book className="h-20 w-20 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">No Content Yet</p>
                <p className="text-sm">Add stories from the sidebar to see your book preview</p>
              </div>
            ) : (
              <div className="flex gap-1 shadow-2xl" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                {/* Left Page */}
                <div
                  className="bg-white border-r-2 border-slate-300 flex items-center justify-center"
                  style={{
                    width: '400px',
                    aspectRatio: project.config.trimSize.replace('x', '/'),
                  }}
                >
                  <div className="w-full h-full p-8 flex items-center justify-center border-4 border-dashed border-slate-200">
                    <div className="text-center text-slate-300">
                      <ImageIcon className="h-16 w-16 mx-auto mb-2" strokeWidth={1} />
                      <p className="text-xs font-bold uppercase tracking-wider">Illustration</p>
                    </div>
                  </div>
                </div>

                {/* Right Page */}
                <div
                  className="bg-white flex items-start justify-center"
                  style={{
                    width: '400px',
                    aspectRatio: project.config.trimSize.replace('x', '/'),
                  }}
                >
                  {currentSpread === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                      <div className="w-16 h-1 bg-indigo-600 mb-8"></div>
                      <p className="text-sm text-slate-500">A Coloring & Learning Book</p>
                    </div>
                  ) : currentSpread - 1 < project.stories.length ? (
                    <div className="w-full h-full p-8 space-y-4 overflow-hidden">
                      <h2 className="text-xl font-bold border-b-2 pb-2">
                        {project.stories[currentSpread - 1].title}
                      </h2>
                      <p className="text-xs leading-relaxed text-slate-700 line-clamp-[10]">
                        {project.stories[currentSpread - 1].story_text}
                      </p>
                      <div className="space-y-2 pt-4">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          Writing Practice
                        </p>
                        {project.stories[currentSpread - 1].writing_words.slice(0, 4).map((word, idx) => (
                          <div key={idx} className="border-b border-slate-200 pb-1">
                            <span className="text-lg text-slate-300 tracking-widest" style={{ fontFamily: 'Raleway Dots, cursive' }}>
                              {word}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
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
