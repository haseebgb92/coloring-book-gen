import jsPDF from 'jspdf';
import { ProjectState, Story } from '../types';
import { getPageDimensions, INCHES_TO_POINTS } from './kdp-helper';
import { loadFontAsBase64, RALEWAY_DOTS_URL } from './font-loader';
import { GOOGLE_FONTS } from './fonts';

export async function generateColoringBookPDF(
    project: ProjectState,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    // 1. Calculate Dimensions in POINTS
    let { width: widthIn, height: heightIn } = getPageDimensions(project.config);
    if (!widthIn || !heightIn) { widthIn = 8.5; heightIn = 11; }

    const widthPt = widthIn * INCHES_TO_POINTS;
    const heightPt = heightIn * INCHES_TO_POINTS;

    // Bleed Offset: 0.125 inches if bleed is enabled
    const bleedIn = project.config.hasBleed ? 0.125 : 0;
    const bleedPt = bleedIn * INCHES_TO_POINTS;

    const pdf = new jsPDF({
        orientation: widthIn > heightIn ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [widthPt, heightPt],
    });

    // 2. Load Fonts
    try {
        const fontData = await loadFontAsBase64(RALEWAY_DOTS_URL);
        const base64 = fontData.split(',')[1];
        pdf.addFileToVFS('RalewayDots.ttf', base64);
        pdf.addFont('RalewayDots.ttf', 'RalewayDots', 'normal');
    } catch (e) {
        console.warn('Failed to load dotted font', e);
    }

    // Load Template Custom Font
    let activeFont = 'helvetica';
    const templateFontName = project.template.fontFamily; // e.g., 'Fredoka' or 'Comic Neue'

    if (templateFontName && GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS]) {
        try {
            const fontUrl = GOOGLE_FONTS[templateFontName as keyof typeof GOOGLE_FONTS];
            const fontData = await loadFontAsBase64(fontUrl);
            const base64 = fontData.split(',')[1];
            const filename = `${templateFontName.replace(/\s+/g, '')}.ttf`;

            pdf.addFileToVFS(filename, base64);
            pdf.addFont(filename, templateFontName, 'normal');

            // Verify it loaded by setting it temporarily in a try catch
            pdf.setFont(templateFontName, 'normal');
            activeFont = templateFontName;
        } catch (e) {
            console.warn(`Failed to load custom font ${templateFontName}, falling back`, e);
            activeFont = 'helvetica';
        }
    } else if (['Times', 'Courier'].includes(templateFontName)) {
        activeFont = templateFontName.toLowerCase();
    } else if (templateFontName) {
        // Try to use it if it's a standard one or already added
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

    pdf.deletePage(1);

    // Common Props for helpers
    const props = { pdf, project, activeFont, w: widthPt, h: heightPt, bleedPt };

    // Add front matter
    for (const matter of project.frontMatter) {
        pdf.addPage();
        await addFrontMatterPage(matter, props);
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
        addStoryTextPage(story, props);
        updateProgress();

        // RIGHT page: Illustration
        pdf.addPage();
        await addIllustrationPage(story, props);
        updateProgress();
    }

    // Add end matter
    for (const matter of project.endMatter) {
        pdf.addPage();
        await addFrontMatterPage(matter, props);
        updateProgress();
    }

    return pdf.output('blob');
}

interface PageProps {
    pdf: jsPDF;
    project: ProjectState;
    activeFont: string;
    w: number;
    h: number;
    bleedPt: number;
}

