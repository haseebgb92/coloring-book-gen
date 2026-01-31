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
    // If current page count is Odd (meaning last page was a Right page), next added page will be Even (Left).
    // If current page count is Even (last page was Left), next added page will be Odd (Right).
    // We want the Story spread to start on a LEFT page (Even).

    let pageNum = pdf.getNumberOfPages();
    if (pageNum % 2 !== 0) {
        // Current count is Odd (e.g., 1, 3, 5). So the LAST page is a Right-side page.
        // The NEXT page added will be an Even (Left-side) page.
        // Perfect! We don't need to add a blank page.
    } else {
        // Current count is Even (e.g., 2, 4). So the LAST page is a Left-side page.
        // The NEXT page added will be an Odd (Right-side) page.
        // But we want to start on a LEFT page. So we need to add a blank Right page first.
        pdf.addPage();
        updateProgress();
    }

    // Add story spreads
    for (const story of project.stories) {
        // LEFT page: Story + Writing Practice
        pdf.addPage();
        addStoryTextPage(pdf, story, project, dottedFontLoaded);
        updateProgress();

        // RIGHT page: Illustration
        pdf.addPage();
        await addIllustrationPage(pdf, story, project);
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

    // Frame size (smaller than page logic)
    // 85% of standard safe width
    const safeAvailableW = w - (margin.inner + margin.outer) * INCHES_TO_POINTS;
    const safeAvailableH = h - (margin.top + margin.bottom) * INCHES_TO_POINTS;

    const frameW = safeAvailableW * 0.85;
    const frameH = safeAvailableH * 0.85;

    const centerX = w / 2;
    const centerY = h / 2;

    const frameX = centerX - (frameW / 2);
    const frameY = centerY - (frameH / 2);

    // Draw Outline Frame
    pdf.setDrawColor(0); // Black for outline
    pdf.setLineWidth(3); // Thick border
    pdf.rect(frameX, frameY, frameW, frameH);

    // Add Image if available
    if (story.illustration) {
        try {
            // Calculate fit inside the frame (padding 10pts inside frame)
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
            pdf.setFontSize(14);
            pdf.setTextColor(200);
            pdf.text('[Error loading image]', w / 2, h / 2, { align: 'center' });
        }
    } else {
        // Placeholder text inside frame
        pdf.setFontSize(14);
        pdf.setTextColor(200);
        pdf.text('[Illustration Here]', w / 2, h / 2, { align: 'center' });
    }
}

function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState, useDottedFont: boolean) {
    const { width, height } = getPageDimensions(project.config);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    // Use template settings
    const fontFamily = project.template.fontFamily || 'helvetica';
    const fontSize = project.template.fontSize || 12;

    const isEven = pdf.getNumberOfPages() % 2 === 0;
    // Margins in points
    const marginLeft = (isEven ? margin.outer : margin.inner) * INCHES_TO_POINTS;
    const marginRight = (isEven ? margin.inner : margin.outer) * INCHES_TO_POINTS;
    const contentWidth = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFont(fontFamily, 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(0); // Black for title
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text (Preserving formatting)
    pdf.setFont(fontFamily, 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(0); // Black for text

    const paragraphs = story.story_text.split('\n');

    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += fontSize; // Empty line spacing
            return;
        }
        const lines = pdf.splitTextToSize(para, contentWidth);
        pdf.text(lines, marginLeft, currentY, { align: 'left', lineHeightFactor: 1.5 });
        currentY += lines.length * fontSize * 1.5 + fontSize; // Add extra space after para
    });

    currentY += 20; // Extra gap before practice

    // Writing Practice Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(100); // Darker Grey header
    pdf.text("WRITING PRACTICE", w / 2, currentY, { align: 'center' });
    currentY += 30;

    // Writing Practice Words
    if (useDottedFont) {
        pdf.setFont('RalewayDots', 'normal');
    } else {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(28); // Smaller size
    pdf.setTextColor(100); // Darker Grey

    const practiceWords = story.writing_words.slice(0, 5);

    practiceWords.forEach((word) => {
        // Draw guide line
        pdf.setDrawColor(180);
        pdf.setLineWidth(0.5);
        pdf.setLineDash([2, 2], 0);
        pdf.line(marginLeft, currentY + 6, w - marginRight, currentY + 6); // Baseline adjusted
        pdf.setLineDash([], 0);

        // Text repeatedly
        const sectionW = contentWidth / 3;

        // 1st
        pdf.text(word, marginLeft + sectionW * 0.5, currentY, { align: 'center' });
        // 2nd
        pdf.text(word, marginLeft + sectionW * 1.5, currentY, { align: 'center' });
        // 3rd
        pdf.text(word, marginLeft + sectionW * 2.5, currentY, { align: 'center' });

        currentY += 50; // Spacing
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
