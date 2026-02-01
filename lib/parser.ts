import { Scene } from './types';
import { v4 as uuidv4 } from 'uuid';

export function parseScenesInput(text: string): Scene[] {
    const scenes: Scene[] = [];
    const lines = text.split('\n');

    let currentScene: Partial<Scene> | null = null;
    let section: 'story' | 'words' | 'none' = 'none';

    for (let i = 0; i < lines.length; i++) {
        const lineRaw = lines[i];
        const line = lineRaw.trim();
        if (!line) continue;

        // Check for new scene start
        if (line.toLowerCase().startsWith('scene title:')) {
            if (currentScene && currentScene.title) {
                finalizeScene(scenes, currentScene);
            }
            currentScene = { id: uuidv4(), story: '', words: [], illustration: null, illustrationFit: 'cover' };
            currentScene.title = line.substring('Scene Title:'.length).trim();
            section = 'none';
            continue;
        }

        if (!currentScene) continue;

        if (line.toLowerCase() === 'story:') {
            section = 'story';
            continue;
        }

        if (line.toLowerCase() === 'words:') {
            section = 'words';
            continue;
        }

        const illMatch = line.match(/^illustration:(.*)$/i);
        if (illMatch) {
            const hint = illMatch[1].trim();
            if (hint && currentScene) {
                currentScene.illustration = hint;
            }
            section = 'none';
            continue;
        }

        if (section === 'story') {
            // Collect story lines
            if (currentScene.story) currentScene.story += '\n';
            currentScene.story += lineRaw.trim(); // preserve formatting? requirement says plain text
        } else if (section === 'words') {
            if (line.startsWith('-')) {
                const word = line.substring(1).trim();
                if (word) {
                    if (!currentScene.words) currentScene.words = [];
                    currentScene.words.push(word);
                }
            }
        }
    }

    if (currentScene && currentScene.title) {
        finalizeScene(scenes, currentScene);
    }

    return scenes;
}

function finalizeScene(scenes: Scene[], partial: Partial<Scene>) {
    if (!partial.story) partial.story = "";
    if (!partial.words) partial.words = [];
    if (!partial.illustrationFit) partial.illustrationFit = 'cover';
    scenes.push(partial as Scene);
}
