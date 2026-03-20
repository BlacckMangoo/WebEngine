import { Vec2 } from './vec2.js'
import { allocVec3, cross, normalize, Vec3 } from './vec3.js'
export type Mat4 = Float32Array & { length: 16 }

function create(): Mat4 {
  return new Float32Array(16) as Mat4
}

export function allocMat4(): Mat4 {
  const out = create()
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}

export function identity(out: Mat4): Mat4 {
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}

// generates the view matrix.
// view matrix is the transformation matrix that transforms world space coordinates into
//camera space coordinates.

// right up and forward must be unit vectors , they must be orthonormal to each other. eye is the position of the camera in world space.

export function lookAt(out: Mat4, eye: Vec3, center: Vec3, up: Vec3): Mat4 {
  const z = allocVec3(
    eye[0] - center[0],
    eye[1] - center[1],
    eye[2] - center[2]
  )
  normalize(z, z)

  const x = allocVec3()
  cross(x, up, z)
  normalize(x, x)

  const y = allocVec3()
  cross(y, z, x)

  out[0] = x[0]
  out[1] = y[0]
  out[2] = z[0]
  out[3] = 0
  out[4] = x[1]
  out[5] = y[1]
  out[6] = z[1]
  out[7] = 0
  out[8] = x[2]
  out[9] = y[2]
  out[10] = z[2]
  out[11] = 0
  out[12] = -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2])
  out[13] = -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2])
  out[14] = -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2])
  out[15] = 1

  return out
}

export function perspective(
  out: Mat4,
  fovy: number,
  aspect: number,
  near: number,
  far: number
): Mat4 {
  const f = 1.0 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)

  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = (far + near) * nf
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[14] = 2 * far * near * nf
  out[15] = 0

  return out
}

export function multiply(out: Mat4, a: Mat4, b: Mat4): Mat4 {
  // matrices in column major order, so a00 is first column, first row, a01 is second column, first row, etc.

  const a00 = a[0],
    a10 = a[1],
    a20 = a[2],
    a30 = a[3]
  const a01 = a[4],
    a11 = a[5],
    a21 = a[6],
    a31 = a[7]
  const a02 = a[8],
    a12 = a[9],
    a22 = a[10],
    a32 = a[11]
  const a03 = a[12],
    a13 = a[13],
    a23 = a[14],
    a33 = a[15]

  const b00 = b[0],
    b10 = b[1],
    b20 = b[2],
    b30 = b[3]
  const b01 = b[4],
    b11 = b[5],
    b21 = b[6],
    b31 = b[7]
  const b02 = b[8],
    b12 = b[9],
    b22 = b[10],
    b32 = b[11]
  const b03 = b[12],
    b13 = b[13],
    b23 = b[14],
    b33 = b[15]

  // Column 0
  out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30
  out[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30
  out[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30
  out[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30

  // Column 1
  out[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31
  out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31
  out[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31
  out[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31

  // Column 2
  out[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32
  out[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32
  out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32
  out[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32

  // Column 3
  out[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33
  out[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33
  out[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33
  out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33

  return out
}

export function Inverse(out: Mat4, a: Mat4): void  {
  const a00 = a[0],
    a10 = a[1],
    a20 = a[2],
    a30 = a[3]
  const a01 = a[4],
    a11 = a[5],
    a21 = a[6],
    a31 = a[7]
  const a02 = a[8],
    a12 = a[9],
    a22 = a[10],
    a32 = a[11]
  const a03 = a[12],
    a13 = a[13],
    a23 = a[14],
    a33 = a[15],
    b00 = a00 * a11 - a01 * a10,
    b01 = a00 * a21 - a01 * a20,
    b02 = a00 * a31 - a01 * a30,
    b03 = a10 * a21 - a11 * a20,
    b04 = a10 * a31 - a11 * a30,
    b05 = a20 * a31 - a21 * a30,
    b06 = a02 * a13 - a03 * a12,
    b07 = a02 * a23 - a03 * a22,
    b08 = a12 * a23 - a13 * a22,
    b09 = a00 * b08 - a01 * b07 + a02 * b06,
    b10 = a10 * b08 - a11 * b07 + a12 * b06,
    b11 = a20 * b08 - a21 * b07 + a22 * b06,
    b12 = a03 * b05 - a02 * b04 + a01 * b03,
    b13 = a13 * b05 - a12 * b04 + a11 * b03,
    b14 = a23 * b05 - a22 * b04 + a21 * b03,
    b15 = a02 * b02 - a03 * b01 + a00 * b00,
    b16 = a12 * b02 - a13 * b01 + a10 * b00,
    b17 = a22 * b02 - a23 * b01 + a20 * b00
  let det = a00 * b00 + a01 * b03 + a02 * b04 + a03 * b05
  if (!det) {
    return null as any
  }
  det = 1.0 / det
  out[0] = b00 * det
  out[1] = (-a10 * b00 + a11 * b03 - a12 * b04) * det
  out[2] = (a20 * b00 - a21 * b03 + a22 * b04) * det
  out[3] = (-a30 * b00 + a31 * b03 - a32 * b04) * det
  out[4] = b01 * det
  out[5] = (-a00 * b01 + a01 * b07 - a03 * b06) * det
  out[6] = (a20 * b01 - a21 * b07 + a23 * b06) * det
  out[7] = (-a30 * b01 + a31 * b07 - a33 * b06) * det
  out[8] = b02 * det
  out[9] = (-a00 * b02 + a01 * b08 - a02 * b06) * det
  out[10] = (a10 * b02 - a11 * b08 + a12 * b06) * det
  out[11] = (-a30 * b02 + a31 * b08 - a32 * b06) * det
  out[12] = b03 * det
  out[13] = (-a00 * b03 + a01 * b05 - a02 * b04) * det
  out[14] = (a10 * b03 - a11 * b05 + a12 * b04) * det
  out[15] = (-a20 * b03 + a21 * b05 - a22 * b04) * det
}