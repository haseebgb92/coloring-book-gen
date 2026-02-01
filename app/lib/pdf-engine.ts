import jsPDF from 'jspdf';
import { ProjectState, Story } from '../types';
import { getPageDimensions, INCHES_TO_POINTS } from './kdp-helper';

export async function generateColoringBookPDF(
    project: ProjectState,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    // 1. Calculate Dimensions in POINTS
    let { width: widthIn, height: heightIn } = getPageDimensions(project.config);

    // Safety Fallback
    if (!widthIn || !heightIn) { widthIn = 8.5; heightIn = 11; }

    const widthPt = widthIn * INCHES_TO_POINTS;
    const heightPt = heightIn * INCHES_TO_POINTS;

    // 2. Initialize PDF with POINTS unit
    // This ensures that coordinate (306, 396) means 306 points, not 306 inches.
    const pdf = new jsPDF({
        orientation: widthIn > heightIn ? 'landscape' : 'portrait',
        unit: 'pt', // CRITICAL FIX: Use Points
        format: [widthPt, heightPt],
    });

    const activeFont = 'helvetica';

    let currentPage = 0;
    const totalPages = project.frontMatter.length + project.stories.length * 2 + project.endMatter.length;

    const updateProgress = () => {
        currentPage++;
        if (onProgress) {
            onProgress(Math.round((currentPage / totalPages) * 100));
        }
    };

    // Remove the default first page
    pdf.deletePage(1);

    // Add front matter
    for (const matter of project.frontMatter) {
        pdf.addPage();
        await addFrontMatterPage(pdf, matter, project, activeFont, widthPt, heightPt);
        updateProgress();
    }

    // Ensure stories start on LEFT page (even page number)
    let pageNum = pdf.getNumberOfPages();
    if (pageNum % 2 === 0) {
        pdf.addPage();
        updateProgress();
    }

    // Add story spreads
    for (const story of project.stories) {
        // LEFT page: Story + Writing Practice
        pdf.addPage();
        addStoryTextPage(pdf, story, project, activeFont, widthPt, heightPt);
        updateProgress();

        // RIGHT page: Illustration
        pdf.addPage();
        await addIllustrationPage(pdf, story, project, widthPt, heightPt);
        updateProgress();
    }

    // Add end matter
    for (const matter of project.endMatter) {
        pdf.addPage();
        await addFrontMatterPage(pdf, matter, project, activeFont, widthPt, heightPt);
        updateProgress();
    }

    return pdf.output('blob');
}

