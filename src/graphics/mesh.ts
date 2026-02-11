
import {gl} from "@/src/graphics/context";

 type VertexAttribute = {
    location: number
    size: number
    type: GLenum
    normalized: boolean
    offset: number
}

 class VertexLayout {
    stride: number
    attributes: VertexAttribute[]

    constructor(stride: number, attributes: VertexAttribute[]) {
        this.stride = stride
        this.attributes = attributes
    }
}

export interface ModelData {
    vertices: number[];
    normals: number[];
    indices: number[];
}

 export class Mesh {

    interleavedData: Float32Array = new Float32Array();
    indices: Uint32Array = new Uint32Array();
    vbo: WebGLBuffer;
    ibo: WebGLBuffer;
    layout: VertexLayout;
    vertexCount: number = 0;


    constructor(data: ModelData, gl: WebGL2RenderingContext, layout: VertexLayout) {
        this.indices = new Uint32Array(data.indices);
        this.layout = layout;
        this.vertexCount = data.vertices.length / 3;

        //[px, py, pz, nx, ny, nz, ...] ->data layout
        this.interleavedData = new Float32Array(this.vertexCount * 6);
        for (let i = 0; i < this.vertexCount; i++) {
            // Position
            this.interleavedData[i * 6] = data.vertices[i * 3];
            this.interleavedData[i * 6 + 1] = data.vertices[i * 3 + 1];
            this.interleavedData[i * 6 + 2] = data.vertices[i * 3 + 2];
            // Normal
            this.interleavedData[i * 6 + 3] = data.normals[i * 3];
            this.interleavedData[i * 6 + 4] = data.normals[i * 3 + 1];
            this.interleavedData[i * 6 + 5] = data.normals[i * 3 + 2];
        }

        // Create buffers
        this.vbo = gl.createBuffer() as WebGLBuffer;
        this.ibo = gl.createBuffer() as WebGLBuffer;

        // Upload index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // Upload interleaved vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.interleavedData, gl.STATIC_DRAW);
    }

    bind(gl: WebGL2RenderingContext): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        for (const attr of this.layout.attributes) {
            gl.enableVertexAttribArray(attr.location);
            gl.vertexAttribPointer(
                attr.location,
                attr.size,
                attr.type,
                attr.normalized,
                this.layout.stride,
                attr.offset
            );
        }
    }

    draw(gl: WebGL2RenderingContext): void {
        gl.drawElements(
            gl.TRIANGLES,
            this.indices.length,
            gl.UNSIGNED_INT,
            0
        );
    }

}

 export const VertexLayouts = {
    // Layout: position (3 floats) + normal (3 floats) = 6 floats * 4 bytes = 24 bytes stride
     posNormLayout : new VertexLayout(24, [
        {location: 0, size: 3, type: gl.FLOAT, normalized: false, offset: 0},
        {location: 1, size: 3, type: gl.FLOAT, normalized: false, offset: 12}
    ])
} as const


