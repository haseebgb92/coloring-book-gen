import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path, Circle, Rect } from '@react-pdf/renderer';
import { ProjectState, Scene, PageContent, TemplateConfig, WritingPracticeSettings } from '@/lib/types';
import { TEMPLATES, INITIAL_PROJECT_STATE } from '@/lib/templates';
import { registerFonts, REGISTERED_FONTS } from '@/lib/fonts-config';

// Initialize fonts once
registerFonts();

const PT_PER_INCH = 72;

// --- Helper Components (Isolation) ---

/**
 * Renders decorative icons in the background of the page
 */
const DecorativeLayer = ({ layout, colors, bleedPt }: {
    layout: TemplateConfig['layout'],
    colors: TemplateConfig['colors'],
    bleedPt: number
}) => {
    if (!layout.showIcon || !layout.iconSet) return null;

    const opacity = layout.iconOpacity ?? 0.12; // Lowered default for subtlety

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }}>
            <View style={{ position: 'absolute', top: 5 + bleedPt, left: 5 + bleedPt, transform: 'rotate(-15deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent || '#000000'} size={72} opacity={opacity} />
            </View>
            <View style={{ position: 'absolute', top: 5 + bleedPt, right: 5 + bleedPt, transform: 'rotate(15deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent || '#000000'} size={50} opacity={opacity} />
            </View>
            <View style={{ position: 'absolute', bottom: 30 + bleedPt, left: 10 + bleedPt, transform: 'rotate(10deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent || '#000000'} size={40} opacity={opacity} />
            </View>
            <View style={{ position: 'absolute', bottom: 35 + bleedPt, right: 10 + bleedPt, transform: 'rotate(-10deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent || '#000000'} size={60} opacity={opacity} />
            </View>
        </View>
    );
};

/**
 * Standard content frame used for story and front/end matter
 */
const ContentFrame = ({ children, colors, layout, safeCornerRadius, borderWeight }: any) => (
    <View style={{ flex: 1, position: 'relative' }}>
        <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderWidth: borderWeight,
            borderColor: colors.border,
            borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid',
            borderRadius: safeCornerRadius,
            backgroundColor: '#ffffff'
        }} />
        <View style={{ flex: 1, padding: 30, alignItems: 'center' }}>
            {children}
        </View>
    </View>
);

const DecorativeIconPDF = ({ type, color, size = 16, opacity = 1 }: { type: string, color: string, size?: number, opacity?: number }) => {
    switch (type) {
        case 'stars':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} />
                </Svg>
            );
        case 'hearts':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} />
                </Svg>
            );
        case 'leaves':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Path d="M12 2C12 2 4 6 4 13C4 18 8 21 12 22C16 21 20 18 20 13C20 6 12 2 12 2Z" fill={color} />
                    <Path d="M12 22V12" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
                </Svg>
            );
        case 'flowers':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Circle cx="12" cy="12" r="3" fill={color} />
                    <Circle cx="12" cy="7" r="3" fill={color} opacity={0.6} />
                    <Circle cx="12" cy="17" r="3" fill={color} opacity={0.6} />
                    <Circle cx="7" cy="12" r="3" fill={color} opacity={0.6} />
                    <Circle cx="17" cy="12" r="3" fill={color} opacity={0.6} />
                </Svg>
            );
        case 'puzzles':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Rect x="4" y="4" width="7" height="7" rx="1" fill={color} />
                    <Rect x="13" y="4" width="7" height="7" rx="1" fill={color} />
                    <Rect x="4" y="13" width="7" height="7" rx="1" fill={color} />
                    <Rect x="13" y="13" width="7" height="7" rx="1" fill={color} />
                </Svg>
            );
        case 'geometric':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill={color} />
                </Svg>
            );
        case 'clouds':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5 0-.115.004-.229.011-.342A3.499 3.499 0 0 1 9.5 6.5c1.018 0 1.916.435 2.536 1.13.62-1.096 1.776-1.83 3.111-1.83.655 0 1.25.176 1.76.483.424-2.812 2.85-5 5.76-5a5.992 5.992 0 0 1 5.981 5.508A3.5 3.5 0 0 1 32 10.5c0 1.933-1.567 3.5-3.5 3.5h-11z" fill={color} />
                </Svg>
            );
        case 'music':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" fill="none" />
                    <Circle cx="6" cy="18" r="3" fill={color} />
                    <Circle cx="18" cy="16" r="3" fill={color} />
                </Svg>
            );
        case 'winter':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
                    <Path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke={color} strokeWidth="1.5" fill="none" />
                    <Path d="M12 4l2 2m-4 0l2-2M4 12l2 2m0-4l-2 2M12 20l-2-2m4 0l-2 2M20 12l-2-2m0 4l2-2" stroke={color} strokeWidth="1.5" />
                    <Circle cx="12" cy="12" r="1.5" fill={color} />
                </Svg>
            );
        case 'ocean':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Path d="M2 6c.6 0 1.2.2 1.5.5.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5s1.2.2 1.5.5c.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5" />
                    <Path d="M2 12c.6 0 1.2.2 1.5.5.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5s1.2.2 1.5.5c.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5" />
                    <Path d="M2 18c.6 0 1.2.2 1.5.5.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5s1.2.2 1.5.5c.3.3.9.5 1.5.5s1.2-.2 1.5-.5c.3-.3.9-.5 1.5-.5" />
                </Svg>
            );
        case 'sun':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Circle cx="12" cy="12" r="5" fill={color} />
                    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" stroke={color} />
                </Svg>
            );
        case 'butterfly':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Path d="M12 10c0-4 4-6 6-4s2 6-2 8c4 2 4 8 0 10s-8-2-4-10c0 0-4 2-8 0s-4-8 0-10s6 0 6 4" fill={color} fillOpacity="0.4" />
                    <Path d="M12 7v10" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </Svg>
            );
        case 'dinosaur':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Path d="M4 18c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zM16 18c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4z" fill={color} fillOpacity="0.3" />
                    <Path d="M8 14h8V10l3-2h3M2 14l3-2" stroke={color} strokeWidth="2" />
                </Svg>
            );
        case 'candy':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
                    <Circle cx="12" cy="12" r="6" fill={color} fillOpacity="0.3" />
                    <Path d="M7 7l10 10M17 7L7 10" stroke={color} />
                    <Path d="M12 6v12M6 12h12" stroke={color} opacity="0.5" />
                </Svg>
            );
        default: return null;
    }
};

