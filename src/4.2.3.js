/* 4.2.3：三个彩色三角形 + 视图矩阵 + 模型矩阵 */

// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec3 a_Color;\n' +
  'varying vec3 v_Color;\n' +

  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec3 v_Color;\n' + // 片元着色器接收变量：定义一个同样的 varying 变量

  'void main() {\n' +
  '  gl_FragColor = vec4(v_Color.rgb, 1.0);\n' +
  '}\n';

function main () {
  // 获取画图上下文
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 写入顶点数据
  var vertices = new Float32Array([
    0.0, 0.5, -0.4,  // The back green one
    -0.5, -0.5, -0.4,
    0.5, -0.5, -0.4,

    0.5, 0.4, -0.2, // The middle yellow one
    -0.5, 0.4, -0.2,
    0.0, -0.6, -0.2,

    0.0, 0.5, 0.0, // The front blue one 
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ]);
  var n = initArrayBuffers(gl, vertices, 'a_Position', 3);

  // 写入颜色数据
  var colors = new Float32Array([
    0.4, 1.0, 0.4, // The back green one
    0.4, 1.0, 0.4,
    1.0, 0.4, 0.4,

    1.0, 0.4, 0.4, // The middle yellow one
    1.0, 1.0, 0.4,
    1.0, 1.0, 0.4,

    0.4, 0.4, 1.0,  // The front blue one 
    0.4, 0.4, 1.0,
    1.0, 0.4, 0.4,
  ]);
  initArrayBuffers(gl, colors, 'a_Color', 3);

  // 定义视图矩阵
  var viewMatrix = new Matrix4();
  // 站在点（0, 0.25, 0.25）往点（0, 0, 0）看，上方向为 y 轴正方向
  viewMatrix.setLookAt(0, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
  // 存入顶点着色器
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // 定义模型矩阵
  var modelMatrix = new Matrix4();
  // modelMatrix.setScale(0.5, 1.0, 1.0); // x 轴方向缩小 0.5
  modelMatrix.setTranslate(0.5, 0.0, 0.0); // x 轴正方向移动 0.5
  // 存入顶点着色器
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // 画图
  gl.clearColor(0, 0, 0, 0.4);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initArrayBuffers (gl, vertices, attribName, num) {
  var vertexBuffer = gl.createBuffer(); // 创建缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定对象到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据绑到缓存对象

  var position = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(position, num, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position); // 激活变量

  return vertices.length / num;
}
