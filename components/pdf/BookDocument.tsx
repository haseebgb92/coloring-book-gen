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
        <Document>
            {/* TODO: Front Matter */}

            {scenes.map((scene, idx) => {
                const leftMargins = getMargins('left');
                const rightMargins = getMargins('right');

                return (
                    <React.Fragment key={scene.id}>
                        {/* Left Page: Story + Words */}
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            <View style={{
                                marginTop: leftMargins.top,
                                marginBottom: leftMargins.bottom,
                                marginLeft: leftMargins.left,
                                marginRight: leftMargins.right,
                                flex: 1
                            }}>
                                <Text style={styles.heading}>{scene.title}</Text>
                                <Text style={styles.text}>{scene.story}</Text>

                                <View style={{ marginTop: 30 }}>
                                    {scene.words.map((word, wIdx) => (
                                        <View key={wIdx} style={styles.practiceRow}>
                                            {/* Writing Lines Background */}
                                            <View style={{ position: 'relative', height: 40, width: '100%', marginBottom: 5 }}>
                                                {/* Top Line */}
                                                {writingSettings.guidelines.showTop && (
                                                    <View style={[styles.writingLine, { top: 0, borderBottomColor: template.colors.writingLine }]} />
                                                )}
                                                {/* Mid Line (should be dashed) */}
                                                {writingSettings.guidelines.showMid && (
                                                    <View style={[styles.writingLine, { top: 15, borderBottomStyle: 'dashed', borderBottomColor: template.colors.writingLine }]} />
                                                )}
                                                {/* Base Line */}
                                                {writingSettings.guidelines.showBase && (
                                                    <View style={[styles.writingLine, { top: 30, borderBottomColor: template.colors.writingLine }]} />
                                                )}

                                                {/* The Words */}
                                                <View style={{ flexDirection: 'row', position: 'absolute', top: 5, left: 0 }}>
                                                    {Array.from({ length: writingSettings.minRepetitions }).map((_, rIdx) => (
                                                        <Text key={rIdx} style={styles.practiceWord}>
                                                            {word}
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
                                    color: template.colors.pageNumber,
                                    fontSize: 10
                                }}>
                                    {2 + (idx * 2)}
                                </Text>
                            )}
                        </Page>

                        {/* Right Page: Illustration */}
                        <Page size={[pageWidth, pageHeight]} style={styles.page}>
                            {/* Bleed/Margins container */}
                            <View style={{
                                marginTop: rightMargins.top,
                                marginBottom: rightMargins.bottom,
                                marginLeft: rightMargins.left,
                                marginRight: rightMargins.right,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {/* The Frame */}
                                <View style={{
                                    width: '100%',
                                    height: '100%',
                                    borderWidth: template.layout.borderStyle !== 'none' ? 2 : 0,
                                    borderColor: template.colors.border,
                                    borderStyle: template.layout.borderStyle === 'dashed' ? 'dashed' : 'solid',
                                    borderRadius: template.layout.cornerRadius, // ReactPDF supports cornerRadius
                                    padding: 10, // Inner padding
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {scene.illustration ? (
                                        <Image
                                            src={scene.illustration}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    ) : (
                                        <Text style={{ color: '#9ca3af' }}>No Illustration</Text>
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
                                    color: template.colors.pageNumber,
                                    fontSize: 10
                                }}>
                                    {3 + (idx * 2)}
                                </Text>
                            )}
                        </Page>
                    </React.Fragment>
                )
            })}
        </Document>
    );
}
