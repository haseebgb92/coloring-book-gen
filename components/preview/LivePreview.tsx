'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProjectState, Scene } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';

export function LivePreview({ state }: { state: ProjectState }) {
    const { scenes, template, printSettings, writingSettings } = state;
    const { trimSize } = printSettings;

    const [currentSpread, setCurrentSpread] = useState(0);
    const [scale, setScale] = useState(0.8);

    // Aspect Ratio
    const [width, height] = trimSize === '6x9' ? [6, 9] :
        trimSize === '8x10' ? [8, 10] : [8.5, 11];
    const aspectRatio = width / height;

    const totalSpreads = scenes.length; // + Front matter logic later

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
        width: `${width * 96 * scale}px`, // 96 DPI approx for screen
        height: `${height * 96 * scale}px`,
        backgroundColor: template.colors.background,
    };

    const contentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: `${printSettings.margins.outer}in`, // Left page outer is left
        paddingRight: `${printSettings.margins.inner}in`,
    };

    const rightContentStyle = {
        paddingTop: `${printSettings.margins.top}in`,
        paddingBottom: `${printSettings.margins.bottom}in`,
        paddingLeft: `${printSettings.margins.inner}in`, // Right page inner is left
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
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] px-1">Safe Area Boundary</div>
                        </div>
                    )}

                    <div className="w-full h-full flex flex-col" style={contentStyle}>
                        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: template.fonts.heading, color: template.colors.heading }}>
                            {currentScene.title}
                        </h1>
                        <p className="text-base whitespace-pre-wrap mb-8" style={{ fontFamily: template.fonts.body, color: template.colors.storyText }}>
                            {currentScene.story}
                        </p>

                        {/* Attributes/Words */}
                        <div className="mt-4 space-y-4">
                            {currentScene.words.map((word, idx) => (
                                <div key={idx} className="relative h-12 w-full">
                                    {/* Guidelines */}
                                    <div className="absolute inset-0 w-full h-full pointer-events-none">
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
                                    <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap px-1">
                                        {Array.from({ length: writingSettings.minRepetitions }).map((_, rIdx) => (
                                            <span
                                                key={rIdx}
                                                className="mr-8 text-3xl select-none"
                                                style={{
                                                    fontFamily: '"Codystar", monospace',
                                                    color: template.colors.tracing,
                                                    opacity: 0.7
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

                    {/* Page Number */}
                    {printSettings.pageNumbers.enabled && (
                        <div
                            className="absolute w-full text-center text-xs"
                            style={{ bottom: '0.25in', color: template.colors.pageNumber }}
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
