
import { gl } from './context'

class Texture {
    readonly texture: WebGLTexture
    readonly target: number

    constructor(image: HTMLImageElement)
    constructor(target: number)
    constructor(imageOrTarget: HTMLImageElement | number = gl.TEXTURE_2D) {
        const texture = gl.createTexture()
        if (!texture) {
            throw new Error('Failed to create texture')
        }

        this.texture = texture

        if (typeof imageOrTarget === 'number') {
            this.target = imageOrTarget
            return
        }

        this.target = gl.TEXTURE_2D
        this.bind(0)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            imageOrTarget
        )
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }

    bind(unit = 0): void {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(this.target, this.texture)
    }
}

export default Texture