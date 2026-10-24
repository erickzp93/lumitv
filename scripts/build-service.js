'use strict';
const result = require('esbuild').buildSync({
  entryPoints: ['src/service.js'],
  outfile: 'dist/service.js',
  bundle: true,
  platform: 'node',
  target: 'esnext',
  write: false,
  external: ['bufferutil', 'utf-8-validate'],
  banner: {js: '// LuminaTV 1.1.0 — TizenBrew playback service (includes ws, MIT license).'},
  legalComments: 'eof'
});
const output = require('@babel/core').transformSync(result.outputFiles[0].text, {
  presets: [[require('@babel/preset-env'), {targets:{node:'4.4'}, modules:false}]],
  babelrc: false,
  configFile: false,
  comments: true
});
require('fs').writeFileSync('dist/service.js', output.code + '\n');
