'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProjectState, Scene } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, Star, Heart, Leaf, Box, Flower, Puzzle, Cloud, Music, Snowflake, Waves, Sun } from 'lucide-react';

const DecorativeIcon = ({ type, color, size = 16 }: { type: string, color: string, size?: number }) => {
    switch (type) {
        case 'stars': return <Star fill={color} stroke="none" size={size} />;
        case 'hearts': return <Heart fill={color} stroke="none" size={size} />;
        case 'leaves': return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <path d="M12 2C12 2 4 6 4 13C4 18 8 21 12 22C16 21 20 18 20 13C20 6 12 2 12 2Z" fill={color} />
                <path d="M12 22V12" stroke="white" strokeWidth="1" opacity="0.5" />
            </svg>
        );
        case 'geometric': return <Box fill={color} stroke="none" size={size} />;
        case 'flowers': return <Flower fill={color} stroke="none" size={size} />;
        case 'puzzles': return <Puzzle fill={color} stroke="none" size={size} />;
        case 'clouds': return <Cloud fill={color} stroke="none" size={size} />;
        case 'music': return <Music fill={color} stroke="none" size={size} />;
        case 'winter': return <Snowflake stroke={color} size={size} />;
        case 'ocean': return <Waves stroke={color} size={size} />;
        case 'sun': return <Sun fill={color} stroke="none" size={size} />;
        case 'butterfly':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                    <path d="M12 10c0-4 4-6 6-4s2 6-2 8c4 2 4 8 0 10s-8-2-4-10c0 0-4 2-8 0s-4-8 0-10s6 0 6 4" fill={color} fillOpacity="0.4" />
                    <path d="M12 7v10" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 'dinosaur':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                    <path d="M4 18c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zM16 18c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4z" fill={color} fillOpacity="0.3" />
                    <path d="M8 14h8V10l3-2h3M2 14l3-2" stroke={color} strokeWidth="2" />
                </svg>
            );
        case 'candy':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <circle cx="12" cy="12" r="6" fill={color} fillOpacity="0.3" />
                    <path d="M7 7l10 10M17 7L7 10" stroke={color} />
                    <path d="M12 6v12M6 12h12" stroke={color} opacity="0.5" />
                </svg>
            );
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
        trimSize === '8x10' ? [8, 10] :
            trimSize === '8.5x8.5' ? [8.5, 8.5] : [8.5, 11];
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

    const isSquare = trimSize === '8.5x8.5';

    // Page Style
    const pageStyle = {
        width: `${(width + (printSettings.bleed ? 0.25 : 0)) * 96 * scale}px`,
        height: `${(height + (printSettings.bleed ? 0.25 : 0)) * 96 * scale}px`,
        backgroundColor: template.colors.background,
        position: 'relative' as const,
        overflow: 'hidden' as const,
    };

    const bleedOffset = printSettings.bleed ? 0.125 * 96 * scale : 0;

    const contentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: isSquare ? `${printSettings.margins.outer}in` : `${printSettings.margins.outer}in`,
        paddingRight: isSquare ? `${printSettings.margins.outer}in` : `${printSettings.margins.inner}in`,
    };

    const rightContentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: isSquare ? `${printSettings.margins.outer}in` : `${printSettings.margins.inner}in`,
        paddingRight: isSquare ? `${printSettings.margins.outer}in` : `${printSettings.margins.outer}in`,
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
                {/* Left Page (Verso) - Story Page */}
                <div
                    className="bg-white shadow-lg relative shrink-0 transition-transform origin-center"
                    style={pageStyle}
                >
                    {/* Decorative Elements */}
                    {layout.showIcon && layout.iconSet && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 left-4 rotate-[-15deg]" style={{ opacity: layout.iconOpacity ?? 0.25 }}>
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={64 * scale} />
                            </div>
                            <div className="absolute top-4 right-4 rotate-[15deg]" style={{ opacity: layout.iconOpacity ?? 0.25 }}>
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={48 * scale} />
                            </div>
                            <div className="absolute bottom-10 left-6 rotate-[10deg]" style={{ opacity: layout.iconOpacity ?? 0.25 }}>
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={40 * scale} />
                            </div>
                            <div className="absolute bottom-12 right-6 rotate-[-10deg]" style={{ opacity: layout.iconOpacity ?? 0.25 }}>
                                <DecorativeIcon type={layout.iconSet} color={template.colors.accent} size={56 * scale} />
                            </div>
                        </div>
                    )}

                    {/* Bleed & Gutter Guides */}
                    <div className="absolute inset-0 pointer-events-none z-50 border border-blue-400 border-dashed opacity-20" style={{ margin: `${bleedOffset}px` }}></div>
                    {!isSquare && <div className="absolute top-0 right-0 bottom-0 w-px border-l border-dashed border-red-400 opacity-40 z-50"></div>} {/* Gutter indicator for Left Page */}


                    <div className="w-full h-full flex flex-col pt-1" style={contentStyle}>
                        <div
                            className="flex-1 flex flex-col items-center text-center p-6 overflow-hidden"
                            style={{
                                borderRadius: `${template.layout.cornerRadius}px`,
                                border: template.layout.borderStyle !== 'none' ? `2px ${template.layout.borderStyle} ${template.colors.border}` : undefined,
                                backgroundColor: '#ffffff',
                                position: 'relative',
                                zIndex: 10 // Ensure content is above icons if they overlap slightly
                            }}
                        >
                            <h1
                                className="font-bold mb-4 shrink-0"
                                style={{
                                    fontFamily: template.fonts.heading,
                                    color: template.colors.heading,
                                    fontSize: `${(layout.headingSize || 28) * (isSquare ? 0.8 : 1) * scale}px`,
                                    marginBottom: isSquare ? `${10 * scale}px` : `${16 * scale}px`
                                }}
                            >
                                {currentScene.title}
                            </h1>

                            {layout.showIcon && <div className="h-px w-24 mb-6 opacity-30 shrink-0" style={{ backgroundColor: template.colors.accent, marginBottom: isSquare ? `${10 * scale}px` : `${24 * scale}px`, width: isSquare ? `${60 * scale}px` : `${96 * scale}px` }} />}

                            <p
                                className="whitespace-pre-wrap mb-10 overflow-hidden"
                                style={{
                                    fontFamily: template.fonts.body,
                                    color: template.colors.storyText,
                                    fontSize: `${(layout.bodySize || 14) * (isSquare ? 0.9 : 1) * scale}px`,
                                    lineHeight: isSquare ? 1.4 : 1.6,
                                    marginBottom: isSquare ? `${20 * scale}px` : `${40 * scale}px`
                                }}
                            >
                                {currentScene.story}
                            </p>

                            {/* Attributes/Words */}
                            <div className="w-full space-y-4" style={{ marginTop: isSquare ? 'auto' : undefined, gap: isSquare ? `${12 * scale}px` : `${16 * scale}px` }}>
                                {currentScene.words.map((word, idx) => (
                                    <div key={idx} className="relative w-full group shrink-0" style={{ height: isSquare ? `${45 * scale}px` : `${60 * scale}px`, marginBottom: isSquare ? `${8 * scale}px` : `${12 * scale}px` }}>
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
                                        <div className="absolute inset-0 flex items-center justify-around overflow-hidden whitespace-nowrap px-4 bg-white/50 rounded pointer-events-none">
                                            {Array.from({ length: Math.max(1, writingSettings.minRepetitions) }).map((_, rIdx) => (
                                                <span
                                                    key={rIdx}
                                                    className="select-none"
                                                    style={{
                                                        fontFamily: 'Codystar, cursive',
                                                        fontSize: `${(writingSettings.practiceFontSize || 28) * (isSquare ? 0.85 : 1) * scale}px`,
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

                {/* Right Page (Recto) - Illustration Page */}
                <div
                    className="bg-white shadow-lg relative shrink-0 transition-transform origin-center"
                    style={pageStyle}
                >
                    {/* Bleed & Gutter Guides */}
                    <div className="absolute inset-0 pointer-events-none z-50 border border-blue-400 border-dashed opacity-20" style={{ margin: `${bleedOffset}px` }}></div>
                    {!isSquare && <div className="absolute top-0 left-0 bottom-0 w-px border-l border-dashed border-red-400 opacity-40 z-50"></div>} {/* Gutter indicator for Right Page */}


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
