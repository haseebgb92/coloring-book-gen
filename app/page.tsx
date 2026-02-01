'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/lib/store';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PreviewPane } from '@/components/preview/PreviewPane';
import { Loader2, Library, ChevronLeft } from 'lucide-react';
import { Gallery } from '@/components/gallery/Gallery';

function HomeContent() {
  const searchParams = useSearchParams();
  const loadProject = useProjectStore(s => s.loadProject);
  const resetProject = useProjectStore(s => s.resetProject);
  const projectId = searchParams.get('project');
  const [view, setView] = useState<'gallery' | 'editor'>('gallery');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      handleLoadProject(projectId);
    }
  }, [projectId]);

  const handleLoadProject = async (id: string) => {
    if (id === 'new') {
      setView('editor');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/project?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        loadProject(data);
        setView('editor');
        // Clean URL
        window.history.replaceState({}, '', '/');
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'gallery') {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg flex items-center justify-center text-white font-black text-sm">CB</div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Coloring Builder <span className="text-blue-600">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-bold">Cloud Synced</span>
          </div>
        </header>
        <Gallery onSelect={handleLoadProject} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto" />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('gallery')}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/50"
            >
              <ChevronLeft className="w-4 h-4" />
              Library
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-gray-900 tracking-tight">Book Editor</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">Cloud History Enabled</span>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded tracking-tighter uppercase font-bold">Build Mode</div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden relative">
          <PreviewPane />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
