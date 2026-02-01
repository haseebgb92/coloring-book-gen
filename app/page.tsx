'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/lib/store';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PreviewPane } from '@/components/preview/PreviewPane';
import { Loader2 } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const loadProject = useProjectStore(s => s.loadProject);
  const projectId = searchParams.get('project');

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/project?id=${projectId}`);
          if (response.ok) {
            const data = await response.json();
            loadProject(data);
            // Remove the param from URL without refreshing
            window.history.replaceState({}, '', '/');
          }
        } catch (err) {
          console.error('Failed to load project:', err);
        }
      };
      fetchProject();
    }
  }, [projectId, loadProject]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto" />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xs">Cb</div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Coloring Book Builder</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">Cloud Storage Enabled</span>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">v1.1.0</div>
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
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-500" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
