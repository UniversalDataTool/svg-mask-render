# SVG Render Mask | Portable SVG Mask Rendering

> This library is in beta, but being used by the Universal Data Tool. Contributions are appreciated!

Render SVGs on node and web. Uses [node-pureimage](https://github.com/joshmarinacci/node-pureimage) and [canvg](https://github.com/canvg/canvg).

Existing libraries often had problems with serverless platforms, inconsistency across machines, forced anti-aliasing or unnecessary complexity.

## Usage

```
const render = require("svg-render")

render(svgText, { output: "pngbuffer" }).then((pngBuffer) => {
  // fs.writeFile("./myImage.png", pngBuffer)
})
```

## TODO

- [] Font Support
