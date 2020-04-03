import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

/**
 * 还可以，虽然用得比较粗糙，后面可以看看 rollup 的源码，然后搭配一套带热更的
 * 能够直接跑通所有示例的。
 */

export default {
  input: './FinalEx01.js',
  output: {
    file: 'bundle.js',
    format: 'umd',
    name: 'zzBundle',
    // globals: {
    //   'lodash': '_',
    //   'ramda': 'R',
    // }
  },
  plugins: [ 
    resolve({
      browser: true
    }),
    commonjs(),
    babel({
      exclude: '**/node_modules/**'
    }),
  ],
  // external: ['lodash', 'ramda'],
};