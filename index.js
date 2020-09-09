const jsdom = require("jsdom")
const canvg = require("canvg")
const { Canvas, Image } = require("skia-canvas")

function colorDistance(c1, c2) {
  // Manhattan is a dumb distance metric, but at the moment it's unclear
  // to me which color distance metric makes the most sense for anti-aliased
  // effects on images
  return (
    Math.abs(c1[0] - c2[0]) +
    Math.abs(c1[1] - c2[1]) +
    Math.abs(c1[2] - c2[2]) +
    Math.abs(c1[3] - c2[3])
  )
}

function modifyContextAndRoundColors(ctx, colors, { width, height }) {
  const imData = ctx.getImageData(0, 0, width, height)
  const pixels = imData.data
  for (let i = 0; i < pixels.length; i += 4) {
    const rgba = pixels.slice(i, i + 4)
    let lowestD = Infinity
    let lowestU = 0
    let needsRounding = true
    for (let u = 0; u < colors.length; u++) {
      const d = colorDistance(rgba, colors[u])
      if (d === 0) {
        needsRounding = false
        break
      } else if (d < lowestD) {
        lowestD = d
        lowestU = u
      }
    }
    if (needsRounding) {
      pixels[i] = colors[lowestU][0]
      pixels[i + 1] = colors[lowestU][1]
      pixels[i + 2] = colors[lowestU][2]
      pixels[i + 3] = colors[lowestU][3]
    }
  }
  ctx.clearRect(0, 0, width, height)
  ctx.putImageData(imData, 0, 0)
}

module.exports = async (
  svgText,
  options = {
    output: "pngbuffer",
    allowedColors: null,
  }
) => {
  if (!options.output) options.output = "pngbuffer"

  const w = new jsdom.JSDOM(svgText).window
  const svg = w.document.getElementsByTagName("svg")[0]
  const [width, height] = [
    parseInt(svg.getAttribute("width")),
    parseInt(svg.getAttribute("height")),
  ]

  if (isNaN(width) || isNaN(height)) {
    throw new Error("svg width and height must be provided")
  }

  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext("2d")
  ctx.imageSmoothingEnabled = false

  const svgRenderer = canvg.Canvg.fromString(ctx, svgText, {
    DOMParser: w.DOMParser,
    window: w,
    ignoreMouse: true,
    ignoreAnimation: true,
    ImageClass: Image,
  })

  svgRenderer.render()

  if (options.allowedColors) {
    // Prevent anti-aliasing by interating over each pixel and rounding
    // it to the nearest color
    modifyContextAndRoundColors(ctx, options.allowedColors, { width, height })
  }

  const dataUrl = canvas.toDataURL("image/png")

  const pngInBase64 = dataUrl.slice("data:image/png;base64,".length)

  return Buffer.from(pngInBase64, "base64")
}
