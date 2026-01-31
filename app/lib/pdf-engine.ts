import { jsPDF } from "jspdf";
import { ProjectState, Story, TrimSize } from "../types";
import { getPageDimensions, INCHES_TO_POINTS } from "./kdp-helper";
import { loadFontAsBase64, DOTTED_FONT_URL } from "./font-loader";

export async function generateColoringBookPDF(project: ProjectState, onProgress?: (p: number) => void) {
    const { config, stories, template, frontMatter, endMatter } = project;
    const { width, height } = getPageDimensions(config.trimSize, config.hasBleed);

    // Initialize PDF in points (1 inch = 72 points)
    const pdf = new jsPDF({
        unit: "pt",
        format: [width * INCHES_TO_POINTS, height * INCHES_TO_POINTS],
        orientation: "portrait"
    });

    // Load Custom Fonts
    try {
        const fontBase64 = await loadFontAsBase64(DOTTED_FONT_URL);
        pdf.addFileToVFS("RalewayDots.ttf", fontBase64);
        pdf.addFont("RalewayDots.ttf", "RalewayDots", "normal");
    } catch (e) {
        console.warn("Failed to load dotted font, falling back to standard font", e);
    }

    const totalSteps = frontMatter.length + (stories.length * 2) + endMatter.length + 5;
    let currentStep = 0;

    const updateProgress = () => {
        currentStep++;
        onProgress?.(Math.round((currentStep / totalSteps) * 100));
    };

    // 1. Add Front Matter
    for (let i = 0; i < frontMatter.length; i++) {
        if (i > 0) pdf.addPage();
        addFormattedPage(pdf, frontMatter[i], project, pdf.getNumberOfPages());
        updateProgress();
    }

    // 2. Pagination Check for Story Start
    // FM ends at pdf.getNumberOfPages()
    // Story spread must be (Even: Image, Odd: Story)
    let currentPage = pdf.getNumberOfPages();
    if (currentPage % 2 !== 0) {
        // Ends on Right page. Instruction: "Automatically insert a blank left page"
        pdf.addPage(); // Page (Even, Left) - Blank
        updateProgress();
        pdf.addPage(); // Page (Odd, Right) - Blank (to keep spread alignment)
        updateProgress();
    }

    // 3. Add Stories
    for (const story of stories) {
        // Image Page (LEFT / EVEN)
        pdf.addPage();
        await addImagePage(pdf, story, project);
        updateProgress();

        // Story Page (RIGHT / ODD)
        pdf.addPage();
        await addStoryTextPage(pdf, story, project);
        updateProgress();
    }

    // 4. Add End Matter
    for (const pageId of endMatter) {
        pdf.addPage();
        addFormattedPage(pdf, pageId, project, pdf.getNumberOfPages());
        updateProgress();
    }

    // 5. Final Polish (Page numbers, borders)
    applyGlobalStyles(pdf, project);
    updateProgress();

    return pdf.output("blob");
}

function addFormattedPage(pdf: jsPDF, pageId: string, project: ProjectState, pageNum: number) {
    const { width, height } = getPageDimensions(project.config.trimSize, project.config.hasBleed);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    // Simple centering for now
    pdf.setFontSize(24);
    pdf.text(pageId.replace('-', ' ').toUpperCase(), w / 2, h / 3, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text("This is a placeholder for " + pageId, w / 2, h / 2, { align: 'center' });
}

async function addImagePage(pdf: jsPDF, story: Story, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config.trimSize, project.config.hasBleed);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;
    const safeZone = margin.safeZone * INCHES_TO_POINTS;

    // Calculate content area (respecting mirrored margins)
    const isEven = pdf.getNumberOfPages() % 2 === 0;
    const innerMargin = margin.inner * INCHES_TO_POINTS;
    const outerMargin = margin.outer * INCHES_TO_POINTS;

    const marginLeft = isEven ? outerMargin : innerMargin;
    const marginRight = isEven ? innerMargin : outerMargin;

    const contentW = w - marginLeft - marginRight;
    const contentH = h - (margin.top + margin.bottom) * INCHES_TO_POINTS;

    if (story.image_path) {
        try {
            // In a real app, we'd fetch the image data
            // For now, let's draw a box
            pdf.setDrawColor(200);
            pdf.rect(marginLeft, margin.top * INCHES_TO_POINTS, contentW, contentH);
            pdf.text("[Image: " + story.title + "]", w / 2, h / 2, { align: 'center' });
        } catch (e) {
            console.error("Failed to add image", e);
        }
    } else {
        pdf.text("Missing Image for " + story.title, w / 2, h / 2, { align: 'center' });
    }
}

async function addStoryTextPage(pdf: jsPDF, story: Story, project: ProjectState) {
    const { width, height } = getPageDimensions(project.config.trimSize, project.config.hasBleed);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    const isEven = pdf.getNumberOfPages() % 2 === 0;
    const innerMargin = margin.inner * INCHES_TO_POINTS;
    const outerMargin = margin.outer * INCHES_TO_POINTS;

    const marginLeft = isEven ? outerMargin : innerMargin;
    const marginRight = isEven ? innerMargin : outerMargin;
    const contentW = w - marginLeft - marginRight;

    let currentY = margin.top * INCHES_TO_POINTS + 40;

    // Title
    pdf.setFontSize(22);
    pdf.text(story.title, w / 2, currentY, { align: 'center' });
    currentY += 40;

    // Story Text
    pdf.setFontSize(14);
    const lines = pdf.splitTextToSize(story.story_text, contentW - 40);
    pdf.text(lines, w / 2, currentY, { align: 'center' });
    currentY += (lines.length * 20) + 40;

    // Writing Words (DOTTED)
    pdf.setFont("RalewayDots", "normal");
    pdf.setFontSize(42); // Large for tracing

    story.writing_words.forEach(word => {
        pdf.setDrawColor(240);
        pdf.setLineWidth(0.5);
        pdf.line(marginLeft + 40, currentY + 10, w - marginRight - 40, currentY + 10);
        pdf.text(word, w / 2, currentY, { align: 'center' });
        currentY += 60;
    });

    pdf.setFont("helvetica", "normal");

    // Lesson
    if (story.lesson) {
        currentY += 20;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.text("Moral: " + story.lesson, w / 2, h - (margin.bottom * INCHES_TO_POINTS) - 20, { align: 'center' });
    }
}

function applyGlobalStyles(pdf: jsPDF, project: ProjectState) {
    const pageCount = pdf.getNumberOfPages();
    const { width, height } = getPageDimensions(project.config.trimSize, project.config.hasBleed);
    const w = width * INCHES_TO_POINTS;
    const h = height * INCHES_TO_POINTS;
    const margin = project.config.margins;

    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);

        // Borders
        if (project.template.hasBorder) {
            const isEven = i % 2 === 0;
            const marginLeft = isEven ? margin.outer * INCHES_TO_POINTS : margin.inner * INCHES_TO_POINTS;
            const marginRight = isEven ? margin.inner * INCHES_TO_POINTS : margin.outer * INCHES_TO_POINTS;

            pdf.setDrawColor(0);
            pdf.setLineWidth(1);
            pdf.rect(marginLeft - 5, margin.top * INCHES_TO_POINTS - 5, w - marginLeft - marginRight + 10, h - (margin.top + margin.bottom) * INCHES_TO_POINTS + 10);
        }

        // Page Numbers
        if (project.template.pageNumbers) {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(i.toString(), w / 2, h - 20, { align: 'center' });
        }
    }
}
