import jsPDF from 'jspdf';
import { ProjectState, Story } from '../types';
import { getPageDimensions, INCHES_TO_POINTS } from './kdp-helper';
import { loadFontAsBase64, RALEWAY_DOTS_URL } from './font-loader';
import { GOOGLE_FONTS } from './fonts';

export async function generateColoringBookPDF(
    project: ProjectState,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const { width, height } = getPageDimensions(project.config);
    const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [width, height],
    });

    // 1. Load Dotted Font (Essential)
    try {
        const fontData = await loadFontAsBase64(RALEWAY_DOTS_URL);
        const base64 = fontData.split(',')[1];
        pdf.addFileToVFS('RalewayDots.ttf', base64);
        pdf.addFont('RalewayDots.ttf', 'RalewayDots', 'normal');
    } catch (e) {
        console.warn('Failed to load dotted font', e);
    }

    // 2. Load Template Font
    const templateFontName = project.template.fontFamily;
    let activeFont = 'helvetica'; // Fallback Default

    if (templateFontName && GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS]) {
        try {
            const fontUrl = GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS];
            const fontData = await loadFontAsBase64(fontUrl);
            const base64 = fontData.split(',')[1];
            const filename = `${templateFontName.replace(/\s+/g, '')}.ttf`;

            pdf.addFileToVFS(filename, base64);
            // Try standard addFont first. identity-H can cause issues with some ttf files.
            // If this fails, the PDF generation generally throws later.
            // We will register it without specific encoding first which usually works for standard TTFs.
            pdf.addFont(filename, templateFontName, 'normal');
            activeFont = templateFontName;
            console.log(`Loaded custom font: ${templateFontName}`);
        } catch (e) {
            console.warn(`Failed to load template font ${templateFontName}, falling back to Helvetica`, e);
            activeFont = 'helvetica';
        }
    } else if (['Times', 'Courier'].includes(templateFontName)) {
        activeFont = templateFontName;
    }

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
        await addFrontMatterPage(pdf, matter, project, activeFont);
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
        addStoryTextPage(pdf, story, project, activeFont);
        updateProgress();

        // RIGHT page: Illustration
        pdf.addPage();
        await addIllustrationPage(pdf, story, project);
        updateProgress();
    }

    // Add end matter
    for (const matter of project.endMatter) {
        pdf.addPage();
        await addFrontMatterPage(pdf, matter, project, activeFont);
        updateProgress();
    }

    return pdf.output('blob');
}

async function addFrontMatterPage(pdf: jsPDF, type: string, project: ProjectState, fontName: string) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;

    // Custom Text Override
    const customContent = project.customText?.[type];

    // Set default font
    try { pdf.setFont(fontName, 'normal'); } catch { pdf.setFont('helvetica', 'normal'); }
    pdf.setTextColor(0);

    if (type === 'title-page') {
        let currentY = h / 2;

        // Logo Logic
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
                pdf.addImage(project.logo, 'PNG', (w - logoW) / 2 / INCHES_TO_POINTS, (h / 2 - logoH - 30) / INCHES_TO_POINTS, logoW / INCHES_TO_POINTS, logoH / INCHES_TO_POINTS);
                currentY = h / 2 + 20;
            } catch (e) {
                console.warn("Failed to render logo", e);
            }
        }

        pdf.setFontSize(32);
        pdf.text(project.title, w / 2, currentY, { align: 'center', lineHeightFactor: 1.5 });

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
        pdf.text(lines, w / 2, h / 2, { align: 'center', lineHeightFactor: 1.5 });

    } else if (type === 'color-test') {
        pdf.setFontSize(24);
        pdf.text("Test Your Colors", w / 2, h * 0.15, { align: 'center' });

        if (customContent) {
            pdf.setFontSize(12);
            const lines = pdf.splitTextToSize(customContent, w * 0.8);
            pdf.text(lines, w / 2, h * 0.25, { align: 'center' });
        }

        // Draw Swatches
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

        // Show tip only if NO custom content, or always?
        // If user provided custom content, maybe they replaced the tip?
        // Let's assume custom content REPLACES the "Pick your favorite..." text, but we keep the tip unless explicitly customized (hard to separate).
        // We will just put the tip at bottom.
        if (!customContent) {
            pdf.setFontSize(11);
            pdf.setTextColor(100);
            const tips = "GUIDANCE: Test your crayons, markers, and pencils here. Use the one that doesn't seep through! If using markers, verify bleed-through before starting.";
            const tipsLines = pdf.splitTextToSize(tips, w * 0.7);
            pdf.text(tipsLines, w / 2, h * 0.7, { align: 'center', lineHeightFactor: 1.5 });
            pdf.setTextColor(0);
        }

    } else if (type === 'certificate') {
        const margin = 40;
        pdf.setDrawColor(0);
        pdf.setLineWidth(4);
        pdf.rect(margin, margin, w - margin * 2, h - margin * 2);

        if (customContent) {
            // Render Custom Certificate Content centered
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
        // Allow custom text for generic pages too
        const text = customContent || type.replace(/-/g, ' ').toUpperCase();
        pdf.text(text, w / 2, h / 2, { align: 'center' });
    }
}

