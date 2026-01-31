export async function loadFontAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove data:application/font-ttf;base64, or similar
            resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Common Google Font URLs for dotted styles
export const DOTTED_FONT_URL = "https://fonts.gstatic.com/s/ralewaydots/v15/6Y_V4AL00L-nI6EzhYp0yC8S-vQ.ttf";
