import {loadImage} from "@/src/graphics/image";
import {CubeMapEntry, CUBEMAPS} from "@/src/graphics/cubemapData";
import {gl} from "@/src/graphics/context";


type CubemapImages = {
    px: HTMLImageElement;
    nx: HTMLImageElement;
    py: HTMLImageElement;
    ny: HTMLImageElement;
    pz: HTMLImageElement;
    nz: HTMLImageElement;
}

export async function loadCubemapImages(entry: CubeMapEntry) :Promise<CubemapImages> {
    const images = await Promise.all([
        loadImage(entry.px),
        loadImage(entry.nx),
        loadImage(entry.py),
        loadImage(entry.ny),
        loadImage(entry.pz),
        loadImage(entry.nz),
    ]);

    return {
        px: images[0],
        nx: images[1],
        py: images[2],
        ny: images[3],
        pz: images[4],
        nz: images[5],
    };
}

 export function createCubeTex(gl: WebGL2RenderingContext, images : CubemapImages): WebGLTexture {
    {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.px);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.nx);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.py);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.ny);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.pz);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.nz);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        return texture;
    }
}


 const CubeMapTextures: Record<string, WebGLTexture> = {};

 async function loadAllCubemaps() {
    for (const key in CUBEMAPS) {
        const entry : CubeMapEntry = CUBEMAPS[key as keyof typeof CUBEMAPS];
        const images = await loadCubemapImages(entry);
        CubeMapTextures[key] = createCubeTex(gl, images);
    }
    console.log(CubeMapTextures);
}

await loadAllCubemaps() ;
export { CubeMapTextures };
