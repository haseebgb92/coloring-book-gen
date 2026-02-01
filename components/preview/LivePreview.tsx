'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProjectState, Scene } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, Star, Heart, Leaf, Box, Flower, Puzzle } from 'lucide-react';

const DecorativeIcon = ({ type, color, size = 16 }: { type: string, color: string, size?: number }) => {
    switch (type) {
        case 'stars': return <Star fill={color} stroke="none" size={size} />;
        case 'hearts': return <Heart fill={color} stroke="none" size={size} />;
        case 'leaves': return <Leaf fill={color} stroke="none" size={size} />;
        case 'geometric': return <Box fill={color} stroke="none" size={size} />;
        case 'flowers': return <Flower fill={color} stroke="none" size={size} />;
        case 'puzzles': return <Puzzle fill={color} stroke="none" size={size} />;
        default: return null;
    }
};

export function LivePreview({ state }: { state: ProjectState }) {
    const { scenes, template, printSettings, writingSettings } = state;
    const { trimSize } = printSettings;
    const layout = template.layout;

    const [currentSpread, setCurrentSpread] = useState(0);
    const [scale, setScale] = useState(0.8);

    // Aspect Ratio
    const [width, height] = trimSize === '6x9' ? [6, 9] :
        trimSize === '8x10' ? [8, 10] : [8.5, 11];
    const aspectRatio = width / height;

    const totalSpreads = scenes.length;

    const currentScene = scenes[currentSpread];

    useEffect(() => {
        if (currentSpread >= totalSpreads && totalSpreads > 0) setCurrentSpread(totalSpreads - 1);
    }, [totalSpreads]);

    if (!currentScene) {
        return (
            <div className="flex h-full items-center justify-center text-gray-400">
                Paste scenes to see a preview
            </div>
        );
    }

    // Page Style
    const pageStyle = {
        width: `${width * 96 * scale}px`,
        height: `${height * 96 * scale}px`,
        backgroundColor: template.colors.background,
    };

    const contentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: `${printSettings.margins.outer}in`,
        paddingRight: `${printSettings.margins.inner}in`,
    };

    const rightContentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: `${printSettings.margins.inner}in`,
        paddingRight: `${printSettings.margins.outer}in`,
    };

    return (
        <div className="flex flex-col h-full bg-gray-200/50">
            {/* Controls */}
            <div className="h-10 bg-white border-b flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <button disabled={currentSpread === 0} onClick={() => setCurrentSpread(p => p - 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-xs font-mono">Spread {currentSpread + 1} / {totalSpreads}</span>
                    <button disabled={currentSpread === totalSpreads - 1} onClick={() => setCurrentSpread(p => p + 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="p-1 hover:bg-gray-100 rounded"><ZoomOut className="w-4 h-4" /></button>
                    <span className="text-xs w-8 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-1 hover:bg-gray-100 rounded"><ZoomIn className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-8 gap-1">
                {/* Left Page (Verso) */}
                <div
                    className="bg-white shadow-lg relative shrink-0 transition-transform origin-center"
                    style={pageStyle}
                >
                    {/* Decorative Elements - Positioned in corners OUTSIDE the content area */}
                    {layout.showIcon && layout.iconSet && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-2 left-2 rotate-[-15deg] opacity-25">
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={64 * scale} />
                            </div>
                            <div className="absolute top-2 right-2 rotate-[15deg] opacity-25">
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={48 * scale} />
                            </div>
                            <div className="absolute bottom-10 left-4 rotate-[10deg] opacity-25">
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={40 * scale} />
                            </div>
                            <div className="absolute bottom-12 right-4 rotate-[-10deg] opacity-25">
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={56 * scale} />
                            </div>
                        </div>
                    )}

                    <div className="w-full h-full flex flex-col pt-1" style={contentStyle}>
                        <div
                            className="flex-1 flex flex-col items-center text-center p-6"
                            style={{
                                borderRadius: `${template.layout.cornerRadius}px`,
                                border: template.layout.borderStyle !== 'none' ? `2px ${template.layout.borderStyle} ${template.colors.border}` : undefined,
                                backgroundColor: '#ffffff',
                                position: 'relative',
                                zIndex: 10 // Ensure content is above icons if they overlap slightly
                            }}
                        >
                            <h1
                                className="font-bold mb-4"
                                style={{
                                    fontFamily: template.fonts.heading,
                                    color: template.colors.heading,
                                    fontSize: `${(layout.headingSize || 28) * scale}px`
                                }}
                            >
                                {currentScene.title}
                            </h1>

                            {layout.showIcon && <div className="h-px w-24 mb-6 opacity-30" style={{ backgroundColor: template.colors.accent }} />}

                            <p
                                className="whitespace-pre-wrap mb-10"
                                style={{
                                    fontFamily: template.fonts.body,
                                    color: template.colors.storyText,
                                    fontSize: `${(layout.bodySize || 14) * scale}px`,
                                    lineHeight: 1.6
                                }}
                            >
                                {currentScene.story}
                            </p>

                            {/* Attributes/Words */}
                            <div className="w-full space-y-4">
                                {currentScene.words.map((word, idx) => (
                                    <div key={idx} className="relative h-14 w-full group">
                                        {/* Guidelines */}
                                        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                            {writingSettings.guidelines.showTop && (
                                                <div className="absolute top-0 w-full border-t" style={{ borderColor: template.colors.writingLine }}></div>
                                            )}
                                            {writingSettings.guidelines.showMid && (
                                                <div className="absolute top-[50%] w-full border-t border-dashed" style={{ borderColor: template.colors.writingLine }}></div>
                                            )}
                                            {writingSettings.guidelines.showBase && (
                                                <div className="absolute bottom-0 w-full border-b" style={{ borderColor: template.colors.writingLine }}></div>
                                            )}
                                        </div>

                                        {/* Words */}
                                        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap px-4 bg-white/50 rounded pointer-events-none">
                                            {Array.from({ length: Math.max(1, writingSettings.minRepetitions) }).map((_, rIdx) => (
                                                <span
                                                    key={rIdx}
                                                    className="mr-12 select-none"
                                                    style={{
                                                        fontFamily: 'Codystar, cursive',
                                                        fontSize: `${(writingSettings.practiceFontSize || 28) * scale}px`,
                                                        color: template.colors.tracing,
                                                        opacity: 0.9,
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Page Number */}
                    {printSettings.pageNumbers.enabled && (
                        <div
                            className="absolute w-full text-center text-xs"
                            style={{
                                bottom: '0.25in',
                                color: template.colors.pageNumber,
                                fontSize: `${10 * scale}px`
                            }}
                        >
                            {2 + (currentSpread * 2)}
                        </div>
                    )}
                </div>

                {/* Right Page (Recto) */}
                <div
                    className="bg-white shadow-lg relative shrink-0 transition-transform origin-center"
                    style={pageStyle}
                >
                    {/* Visual Bleed Guide (Overlay) */}
                    {printSettings.bleed && (
                        <div className="absolute inset-0 pointer-events-none z-50 border border-red-400 border-dashed"
                            style={{
                                left: `${0.125 * 96 * scale}px`,
                                top: `${0.125 * 96 * scale}px`,
                                right: `${0.125 * 96 * scale}px`,
                                bottom: `${0.125 * 96 * scale}px`,
                            }}
                        >
                            <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] px-1">Safe Area Boundary</div>
                        </div>
                    )}

                    <div className="w-full h-full" style={rightContentStyle}>
                        <div
                            className="w-full h-full relative"
                            style={{
                                borderRadius: `${template.layout.cornerRadius}px`,
                                border: template.layout.borderStyle !== 'none' ? `2px ${template.layout.borderStyle} ${template.colors.border}` : undefined,
                                backgroundColor: '#ffffff',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {currentScene.illustration ? (
                                <img
                                    src={currentScene.illustration}
                                    alt={currentScene.title}
                                    className="absolute inset-0 w-full h-full transition-all duration-300"
                                    style={{
                                        objectFit: currentScene.illustrationFit || 'cover',
                                        transform: `scale(${currentScene.illustrationScale || 1.05}) translate(${currentScene.illustrationPositionX || 0}%, ${currentScene.illustrationPositionY || 0}%)`,
                                        borderRadius: `${template.layout.cornerRadius}px`,
                                    }}
                                />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center">
                                    <span className="text-xs">No Illustration</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Page Number */}
                    {printSettings.pageNumbers.enabled && (
                        <div
                            className="absolute w-full text-center text-xs"
                            style={{ bottom: '0.25in', color: template.colors.pageNumber }}
                        >
                            {3 + (currentSpread * 2)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
