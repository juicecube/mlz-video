import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import common from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import globals from 'rollup-plugin-node-globals';

const pkg = require('./package.json');

// eslint-disable-next-line import/no-default-export
export default [
  // es
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      indent: false,
      globals: {
        'react-dom': 'ReactDOM',
        react: 'React',
        classnames: 'classnames',
      },
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.json', '.jsx'],
      }),
      common({
        include: 'node_modules/**',
      }),
      image(),
      json(),
      postcss(),
      globals(),
      terser(),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      indent: false,
      globals: {
        'react-dom': 'ReactDOM',
        react: 'React',
        classnames: 'classnames',
      },
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.json', '.jsx'],
      }),
      common({
        include: 'node_modules/**',
      }),
      json(),
      image(),
      postcss(),
      globals(),
      terser(),
      typescript({ useTsconfigDeclarationDir: true }),
    ],
  },
  // UMD production
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: pkg.pkgName,
      indent: false,
      globals: {
        'react-dom': 'ReactDOM',
        react: 'React',
        classnames: 'classnames',
      },
    },
    plugins: [
      // replace({
      //   preventAssignment: true,
      //   // 'process.env.NODE_ENV': JSON.stringify('production'),
      //   'process.env.NODE_ENV': JSON.stringify('development'),
      // }),
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
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
