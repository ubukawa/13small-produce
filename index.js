const config = require('config')
const Parser = require('json-text-sequence').parser
const { spawn } = require('child_process')

const minzoom = config.get('minzoom')
const maxzoom = config.get('maxzoom')
const projection = config.get('projection')
const srcs = config.get('srcs')
const ogr2ogrPath = config.get('ogr2ogrPath')
const tippecanoePath = config.get('tippecanoePath')
const dstDir = config.get('dstDir')
const pgPath = config.get('pgPath')

const tippecanoe = spawn(tippecanoePath, [
  `--output-to-directory=${dstDir}`,
  `--no-tile-compression`,
  '--force',
  `--minimum-zoom=${minzoom}`,
  `--maximum-zoom=${maxzoom}`,
  `--projection=EPSG:${projection}`
], { stdio: ['pipe', 'inherit', 'inherit'] })
const downstream = tippecanoe.stdin

const preprocessProperties = (f) => {
 if (f.properties['element']) {
  delete f.properties['element']
    }
  return f
}

let nOpenFiles = 0
for (const src of srcs) {
  nOpenFiles++
  const parser = new Parser()
    .on('data', f => {
      f = preprocessProperties(f)
      f.tippecanoe = {
        layer: src.layer,
        projection: src.projection,
        minzoom: src.minzoom,
        maxzoom: src.maxzoom,
        projection: src.projection
      }
      downstream.write(`\x1e${JSON.stringify(f)}\n`)
    })
    .on('finish', () => {
      nOpenFiles--
      if (nOpenFiles === 0) {
        downstream.end()
      }
    })
  const ogr2ogr = spawn(ogr2ogrPath, [
    '-f', 'GeoJSONSeq',
    '-lco', 'RS=YES',
    '/vsistdout/',
    `"${pgPath}"`,
    src.sql
  ])
  ogr2ogr.stdout.pipe(parser)
}
