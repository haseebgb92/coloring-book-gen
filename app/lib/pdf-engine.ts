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
        addIllustrationPage(pdf, story, project);
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

function addIllustrationPage(pdf: jsPDF, story: Story, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    // Placeholder for illustration
    pdf.setFontSize(14);
    pdf.setTextColor(200);
    pdf.text('[Illustration: ' + story.title + ']', w / 2, h / 2, { align: 'center' });
    pdf.setTextColor(0);
}

function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState, useDottedFont: boolean) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    const isEven = pdf.getNumberOfPages() % 2 === 0;
    const marginLeft = isEven ? margin.outer * INCHES_TO_POINTS : margin.inner * INCHES_TO_POINTS;
    const marginRight = isEven ? margin.inner * INCHES_TO_POINTS : margin.outer * INCHES_TO_POINTS;
    const contentW = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(story.story_text, contentW - 60);
    pdf.text(lines, w / 2, currentY, { align: 'center', lineHeightFactor: 1.5 });
    currentY += lines.length * 12 * 1.5 + 30;

    // Writing Practice
    if (useDottedFont) {
        pdf.setFont('RalewayDots', 'normal');
    } else {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(44);

    const practiceWords = story.writing_words.slice(0, 5);
    practiceWords.forEach((word) => {
        pdf.setDrawColor(230);
        pdf.setLineWidth(0.5);
        pdf.line(marginLeft + 40, currentY + 12, w - marginRight - 40, currentY + 12);

        pdf.setTextColor(180);
        pdf.text(word, w / 2, currentY, { align: 'center' });
        currentY += 65;
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
