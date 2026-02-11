export async function loadImage(url: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = url;
    await img.decode();   // waits for load + decode
    return img;
}