// ... (Rest of file: addIllustrationPage, addStoryTextPage unchanged)
async function addIllustrationPage(pdf: jsPDF, story: Story, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    // Frame size: 85% of safe area
    const safeAvailableW = w - (margin.inner + margin.outer) * INCHES_TO_POINTS;
    const safeAvailableH = h - (margin.top + margin.bottom) * INCHES_TO_POINTS;

    const frameW = safeAvailableW * 0.85;
    const frameH = safeAvailableH * 0.85;

    const centerX = w / 2;
    const centerY = h / 2;

    const frameX = centerX - (frameW / 2);
    const frameY = centerY - (frameH / 2);

    // Draw Outline Frame
    pdf.setDrawColor(0);
    pdf.setLineWidth(3);
    pdf.rect(frameX, frameY, frameW, frameH);

    // Add Image
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

            pdf.addImage(story.illustration, 'PNG', imgX / INCHES_TO_POINTS, imgY / INCHES_TO_POINTS, finalW / INCHES_TO_POINTS, finalH / INCHES_TO_POINTS);
        } catch (e) {
            console.error("Failed to add image to PDF", e);
        }
    }
}

function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState, fontName: string) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    const fontSize = project.template.fontSize || 12;

    const isEven = pdf.getNumberOfPages() % 2 === 0;

    const marginLeft = (isEven ? margin.outer : margin.inner) * INCHES_TO_POINTS;
    const marginRight = (isEven ? margin.inner : margin.outer) * INCHES_TO_POINTS;
    const contentWidth = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    try {
        pdf.setFont(fontName, 'normal');
    } catch (e) {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(24);
    pdf.setTextColor(0);
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0);

    const paragraphs = story.story_text.split('\n');
    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += fontSize;
            return;
        }
        try {
            const lines = pdf.splitTextToSize(para, contentWidth);
            pdf.text(lines, marginLeft, currentY, { align: 'left', lineHeightFactor: 1.5 });
            currentY += lines.length * fontSize * 1.5 + fontSize;
        } catch (e) {
            console.warn("Text split failed, falling back to Helvetica", e);
            pdf.setFont('helvetica', 'normal');
            const lines = pdf.splitTextToSize(para, contentWidth);
            pdf.text(lines, marginLeft, currentY, { align: 'left', lineHeightFactor: 1.5 });
            currentY += lines.length * fontSize * 1.5 + fontSize;
            try { pdf.setFont(fontName, 'normal'); } catch { }
        }
    });

    currentY += 20;

    // Writing Practice
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text("WRITING PRACTICE", w / 2, currentY, { align: 'center' });
    currentY += 30;

    // Words
    pdf.setFont('RalewayDots', 'normal');
    pdf.setFontSize(28);
    pdf.setTextColor(100);

    const practiceWords = story.writing_words.slice(0, 5);
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
