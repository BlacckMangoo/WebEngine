export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    let settled = false

    const finish = (cb: () => void) => {
      if (settled) return
      settled = true
      cb()
    }

    img.onload = () => finish(() => resolve(img))
    img.onerror = () => finish(() => reject(new Error(`Failed to load image: ${url}`)))
    img.src = url

    // decode gives earlier decode failure signals in some browsers, but
    // onload remains the fallback for environments where decode is unreliable.
    if (typeof img.decode === 'function') {
      void img.decode().then(
        () => finish(() => resolve(img)),
        () => {
          // Intentionally ignore decode rejection and rely on onload/onerror.
        }
      )
    }
  })
}
