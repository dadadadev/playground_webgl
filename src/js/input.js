import { mat4 } from 'gl-matrix';
import triangleVs from '../glsl/triangle.vs';
import triangleFs from '../glsl/triangle.fs';

window.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('canvas_1');
  const gl = c.getContext('webgl');
  const createShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.log(gl.getShaderInfoLog(shader));
    }
  }
  const createProgram = (vs, fs) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      console.log(gl.getProgramInfoLog(program));
    }
  }
  const create_vbo = (data) => {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }
  const create_ibo = (data) => {
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    return ibo;
  }
  const set_attribute = (vbo, attL, attS) => {
    for (let i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
      gl.enableVertexAttribArray(attL[i]);
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
  }

  gl.enable(gl.CULL_FACE);
  gl.depthFunc(gl.LEQUAL);

  const vShader = createShader(triangleVs, gl.VERTEX_SHADER);
  const fShader = createShader(triangleFs, gl.FRAGMENT_SHADER);
  const program = createProgram(vShader, fShader);

  const attLocation = new Array(2);
  attLocation[0] = gl.getAttribLocation(program, 'position');
  attLocation[1] = gl.getAttribLocation(program, 'color');

  const attStride = new Array(2);
  attStride[0] = 3;
  attStride[1] = 4;

  const vertex_position = new Float32Array([
    0.0,  0.5,  0.0, //0
   -0.5,  0.0,  0.5, //1
    0.5,  0.0,  0.5, //2
    0.5,  0.0, -0.5, //3
   -0.5,  0.0, -0.5, //4
    0.0, -0.5,  0.0  //5
  ]);
  const vertex_color = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 0.0, 1.0
  ]);

  const index = new Int16Array([
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1,
    5, 2, 1,
    5, 3, 2,
    5, 4, 3,
    5, 1, 4
  ]);

  const position_vbo = create_vbo(vertex_position);
  const color_vbo = create_vbo(vertex_color);
  set_attribute([position_vbo, color_vbo], attLocation, attStride);
  const ibo = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  let r = 0;
  const anime = () => {
    for ( let  i = 0, i < 360, i++) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const translation = mat4.create();
      mat4.translate(translation, translation, [-1.5, 0, 0]);
      const model = mat4.create();
      mat4.multiply(model, model, translation);

      const cameraPosition = [0, 0, 5];
      const lookAtPosition = [0, 0, 0];
      const upDirection    = [0, 1, 0];
      const view  = mat4.create();
      mat4.lookAt(view, cameraPosition, lookAtPosition, upDirection);

      const fovy   = Math.PI / 2;
      const aspect = c.width / c.height;
      const near   = 0.1;
      const far    = 100;
      const projection = mat4.create();
      mat4.perspective(projection, fovy, aspect, near, far);

      const modelLocation      = gl.getUniformLocation(program, 'model');
      const viewLocation       = gl.getUniformLocation(program, 'view');
      const projectionLocation = gl.getUniformLocation(program, 'projection');

      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniformMatrix4fv(viewLocation, false, view);
      gl.uniformMatrix4fv(projectionLocation, false, projection);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

      r++;
      const scale2 = mat4.create();
      mat4.scale(scale2, scale2, [1, 1, 1]);
      const rotation2 = mat4.create();
      mat4.rotateX(rotation2, rotation2, r * Math.PI / 180);
      mat4.rotateY(rotation2, rotation2, r * Math.PI / 180);
      mat4.rotateZ(rotation2, rotation2, r * Math.PI / 180);
      const translation2 = mat4.create();
      mat4.translate(translation2, translation2, [1.5, 0, 0]);
      const model2 = mat4.create();
      mat4.multiply(model2, model2, translation2);
      mat4.multiply(model2, model2, rotation2);
      mat4.multiply(model2, model2, scale2);

      gl.uniformMatrix4fv(modelLocation, false, model2);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
      gl.flush();

      window.requestAnimationFrame(anime);
      console.log(r);
    }
  }
  window.requestAnimationFrame(anime);
});
