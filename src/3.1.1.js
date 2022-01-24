var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

  // 将顶点坐标数据写进顶点着色器
  const vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = initVertexBuffers(gl, vertices, 'a_Position');

  // 清空背景
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 画三角形
  gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);
  // gl.drawArrays(gl.LINE_STRIP, 0, n);
  // gl.drawArrays(gl.LINES, 0, n);
  // gl.drawArrays(gl.POINTS, 0, n);
  // gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * @description: 批量传入数据
 * @param {Object} gl：webGL 上下文对象
 * @param {Array} vertices：传入数据
 * @param {String} attribName
 * @return {null}
 */
function initVertexBuffers(gl, vertices, attribName) {
  var vertexBuffer = gl.createBuffer(); // 创建缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定对象到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据绑到缓存对象

  var position = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position); // 激活变量

  return vertices.length / 2;
}