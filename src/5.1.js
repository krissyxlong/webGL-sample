/* 5.1 立方体 + 着色 */

// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'varying vec3 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec3 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Color.rgb, 1.0);\n' +
  '}\n';

function main () {
  // 获取 webGL 上下文
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 设置顶点和颜色数据
  var n = initVertexBuffers(gl);

  // 定义视图矩阵
  var viewMatrix = new Matrix4();
  // 站在点（0, 0.25, 0.25）往点（0, 0, 0）看，上方向为 y 轴正方向
  viewMatrix.setLookAt(1.0, 1.0, 1.0, 0, 0, 0, 0, 1, 0);

  // 定义模型矩阵
  var modelMatrix = new Matrix4();
  modelMatrix.setScale(1.0, 1.0, 1.0); // x 轴方向缩小 0.5
  // modelMatrix.setTranslate(0.6, 0.0, 0.0); // x 轴正方向移动 0.5

  // 定义投影矩阵
  var projectMatrix = new Matrix4();
  projectMatrix.setOrtho(-3.0, 3.0, -3.0, 3.0, -3.0, 3.0);

  // 组合矩阵
  var mvpMatrix = new Matrix4();
  mvpMatrix.set(projectMatrix).multiply(viewMatrix).multiply(modelMatrix);
  var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  // 重置背景色
  gl.clearColor(0.0, 0.0, 0.0, 0.7);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 绘制
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers (gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // 顶点坐标
    // 前面
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, // v0-v1-v2
    1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v2-v3
    // 右面
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, // v0-v3-v4
    1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v4-v5
    // 上面
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, // v0-v5-v6
    1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v6-v1
    // 左面
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, // v1-v6-v7
    -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v7-v2
    // 下面
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, // v7-v4-v3
    -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v3-v2
    // 后面
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, // v4-v7-v6
    1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v6-v5
  ]);

  var colors = new Float32Array([   // 各顶点对应的纹理坐标
    // 前面：红色
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // 右面
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    // 上面
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    // 左面
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    // 下面
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    // 后面
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  ]);

  // 写入顶点信息
  initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
  initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');

  return vertices.length / 3;
}

function initArrayBuffer (gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);

  return true;
}