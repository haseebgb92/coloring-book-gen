import jsPDF from 'jspdf';
import { ProjectState, Story } from '../types';
import { getPageDimensions, INCHES_TO_POINTS } from './kdp-helper';
import { loadFontAsBase64, RALEWAY_DOTS_URL } from './font-loader';

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

    // Load dotted font
    let dottedFontLoaded = false;
    try {
        const fontData = await loadFontAsBase64(RALEWAY_DOTS_URL);
        const base64 = fontData.split(',')[1];
        pdf.addFileToVFS('RalewayDots.ttf', base64);
        pdf.addFont('RalewayDots.ttf', 'RalewayDots', 'normal');
        dottedFontLoaded = true;
    } catch (e) {
        console.warn('Failed to load dotted font, using fallback');
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
        addFrontMatterPage(pdf, matter, project);
        updateProgress();
    }

    // Ensure stories start on LEFT page (even page number)
    let pageNum = pdf.getNumberOfPages();
    if (pageNum % 2 !== 0) {
        pdf.addPage(); // Add blank page
        updateProgress();
    }

    // Add story spreads
    for (const story of project.stories) {
        // LEFT page: Illustration
        pdf.addPage();
        await addIllustrationPage(pdf, story, project);
        updateProgress();

        // RIGHT page: Story + Writing Practice
        pdf.addPage();
        addStoryTextPage(pdf, story, project, dottedFontLoaded);
        updateProgress();
    }

    // Add end matter
    for (const matter of project.endMatter) {
        pdf.addPage();
        addEndMatterPage(pdf, matter, project);
        updateProgress();
    }

    return pdf.output('blob');
}

function addFrontMatterPage(pdf: jsPDF, type: string, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;

    pdf.setFontSize(24);
    pdf.text(type === 'title-page' ? project.title : type.toUpperCase(), w / 2, h / 2, { align: 'center' });
}

async function addIllustrationPage(pdf: jsPDF, story: Story, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    // Add Image if available
    if (story.illustration) {
        try {
            // Calculate fit
            const imgProps = pdf.getImageProperties(story.illustration);
            const imgRatio = imgProps.width / imgProps.height;
            const pageRatio = width / height;

            let finalW = w;
            let finalH = h;

            // Basic "contain" logic respecting margins if needed, 
            // but for "coloring book" often we want full bleed or near full bleed.
            // Let's settle for a safe margin fit for now to be safe.
            const safeW = w - (margin.inner + margin.outer) * INCHES_TO_POINTS;
            const safeH = h - (margin.top + margin.bottom) * INCHES_TO_POINTS;

            if (imgRatio > pageRatio) {
                finalW = safeW;
                finalH = safeW / imgRatio;
            } else {
                finalH = safeH;
                finalW = safeH * imgRatio;
            }

            const x = (w - finalW) / 2; // Center horizontally
            const y = (h - finalH) / 2; // Center vertically

            pdf.addImage(story.illustration, 'PNG', x / INCHES_TO_POINTS, y / INCHES_TO_POINTS, finalW / INCHES_TO_POINTS, finalH / INCHES_TO_POINTS);
        } catch (e) {
            console.error("Failed to add image to PDF", e);
            // Fallback text
            pdf.setFontSize(14);
            pdf.setTextColor(200);
            pdf.text('[Error loading image]', w / 2, h / 2, { align: 'center' });
        }
    } else {
        // Placeholder
        pdf.setFontSize(14);
        pdf.setTextColor(200);
        pdf.text('[Place Illustration Here]', w / 2, h / 2, { align: 'center' });
    }
}

function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState, useDottedFont: boolean) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    const isEven = pdf.getNumberOfPages() % 2 === 0;
    // Margins in points
    const marginLeft = (isEven ? margin.outer : margin.inner) * INCHES_TO_POINTS;
    const marginRight = (isEven ? margin.inner : margin.outer) * INCHES_TO_POINTS;
    const contentWidth = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(0); // Black for title
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text (Preserving formatting)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(0); // Black for text

    // Handle text block
    // splitTextToSize handles newlines if passed correctly, but let's be explicit
    const paragraphs = story.story_text.split('\n');

    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += 12; // Empty line spacing
            return;
        }
        const lines = pdf.splitTextToSize(para, contentWidth);
        pdf.text(lines, marginLeft, currentY, { align: 'left', lineHeightFactor: 1.5 });
        currentY += lines.length * 12 * 1.5 + 12; // Add extra space after para
    });

    currentY += 20; // Extra gap before practice

    // Writing Practice Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(150); // Grey header
    pdf.text("WRITING PRACTICE", w / 2, currentY, { align: 'center' });
    currentY += 30;

    // Writing Practice Words
    if (useDottedFont) {
        pdf.setFont('RalewayDots', 'normal');
    } else {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(36); // Good size for tracing
    pdf.setTextColor(180); // Light Grey for tracing

    const practiceWords = story.writing_words.slice(0, 5);

    practiceWords.forEach((word) => {
        // Draw guide line
        pdf.setDrawColor(200);
        pdf.setLineWidth(0.5);
        pdf.setLineDash([2, 2], 0);
        pdf.line(marginLeft, currentY + 8, w - marginRight, currentY + 8); // Baseline
        pdf.setLineDash([], 0);

        // Text repeatedly
        // Calculate simple spacing: divide width by 3
        const sectionW = contentWidth / 3;

        // 1st
        pdf.text(word, marginLeft + sectionW * 0.5, currentY, { align: 'center' });
        // 2nd
        pdf.text(word, marginLeft + sectionW * 1.5, currentY, { align: 'center' });
        // 3rd
        pdf.text(word, marginLeft + sectionW * 2.5, currentY, { align: 'center' });

        currentY += 60; // Spacing between rows
    });

    pdf.setTextColor(0);
    pdf.setFont('helvetica', 'normal');
}

function addEndMatterPage(pdf: jsPDF, type: string, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;

    pdf.setFontSize(18);
    pdf.text(type.toUpperCase(), w / 2, h / 2, { align: 'center' });
}
