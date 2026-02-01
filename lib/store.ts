import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectState, Scene, PageContent, TemplateConfig, PrintSettings, WritingPracticeSettings } from './types';
import { TEMPLATES, INITIAL_PROJECT_STATE } from './templates';
import { v4 as uuidv4 } from 'uuid';

interface ProjectStore extends ProjectState {
    updatePrintSettings: (settings: Partial<PrintSettings>) => void;
    updateWritingSettings: (settings: Partial<WritingPracticeSettings>) => void;

    setTemplate: (templateId: string) => void;
    updateTemplateColors: (colors: Partial<TemplateConfig['colors']>) => void;
    updateTemplateFonts: (fonts: Partial<TemplateConfig['fonts']>) => void;
    updateTemplateLayout: (layout: Partial<TemplateConfig['layout']>) => void;

    addScene: (scene: Omit<Scene, 'id'>) => void;
    updateScene: (id: string, updates: Partial<Scene>) => void;
    removeScene: (id: string) => void;
    reorderScenes: (fromIndex: number, toIndex: number) => void;
    setScenes: (scenes: Scene[]) => void;

    updateFrontMatter: (pages: PageContent[]) => void;
    updateEndingPages: (pages: PageContent[]) => void;

    setActiveSection: (section: string) => void;
    setName: (name: string) => void;
    resetProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            id: uuidv4(),
            name: 'My Coloring Book',
            lastModified: Date.now(),
            scenes: [],
            frontMatter: [],
            endingPages: [],
            printSettings: INITIAL_PROJECT_STATE.printSettings,
            writingSettings: INITIAL_PROJECT_STATE.writingSettings,
            template: TEMPLATES[0],
            activeSection: 'project',
            validationErrors: [],

            setName: (name) => set({ name, lastModified: Date.now() }),

            updatePrintSettings: (settings) => set((state) => ({
                printSettings: { ...state.printSettings, ...settings },
                lastModified: Date.now()
            })),

            updateWritingSettings: (settings) => set((state) => ({
                writingSettings: { ...state.writingSettings, ...settings },
                lastModified: Date.now()
            })),

            setTemplate: (templateId) => {
                const t = TEMPLATES.find(t => t.id === templateId);
                if (t) set({ template: t, lastModified: Date.now() });
            },

            updateTemplateColors: (colors) => set((state) => ({
                template: { ...state.template, colors: { ...state.template.colors, ...colors } },
                lastModified: Date.now()
            })),

            updateTemplateFonts: (fonts) => set((state) => ({
                template: { ...state.template, fonts: { ...state.template.fonts, ...fonts } },
                lastModified: Date.now()
            })),

            updateTemplateLayout: (layout) => set((state) => ({
                template: { ...state.template, layout: { ...state.template.layout, ...layout } },
                lastModified: Date.now()
            })),

            addScene: (sceneParams) => set((state) => ({
                scenes: [...state.scenes, { ...sceneParams, id: uuidv4() }],
                lastModified: Date.now()
            })),

            updateScene: (id, updates) => set((state) => ({
                scenes: state.scenes.map(s => s.id === id ? { ...s, ...updates } : s),
                lastModified: Date.now()
            })),

            removeScene: (id) => set((state) => ({
                scenes: state.scenes.filter(s => s.id !== id),
                lastModified: Date.now()
            })),

            reorderScenes: (from, to) => set((state) => {
                const newScenes = [...state.scenes];
                const [moved] = newScenes.splice(from, 1);
                newScenes.splice(to, 0, moved);
                return { scenes: newScenes, lastModified: Date.now() };
            }),

            setScenes: (scenes) => set({ scenes, lastModified: Date.now() }),

            updateFrontMatter: (pages) => set({ frontMatter: pages, lastModified: Date.now() }),
            updateEndingPages: (pages) => set({ endingPages: pages, lastModified: Date.now() }),

            setActiveSection: (section) => set({ activeSection: section }),

            resetProject: () => set({
                id: uuidv4(),
                name: 'My Coloring Book',
                lastModified: Date.now(),
                scenes: [],
                frontMatter: [],
                endingPages: [],
                printSettings: INITIAL_PROJECT_STATE.printSettings,
                writingSettings: INITIAL_PROJECT_STATE.writingSettings,
                template: TEMPLATES[0],
                activeSection: 'project',
                validationErrors: []
            }),
        }),
        {
            name: 'coloring-book-storage',
        }
    )
);
