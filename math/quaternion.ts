import { Mat4 } from './mat4'
import { allocVec3, normalize, Vec3 } from './vec3'

//Quaternion -> Vec3(x,y,z)(Imaginiary) + number(w)(scalar part)

export interface Quaternion {
  imaginary: Vec3
  scalar: number
}

export function allocQuaternion(
  x: number = 0,
  y: number = 0,
  z: number = 0,
  w: number = 1
): Quaternion {
  return {
    imaginary: allocVec3(x, y, z),
    scalar: w,
  }
}


export function setQuaternion(
  out: Quaternion,
  q: Quaternion
): void {
  out.imaginary[0] = q.imaginary[0] 
  out.imaginary[1] = q.imaginary[1]
  out.imaginary[2] = q.imaginary[2]
  out.scalar = q.scalar
}


// UNIT Quaternions can be used to represent rotations in 3D space.
// To rotate a vector v by a quaternion q, you can use the formula:
// v' = q * v * q^-1
// where v is treated as a quaternion with a scalar part of 0, and q^-1 is the inverse of q.

// To create a quaternion representing a rotation around an axis by a certain angle
export function quaternionFromAxisAngle(axis: Vec3, angle: number): Quaternion {
  //axis must be normalised ( be a unit vector) for the rotation to be correct

  const len = Math.hypot(axis[0], axis[1], axis[2])

  const nx = axis[0] / len
  const ny = axis[1] / len
  const nz = axis[2] / len

  const half = angle / 2
  const s = Math.sin(half)

  return {
    imaginary: allocVec3(nx * s, ny * s, nz * s),
    scalar: Math.cos(half),
  }
}

// To rotate a vector v by a quaternion q
// v' = q * v * q^-1
//this function is just for kind of like documentation dont ever use this its slow
//but conceptually its easier to understand than the optimized version below
function rotateVec3ByQuaternionslowDONTUSETHISBRO(
  out: Vec3,
  v: Vec3,
  q: Quaternion
) {
  // v -> quaternion
  const vq: Quaternion = {
    imaginary: allocVec3(v[0], v[1], v[2]),
    scalar: 0,
  }

  const qInv = inverse(q)

  const temp = allocQuaternion()
  const result = allocQuaternion()

  //  q * v
  multiplyQuaternions(temp, q, vq)

  //  temp * q^-1
  multiplyQuaternions(result, temp, qInv)

  out[0] = result.imaginary[0]
  out[1] = result.imaginary[1]
  out[2] = result.imaginary[2]
}

//faster version of the above function that doesnt create any temporary quaternions
// and directly applies the formula for rotating a vector by a quaternion

export function rotateVec3ByQuaternion(out: Vec3, v: Vec3, q: Quaternion) {
  const x = q.imaginary[0],
    y = q.imaginary[1],
    z = q.imaginary[2],
    w = q.scalar
  const vx = v[0],
    vy = v[1],
    vz = v[2]

  // t = 2 * cross(q.xyz, v)
  const tx = 2 * (y * vz - z * vy)
  const ty = 2 * (z * vx - x * vz)
  const tz = 2 * (x * vy - y * vx)

  // v' = v + w * t + cross(q.xyz, t)
  out[0] = vx + w * tx + (y * tz - z * ty)
  out[1] = vy + w * ty + (z * tx - x * tz)
  out[2] = vz + w * tz + (x * ty - y * tx)
}


export function RotateVec3AxisAngle(out: Vec3, v: Vec3, axis: Vec3, angle: number): void {
  const q = quaternionFromAxisAngle(axis, angle)
  rotateVec3ByQuaternion(out, v, q)
}


export function normalizeQuaternion(out: Quaternion, q: Quaternion): void {
  const length = norm(q)
  if (length <= 1e-8) {
    out.imaginary[0] = 0
    out.imaginary[1] = 0
    out.imaginary[2] = 0
    out.scalar = 1
    return
  }

  const inv = 1 / length
  out.imaginary[0] = q.imaginary[0] * inv
  out.imaginary[1] = q.imaginary[1] * inv
  out.imaginary[2] = q.imaginary[2] * inv
  out.scalar = q.scalar * inv
}

export function composeQuaternion(
  out: Quaternion,
  lhs: Quaternion,
  rhs: Quaternion
): void {
  multiplyQuaternions(out, lhs, rhs)
  normalizeQuaternion(out, out)
}

export function rotateQuaternionAroundAxis(
  out: Quaternion,
  q: Quaternion,
  axis: Vec3,
  angle: number
): void {
  const unitAxis = allocVec3()
  normalize(unitAxis, axis)
  const delta = quaternionFromAxisAngle(unitAxis, angle)
  composeQuaternion(out, delta, q)
}

