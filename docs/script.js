
window.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('canvas_1');

  const gl = c.getContext('webgl');
  gl.viewport(0, 0, c.width, c.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const create_shader = (id, type) => {
    const sourse = document.getElementById(id).textContent;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourse);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }

  const create_program = (vs, fs) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfoLog(program));
    }
  }
  const create_vbo = (data) => {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }
  const set_attribute = (vbo, attL, attS) => {
    for (let i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
      gl.enableVertexAttribArray(attL[i]);
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
  }

  const vShader = create_shader('vs', gl.VERTEX_SHADER);
  const fShader = create_shader('fs', gl.FRAGMENT_SHADER);
  const prg = create_program(vShader, fShader);


  const attLocation = new Array(2);
  attLocation[0] = gl.getAttribLocation(prg, 'position');
  attLocation[1] = gl.getAttribLocation(prg, 'color');

  const attStride = new Array(2);
  attStride[0] = 3;
  attStride[1] = 4;

  const vertex_position = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
   -1.0, 0.0, 0.0
];

  const vertex_color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  const position_vbo = create_vbo(vertex_position);
  const color_vbo = create_vbo(vertex_color);

  set_attribute([position_vbo, color_vbo], attLocation, attStride);

  const uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

  const m = new matIV();
  const mMatrix = m.identity(m.create());
  const vMatrix = m.identity(m.create());
  const pMatrix = m.identity(m.create());
  const tmpMatrix = m.identity(m.create());
  const mvpMatrix = m.identity(m.create());

  m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
  m.multiply(pMatrix, vMatrix, tmpMatrix);
  m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  m.identity(mMatrix);
  m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);

  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.flush();
});
