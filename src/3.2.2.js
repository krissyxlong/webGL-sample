// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
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
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = initVertexBuffers(gl, vertices, 'a_Position');

  // 定义缩放矩阵
  var Sx = 1.0, Sy = 1.5, Sz = 1.0; // 缩放因子
  // (1)自定义
  var xformMatrix = new Float32Array([
      Sx,   0.0,  0.0,  0.0,
      0.0,  Sy,   0.0,  0.0,
      0.0,  0.0,  Sz,   0.0,
      0.0,  0.0,  0.0,  1.0
  ]);
  // (2)矩阵库生成
  var modelMatrix = new Matrix4();
  modelMatrix.setScale(Sx, Sy, Sz);

  // 写入旋转矩阵
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
  // gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);

  // 画图
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, vertices, attribName) {
  var vertexBuffer = gl.createBuffer(); // 创建缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定对象到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据绑到缓存对象

  var position = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position); // 激活变量

  return vertices.length / 2;
}

// main()