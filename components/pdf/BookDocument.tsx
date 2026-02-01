import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { ProjectState, Scene } from '@/lib/types';
import { TEMPLATES, INITIAL_PROJECT_STATE } from '@/lib/templates';

// Register Fonts
// Using Google Fonts URLs. In production these should be downloaded or robustly handled.
// Font.register({
//     family: 'Inter',
//     src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
// });
// Font.register({
//     family: 'Schoolbell', // Handwriting style for tracing? Or just dotted.
//     src: 'https://fonts.gstatic.com/s/schoolbell/v22/P_V12m4o84jO4eAs9zVl8w.woff2'
// });
// // Using a dotted font for tracing if possible, or just light color
// Font.register({
//     family: 'Codystar',
//     src: 'https://fonts.gstatic.com/s/codystar/v18/FwZf7-Q1xW8sOse7bkF-4E_y.woff2'
// });

const PT_PER_INCH = 72;

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

    // Helper for margins based on page side
    const getMargins = (side: 'left' | 'right') => {
        const t = (safeMargins.top * PT_PER_INCH) + bleedPt;
        const b = (safeMargins.bottom * PT_PER_INCH) + bleedPt;

        if (side === 'left') {
            return {
                top: t, bottom: b,
                left: (safeMargins.outer * PT_PER_INCH) + bleedPt,
                right: (safeMargins.inner * PT_PER_INCH)
            };
        } else {
            return {
                top: t, bottom: b,
                left: (safeMargins.inner * PT_PER_INCH),
                right: (safeMargins.outer * PT_PER_INCH) + bleedPt
            };
        }
    };

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background || '#ffffff',
            fontFamily: 'Helvetica',
        },
        text: {
            color: colors.storyText || '#000000',
            fontSize: 12,
            lineHeight: 1.5,
        },
        heading: {
            color: colors.heading || '#000000',
            fontSize: 24,
            marginBottom: 20,
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
        },
        practiceRow: {
            marginTop: 20,
            marginBottom: 10,
        },
        practiceWord: {
            fontSize: 28,
            color: colors.tracing || '#9ca3af',
            fontFamily: 'Courier',
            marginRight: 15,
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
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {page.title && <Text style={[styles.heading, { textAlign: 'center' }]}>{page.title}</Text>}
                        {page.image && (page.image.startsWith('data:') || page.image.startsWith('http') || page.image.startsWith('blob:')) ? (
                            <View style={{ width: '80%', height: '50%', marginBottom: 20 }}>
                                <Image src={page.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </View>
                        ) : (
                            page.image && <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 10 }}>[Image: {page.image}]</Text>
                        )}
                        {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                    </View>
                </Page>
            ))}

            {/* Main Scenes */}
            {(scenes || []).map((scene, idx) => {
                const leftMargins = getMargins('left');
                const rightMargins = getMargins('right');

                if (!scene) return null;

                return (
                    <React.Fragment key={scene.id || idx}>
                        {/* Left Page: Story + Words */}
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{
                                marginTop: leftMargins.top,
                                marginBottom: leftMargins.bottom,
                                marginLeft: leftMargins.left,
                                marginRight: leftMargins.right,
                                flex: 1
                            }}>
                                {scene.title && <Text style={styles.heading}>{scene.title}</Text>}
                                {scene.story && <Text style={styles.text}>{scene.story}</Text>}

                                <View style={{ marginTop: 30 }}>
                                    {(scene.words || []).map((word, wIdx) => (
                                        <View key={wIdx} style={styles.practiceRow}>
                                            <View style={{ position: 'relative', height: 40, width: '100%', marginBottom: 5 }}>
                                                {writingSettings.guidelines.showTop && (
                                                    <View style={[styles.writingLine, { top: 0, borderBottomColor: colors.writingLine }]} />
                                                )}
                                                {writingSettings.guidelines.showMid && (
                                                    <View style={[styles.writingLine, { top: 15, borderBottomStyle: 'dashed', borderBottomColor: colors.writingLine }]} />
                                                )}
                                                {writingSettings.guidelines.showBase && (
                                                    <View style={[styles.writingLine, { top: 30, borderBottomColor: colors.writingLine }]} />
                                                )}

                                                <View style={{ flexDirection: 'row', position: 'absolute', top: 5, left: 0 }}>
                                                    {Array.from({ length: Math.max(1, getNum(writingSettings.minRepetitions, 1)) }).map((_, rIdx) => (
                                                        <Text key={rIdx} style={styles.practiceWord}>
                                                            {word || ''}
                                                        </Text>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Page Number */}
                            {printSettings.pageNumbers.enabled && (
                                <Text style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 0, right: 0,
                                    textAlign: 'center',
                                    color: colors.pageNumber || '#000000',
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
                                    width: '100%',
                                    height: '100%',
                                    borderWidth: borderWeight,
                                    borderColor: colors.border || '#000000',
                                    borderStyle: layout?.borderStyle === 'dashed' ? 'dashed' : 'solid',
                                    ...(safeCornerRadius > 0 ? { borderRadius: safeCornerRadius } : {}),
                                    overflow: 'hidden',
                                    backgroundColor: '#ffffff',
                                    position: 'relative'
                                }}>
                                    {scene.illustration && (scene.illustration.startsWith('data:') || scene.illustration.startsWith('http') || scene.illustration.startsWith('blob:')) ? (
                                        <Image
                                            src={scene.illustration}
                                            style={{
                                                position: 'absolute',
                                                top: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + getNum(scene.illustrationPositionY, 0)}%`,
                                                left: `${((1 - getNum(scene.illustrationScale, 1.05)) / 2 * 100) + getNum(scene.illustrationPositionX, 0)}%`,
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
                                </View>
                            </View>

                            {/* Page Number */}
                            {printSettings.pageNumbers.enabled && (
                                <Text style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 0, right: 0,
                                    textAlign: 'center',
                                    color: colors.pageNumber || '#000000',
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
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {page.title && <Text style={[styles.heading, { textAlign: 'center' }]}>{page.title}</Text>}
                        {page.text && <Text style={[styles.text, { textAlign: 'center' }]}>{page.text}</Text>}
                    </View>
                </Page>
            ))}
        </Document>
    );
}
