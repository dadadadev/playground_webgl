import nodeResolve from 'rollup-plugin-node-resolve';
import glslify from 'rollup-plugin-glslify';

export default {
  format: 'es',
  plugins: [
    nodeResolve({ jsnext: true }),
    glslify()
  ]
}
