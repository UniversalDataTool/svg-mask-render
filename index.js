const jsdom = require("jsdom")
const canvg = require("canvg")
const stream = require("stream")
const PImage = require("pureimage")
const streams = require("memory-streams")

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

  w.createCanvas = PImage.make

  const canvas = PImage.make(width, height)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  ctx.imageSmoothingEnabled = false
  ctx.canvas = canvas

  const svgRenderer = canvg.Canvg.fromString(ctx, svgText, {
    DOMParser: w.DOMParser,
    window: w,
    ignoreMouse: true,
    ignoreAnimation: true,
    canvas: canvas,
    createCanvas: PImage.make,
  })

  svgRenderer.render()

  const outputStream = new streams.WritableStream()

  await PImage.encodePNGToStream(canvas, outputStream)

  return outputStream.toBuffer()
}
