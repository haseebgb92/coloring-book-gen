"use client";

import { useDropzone } from "react-dropzone";
import { FileText, Upload, Check, AlertCircle, X, Layout } from "lucide-react";
import { ProjectState, Story } from "../types";
import { useState, useCallback } from "react";

interface ImportDataProps {
    project: ProjectState;
    setProject: (project: ProjectState) => void;
}

export default function ImportData({ project, setProject }: ImportDataProps) {
    const [jsonError, setJsonError] = useState<string | null>(null);

    const onDropJson = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result as string);
                if (Array.isArray(json)) {
                    const validatedStories = json.map((item: any, index: number) => ({
                        order: item.order || index + 1,
                        title: item.title || `Story ${index + 1}`,
                        story_text: item.story_text || "",
                        writing_words: item.writing_words || [],
                        lesson: item.lesson || "",
                    }));
                    setProject({ ...project, stories: validatedStories });
                    setJsonError(null);
                } else {
                    setJsonError("JSON must be an array of stories.");
                }
            } catch (e) {
                setJsonError("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    }, [project, setProject]);

    const onDropImages = useCallback((acceptedFiles: File[]) => {
        // Match images to stories based on title
        const newStories = project.stories.map(story => {
            const match = acceptedFiles.find(file => {
                const fileName = file.name.split('.')[0].toLowerCase().replace(/[\s\-_]/g, '');
                const storyTitle = story.title.toLowerCase().replace(/[\s\-_]/g, '');
                return fileName === storyTitle;
            });

            if (match) {
                return { ...story, image_file: match, image_path: URL.createObjectURL(match) };
            }
            return story;
        });

        setProject({ ...project, stories: newStories });
    }, [project, setProject]);

    const { getRootProps: getJsonProps, getInputProps: getJsonInputProps, isDragActive: isJsonActive } = useDropzone({
        onDrop: onDropJson,
        accept: { 'application/json': ['.json'] },
        multiple: false
    });

    const { getRootProps: getImageProps, getInputProps: getImageInputProps, isDragActive: isImageActive } = useDropzone({
        onDrop: onDropImages,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
    });

    const removeStory = (index: number) => {
        const newStories = [...project.stories];
        newStories.splice(index, 1);
        setProject({ ...project, stories: newStories });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">Import Stories & Illustrations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    {...getJsonProps()}
                    className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isJsonActive ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white/30 hover:border-accent'
                        }`}
                >
                    <input {...getJsonInputProps()} />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${project.stories.length > 0 ? 'bg-green-100 text-green-600' : 'bg-accent-soft text-accent'
                        }`}>
                        {project.stories.length > 0 ? <Check size={32} /> : <FileText size={32} />}
                    </div>
                    <h3 className="font-bold mb-1">Import stories.json</h3>
                    <p className="text-sm text-gray-500">
                        {project.stories.length > 0 ? `${project.stories.length} stories loaded` : 'Upload your content data model'}
                    </p>
                    {jsonError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} /> {jsonError}</p>}
                </div>

                <div
                    {...getImageProps()}
                    className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isImageActive ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white/30 hover:border-accent'
                        }`}
                >
                    <input {...getImageInputProps()} />
                    <div className="w-16 h-16 bg-accent-soft text-accent rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} />
                    </div>
                    <h3 className="font-bold mb-1">Upload Illustrations</h3>
                    <p className="text-sm text-gray-500">Drag & drop JPG/PNG/WEBP files</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Layout size={18} />
                    Content Setup & Matching
                </h3>
                {project.stories.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 text-gray-400">
                        No stories imported yet. Try uploading a sample JSON.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {project.stories.map((story, i) => (
                            <div key={i} className="p-4 bg-white rounded-xl border shadow-sm flex items-center justify-between group hover:border-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg border overflow-hidden flex items-center justify-center relative">
                                        {story.image_path ? (
                                            <img src={story.image_path} alt={story.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <Layout className="text-gray-300" size={24} />
                                        )}
                                        {!story.image_path && (
                                            <div className="absolute inset-0 bg-red-50/50 flex items-center justify-center">
                                                <AlertCircle className="text-red-400" size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold flex items-center gap-2">
                                            {story.title}
                                            {!story.image_path && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Missing Image</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{story.story_text}</p>
                                        <div className="flex gap-2 mt-1">
                                            {story.writing_words.map((w, idx) => (
                                                <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded italic">
                                                    {w}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeStory(i)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
