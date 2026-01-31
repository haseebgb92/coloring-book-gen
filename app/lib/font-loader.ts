export const RALEWAY_DOTS_URL = 'https://fonts.gstatic.com/s/ralewaydots/v14/6NUR8FifJg6AfQvzpshgwJ8kyf9Fdty2ew.ttf';

export async function loadFontAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
