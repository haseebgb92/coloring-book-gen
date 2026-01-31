"use client";

import { useState, useEffect } from "react";
import {
  Book,
  Settings,
  Palette,
  Layout,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Type,
  Trash2,
  Edit3,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { ProjectState, Story, Template, TrimSize } from "./types";
import { KDP_PRESETS, getPageDimensions } from "./lib/kdp-helper";
import { BUILT_IN_TEMPLATES } from "./lib/templates";
import StoryDialog from "./components/StoryDialog";
import ExportButton from "./components/ExportButton";

export default function Dashboard() {
  const [project, setProject] = useState<ProjectState>({
    title: "My Coloring Book",
    config: KDP_PRESETS['8.5x11'],
    stories: [],
    template: BUILT_IN_TEMPLATES[0],
    frontMatter: ['title-page', 'copyright'],
    endMatter: ['certificate'],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStoryIndex, setEditingStoryIndex] = useState<number | null>(null);
  const [activeSpread, setActiveSpread] = useState(0);
  const [sidebarTab, setSidebarTab] = useState<'content' | 'style' | 'settings'>('content');

  // Total spreads = (Front Matter pages / 2) + Story Spreads + (End Matter pages / 2)
  const totalSpreads = Math.ceil((2 + project.stories.length * 2 + 2) / 2);

  const addOrUpdateStory = (story: Story) => {
    const newStories = [...project.stories];
    if (editingStoryIndex !== null) {
      newStories[editingStoryIndex] = story;
    } else {
      newStories.push(story);
    }
    setProject({ ...project, stories: newStories });
    setEditingStoryIndex(null);
  };

  const removeStory = (index: number) => {
    const newStories = project.stories.filter((_, i) => i !== index);
    setProject({ ...project, stories: newStories });
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-6 border-bottom">
          <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Book className="text-accent" />
            Coloring Gen
          </h1>
        </div>

        {/* Sidebar Nav */}
        <div className="flex px-4 gap-1 border-b">
          <button
            onClick={() => setSidebarTab('content')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${sidebarTab === 'content' ? 'border-accent text-accent' : 'border-transparent text-gray-400'}`}
          >
            Content
          </button>
          <button
            onClick={() => setSidebarTab('style')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${sidebarTab === 'style' ? 'border-accent text-accent' : 'border-transparent text-gray-400'}`}
          >
            Style
          </button>
          <button
            onClick={() => setSidebarTab('settings')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${sidebarTab === 'settings' ? 'border-accent text-accent' : 'border-transparent text-gray-400'}`}
          >
            KDP
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {sidebarTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Book Stories</h3>
                <button
                  onClick={() => { setEditingStoryIndex(null); setIsDialogOpen(true); }}
                  className="p-2 bg-accent-soft text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {project.stories.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-xl">
                    No stories yet.<br />Click + to add your first one.
                  </div>
                )}
                {project.stories.map((story, i) => (
                  <div key={i} className="group p-4 bg-gray-50 rounded-xl border hover:border-accent/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Spread {i + 2}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingStoryIndex(i); setIsDialogOpen(true); }} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit3 size={14} /></button>
                        <button onClick={() => removeStory(i)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="font-bold text-sm truncate">{story.title}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1 italic">{story.story_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidebarTab === 'style' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700">Active Template</h3>
                <div className="grid grid-cols-2 gap-3">
                  {BUILT_IN_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setProject({ ...project, template: t })}
                      className={`p-3 text-[10px] font-bold rounded-lg border-2 transition-all ${project.template.id === t.id ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100'}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-bold text-gray-700">Display Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between text-xs font-semibold">
                    <span>Page Numbers</span>
                    <button
                      onClick={() => setProject({ ...project, template: { ...project.template, pageNumbers: !project.template.pageNumbers } })}
                      className={`w-10 h-5 rounded-full relative transition-all ${project.template.pageNumbers ? 'bg-accent' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${project.template.pageNumbers ? 'left-6' : 'left-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between text-xs font-semibold">
                    <span>Interior Border</span>
                    <button
                      onClick={() => setProject({ ...project, template: { ...project.template, hasBorder: !project.template.hasBorder } })}
                      className={`w-10 h-5 rounded-full relative transition-all ${project.template.hasBorder ? 'bg-accent' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${project.template.hasBorder ? 'left-6' : 'left-1'}`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          )}

          {sidebarTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Trim Size</label>
                <select
                  value={project.config.trimSize}
                  onChange={e => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
                  className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                >
                  <option value="6x9">6 x 9 in</option>
                  <option value="8x10">8 x 10 in</option>
                  <option value="8.5x11">8.5 x 11 in</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Bleed</label>
                <div
                  onClick={() => setProject({ ...project, config: { ...project.config, hasBleed: !project.config.hasBleed } })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${project.config.hasBleed ? 'border-accent bg-accent/5' : 'bg-gray-50'}`}
                >
                  <p className="text-sm font-bold">Include Bleed</p>
                  <p className="text-[10px] text-gray-500">Adds 0.125" for full-page art</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <ExportButton project={project} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Book Spread Preview</h2>
            <p className="text-gray-500 text-sm">Visualizing {project.config.trimSize} Layout</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border">
            <button onClick={() => setActiveSpread(Math.max(0, activeSpread - 1))} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronLeft /></button>
            <span className="text-sm font-bold w-20 text-center">Spread {activeSpread + 1} / {totalSpreads}</span>
            <button onClick={() => setActiveSpread(Math.min(totalSpreads - 1, activeSpread + 1))} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronRight /></button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="book-container scale-[0.85] lg:scale-100 transition-transform">
            <div
              className="spread"
              style={{
                ['--aspect-ratio' as any]: project.config.trimSize.split('x').join(' / ')
              }}
            >
              {/* Left Page (Image Content) */}
              <div className="page page-left">
                <div className="page-content bg-gray-50 items-center justify-center">
                  {activeSpread === 0 ? (
                    <div className="text-center space-y-4">
                      <Monitor className="mx-auto text-gray-300" size={48} />
                      <p className="text-sm font-bold text-gray-400">Title Page Art</p>
                    </div>
                  ) : (
                    <div className="w-full h-full border-4 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={64} strokeWidth={1} />
                      <p className="mt-4 font-bold uppercase tracking-widest text-xs">Illustration Area</p>
                    </div>
                  )}
                  {project.template.pageNumbers && <div className="absolute bottom-4 left-4 text-[10px] font-bold text-gray-400">{(activeSpread * 2) + 1}</div>}
                </div>
              </div>

              {/* Right Page (Story Content) */}
              <div className="page page-right">
                <div className="page-content relative">
                  {activeSpread === 0 ? (
                    <div className="text-center py-20 px-8">
                      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                      <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
                      <p className="text-sm text-gray-400">By Author Name</p>
                    </div>
                  ) : (
                    activeSpread - 1 < project.stories.length ? (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center border-b pb-4">{project.stories[activeSpread - 1].title}</h2>
                        <p className="text-xs leading-relaxed text-gray-600 line-clamp-[12]">
                          {project.stories[activeSpread - 1].story_text}
                        </p>
                        <div className="space-y-3 pt-6">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Writing Practice</p>
                          {project.stories[activeSpread - 1].writing_words.map((word, idx) => (
                            <div key={idx} className="h-8 border-b border-gray-100 flex items-center px-2">
                              <span className="text-xl font-dotted tracking-widest text-gray-300">
                                {word}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 italic text-sm">
                        Empty / End Matter Page
                      </div>
                    )
                  )}
                  {project.template.pageNumbers && <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400">{(activeSpread * 2) + 2}</div>}
                  {project.template.hasBorder && <div className="absolute inset-4 border border-gray-200 pointer-events-none"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={addOrUpdateStory}
        initialData={editingStoryIndex !== null ? project.stories[editingStoryIndex] : undefined}
      />

      <style jsx>{`
        .font-dotted {
          font-family: 'Raleway Dots', cursive;
        }
      `}</style>
    </div>
  );
}
