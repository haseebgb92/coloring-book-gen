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

    // 2. Load Template Font (if strictly needed)
    const templateFontName = project.template.fontFamily;
    let activeFont = 'helvetica'; // Fallback

    if (templateFontName && GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS]) {
        try {
            const fontUrl = GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS];
            const fontData = await loadFontAsBase64(fontUrl);
            const base64 = fontData.split(',')[1];
            const filename = `${templateFontName.replace(/\s+/g, '')}.ttf`;

            pdf.addFileToVFS(filename, base64);
            pdf.addFont(filename, templateFontName, 'normal');
            pdf.addFont(filename, templateFontName, 'bold'); // Re-use normal for bold if single weight, or just use normal
            activeFont = templateFontName;
            console.log(`Loaded custom font: ${templateFontName}`);
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
        addFrontMatterPage(pdf, matter, project, activeFont); // Use active font here too if desired
        updateProgress();
    }

    // Ensure stories start on LEFT page (even page number)
    // Left page = Verso. Right page = Recto.
    // We want spread: Left = Story, Right = Illustration.
    // Standard book: Page 1 (R), Page 2 (L), Page 3 (R).
    // Ideally, Page 2 starts the story.

    // Logic:
    // If we are at an ODD page count (last page was Right), next is Left. Perfect.
    // If we are at an EVEN page count (last page was Left), next is Right. We need to skip one to start on Left.
    let pageNum = pdf.getNumberOfPages();
    if (pageNum % 2 === 0) {
        // Last page was Left. Next is Right. Add blank.
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

    pdf.setFont(fontName, 'bold');
    pdf.setFontSize(24);
    pdf.text(type === 'title-page' ? project.title : type.toUpperCase(), w / 2, h / 2, { align: 'center' });
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

    // Verify Margin Logic for LEFT PAGE (Even):
    // Even Page (Verso/Left):
    // Inner Binding Edge is Right side. Outer Edge is Left Side.
    // Left Margin should be Outer. Right Margin should be Inner.
    const marginLeft = (isEven ? margin.outer : margin.inner) * INCHES_TO_POINTS;
    const marginRight = (isEven ? margin.inner : margin.outer) * INCHES_TO_POINTS;
    const contentWidth = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFont(fontName);
    // Attempt to set bold if possible, but for custom fonts embedded as 'normal' we might just use normal
    // pdf.setFont(fontName, 'bold'); 
    pdf.setFontSize(24);
    pdf.setTextColor(0);
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text
    pdf.setFont(fontName, 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0);

    const paragraphs = story.story_text.split('\n');
    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += fontSize;
            return;
        }
        const lines = pdf.splitTextToSize(para, contentWidth);
        pdf.text(lines, marginLeft, currentY, { align: 'left', lineHeightFactor: 1.5 });
        currentY += lines.length * fontSize * 1.5 + fontSize;
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

    pdf.setFont(fontName, 'normal');
    pdf.setFontSize(18);
    pdf.text(type.toUpperCase(), w / 2, h / 2, { align: 'center' });
}
