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
    let activeFont = 'helvetica'; // Fallback

    if (templateFontName && GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS]) {
        try {
            const fontUrl = GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS];
            const fontData = await loadFontAsBase64(fontUrl);
            const base64 = fontData.split(',')[1];
            const filename = `${templateFontName.replace(/\s+/g, '')}.ttf`;

            pdf.addFileToVFS(filename, base64);
            // CRITICAL FIX: Use 'Identity-H' for correct Unicode mapping of custom fonts
            pdf.addFont(filename, templateFontName, 'normal');
            activeFont = templateFontName;
        } catch (e) {
            console.warn(`Failed to load template font ${templateFontName}, falling back to Helvetica`, e);
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
        addFrontMatterPage(pdf, matter, project, activeFont);
        updateProgress();
    }

    // Ensure stories start on LEFT page (even page number)
    let pageNum = pdf.getNumberOfPages();
    // We want the Story spread to start on a LEFT page (Even).
    // Current count | Type | Next Page needs to be
    // 1 (Odd)       | Right| Left (Even) -> OK
    // 2 (Even)      | Left | Right (Odd) -> Need spacer to get to Left

    if (pageNum % 2 === 0) {
        // Last page was Left. Next available is Right.
        // We want to start on Left. So add a blank Right page.
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
        addEndMatterPage(pdf, matter, project, activeFont);
        updateProgress();
    }

    return pdf.output('blob');
}

function addFrontMatterPage(pdf: jsPDF, type: string, project: ProjectState, fontName: string) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;

    pdf.setFont(fontName, 'normal');
    pdf.setFontSize(24);

    let text = type.replace(/-/g, ' ').toUpperCase();
    if (type === 'title-page') {
        text = project.title;
        pdf.setFontSize(32);
    } else if (type === 'this-book-belongs-to') {
        text = "This Book Belongs To:\n\n_________________________";
        pdf.setFontSize(18);
    } else if (type === 'copyright') {
        text = `Copyright © ${new Date().getFullYear()} ${project.title}\nAll Rights Reserved.`;
        pdf.setFontSize(12);
    }

    pdf.text(text, w / 2, h / 2, { align: 'center', lineHeightFactor: 1.5 });
}

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
        // Safety check for text width calculation failure
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
            // Revert font setup
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

function addEndMatterPage(pdf: jsPDF, type: string, project: ProjectState, fontName: string) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;

    try {
        pdf.setFont(fontName, 'normal');
    } catch {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(18);

    if (type === 'certificate') {
        // Draw a fancy border
        const margin = 40;
        pdf.setDrawColor(0);
        pdf.setLineWidth(4);
        pdf.rect(margin, margin, w - margin * 2, h - margin * 2);

        pdf.setFontSize(32);
        pdf.text("CERTIFICATE", w / 2, h / 3, { align: 'center' });
        pdf.setFontSize(16);
        pdf.text("Of Completion", w / 2, h / 3 + 30, { align: 'center' });

        pdf.text("This certifies that", w / 2, h / 2, { align: 'center' });
        pdf.line(w / 4, h / 2 + 40, w * 0.75, h / 2 + 40); // line

        pdf.text("Has completed this coloring book!", w / 2, h * 0.7, { align: 'center' });
    } else {
        pdf.text(type.toUpperCase(), w / 2, h / 2, { align: 'center' });
    }
}
