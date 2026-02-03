import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// Note: In a client-side Next.js app, we normally need to set the worker path.
// For simplicity, we can use the cdn version if we don't want to mess with local worker setup.
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

/**
 * Flattens a PDF by converting each page into a high-resolution image.
 * This ensures no transparency issues and "locks" the content for printing.
 */
export async function flattenPDF(pdfBlob: Blob): Promise<Blob> {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;

    const outPdf = await PDFDocument.create();

    // We target 300 DPI. Standard PDF is 72 DPI.
    // Scale factor = 300 / 72 = 4.166...
    const SCALE_FACTOR = 4.1666666667;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: SCALE_FACTOR });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Failed to get canvas context');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Convert canvas to a high-quality JPEG
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const img = await outPdf.embedJpg(imgData);

        // Create matching page in output PDF
        const outPage = outPdf.addPage([viewport.width / SCALE_FACTOR, viewport.height / SCALE_FACTOR]);

        outPage.drawImage(img, {
            x: 0,
            y: 0,
            width: outPage.getWidth(),
            height: outPage.getHeight(),
        });
    }

    const pdfBytes = await outPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
