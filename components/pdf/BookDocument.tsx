import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { ProjectState, Scene } from '@/lib/types';

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
    const { printSettings, scenes, template, writingSettings } = state;
    const { trimSize, bleed, margins } = printSettings;

    // Calculate dimensions
    const [widthIn, heightIn] = trimSize === '6x9' ? [6, 9] :
        trimSize === '8x10' ? [8, 10] : [8.5, 11];

    const width = widthIn * PT_PER_INCH;
    const height = heightIn * PT_PER_INCH;

    const bleedPt = bleed ? 0.125 * PT_PER_INCH : 0;

    const pageWidth = width + (bleed ? bleedPt * 2 : 0);
    const pageHeight = height + (bleed ? bleedPt * 2 : 0);

    // Content Area
    const marginTop = (margins.top * PT_PER_INCH) + bleedPt;
    const marginBottom = (margins.bottom * PT_PER_INCH) + bleedPt;
    const marginLeft = (margins.outer * PT_PER_INCH) + bleedPt; // Standard assumption: Left page outer is Left.
    const marginRight = (margins.inner * PT_PER_INCH) + bleedPt;

    // For Right page (recto), Inner is Left, Outer is Right.
    // Left Page (verso): Inner is Right, Outer is Left.

    // Helper for margins based on page side
    const getMargins = (side: 'left' | 'right') => {
        const top = (margins.top * PT_PER_INCH) + bleedPt;
        const bottom = (margins.bottom * PT_PER_INCH) + bleedPt;
        const inner = (margins.inner * PT_PER_INCH) + (state.printSettings.bleed ? 0 : 0); // Inner margin from trim edge
        // If bleed is ON, do we add bleed to inner? Usually No, bleed is outer edges.
        // But standard "inner" margin is safe area from spine.

        // Let's stick to safe box.
        // Left Page: Left=Outer+Bleed, Right=Inner.
        // Right Page: Left=Inner, Right=Outer+Bleed.

        if (side === 'left') {
            return {
                top, bottom,
                left: (margins.outer * PT_PER_INCH) + bleedPt,
                right: (margins.inner * PT_PER_INCH)
            };
        } else {
            return {
                top, bottom,
                left: (margins.inner * PT_PER_INCH),
                right: (margins.outer * PT_PER_INCH) + bleedPt
            };
        }
    };

    const styles = StyleSheet.create({
        page: {
            backgroundColor: template.colors.background,
            fontFamily: 'Helvetica',
        },
        text: {
            color: template.colors.storyText,
            fontSize: 12, // From template settings in future
            lineHeight: 1.5,
        },
        heading: {
            color: template.colors.heading,
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
            fontSize: 28, // tracing size
            color: template.colors.tracing,
            fontFamily: 'Courier', // Dotted font replacement
            marginRight: 15,
        },
        writingLine: {
            borderBottomWidth: 1,
            borderBottomColor: template.colors.writingLine,
            borderBottomStyle: 'solid', // No dashed support for borders in ReactPDF yet? It supports dotted/dashed.
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
                        {page.image && (
                            <View style={{ width: '80%', height: '40%', marginBottom: 20 }}>
                                <Image src={page.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </View>
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
                                                    <View style={[styles.writingLine, { top: 0, borderBottomColor: template.colors.writingLine }]} />
                                                )}
                                                {writingSettings.guidelines.showMid && (
                                                    <View style={[styles.writingLine, { top: 15, borderBottomStyle: 'dashed', borderBottomColor: template.colors.writingLine }]} />
                                                )}
                                                {writingSettings.guidelines.showBase && (
                                                    <View style={[styles.writingLine, { top: 30, borderBottomColor: template.colors.writingLine }]} />
                                                )}

                                                <View style={{ flexDirection: 'row', position: 'absolute', top: 5, left: 0 }}>
                                                    {Array.from({ length: Math.max(1, writingSettings.minRepetitions || 0) }).map((_, rIdx) => (
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
                                    color: template.colors.pageNumber || '#000',
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
                                    borderWidth: (template.layout.borderStyle !== 'none' && template.layout.borderStyle) ? 2 : 0,
                                    borderColor: template.colors.border || '#000',
                                    borderStyle: template.layout.borderStyle === 'dashed' ? 'dashed' : 'solid',
                                    borderRadius: template.layout.cornerRadius || 0,
                                    overflow: 'hidden',
                                    backgroundColor: '#ffffff',
                                    position: 'relative'
                                }}>
                                    {scene.illustration ? (
                                        <Image
                                            src={scene.illustration}
                                            style={{
                                                position: 'absolute',
                                                top: `${((1 - (scene.illustrationScale || 1.05)) / 2 * 100) + (scene.illustrationPositionY || 0)}%`,
                                                left: `${((1 - (scene.illustrationScale || 1.05)) / 2 * 100) + (scene.illustrationPositionX || 0)}%`,
                                                width: `${(scene.illustrationScale || 1.05) * 100}%`,
                                                height: `${(scene.illustrationScale || 1.05) * 100}%`,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#9ca3af', fontSize: 10 }}>No Illustration</Text>
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
                                    color: template.colors.pageNumber || '#000',
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
