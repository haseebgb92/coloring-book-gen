'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import {
  Book,
  Plus,
  Trash2,
  Edit3,
  Download,
  Settings,
  Palette,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', story_text: '', writing_words: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const openDialog = (index?: number) => {
    if (index !== undefined) {
      const story = project.stories[index];
      setFormData({
        title: story.title,
        story_text: story.story_text,
        writing_words: story.writing_words.join(', ')
      });
      setEditingIndex(index);
    } else {
      setFormData({ title: '', story_text: '', writing_words: '' });
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };

  const saveStory = () => {
    const words = formData.writing_words.split(',').map(w => w.trim()).filter(w => w);
    const newStory: Story = {
      order: editingIndex !== null ? project.stories[editingIndex].order : Date.now(),
      title: formData.title,
      story_text: formData.story_text,
      writing_words: words,
      lesson: ''
    };

    const newStories = [...project.stories];
    if (editingIndex !== null) {
      newStories[editingIndex] = newStory;
    } else {
      newStories.push(newStory);
    }

    setProject({ ...project, stories: newStories });
    setIsDialogOpen(false);
  };

  const removeStory = (index: number) => {
    setProject({ ...project, stories: project.stories.filter((_, i) => i !== index) });
  };

  const handleExport = async () => {
    setIsGenerating(true);
    setProgress(0);
    try {
      const pdfBlob = await generateColoringBookPDF(project, (p) => setProgress(p));
      saveAs(pdfBlob, `${project.title.replace(/\s+/g, '_')}_KDP_Interior.pdf`);
    } catch (e) {
      console.error("Export failed", e);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 items-start">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">Book Stories</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => openDialog()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Story
              </Button>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {project.stories.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">
                    No stories yet.<br />Click above to add your first one.
                  </div>
                )}
                {project.stories.map((story, i) => (
                  <div key={i} className="group p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-[10px]">Story {i + 1}</Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openDialog(i)}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => removeStory(i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-bold text-sm truncate">{story.title}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">{story.story_text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KDP SETTINGS */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">KDP Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">Trim Size</label>
                <select
                  value={project.config.trimSize}
                  onChange={e => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                  className="w-full p-2 bg-slate-50 border rounded-md text-sm"
                >
                  <option value="6x9">6 x 9 in</option>
                  <option value="8x10">8 x 10 in</option>
                  <option value="8.5x11">8.5 x 11 in</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">Template</label>
                <select
                  value={project.template.id}
                  onChange={e => setProject({ ...project, template: BUILT_IN_TEMPLATES.find(t => t.id === e.target.value)! })}
                  className="w-full p-2 bg-slate-50 border rounded-md text-sm"
                >
                  {BUILT_IN_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleExport}
                disabled={project.stories.length === 0 || isGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold h-12"
              >
                {isGenerating ? (
                  <>Generating {progress}%...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export KDP PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PREVIEW AREA */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Book Preview</CardTitle>
              <p className="text-sm text-slate-500">Visualizing {project.config.trimSize} Layout</p>
            </CardHeader>
            <CardContent>
              {project.stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Book className="h-16 w-16 mb-4" />
                  <p className="text-lg font-bold">No Stories Added Yet</p>
                  <p className="text-sm">Add your first story to see the preview</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {project.stories.map((story, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                      <div className="flex gap-6">
                        <div className="w-1/2 border-2 border-dashed border-slate-200 rounded-lg p-8 flex items-center justify-center bg-slate-50">
                          <div className="text-center text-slate-300">
                            <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase">Illustration Area</p>
                          </div>
                        </div>
                        <div className="w-1/2 space-y-4">
                          <h3 className="text-xl font-bold border-b pb-2">{story.title}</h3>
                          <p className="text-xs leading-relaxed text-slate-600 line-clamp-6">{story.story_text}</p>
                          <div className="space-y-2 pt-4">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">Writing Practice</p>
                            {story.writing_words.slice(0, 5).map((word, idx) => (
                              <div key={idx} className="border-b border-slate-200 pb-1">
                                <span className="text-lg text-slate-300 font-dotted">{word}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DIALOG */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-indigo-600" />
                {editingIndex !== null ? 'Edit Story' : 'Add New Story'}
              </h2>
              <Button size="icon" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase mb-2 block">Heading / Title</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Brave Little Lion"
                  className="text-lg font-semibold"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase mb-2 block">Story Text</label>
                <Textarea
                  rows={4}
                  value={formData.story_text}
                  onChange={e => setFormData({ ...formData, story_text: e.target.value })}
                  placeholder="Write the moral story here..."
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase mb-2 block">Practice Words (Comma separated)</label>
                <Input
                  value={formData.writing_words}
                  onChange={e => setFormData({ ...formData, writing_words: e.target.value })}
                  placeholder="Lion, Brave, Jungle, Kingdom"
                />
                <p className="text-[10px] text-slate-400 italic mt-1">Recommended: 4–5 words for optimal tracing space.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveStory} className="bg-indigo-600 hover:bg-indigo-700 px-8">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .font-dotted {
          font-family: 'Raleway Dots', cursive;
        }
      `}</style>
    </div>
  );
}
