// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // attribute 变量
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + // 设置顶点坐标
  '  gl_PointSize = 10.0;\n' +                    // 设置顶点大小
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' + // uniform 变量
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' + // 设置顶点颜色：gl_FragColor 控制着像素在屏幕上的最终颜色
  '}\n';
function main () {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 获取 a_Position 存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  // gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);

  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

  // 清空绘图区
  gl.clearColor(0.0, 0.0, 0.0, 0.7);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 开始绘制
  // gl.drawArrays(gl.POINTS, 0, 1);
}

var g_points = [];  // 存放鼠标点击位置
var g_colors = [];  // 存放点颜色
function click (ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x 坐标
  var y = ev.clientY; // y 坐标
  var rect = ev.target.getBoundingClientRect();

  // 转换成 webgl 坐标
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  g_points.push([x, y]);
  if (x >= 0.0 && y >= 0.0) {      // 第一象限：红色
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0.0 && y < 0.0) { // 第三象限：绿色
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {                         // 其他：白色
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }

  // 清空绘图区
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for (var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // 传递顶点位置
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // 传递顶点颜色
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // 开始绘制
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}