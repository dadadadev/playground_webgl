var triangleVs = "#define GLSLIFY 1\nattribute vec3 position;\nattribute vec4 color;\nuniform mat4 mvpMatrix;\nvarying vec4 vColor;\nvoid main(void){\n  vColor = color;\n  gl_Position = mvpMatrix * vec4(position, 1.0);\n}\n"; // eslint-disable-line

var triangleFs = "precision mediump float;\n#define GLSLIFY 1\nvarying vec4 vColor;\nvoid main(void){\n  gl_FragColor = vColor;\n}\n"; // eslint-disable-line

window.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('canvas_1');
  const gl = c.getContext('webgl');
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
  };
  const create_vbo = (data) => {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  };
  const set_attribute = (vbo, attL, attS) => {
    for (let i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
      gl.enableVertexAttribArray(attL[i]);
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
  };

  gl.viewport(0, 0, c.clientWidth, c.clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const createShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  };
  const vShader = createShader(triangleVs, gl.VERTEX_SHADER);
  const fShader = createShader(triangleFs, gl.FRAGMENT_SHADER);
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
   -1.0, 0.0, 0.0,
    0.0, 0.0, 1.0
  ];
  const vertex_color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  const position_vbo = create_vbo(vertex_position);
  const color_vbo = create_vbo(vertex_color);
  set_attribute([position_vbo, color_vbo], attLocation, attStride);

  const m = new matIV();
  const mMatrix = m.identity(m.create());
  const vMatrix = m.identity(m.create());
  const pMatrix = m.identity(m.create());
  const tmpMatrix = m.identity(m.create());
  const mvpMatrix = m.identity(m.create());

  const uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

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
