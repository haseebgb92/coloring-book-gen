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

    // Sizes matched to preview (px * 0.75 for pt conversion approx)
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.25 }}>
            <View style={{ position: 'absolute', top: 10 + bleedPt, left: 10 + bleedPt, transform: 'rotate(-15deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={48} />
            </View>
            <View style={{ position: 'absolute', top: 10 + bleedPt, right: 10 + bleedPt, transform: 'rotate(15deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={36} />
            </View>
            <View style={{ position: 'absolute', bottom: 30 + bleedPt, left: 15 + bleedPt, transform: 'rotate(10deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={30} />
            </View>
            <View style={{ position: 'absolute', bottom: 35 + bleedPt, right: 15 + bleedPt, transform: 'rotate(-10deg)' }}>
                <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={42} />
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

const DecorativeIconPDF = ({ type, color, size = 16 }: { type: string, color: string, size?: number }) => {
    switch (type) {
        case 'stars':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} />
                </Svg>
            );
        case 'hearts':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} />
                </Svg>
            );
        case 'leaves':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M11 20A7 7 0 0 1 11 6a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7z" fill={color} />
                    <Path d="M13 2.05A10.57 10.57 0 0 1 15.36 3" fill={color} opacity={0.5} />
                </Svg>
            );
        case 'flowers':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Circle cx="12" cy="12" r="3" fill={color} />
                    <Circle cx="12" cy="7" r="3" fill={color} opacity={0.6} />
                    <Circle cx="12" cy="17" r="3" fill={color} opacity={0.6} />
                    <Circle cx="7" cy="12" r="3" fill={color} opacity={0.6} />
                    <Circle cx="17" cy="12" r="3" fill={color} opacity={0.6} />
                </Svg>
            );
        case 'puzzles':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Rect x="4" y="4" width="7" height="7" rx="1" fill={color} />
                    <Rect x="13" y="4" width="7" height="7" rx="1" fill={color} />
                    <Rect x="4" y="13" width="7" height="7" rx="1" fill={color} />
                    <Rect x="13" y="13" width="7" height="7" rx="1" fill={color} />
                </Svg>
            );
        case 'geometric':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill={color} />
                </Svg>
            );
        case 'clouds':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5 0-.115.004-.229.011-.342A3.499 3.499 0 0 1 9.5 6.5c1.018 0 1.916.435 2.536 1.13.62-1.096 1.776-1.83 3.111-1.83.655 0 1.25.176 1.76.483.424-2.812 2.85-5 5.76-5a5.992 5.992 0 0 1 5.981 5.508A3.5 3.5 0 0 1 32 10.5c0 1.933-1.567 3.5-3.5 3.5h-11z" fill={color} />
                </Svg>
            );
        case 'music':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" fill="none" />
                    <Circle cx="6" cy="18" r="3" fill={color} />
                    <Circle cx="18" cy="16" r="3" fill={color} />
                </Svg>
            );
        case 'winter':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke={color} strokeWidth="2" fill="none" />
                </Svg>
            );
        case 'ocean':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill={color} opacity={0.3} />
                    <Path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill={color} />
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

    const [widthIn, heightIn] = trimSize === '6x9' ? [6, 9] :
        trimSize === '8x10' ? [8, 10] :
            trimSize === '8.5x8.5' ? [8.5, 8.5] : [8.5, 11];
    const width = widthIn * PT_PER_INCH;
    const height = heightIn * PT_PER_INCH;
    const bleedPt = bleed ? 0.125 * PT_PER_INCH : 0;
    const pageWidth = width + (bleed ? bleedPt * 2 : 0);
    const pageHeight = height + (bleed ? bleedPt * 2 : 0);

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

    const marginTop = (safeMargins.top * PT_PER_INCH) + bleedPt;
    const marginBottom = (safeMargins.bottom * PT_PER_INCH) + bleedPt;
    const marginLeft = (safeMargins.outer * PT_PER_INCH) + bleedPt;
    const marginRight = (safeMargins.inner * PT_PER_INCH) + bleedPt;

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
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page}>
                    <View style={{ marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight, flex: 1 }}>
                        <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                            {page.title && <Text style={styles.heading}>{page.title}</Text>}
                            {page.image && <View style={{ width: '80%', height: '50%', marginBottom: 20 }}><Image src={page.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></View>}
                            {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                        </ContentFrame>
                    </View>
                    <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                </Page>
            ))}

            {/* Scenes */}
            {(scenes || []).map((scene, idx) => {
                const isOdd = (idx * 2 + (state.frontMatter?.length || 0)) % 2 !== 0;
                const m = {
                    top: (safeMargins.top * PT_PER_INCH) + bleedPt,
                    bottom: (safeMargins.bottom * PT_PER_INCH) + bleedPt,
                    left: (isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: (isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };
                const rm = {
                    top: (safeMargins.top * PT_PER_INCH) + bleedPt,
                    bottom: (safeMargins.bottom * PT_PER_INCH) + bleedPt,
                    left: (!isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: (!isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };

                // For square format (8.5x8.5), create single combined pages
                if (trimSize === '8.5x8.5') {
                    const squareMargin = {
                        top: (safeMargins.top * PT_PER_INCH) + bleedPt,
                        bottom: (safeMargins.bottom * PT_PER_INCH) + bleedPt,
                        left: (safeMargins.outer * PT_PER_INCH) + bleedPt,
                        right: (safeMargins.outer * PT_PER_INCH) + bleedPt,
                    };

                    return (
                        <Page key={scene.id || idx} size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{ marginTop: squareMargin.top, marginBottom: squareMargin.bottom, marginLeft: squareMargin.left, marginRight: squareMargin.right, flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'column', gap: 15 }}>
                                    {/* Top Section: Illustration */}
                                    {scene.illustration && (
                                        <View style={{ flex: 0.5, position: 'relative', overflow: 'hidden', borderRadius: safeCornerRadius, backgroundColor: '#ffffff' }}>
                                            <Image src={scene.illustration} style={{ position: 'absolute', top: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionY, 0) * getNum(scene.illustrationScale, 1.05))}%`, left: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionX, 0) * getNum(scene.illustrationScale, 1.05))}%`, width: `${getNum(scene.illustrationScale, 1.05) * 100}%`, height: `${getNum(scene.illustrationScale, 1.05) * 100}%`, objectFit: 'cover' }} />
                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: borderWeight, borderColor: colors.border, borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid', borderRadius: safeCornerRadius }} />
                                        </View>
                                    )}

                                    {/* Bottom Section: Story and Words */}
                                    <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                                        {scene.title && <Text style={[styles.heading, { fontSize: layout.headingSize * 0.85 || 24 }]}>{scene.title}</Text>}
                                        {layout.showIcon && <View style={{ height: 1, width: 60, backgroundColor: colors.accent, opacity: 0.3, marginBottom: 12 }} />}
                                        {scene.story && <Text style={[styles.text, { textAlign: 'center', fontSize: (layout.bodySize || 14) * 0.85 }]}>{scene.story}</Text>}
                                        <View style={{ marginTop: 20, width: '100%' }}>
                                            {scene.words?.slice(0, 2).map((word, wIdx) => (
                                                <View key={wIdx} style={{ marginTop: 8, marginBottom: 6 }}>
                                                    <View style={{ position: 'relative', height: 35, width: '100%' }}>
                                                        {writingSettings.guidelines.showTop && <View style={[styles.writingLine, { top: 0 }]} />}
                                                        {writingSettings.guidelines.showMid && <View style={[styles.writingLine, { top: 17.5, borderBottomStyle: 'dashed' }]} />}
                                                        {writingSettings.guidelines.showBase && <View style={[styles.writingLine, { top: 35 }]} />}
                                                        <View style={{ flexDirection: 'row', position: 'absolute', top: 3, left: 8 }}>
                                                            {Array.from({ length: Math.min(2, Math.max(1, getNum(writingSettings.minRepetitions, 1))) }).map((_, rIdx) => (
                                                                <Text key={rIdx} style={[styles.practiceWord, { fontSize: (writingSettings.practiceFontSize || 28) * 0.75, marginRight: 20 }]}>{word}</Text>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </ContentFrame>
                                </View>
                            </View>
                            <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                            {printSettings.pageNumbers.enabled && <Text style={{ position: 'absolute', bottom: squareMargin.bottom - 12, left: 0, right: 0, textAlign: 'center', color: colors.pageNumber, fontSize: 10 }}>{(state.frontMatter?.length || 0) + idx + 1}</Text>}
                        </Page>
                    );
                }

                // For other formats, keep the existing two-page spread layout
                return (
                    <React.Fragment key={scene.id || idx}>
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{ marginTop: m.top, marginBottom: m.bottom, marginLeft: m.left, marginRight: m.right, flex: 1 }}>
                                <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                                    {scene.title && <Text style={styles.heading}>{scene.title}</Text>}
                                    {layout.showIcon && <View style={{ height: 1, width: 80, backgroundColor: colors.accent, opacity: 0.3, marginBottom: 20 }} />}
                                    {scene.story && <Text style={[styles.text, { textAlign: 'center' }]}>{scene.story}</Text>}
                                    <View style={{ marginTop: 40, width: '100%' }}>
                                        {scene.words?.map((word, wIdx) => (
                                            <View key={wIdx} style={styles.practiceRow}>
                                                <View style={{ position: 'relative', height: 45, width: '100%', marginBottom: 8 }}>
                                                    {writingSettings.guidelines.showTop && <View style={[styles.writingLine, { top: 0 }]} />}
                                                    {writingSettings.guidelines.showMid && <View style={[styles.writingLine, { top: 22.5, borderBottomStyle: 'dashed' }]} />}
                                                    {writingSettings.guidelines.showBase && <View style={[styles.writingLine, { top: 45 }]} />}
                                                    <View style={{ flexDirection: 'row', position: 'absolute', top: 5, left: 10 }}>
                                                        {Array.from({ length: Math.max(1, getNum(writingSettings.minRepetitions, 1)) }).map((_, rIdx) => (
                                                            <Text key={rIdx} style={styles.practiceWord}>{word}</Text>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ContentFrame>
                            </View>
                            <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                            {printSettings.pageNumbers.enabled && <Text style={{ position: 'absolute', bottom: m.bottom - 12, left: 0, right: 0, textAlign: 'center', color: colors.pageNumber, fontSize: 10 }}>{2 + (state.frontMatter?.length || 0) + (idx * 2)}</Text>}
                        </Page>

                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{ marginTop: rm.top, marginBottom: rm.bottom, marginLeft: rm.left, marginRight: rm.right, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: pageWidth - (rm.left + rm.right), height: pageHeight - (rm.top + rm.bottom), backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden', borderRadius: safeCornerRadius }}>
                                    {scene.illustration && <Image src={scene.illustration} style={{ position: 'absolute', top: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionY, 0) * getNum(scene.illustrationScale, 1.05))}%`, left: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionX, 0) * getNum(scene.illustrationScale, 1.05))}%`, width: `${getNum(scene.illustrationScale, 1.05) * 100}%`, height: `${getNum(scene.illustrationScale, 1.05) * 100}%`, objectFit: 'cover' }} />}
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: borderWeight, borderColor: colors.border, borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid', borderRadius: safeCornerRadius }} />
                                </View>
                            </View>
                            <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                            {printSettings.pageNumbers.enabled && <Text style={{ position: 'absolute', bottom: rm.bottom - 12, left: 0, right: 0, textAlign: 'center', color: colors.pageNumber, fontSize: 10 }}>{3 + (state.frontMatter?.length || 0) + (idx * 2)}</Text>}
                        </Page>
                    </React.Fragment>
                );
            })}

            {/* Ending Pages */}
            {(state.endingPages || []).map((page, idx) => (
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page}>
                    <View style={{ marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight, flex: 1 }}>
                        <ContentFrame colors={colors} layout={layout} safeCornerRadius={safeCornerRadius} borderWeight={borderWeight}>
                            {page.title && <Text style={styles.heading}>{page.title}</Text>}
                            {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                        </ContentFrame>
                    </View>
                    <DecorativeLayer layout={layout} colors={colors} bleedPt={bleedPt} />
                </Page>
            ))}
        </Document>
    );
}
