"use client";

import { useState, useEffect } from "react";
import { X, Save, Type, FileText, ListChecks } from "lucide-react";
import { Story } from "../types";

interface StoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (story: Story) => void;
    initialData?: Story;
}

export default function StoryDialog({ isOpen, onClose, onSave, initialData }: StoryDialogProps) {
    const [formData, setFormData] = useState<Partial<Story>>({
        title: "",
        story_text: "",
        writing_words: [],
        lesson: ""
    });

    const [wordsInput, setWordsInput] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setWordsInput(initialData.writing_words.join(", "));
        } else {
            setFormData({ title: "", story_text: "", writing_words: [], lesson: "" });
            setWordsInput("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const words = wordsInput.split(",").map(w => w.trim()).filter(w => w !== "");
        onSave({
            ...formData as Story,
            writing_words: words,
            order: initialData?.order || Date.now()
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Save className="text-accent" />
                        {initialData ? "Edit Story" : "Add New Story"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2">
                            <Type size={16} /> Heading / Title
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border-2 rounded-xl focus:border-accent outline-none transition-all"
                            placeholder="e.g. The Brave Little Lion"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2">
                            <FileText size={16} /> Story Text
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.story_text}
                            onChange={e => setFormData({ ...formData, story_text: e.target.value })}
                            className="w-full p-3 border-2 rounded-xl focus:border-accent outline-none transition-all resize-none"
                            placeholder="Write the moral story here..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2">
                            <ListChecks size={16} /> Practice Words (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={wordsInput}
                            onChange={e => setWordsInput(e.target.value)}
                            className="w-full p-3 border-2 rounded-xl focus:border-accent outline-none transition-all"
                            placeholder="Lion, Brave, Jungle, Kingdom"
                        />
                        <p className="text-[10px] text-gray-400 italic">Recommended: 4–5 words for optimal tracing space.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                            <Save size={18} />
                            Save Story
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