// --- Main Document ---

export function BookDocument({ state }: { state: ProjectState }) {
    const printSettings = state?.printSettings || INITIAL_PROJECT_STATE.printSettings;
    const scenes = state?.scenes || [];
    const template = state?.template || TEMPLATES[0];
    const writingSettings = state?.writingSettings || INITIAL_PROJECT_STATE.writingSettings;

    const { trimSize, bleed, margins } = printSettings;
    const colors = template?.colors;
    const layout = template?.layout;

    const normalizedTrim = (trimSize || '').toLowerCase().replace(/\s+/g, '');

    // Aggressive square detection
    const isSquare = normalizedTrim.includes('8.5x8.5') ||
        (normalizedTrim.includes('8.5') && !normalizedTrim.includes('11') && !normalizedTrim.includes('9') && !normalizedTrim.includes('10'));

    let widthIn = 8.5;
    let heightIn = 11;

    if (normalizedTrim.includes('6x9')) { widthIn = 6; heightIn = 9; }
    else if (normalizedTrim.includes('8x10')) { widthIn = 8; heightIn = 10; }
    else if (isSquare) { widthIn = 8.5; heightIn = 8.5; }
    else { widthIn = 8.5; heightIn = 11; }

    const width = widthIn * PT_PER_INCH;
    const height = heightIn * PT_PER_INCH;
    const bleedPt = bleed ? 0.125 * PT_PER_INCH : 0;
    const pageWidth = width + (bleed ? bleedPt * 2 : 0);
    // FORCE SQUARE: If isSquare is true, height MUST be pageWidth
    const pageHeight = isSquare ? pageWidth : (height + (bleed ? bleedPt * 2 : 0));

    const getNum = (val: any, fallback: number) => {
        const n = Number(val);
        return (typeof val === 'number' || typeof val === 'string') && !isNaN(n) ? n : fallback;
    };

    const safeMargins = {
        top: Math.max(0, getNum(margins?.top, 0.5)),
        bottom: Math.max(0, getNum(margins?.bottom, 0.5)),
        inner: Math.max(0, getNum(margins?.inner, 0.5)),
        outer: Math.max(0, getNum(margins?.outer, 0.5)),
    };

    const safeCornerRadius = Math.max(0, getNum(layout?.cornerRadius, 0));
    const borderWeight = (layout?.borderStyle && layout?.borderStyle !== 'none') ? 2 : 0;

    const pageTop = (isSquare ? safeMargins.top : safeMargins.top) * PT_PER_INCH + bleedPt;
    const pageBottom = (isSquare ? safeMargins.top : safeMargins.bottom) * PT_PER_INCH + bleedPt;
    const pageLeft = (isSquare ? safeMargins.outer : safeMargins.outer) * PT_PER_INCH + bleedPt;
    const pageRight = (isSquare ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt;

    const styles = StyleSheet.create({
        page: { backgroundColor: colors.background || '#ffffff', fontFamily: 'Helvetica' },
        text: { color: colors.storyText, fontSize: layout.bodySize || 14, lineHeight: 1.6 },
        heading: {
            color: colors.heading,
            fontSize: layout.headingSize || 30,
            marginBottom: 20,
            fontFamily: REGISTERED_FONTS.includes(template.fonts.heading) ? template.fonts.heading : 'Helvetica-Bold',
            textAlign: 'center'
        },
        practiceRow: { marginTop: 20, marginBottom: 10 },
        practiceWord: { fontSize: writingSettings.practiceFontSize || 28, color: colors.tracing, fontFamily: 'Codystar', marginRight: 30 },
        writingLine: { borderBottomWidth: 1, borderBottomColor: colors.writingLine, borderBottomStyle: 'solid', position: 'absolute', left: 0, right: 0, height: 1 }
    });

    return (
        <Document title={state.name || 'Coloring Book'}>
            {/* Front Matter */}
            {(state.frontMatter || []).map((page, idx) => (
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page} wrap={false}>
                    <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                    <View style={{ marginTop: pageTop, marginBottom: pageBottom, marginLeft: pageLeft, marginRight: pageRight, flex: 1, zIndex: 10 }}>
                        <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                            {page.title && <Text style={styles.heading}>{page.title}</Text>}
                            {page.image && <View style={{ width: '80%', height: '50%', marginBottom: 20 }}><Image src={page.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></View>}
                            {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                        </ContentFrame>
                    </View>
                </Page>
            ))}

            {/* Scenes */}
            {(scenes || []).map((scene, idx) => {
                const isOdd = (idx * 2 + (state.frontMatter?.length || 0)) % 2 !== 0;
                // For square format, use uniform margins on all sides
                const page1Margins = {
                    top: (isSquare ? safeMargins.top : safeMargins.top) * PT_PER_INCH + bleedPt,
                    bottom: (isSquare ? safeMargins.top : safeMargins.bottom) * PT_PER_INCH + bleedPt,
                    left: isSquare ? (safeMargins.outer * PT_PER_INCH) + bleedPt : (isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: isSquare ? (safeMargins.outer * PT_PER_INCH) + bleedPt : (isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };
                const page2Margins = {
                    top: (isSquare ? safeMargins.top : safeMargins.top) * PT_PER_INCH + bleedPt,
                    bottom: (isSquare ? safeMargins.top : safeMargins.bottom) * PT_PER_INCH + bleedPt,
                    left: isSquare ? (safeMargins.outer * PT_PER_INCH) + bleedPt : (!isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: isSquare ? (safeMargins.outer * PT_PER_INCH) + bleedPt : (!isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };

                // Return two-page spread layout for all formats
                return (
                    <React.Fragment key={scene.id || idx}>
                        <Page size={[pageWidth, pageHeight]} style={styles.page} wrap={false}>
                            <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                            <View style={{ marginTop: page1Margins.top, marginBottom: page1Margins.bottom, marginLeft: page1Margins.left, marginRight: page1Margins.right, flex: 1, zIndex: 10 }}>
                                <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                                    {scene.title && (
                                        <Text style={[
                                            styles.heading,
                                            isSquare ? { fontSize: (layout.headingSize || 30) * 0.8, marginBottom: 10 } : {}
                                        ]}>
                                            {scene.title}
                                        </Text>
                                    )}
                                    {layout.showIcon && (
                                        <View style={{
                                            height: 1,
                                            width: isSquare ? 60 : 80,
                                            backgroundColor: colors.accent,
                                            opacity: 0.3,
                                            marginBottom: isSquare ? 10 : 20
                                        }} />
                                    )}
                                    {scene.story && (
                                        <Text style={[
                                            styles.text,
                                            { textAlign: 'center' },
                                            isSquare ? { fontSize: (layout.bodySize || 14) * 0.9, lineHeight: 1.4 } : {}
                                        ]}>
                                            {scene.story}
                                        </Text>
                                    )}
                                    <View style={{ marginTop: isSquare ? 20 : 40, width: '100%' }}>
                                        {scene.words?.map((word, wIdx) => (
                                            <View key={wIdx} style={[styles.practiceRow, isSquare ? { marginTop: 12, marginBottom: 8 } : { marginTop: 24, marginBottom: 12 }]}>
                                                <View style={{ position: 'relative', height: isSquare ? 45 : 60, width: '100%', marginBottom: isSquare ? 6 : 10 }}>
                                                    {writingSettings.guidelines.showTop && <View style={[styles.writingLine, { top: 0 }]} />}
                                                    {writingSettings.guidelines.showMid && <View style={[styles.writingLine, { top: isSquare ? 22.5 : 30, borderBottomStyle: 'dashed' }]} />}
                                                    {writingSettings.guidelines.showBase && <View style={[styles.writingLine, { top: isSquare ? 45 : 60 }]} />}
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        position: 'absolute',
                                                        top: isSquare ? 4 : 8,
                                                        left: 0,
                                                        right: 0,
                                                        justifyContent: 'space-around',
                                                        alignItems: 'center'
                                                    }}>
                                                        {Array.from({ length: Math.max(1, getNum(writingSettings.minRepetitions, 1)) }).map((_, rIdx) => (
                                                            <Text key={rIdx} style={[
                                                                styles.practiceWord,
                                                                { marginRight: 0 },
                                                                isSquare ? { fontSize: (writingSettings.practiceFontSize || 28) * 0.85 } : {}
                                                            ]}>
                                                                {word}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ContentFrame>
                            </View>
                            {printSettings.pageNumbers.enabled && <Text style={{ position: 'absolute', bottom: page1Margins.bottom - 12, left: 0, right: 0, textAlign: 'center', color: colors.pageNumber, fontSize: 10 }}>{2 + (state.frontMatter?.length || 0) + (idx * 2)}</Text>}
                        </Page>

                        <Page size={[pageWidth, pageHeight]} style={styles.page} wrap={false}>
                            <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                            <View style={{ marginTop: page2Margins.top, marginBottom: page2Margins.bottom, marginLeft: page2Margins.left, marginRight: page2Margins.right, flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                                <View style={{ width: pageWidth - (page2Margins.left + page2Margins.right), height: pageHeight - (page2Margins.top + page2Margins.bottom), backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden', borderRadius: safeCornerRadius }}>
                                    {scene.illustration && <Image src={scene.illustration!} style={{ position: 'absolute', top: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionY, 0) * getNum(scene.illustrationScale, 1.05))}%`, left: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionX, 0) * getNum(scene.illustrationScale, 1.05))}%`, width: `${getNum(scene.illustrationScale, 1.05) * 100}%`, height: `${getNum(scene.illustrationScale, 1.05) * 100}%`, objectFit: 'cover' }} />}
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: borderWeight, borderColor: colors.border, borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid', borderRadius: safeCornerRadius }} />
                                </View>
                            </View>
                            {printSettings.pageNumbers.enabled && <Text style={{ position: 'absolute', bottom: page2Margins.bottom - 12, left: 0, right: 0, textAlign: 'center', color: colors.pageNumber, fontSize: 10 }}>{3 + (state.frontMatter?.length || 0) + (idx * 2)}</Text>}
                        </Page>
                    </React.Fragment>
                );
            })}

            {/* Ending Pages */}
            {(state.endingPages || []).map((page, idx) => (
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page} wrap={false}>
                    <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                    <View style={{ marginTop: pageTop, marginBottom: pageBottom, marginLeft: pageLeft, marginRight: pageRight, flex: 1, zIndex: 10 }}>
                        <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                            {page.title && <Text style={styles.heading}>{page.title}</Text>}
                            {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                        </ContentFrame>
                    </View>
                </Page>
            ))}
        </Document>
    );
}
