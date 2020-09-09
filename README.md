# SVG Render Mask | Portable SVG Mask Rendering

> This library is in beta, but being used by the Universal Data Tool. Contributions are appreciated!

Render SVGs on node and web. Uses [skia-canvas](https://github.com/samizdatco/skia-canvas) and [canvg](https://github.com/canvg/canvg).

Existing libraries often had problems with serverless platforms, inconsistency across machines, forced anti-aliasing or unnecessary complexity.

## Usage

```
const render = require("svg-render")

render(svgText, { output: "pngbuffer" }).then((pngBuffer) => {
  // fs.writeFile("./myImage.png", pngBuffer)
})


// Want to eliminate anti-aliasing? No problem, provide allowed colors
// and every color will be rounded to the nearest colors
render(svgText, { output: "pngbuffer", allowedColors:[
  [255,255,255,255], // white
  [255,0,0,255], // red
]})
  .then((pngBuffer) => {
    // fs.writeFile("./myImage.png", pngBuffer)
  })

```

## TODO

- [] Font Support
- [] Support allowedColors with string colors