// Updated Helper Functions to accept Width/Height in Points explicitly
async function addFrontMatterPage(pdf: jsPDF, type: string, project: ProjectState, fontName: string, w: number, h: number) {

    const customContent = project.customText?.[type];

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    if (type === 'title-page') {
        let currentY = h / 2;

        if (project.logo) {
            try {
                const imgProps = pdf.getImageProperties(project.logo);
                const imgRatio = imgProps.width / imgProps.height;
                const maxLogoW = w * 0.4;
                const maxLogoH = h * 0.3;
                let logoW = maxLogoW;
                let logoH = maxLogoW / imgRatio;
                if (logoH > maxLogoH) {
                    logoH = maxLogoH;
                    logoW = logoH * imgRatio;
                }
                const logoY = (h / 2) - logoH - 30;
                // No division by INCHES_TO_POINTS because unit is now 'pt'
                pdf.addImage(project.logo, 'PNG', (w - logoW) / 2, logoY, logoW, logoH);
                currentY = h / 2 + 30;
            } catch (e) {
                console.warn("Failed to render logo", e);
            }
        }

        pdf.setFontSize(32);
        pdf.text(project.title || "Untitled Book", w / 2, currentY, { align: 'center' });

        pdf.setFontSize(14);
        const sub = customContent || "A Story-Based Coloring Book";
        pdf.text(sub, w / 2, currentY + 30, { align: 'center' });

    } else if (type === 'this-book-belongs-to') {
        pdf.setFontSize(18);
        if (customContent) {
            const lines = pdf.splitTextToSize(customContent, w * 0.8);
            pdf.text(lines, w / 2, h / 3, { align: 'center' });
        } else {
            pdf.text("This Book Belongs To:", w / 2, h / 3, { align: 'center' });
            pdf.setLineWidth(1);
            pdf.line(w * 0.2, h / 2, w * 0.8, h / 2);
        }
    } else if (type === 'copyright') {
        pdf.setFontSize(12);
        const text = customContent || `Copyright © ${new Date().getFullYear()} ${project.title}\nAll Rights Reserved.`;
        const lines = pdf.splitTextToSize(text, w * 0.8);
        pdf.text(lines, w / 2, h / 2, { align: 'center' });

    } else if (type === 'color-test') {
        pdf.setFontSize(24);
        pdf.text("Test Your Colors", w / 2, h * 0.15, { align: 'center' });

        if (customContent) {
            pdf.setFontSize(12);
            const lines = pdf.splitTextToSize(customContent, w * 0.8);
            pdf.text(lines, w / 2, h * 0.25, { align: 'center' });
        }

        const boxSize = 80;
        const gap = 40;
        const startX = (w - (boxSize * 3 + gap * 2)) / 2;
        const startY = h * 0.35;
        const labels = ["Crayons", "Pencils", "Markers"];
        labels.forEach((label, i) => {
            const x = startX + i * (boxSize + gap);
            pdf.setDrawColor(0);
            pdf.setLineWidth(2);
            pdf.rect(x, startY, boxSize, boxSize);
            pdf.setFontSize(14);
            pdf.text(label, x + boxSize / 2, startY + boxSize + 20, { align: 'center' });
        });

        if (!customContent) {
            pdf.setFontSize(11);
            pdf.setTextColor(100, 100, 100);
            const tips = "GUIDANCE: Test your crayons, markers, and pencils here. Use the one that doesn't seep through! If using markers, verify bleed-through before starting.";
            const tipsLines = pdf.splitTextToSize(tips, w * 0.7);
            pdf.text(tipsLines, w / 2, h * 0.7, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
        }

    } else if (type === 'certificate') {
        const margin = 40;
        pdf.setDrawColor(0);
        pdf.setLineWidth(4);
        pdf.rect(margin, margin, w - margin * 2, h - margin * 2);

        if (customContent) {
            pdf.setFontSize(16);
            const lines = pdf.splitTextToSize(customContent, w - margin * 4);
            pdf.text(lines, w / 2, h / 2, { align: 'center' });
        } else {
            pdf.setFontSize(32);
            pdf.text("CERTIFICATE", w / 2, h / 3, { align: 'center' });
            pdf.setFontSize(16);
            pdf.text("Of Completion", w / 2, h / 3 + 30, { align: 'center' });
            pdf.text("This certifies that", w / 2, h / 2, { align: 'center' });
            pdf.line(w / 4, h / 2 + 40, w * 0.75, h / 2 + 40);
            pdf.text("Has completed this coloring book!", w / 2, h * 0.7, { align: 'center' });
        }
    } else {
        pdf.setFontSize(18);
        const text = customContent || type.toUpperCase();
        pdf.text(text, w / 2, h / 2, { align: 'center' });
    }
}

async function addIllustrationPage(pdf: jsPDF, story: Story, project: ProjectState, w: number, h: number) {
    const margin = project.config.margins;

    const safeAvailableW = w - (margin.inner + margin.outer) * INCHES_TO_POINTS;
    const safeAvailableH = h - (margin.top + margin.bottom) * INCHES_TO_POINTS;
    const frameW = safeAvailableW * 0.85;
    const frameH = safeAvailableH * 0.85;
    const centerX = w / 2;
    const centerY = h / 2;
    const frameX = centerX - (frameW / 2);
    const frameY = centerY - (frameH / 2);

    pdf.setDrawColor(0);
    pdf.setLineWidth(3);
    pdf.rect(frameX, frameY, frameW, frameH);

    if (story.illustration) {
        try {
            const padding = 10;
            const innerW = frameW - (padding * 2);
            const innerH = frameH - (padding * 2);

            const imgProps = pdf.getImageProperties(story.illustration);
            const imgRatio = imgProps.width / imgProps.height;
            const frameRatio = innerW / innerH;

            let finalW = innerW;
            let finalH = innerH;

            if (imgRatio > frameRatio) {
                finalH = innerW / imgRatio;
            } else {
                finalW = innerH * imgRatio;
            }

            const imgX = frameX + padding + (innerW - finalW) / 2;
            const imgY = frameY + padding + (innerH - finalH) / 2;

            // No division because unit is 'pt'
            pdf.addImage(story.illustration, 'PNG', imgX, imgY, finalW, finalH);
        } catch (e) {
            console.error("Failed to add image to PDF", e);
        }
    }
}

function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState, fontName: string, w: number, h: number) {
    const margin = project.config.margins;

    const fontSize = project.template.fontSize && project.template.fontSize > 0 ? project.template.fontSize : 12;

    const isEven = pdf.getNumberOfPages() % 2 === 0;

    const marginLeft = (isEven ? margin.outer : margin.inner) * INCHES_TO_POINTS;
    const marginRight = (isEven ? margin.inner : margin.outer) * INCHES_TO_POINTS;
    const contentWidth = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    if (story.title) {
        pdf.text(story.title, w / 2, currentY, { align: 'center' });
    }
    currentY += 40;

    // Story Text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0, 0, 0);

    const paragraphs = story.story_text ? story.story_text.split('\n') : [];
    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += fontSize;
            return;
        }
        const lines = pdf.splitTextToSize(para, contentWidth);
        pdf.text(lines, marginLeft, currentY, { align: 'left' });
        currentY += lines.length * fontSize * 1.5 + fontSize;
    });

    currentY += 20;

    // Writing Practice
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("WRITING PRACTICE", w / 2, currentY, { align: 'center' });
    currentY += 30;

    // Words
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(28);
    pdf.setTextColor(100, 100, 100);

    const practiceWords = story.writing_words ? story.writing_words.slice(0, 5) : [];
    practiceWords.forEach((word) => {
        // Guide Line
        pdf.setDrawColor(180);
        pdf.setLineWidth(0.5);
        pdf.setLineDash([2, 2], 0);
        pdf.line(marginLeft, currentY + 6, w - marginRight, currentY + 6);
        pdf.setLineDash([], 0);

        // 3x Repetition
        const sectionW = contentWidth / 3;
        pdf.text(word, marginLeft + sectionW * 0.5, currentY, { align: 'center' });
        pdf.text(word, marginLeft + sectionW * 1.5, currentY, { align: 'center' });
        pdf.text(word, marginLeft + sectionW * 2.5, currentY, { align: 'center' });

        currentY += 50;
    });
}
