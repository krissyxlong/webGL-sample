// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // attribute 变量
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + // 设置顶点坐标
  '  gl_PointSize = 10.0;\n' +                    // 设置顶点大小
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置顶点颜色：gl_FragColor 控制着像素在屏幕上的最终颜色
  '}\n';
function main () {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 获取 a_Position 存储位置，通过地址像变量中传输数据
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);
  // canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

  // 清空绘图区
  gl.clearColor(0.0, 0.0, 0.0, 0.7);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.drawArrays() 绘制函数
  gl.drawArrays(gl.POINTS, 0, 1);
}

var g_points = []; // The array for the position of a mouse press
function click(ev, gl, canvas, a_Position) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  // 鼠标位置转换成 webgl 坐标
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  g_points.push(x); g_points.push(y);

  // 清空绘图区域
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for (var i = 0; i < len; i += 2) {
    // 往着色器传递位置
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

    // 开始绘图
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}