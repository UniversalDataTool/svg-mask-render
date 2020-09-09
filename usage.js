const render = require("./")
const fs = require("fs")

render(
  `<svg width="400" height="400" shape-rendering="crispEdges">

    <g style="opacity: 1">
    <polygon points="377.65431676538424 205.3624637222935, 333.2707896086034 227.26704387521238, 326.1535600792077 276.2471741157318, 291.6058022263174 240.80481891901266, 242.82358531463566 249.17162402813128, 265.85542388322915 205.3624637222935, 242.8235853146356 161.55330341645572, 291.6058022263174 169.92010852557436, 326.15356007920764 134.47775332885521, 333.2707896086034 183.45788356937462"
            fill="#0f0" shape-rendering="crispEdges" stroke="" />
    </g>
  </svg>`,
  {
    output: "pngbuffer",
    allowedColors: [
      [0, 0, 0, 0], // transparent black
      [0, 255, 0, 255], // green
    ],
  }
).then((pngBuffer) => {
  fs.writeFileSync("usage.output.png", pngBuffer)
})
