import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

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