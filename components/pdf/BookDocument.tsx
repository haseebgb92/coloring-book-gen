import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, Svg, Path, Circle, Rect } from '@react-pdf/renderer';
import { ProjectState, Scene } from '@/lib/types';
import { TEMPLATES, INITIAL_PROJECT_STATE } from '@/lib/templates';

// Register Fonts with CORS-friendly CDN (jsDelivr)
Font.register({
    family: 'Codystar',
    src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/codystar/Codystar-Regular.ttf'
});

Font.register({
    family: 'Fredoka',
    src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/fredoka/static/Fredoka-Bold.ttf'
});

Font.register({
    family: 'Outfit',
    src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/outfit/static/Outfit-Bold.ttf'
});

const PT_PER_INCH = 72;

// Decorative Components for PDF
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
        default: return null;
    }
};

export function BookDocument({ state }: { state: ProjectState }) {
    // Sanitization and Defaults
    const printSettings = state?.printSettings || INITIAL_PROJECT_STATE.printSettings;
    const scenes = state?.scenes || [];
    const template = state?.template || TEMPLATES[0];
    const writingSettings = state?.writingSettings || INITIAL_PROJECT_STATE.writingSettings;

    const { trimSize, bleed, margins } = printSettings;
    const colors = template?.colors || TEMPLATES[0].colors;
    const layout = template?.layout || TEMPLATES[0].layout;

    // Calculate dimensions
    const [widthIn, heightIn] = trimSize === '6x9' ? [6, 9] :
        trimSize === '8x10' ? [8, 10] : [8.5, 11];

    const width = widthIn * PT_PER_INCH;
    const height = heightIn * PT_PER_INCH;

    const bleedPt = bleed ? 0.125 * PT_PER_INCH : 0;

    const pageWidth = width + (bleed ? bleedPt * 2 : 0);
    const pageHeight = height + (bleed ? bleedPt * 2 : 0);

    // Safe Value Helpers
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
        page: {
            backgroundColor: colors.background || '#ffffff',
            fontFamily: 'Helvetica',
        },
        text: {
            color: colors.storyText || '#000000',
            fontSize: layout.bodySize || 14,
            lineHeight: 1.6,
        },
        heading: {
            color: colors.heading || '#000000',
            fontSize: layout.headingSize || 30,
            marginBottom: 20,
            fontFamily: (template.fonts.heading === 'Fredoka' || template.fonts.heading === 'Outfit')
                ? template.fonts.heading
                : 'Helvetica-Bold',
            textAlign: 'center'
        },
        practiceRow: {
            marginTop: 20,
            marginBottom: 10,
        },
        practiceWord: {
            fontSize: writingSettings.practiceFontSize || 28,
            color: colors.tracing || '#9ca3af',
            fontFamily: 'Codystar',
            marginRight: 30,
        },
        writingLine: {
            borderBottomWidth: 1,
            borderBottomColor: colors.writingLine || '#e5e7eb',
            borderBottomStyle: 'solid',
            position: 'absolute',
            left: 0, right: 0,
            height: 1,
        }
    });

    return (
        <Document title={state.name || 'Coloring Book'}>
            {/* Front Matter Pages */}
            {(state.frontMatter || []).map((page, idx) => (
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page}>
                    <View style={{
                        marginTop: marginTop,
                        marginBottom: marginBottom,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        flex: 1,
                        position: 'relative'
                    }}>
                        <View style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            borderWidth: borderWeight,
                            borderColor: colors.border,
                            borderRadius: safeCornerRadius,
                            backgroundColor: '#ffffff'
                        }} />
                        <View style={{ flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' }}>
                            {page.title && <Text style={[styles.heading, { color: colors.heading }]}>{page.title}</Text>}
                            {page.image && (page.image.startsWith('data:') || page.image.startsWith('http') || page.image.startsWith('blob:')) ? (
                                <View style={{ width: '80%', height: '50%', marginBottom: 20 }}>
                                    <Image src={page.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </View>
                            ) : (
                                page.image && <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 10 }}>[Image: {page.image}]</Text>
                            )}
                            {page.text && <Text style={[styles.text, { textAlign: 'center', color: colors.storyText }]}>{page.text}</Text>}
                        </View>
                    </View>
                </Page>
            ))}

            {/* Main Scenes */}
            {(scenes || []).map((scene, idx) => {
                const isOdd = (idx * 2 + (state.frontMatter?.length || 0)) % 2 !== 0;

                const leftMargins = {
                    top: (safeMargins.top * PT_PER_INCH) + bleedPt,
                    bottom: (safeMargins.bottom * PT_PER_INCH) + bleedPt,
                    left: (isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: (isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };

                const rightMargins = {
                    top: (safeMargins.top * PT_PER_INCH) + bleedPt,
                    bottom: (safeMargins.bottom * PT_PER_INCH) + bleedPt,
                    left: (!isOdd ? safeMargins.inner : safeMargins.outer) * PT_PER_INCH + bleedPt,
                    right: (!isOdd ? safeMargins.outer : safeMargins.inner) * PT_PER_INCH + bleedPt,
                };

                if (!scene) return null;

                return (
                    <React.Fragment key={scene.id || idx}>
                        {/* Left Page: Story + Words */}
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            {/* Decorative Ornaments Layer */}
                            {layout.showIcon && layout.iconSet && (
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                                    <View style={{ position: 'absolute', top: 40 + bleedPt, left: 40 + bleedPt, transform: 'rotate(-15deg)' }}>
                                        <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={80} />
                                    </View>
                                    <View style={{ position: 'absolute', top: 40 + bleedPt, right: 40 + bleedPt, transform: 'rotate(15deg)' }}>
                                        <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={60} />
                                    </View>
                                    <View style={{ position: 'absolute', bottom: 60 + bleedPt, left: 60 + bleedPt, transform: 'rotate(10deg)' }}>
                                        <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={50} />
                                    </View>
                                    <View style={{ position: 'absolute', bottom: 80 + bleedPt, right: 60 + bleedPt, transform: 'rotate(-10deg)' }}>
                                        <DecorativeIconPDF type={layout.iconSet} color={colors.accent} size={70} />
                                    </View>
                                </View>
                            )}

                            <View style={{
                                marginTop: leftMargins.top,
                                marginBottom: leftMargins.bottom,
                                marginLeft: leftMargins.left,
                                marginRight: leftMargins.right,
                                flex: 1,
                                position: 'relative'
                            }}>
                                {/* Story Area Frame */}
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
                                    {scene.title && <Text style={[styles.heading, { color: colors.heading }]}>{scene.title}</Text>}
                                    {layout.showIcon && <View style={{ height: 1, width: 80, backgroundColor: colors.accent, opacity: 0.3, marginBottom: 20 }} />}
                                    {scene.story && <Text style={[styles.text, { textAlign: 'center', color: colors.storyText }]}>{scene.story}</Text>}

                                    <View style={{ marginTop: 40, width: '100%' }}>
                                        {(scene.words || []).map((word, wIdx) => (
                                            <View key={wIdx} style={styles.practiceRow}>
                                                <View style={{ position: 'relative', height: 45, width: '100%', marginBottom: 8 }}>
                                                    {writingSettings.guidelines.showTop && (
                                                        <View style={[styles.writingLine, { top: 0, borderBottomColor: colors.writingLine }]} />
                                                    )}
                                                    {writingSettings.guidelines.showMid && (
                                                        <View style={[styles.writingLine, { top: 22.5, borderBottomStyle: 'dashed', borderBottomColor: colors.writingLine }]} />
                                                    )}
                                                    {writingSettings.guidelines.showBase && (
                                                        <View style={[styles.writingLine, { top: 45, borderBottomColor: colors.writingLine }]} />
                                                    )}
                                                    <View style={{ flexDirection: 'row', position: 'absolute', top: 5, left: 10 }}>
                                                        {Array.from({ length: Math.max(1, getNum(writingSettings.minRepetitions, 1)) }).map((_, rIdx) => (
                                                            <View key={rIdx} style={{ marginRight: 30 }}>
                                                                <Text style={[styles.practiceWord, { color: colors.tracing }]}>
                                                                    {word || ''}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Page Number */}
                            {printSettings.pageNumbers.enabled && (
                                <Text style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 0, right: 0,
                                    textAlign: 'center',
                                    color: colors.pageNumber,
                                    fontSize: 10
                                }}>
                                    {2 + (state.frontMatter?.length || 0) + (idx * 2)}
                                </Text>
                            )}
                        </Page>

                        {/* Right Page: Illustration */}
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{
                                marginTop: rightMargins.top,
                                marginBottom: rightMargins.bottom,
                                marginLeft: rightMargins.left,
                                marginRight: rightMargins.right,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    width: pageWidth - (rightMargins.left + rightMargins.right),
                                    height: pageHeight - (rightMargins.top + rightMargins.bottom),
                                    backgroundColor: '#ffffff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: safeCornerRadius,
                                }}>
                                    {/* Image Layer */}
                                    {scene.illustration && (scene.illustration.startsWith('data:') || scene.illustration.startsWith('http') || scene.illustration.startsWith('blob:')) ? (
                                        <Image
                                            src={scene.illustration}
                                            style={{
                                                position: 'absolute',
                                                top: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionY, 0) * getNum(scene.illustrationScale, 1.05))}%`,
                                                left: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + (getNum(scene.illustrationPositionX, 0) * getNum(scene.illustrationScale, 1.05))}%`,
                                                width: `${getNum(scene.illustrationScale, 1.05) * 100}%`,
                                                height: `${getNum(scene.illustrationScale, 1.05) * 100}%`,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                            <Text style={{ color: '#9ca3af', fontSize: 10, textAlign: 'center' }}>
                                                {scene.illustration || 'No Illustration'}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Frame/Border Layer (On Top) */}
                                    <View style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        borderWidth: borderWeight,
                                        borderColor: colors.border,
                                        borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid',
                                        borderRadius: safeCornerRadius,
                                    }} />
                                </View>
                            </View>

                            {/* Page Number */}
                            {printSettings.pageNumbers.enabled && (
                                <Text style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 0, right: 0,
                                    textAlign: 'center',
                                    color: colors.pageNumber,
                                    fontSize: 10
                                }}>
                                    {3 + (state.frontMatter?.length || 0) + (idx * 2)}
                                </Text>
                            )}
                        </Page>
                    </React.Fragment>
                );
            })}

            {/* Ending Pages */}
            {(state.endingPages || []).map((page, idx) => (
                <Page key={page.id || idx} size={[pageWidth, pageHeight]} style={styles.page}>
                    <View style={{
                        marginTop: marginTop,
                        marginBottom: marginBottom,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        flex: 1,
                        position: 'relative'
                    }}>
                        <View style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            borderWidth: borderWeight,
                            borderColor: colors.border,
                            borderRadius: safeCornerRadius,
                            backgroundColor: '#ffffff'
                        }} />
                        <View style={{ flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' }}>
                            {page.title && <Text style={[styles.heading, { color: colors.heading }]}>{page.title}</Text>}
                            {page.text && <Text style={[styles.text, { textAlign: 'center', color: colors.storyText }]}>{page.text}</Text>}
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
}