export function slerp(
  out: Quaternion,
  from: Quaternion,
  to: Quaternion,
  t: number
): void {
  const clampedT = Math.max(0, Math.min(1, t))
  const ax = from.imaginary[0]
  const ay = from.imaginary[1]
  const az = from.imaginary[2]
  const aw = from.scalar

  let bx = to.imaginary[0]
  let by = to.imaginary[1]
  let bz = to.imaginary[2]
  let bw = to.scalar

  let cosTheta = ax * bx + ay * by + az * bz + aw * bw

  if (cosTheta < 0) {
    cosTheta = -cosTheta
    bx = -bx
    by = -by
    bz = -bz
    bw = -bw
  }

  if (cosTheta > 0.9995) {
    out.imaginary[0] = ax + clampedT * (bx - ax)
    out.imaginary[1] = ay + clampedT * (by - ay)
    out.imaginary[2] = az + clampedT * (bz - az)
    out.scalar = aw + clampedT * (bw - aw)
    normalizeQuaternion(out, out)
    return
  }

  const theta = Math.acos(cosTheta)
  const sinTheta = Math.sin(theta)
  const scaleA = Math.sin((1 - clampedT) * theta) / sinTheta
  const scaleB = Math.sin(clampedT * theta) / sinTheta

  out.imaginary[0] = scaleA * ax + scaleB * bx
  out.imaginary[1] = scaleA * ay + scaleB * by
  out.imaginary[2] = scaleA * az + scaleB * bz
  out.scalar = scaleA * aw + scaleB * bw
  normalizeQuaternion(out, out)
}


export function multiplyQuaternions(
  res: Quaternion,
  q1: Quaternion,
  q2: Quaternion
): void {
  const w1 = q1.scalar
  const x1 = q1.imaginary[0]
  const y1 = q1.imaginary[1]
  const z1 = q1.imaginary[2]

  const w2 = q2.scalar
  const x2 = q2.imaginary[0]
  const y2 = q2.imaginary[1]
  const z2 = q2.imaginary[2]

  const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
  const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
  const y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2
  const z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2

  res.imaginary[0] = x
  res.imaginary[1] = y
  res.imaginary[2] = z
  res.scalar = w
}

export function addQuaternions(
  res: Quaternion,
  q1: Quaternion,
  q2: Quaternion
): void {
  res.imaginary[0] = q1.imaginary[0] + q2.imaginary[0]
  res.imaginary[1] = q1.imaginary[1] + q2.imaginary[1]
  res.imaginary[2] = q1.imaginary[2] + q2.imaginary[2]
  res.scalar = q1.scalar + q2.scalar
}

export function norm(q: Quaternion): number {
  const x = q.imaginary[0]
  const y = q.imaginary[1]
  const z = q.imaginary[2]
  const w = q.scalar
  return Math.sqrt(x * x + y * y + z * z + w * w)
}

export function conjugate(q: Quaternion): Quaternion {
  return {
    imaginary: allocVec3(-q.imaginary[0], -q.imaginary[1], -q.imaginary[2]),
    scalar: q.scalar,
  }
}

export function inverse(q: Quaternion): Quaternion {
  const conjugateQ = conjugate(q)
  const normQ = norm(q)
  const invNormQ = 1 / (normQ * normQ)
  return {
    imaginary: allocVec3(
      conjugateQ.imaginary[0] * invNormQ,
      conjugateQ.imaginary[1] * invNormQ,
      conjugateQ.imaginary[2] * invNormQ
    ),
    scalar: conjugateQ.scalar * invNormQ,
  }
}


// actual stuff useful in the engine 

//Get Euler Angles from a quaternion
export function getEulerAngles(q: Quaternion): Vec3 {
  const x = q.imaginary[0]
  const y = q.imaginary[1]
  const z = q.imaginary[2]
  const w = q.scalar
  const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y))
  const pitch = Math.asin(2 * (w * y - z * x))
  const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z))
  return allocVec3(roll, pitch, yaw)
}

// get Rotation Matrix from a quaternion

export function getRotationMatrix(out: Mat4, q: Quaternion): void{
  const x = q.imaginary[0]
  const y = q.imaginary[1]
  const z = q.imaginary[2]
  const w = q.scalar
  const xx = x * x
  const yy = y * y
  const zz = z * z
  const xy = x * y
  const xz = x * z
  const yz = y * z
  const wx = w * x
  const wy = w * y
  const wz = w * z

  out[0] = 1 - 2 * (yy + zz)
  out[1] = 2 * (xy + wz)
  out[2] = 2 * (xz - wy)
  out[3] = 0

  out[4] = 2 * (xy - wz)
  out[5] = 1 - 2 * (xx + zz)
  out[6] = 2 * (yz + wx)
  out[7] = 0

  out[8] = 2 * (xz + wy)
  out[9] = 2 * (yz - wx)
  out[10] = 1 - 2 * (xx + yy)
  out[11] = 0

  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
}