async function addFrontMatterPage(type: string, { pdf, project, activeFont, w, h, bleedPt }: PageProps) {
    const customContent = project.customText?.[type];

    try {
        pdf.setFont(activeFont, 'normal');
    } catch {
        pdf.setFont('helvetica', 'normal');
    }
    pdf.setTextColor(0, 0, 0);

    // Effective Top/Bottom Margins including Bleed
    const topM = (project.config.margins.top * INCHES_TO_POINTS) + bleedPt;
    const bottomM = (project.config.margins.bottom * INCHES_TO_POINTS) + bleedPt;
    const availableH = h - topM - bottomM;

    // Center Y reference relative to Safe Area
    const centerY = topM + (availableH / 2);

    if (type === 'title-page') {
        let currentY = centerY;

        if (project.logo) {
            try {
                const imgProps = pdf.getImageProperties(project.logo);
                const imgRatio = imgProps.width / imgProps.height;
                // Max Logo area
                const maxLogoW = w * 0.4;
                const maxLogoH = availableH * 0.4;
                let logoW = maxLogoW;
                let logoH = maxLogoW / imgRatio;
                if (logoH > maxLogoH) {
                    logoH = maxLogoH;
                    logoW = logoH * imgRatio;
                }
                const logoY = centerY - logoH - 40;
                pdf.addImage(project.logo, 'PNG', (w - logoW) / 2, logoY, logoW, logoH);
                currentY = centerY + 40;
            } catch (e) { console.warn("Logo error", e); }
        }

        pdf.setFontSize(32);
        pdf.text(project.title || "Untitled", w / 2, currentY, { align: 'center' });

        pdf.setFontSize(14);
        pdf.text(customContent || "A Story-Based Coloring Book", w / 2, currentY + 40, { align: 'center' });

    } else if (type === 'this-book-belongs-to') {
        pdf.setFontSize(18);
        if (customContent) {
            const lines = pdf.splitTextToSize(customContent, w * 0.7);
            pdf.text(lines, w / 2, h / 3, { align: 'center' });
        } else {
            pdf.text("This Book Belongs To:", w / 2, h / 3, { align: 'center' });
            pdf.setLineWidth(1);
            pdf.line(w * 0.2, h / 2, w * 0.8, h / 2);
        }
    } else if (type === 'copyright') {
        pdf.setFontSize(12);
        const text = customContent || `Copyright © ${new Date().getFullYear()} ${project.title}\nAll Rights Reserved.`;
        const lines = pdf.splitTextToSize(text, w * 0.7); // Smaller width constraints
        pdf.text(lines, w / 2, centerY, { align: 'center' });

    } else if (type === 'color-test') {
        pdf.setFontSize(24);
        // Top 15% relative to bleed is weird. Use absolute from Top Margin.
        const titleY = topM + 60;
        pdf.text("Test Your Colors", w / 2, titleY, { align: 'center' });

        if (customContent) {
            pdf.setFontSize(12);
            const lines = pdf.splitTextToSize(customContent, w * 0.8);
            pdf.text(lines, w / 2, titleY + 40, { align: 'center' });
        }

        const boxSize = 80;
        const gap = 40;
        const startX = (w - (boxSize * 3 + gap * 2)) / 2;
        const boxesY = centerY - (boxSize / 2); // Vertically Center boxes

        const labels = ["Crayons", "Pencils", "Markers"];
        labels.forEach((label, i) => {
            const x = startX + i * (boxSize + gap);
            pdf.setDrawColor(0);
            pdf.setLineWidth(2);
            pdf.rect(x, boxesY, boxSize, boxSize);
            pdf.setFontSize(14);
            pdf.text(label, x + boxSize / 2, boxesY + boxSize + 25, { align: 'center' });
        });

        if (!customContent) {
            pdf.setFontSize(11);
            pdf.setTextColor(80, 80, 80);
            const tips = "GUIDANCE: Test your crayons, markers, and pencils here. Use the one that doesn't seep through! If using markers, verify bleed-through before starting.";
            const tipsLines = pdf.splitTextToSize(tips, w * 0.7);
            pdf.text(tipsLines, w / 2, h - bottomM - 40, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
        }

    } else if (type === 'certificate') {
        const frameMargin = topM; // Use top margin as frame inset
        pdf.setDrawColor(0);
        pdf.setLineWidth(4);
        pdf.rect(frameMargin, frameMargin, w - frameMargin * 2, h - frameMargin * 2);

        if (customContent) {
            pdf.setFontSize(16);
            const lines = pdf.splitTextToSize(customContent, w - frameMargin * 4);
            pdf.text(lines, w / 2, centerY, { align: 'center' });
        } else {
            pdf.setFontSize(32);
            pdf.text("CERTIFICATE", w / 2, topM + 100, { align: 'center' });
            pdf.setFontSize(16);
            pdf.text("Of Completion", w / 2, topM + 140, { align: 'center' });
            pdf.text("This certifies that", w / 2, centerY, { align: 'center' });
            pdf.line(w / 4, centerY + 40, w * 0.75, centerY + 40);
            pdf.text("Has completed this coloring book!", w / 2, h - bottomM - 100, { align: 'center' });
        }
    } else {
        pdf.setFontSize(18);
        pdf.text(customContent || type.toUpperCase(), w / 2, centerY, { align: 'center' });
    }
}

async function addIllustrationPage(story: Story, { pdf, project, w, h, bleedPt }: PageProps) {
    const margin = project.config.margins;

    const topM = (margin.top * INCHES_TO_POINTS) + bleedPt;
    const bottomM = (margin.bottom * INCHES_TO_POINTS) + bleedPt;
    // Illustration is Recto (Right page).
    // Inner margin is Left. Outer margin is Right.
    const innerM = (margin.inner * INCHES_TO_POINTS) + bleedPt;
    const outerM = (margin.outer * INCHES_TO_POINTS) + bleedPt;

    const safeAvailableW = w - innerM - outerM;
    const safeAvailableH = h - topM - bottomM;

    // Frame size: 85% of safe area
    const frameW = safeAvailableW * 0.85;
    const frameH = safeAvailableH * 0.85;

    // Frame is centered in the Safe Area
    // Safe Area starts at (innerM, topM)
    const safeX = innerM;
    const safeY = topM;

    const centerX = safeX + (safeAvailableW / 2);
    const centerY = safeY + (safeAvailableH / 2);

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

            pdf.addImage(story.illustration, 'PNG', imgX, imgY, finalW, finalH);
        } catch (e) {
            console.error("Failed to add image to PDF", e);
        }
    }
}

