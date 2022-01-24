// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform vec4 u_Translation;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position + u_Translation;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 设置偏移量
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 写入顶点数据
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = initVertexBuffers(gl, vertices, 'a_position');

  // 写入偏移量
  var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

  // 清空背景
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 画图
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, vertices, attribName) {
  var vertexBuffer = gl.createBuffer(); // 创建缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定对象到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据绑到缓存对象

  var position = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position); // 激活变量

  return vertices / 2;
}

