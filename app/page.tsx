"use client";

import { useState } from "react";
import { Book, Upload, Settings, Palette, FileText, CheckCircle, Download, Layout, Sparkles } from "lucide-react";
import { ProjectState, Story, Template, TrimSize } from "./types";
import { KDP_PRESETS } from "./lib/kdp-helper";
import { BUILT_IN_TEMPLATES } from "./lib/templates";
import ImportData from "./components/ImportData";
import TemplateSelector from "./components/TemplateSelector";
import PageSelector from "./components/PageSelector";
import Validation from "./components/Validation";
import ExportButton from "./components/ExportButton";

const STEPS = [
  { id: 1, name: "Project", icon: Book },
  { id: 2, name: "Import", icon: Upload },
  { id: 3, name: "Template", icon: Palette },
  { id: 4, name: "Front Matter", icon: Layout },
  { id: 5, name: "Validation", icon: CheckCircle },
  { id: 6, name: "End Matter", icon: FileText },
  { id: 7, name: "Export", icon: Download },
];

const FRONT_MATTER_OPTIONS = [
  { id: 'title-page', name: 'Title Page' },
  { id: 'copyright', name: 'Copyright Page' },
  { id: 'dedication', name: 'Dedication Page' },
  { id: 'about', name: 'About This Book' },
  { id: 'how-to', name: 'How to Use' },
  { id: 'toc', name: 'Table of Contents' },
  { id: 'notes-parents', name: 'Note to Parents' },
];

const END_MATTER_OPTIONS = [
  { id: 'the-end', name: 'The End' },
  { id: 'review', name: 'Review Request' },
  { id: 'other-books', name: 'Other Books' },
  { id: 'resources', name: 'Reader Resources' },
  { id: 'notes-pages', name: 'Notes Pages' },
  { id: 'certificate', name: 'Certificate' },
];

const DEFAULT_TEMPLATE = BUILT_IN_TEMPLATES[0];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState<ProjectState>({
    title: "My New Coloring Book",
    config: KDP_PRESETS['8.5x11'],
    stories: [],
    template: DEFAULT_TEMPLATE,
    frontMatter: ['title-page', 'copyright'],
    endMatter: ['the-end', 'certificate'],
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Book className="text-accent" size={36} />
            Coloring Book Gen
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            Empowering child education through print-ready KDP interiors
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary group flex items-center gap-2">
            <Layout size={18} className="group-hover:rotate-12 transition-transform" />
            Save Project
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Upload size={18} />
            Load JSON
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator overflow-x-auto pb-4 scrollbar-hide">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={`step-item min-w-[80px] ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isCompleted && setCurrentStep(step.id)}
            >
              <div className={`step-number transition-all duration-300 ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                {isCompleted ? <CheckCircle size={18} /> : step.id}
              </div>
              <div className={`text-[10px] md:text-xs font-bold mt-1 uppercase tracking-tight ${isActive ? 'text-accent' : 'text-gray-400'}`}>
                {step.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="premium-card min-h-[600px] border-accent/10">
        {currentStep === 1 && <ProjectSettings project={project} setProject={setProject} />}
        {currentStep === 2 && <ImportData project={project} setProject={setProject} />}
        {currentStep === 3 && <TemplateSelector project={project} setProject={setProject} />}
        {currentStep === 4 && (
          <PageSelector
            title="Front Matter Setup"
            options={FRONT_MATTER_OPTIONS}
            selected={project.frontMatter}
            onChange={(selected) => setProject({ ...project, frontMatter: selected })}
          />
        )}
        {currentStep === 5 && <Validation project={project} />}
        {currentStep === 6 && (
          <PageSelector
            title="Ending Pages Setup"
            options={END_MATTER_OPTIONS}
            selected={project.endMatter}
            onChange={(selected) => setProject({ ...project, endMatter: selected })}
          />
        )}

        {currentStep === 7 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4 ring-8 ring-accent/5">
              <Download size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready for Export!</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We have validated all {project.stories.length} stories. Your {project.config.trimSize} PDF will be generated with print-safe margins and high-resolution settings.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-gray-50 rounded-xl border">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Pages</p>
                <p className="text-xl font-bold italic">est. {project.frontMatter.length + (project.stories.length * 2) + project.endMatter.length + 2}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border">
                <p className="text-xs text-gray-400 uppercase font-bold">Format</p>
                <p className="text-xl font-bold">KDP PDF</p>
              </div>
            </div>

            <ExportButton project={project} />

            <p className="text-xs text-gray-400">
              This process may take a few moments for large books (up to 250 pages supported).
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 sticky bottom-8 z-10">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary disabled:opacity-30 flex items-center gap-2 bg-white/80 backdrop-blur-md"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="btn-primary group flex items-center gap-2 shadow-lg"
        >
          {currentStep === STEPS.length ? 'Start Generation' : 'Next Step'}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <style jsx>{`
        .container {
          padding: 2rem;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function ProjectSettings({ project, setProject }: { project: ProjectState, setProject: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider">Book Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="w-full p-4 border-2 rounded-xl bg-white/50 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg font-semibold"
            placeholder="Enter book title..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider">Trim Size</label>
          <select
            value={project.config.trimSize}
            onChange={(e) => setProject({ ...project, config: KDP_PRESETS[e.target.value as TrimSize] })}
            className="w-full p-4 border-2 rounded-xl bg-white/50 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg font-semibold appearance-none"
          >
            <option value="6x9">6 x 9 in (Compact)</option>
            <option value="8x10">8 x 10 in (Standard)</option>
            <option value="8.5x11">8.5 x 11 in (Large Format)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider">Bleed Setting</label>
          <div
            className={`flex items-center gap-4 p-4 border-2 rounded-xl bg-white/50 cursor-pointer transition-all ${project.config.hasBleed ? 'border-accent bg-accent/5' : ''}`}
            onClick={() => setProject({ ...project, config: { ...project.config, hasBleed: !project.config.hasBleed } })}
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${project.config.hasBleed ? 'bg-accent border-accent text-white' : 'border-gray-200'}`}>
              {project.config.hasBleed && <CheckCircle size={14} />}
            </div>
            <div>
              <p className="font-bold">Enable Bleed</p>
              <p className="text-xs text-gray-500">Recommended for coloring books to avoid white gaps.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-8 bg-black/5 rounded-2xl border border-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Settings size={120} />
        </div>
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Settings size={20} className="text-accent" />
          KDP Specification Preview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Page Size</span>
            <span className="font-mono block text-xl font-bold">{project.config.hasBleed ? (project.config.trimSize === '6x9' ? '6.25 x 9.25' : project.config.trimSize === '8x10' ? '8.25 x 10.25' : '8.75 x 11.25') : project.config.trimSize} in</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Inner Margin</span>
            <span className="font-mono block text-xl font-bold">{project.config.margins.inner} in</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Outer Margin</span>
            <span className="font-mono block text-xl font-bold">{project.config.margins.outer} in</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Safe Zone</span>
            <span className="font-mono block text-xl font-bold">{project.config.margins.safeZone} in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