function addStoryTextPage(story: Story, { pdf, project, activeFont, w, h, bleedPt }: PageProps) {
    const margin = project.config.margins;
    const fontSize = project.template.fontSize && project.template.fontSize > 0 ? project.template.fontSize : 12;

    // Story is Verso (Left Page).
    // Inner margin is Right. Outer margin is Left.
    const innerM = (margin.inner * INCHES_TO_POINTS) + bleedPt;
    const outerM = (margin.outer * INCHES_TO_POINTS) + bleedPt;

    const topM = (margin.top * INCHES_TO_POINTS) + bleedPt;

    const marginLeft = outerM; // Outer is Left on Verso
    const marginRight = innerM; // Inner is Right on Verso
    const contentWidth = w - marginLeft - marginRight;

    let currentY = topM + 50;

    // Title
    try { pdf.setFont(activeFont, 'normal'); } catch { pdf.setFont('helvetica', 'normal'); }
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    if (story.title) {
        pdf.text(story.title, w / 2, currentY, { align: 'center' });
    }
    currentY += 50;

    // Story Text
    pdf.setFontSize(fontSize);

    const paragraphs = story.story_text ? story.story_text.split('\n') : [];
    paragraphs.forEach(para => {
        if (!para.trim()) {
            currentY += fontSize;
            return;
        }
        const lines = pdf.splitTextToSize(para, contentWidth);
        // Use active font, fallback handled at function start or by jspdf
        pdf.text(lines, marginLeft, currentY, { align: 'left' });
        currentY += lines.length * fontSize * 1.5 + fontSize;
    });

    currentY += 30;

    // Writing Practice
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("WRITING PRACTICE", w / 2, currentY, { align: 'center' });
    currentY += 35;

    // Words
    try { pdf.setFont('RalewayDots', 'normal'); } catch { pdf.setFont('courier', 'normal'); }
    pdf.setFontSize(28);
    pdf.setTextColor(100, 100, 100);

    const practiceWords = story.writing_words ? story.writing_words.slice(0, 5) : [];
    practiceWords.forEach((word) => {
        pdf.setDrawColor(180);
        pdf.setLineWidth(0.5);
        pdf.setLineDash([2, 2], 0);
        pdf.line(marginLeft, currentY + 6, w - marginRight, currentY + 6);
        pdf.setLineDash([], 0);

        const sectionW = contentWidth / 3;
        pdf.text(word, marginLeft + sectionW * 0.5, currentY, { align: 'center' });
        pdf.text(word, marginLeft + sectionW * 1.5, currentY, { align: 'center' });
        pdf.text(word, marginLeft + sectionW * 2.5, currentY, { align: 'center' });

        currentY += 50;
    });
}
