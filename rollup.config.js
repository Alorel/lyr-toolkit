import {fastTscPlugin} from '@alorel/rollup-plugin-fast-tsc';
import nodeResolve from '@rollup/plugin-node-resolve';
import {sassPlugin} from '@alorel/rollup-plugin-scss';
import alias from '@rollup/plugin-alias';
import {join, relative} from 'path';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import {makeStyleId, modularCssExporterPlugin, modularCssProcessorPlugin} from '@alorel/rollup-plugin-modular-css';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import replacePlugin from '@rollup/plugin-replace';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import {SystemjsIndexRendererRuntime} from '@alorel/rollup-plugin-index-renderer-systemjs';
import commonjs from '@rollup/plugin-commonjs';

const isProd = process.env.NODE_ENV === 'production';
const distDir = join(__dirname, 'dist');
const srcDir = join(__dirname, 'src');
const regScss = /\.scss$/;

const indexRenderer = new SystemjsIndexRendererRuntime({
  input: join(srcDir, 'index.pug'),
  outputFileName: 'index.html',
  pugOptions: {
    self: true
  }
});

export default function (rollupOptions) {
  const isWatchMode = !!rollupOptions.watch;

  return {
    input: join(srcDir, 'index.tsx'),
    output: {
      assetFileNames: `[name]${isProd ? '.[hash]' : ''}.[ext]`,
      dir: distDir,
      format: 'system',
      entryFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
      chunkFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
      sourcemap: !isProd
    },
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
    plugins: [
      alias({
        entries: [
          {find: /^(preact\/compat|react(-dom)?)$/, replacement: 'preact/compat/dist/compat.module.js'},
          {find: /^@material-ui\/(core|styles|icons)\/(.*)/, replacement: '@material-ui/$1/esm/$2'}
        ]
      }),
      nodeResolve({
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.json', '.node'],
        mainFields: ['fesm5', 'esm5', 'module', 'main', 'browser']
      }),
      cleanPlugin({dir: distDir}),
      sassPlugin({
        include: regScss,
        sassOpts: {sourceMap: false}
      }),
      modularCssProcessorPlugin({
        include: regScss,
        processorConfig: {
          before: [autoprefixer(), cssnano()],
          ...(() => {
            if (!isProd) {
              return {};
            }

            return {namer: (file, selector) => `s${makeStyleId(relative(__dirname, file))}_${makeStyleId(selector)}`};
          })()
        },
        sourceMap: false
      }),
      modularCssExporterPlugin({
        pureLoadStyle: false,
        styleImportName: 'loadStyle',
        include: regScss,
        sourceMap: false
      }),
      fastTscPlugin({
          extraCliArgs: isProd ? [] : ['--sourceMap'],
          watch: isWatchMode
        }),
      commonjs({
        include: [
          /node_modules[\\/](prop-types|object-assign|react-is|hoist-non-react-statics)[\\/]/
        ],
        namedExports: {
          'react-is': [
            'ForwardRef',
            'Memo',
            'isFragment'
          ],
          'prop-types': [
            'elementType'
          ]
        }
      }),
      replacePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      copyPlugin({
        defaultOpts: {
          glob: {
            cwd: srcDir
          },
          emitNameKind: 'fileName'
        },
        copy: [
          'favicon.ico',
          'gooserank.css'
        ]
      }),
      indexRenderer.createPlugin(),
      indexRenderer.createOutputPlugin(),
      ...(() => {
        if (!isProd) {
          return [];
        }

        const systemAsset = /^system\.[a-z0-9]+\.js$/;
        const ecma = 5;
        const ie8 = false;
        const safari10 = true;
        const includeSystemAsset = a => systemAsset.test(a.fileName);

        return [
          require('@alorel/rollup-plugin-iife-wrap').iifeWrapPlugin({
            includeAssets: includeSystemAsset,
            ssrAwareVars: []
          }),
          require('@alorel/rollup-plugin-threaded-terser').threadedTerserPlugin({
            terserOpts: {
              compress: {
                drop_console: true,
                keep_infinity: true,
                typeofs: false,
                ecma
              },
              ecma,
              ie8,
              mangle: {
                safari10
              },
              output: {
                comments: false,
                ie8,
                safari10
              },
              safari10,
              sourceMap: false
            },
            includeAssets: includeSystemAsset
          })
        ]
      })()
    ]
  };
};
