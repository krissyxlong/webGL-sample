// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'varying vec3 v_Color;\n' +

  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
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
    0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ]);
  var n = initArrayBuffers(gl, vertices, 'a_Position', 2);
  
  // 写入颜色数据
  var colors = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
  ]);
  initArrayBuffers(gl, colors, 'a_Color', 3);

  // 画图
  gl.clearColor(0, 0, 0, 1);
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
