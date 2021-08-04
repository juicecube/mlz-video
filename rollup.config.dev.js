import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

// const testFunc = require('./plugin/rollup-plugin-test');
const pkg = require('./package.json');


function onwarn(warning) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    console.error(`(!) ${warning.message}`);
  }
}

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.ts',
  context: 'window',
  onwarn,
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'RollupDemo',
    globals: {
      'react-dom': 'ReactDOM',
      react: 'React',
      antd: 'antd',
    },
  },
  plugins: [
    // testFunc(),
    nodeResolve({
      extensions: ['.js', '.json', '.jsx'],
    }),
    common({
      include: 'node_modules/**',
    }),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    image(),
    postcss(),
    globals(),
    terser(),
    // serve({
    //   port: 8080,
    //   historyApiFallback: 'index.html',
    // }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
