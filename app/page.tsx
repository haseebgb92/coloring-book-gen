'use client';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { PreviewPane } from '@/components/preview/PreviewPane';

export default function Home() {
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
            <a href="#" className="text-xs text-gray-500 hover:text-gray-900">Documentation</a>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">v1.0.0</div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden relative">
          <PreviewPane />
        </main>
      </div>
    </div>
  );
}
