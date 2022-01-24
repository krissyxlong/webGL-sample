var VSHADER_SOURCE =
  'void main() {\n' +
  '  gl_Position = vec4(0.5, 0.5, 0.5, 1.0);\n' + // 设置顶点坐标
  '  gl_PointSize = 10.0;\n' +                    // 设置顶点大小
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置顶点颜色：gl_FragColor 控制着像素在屏幕上的最终颜色
  '}\n';
  
function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 清空绘图区
  gl.clearColor(0.0, 0.0, 0.0, 0.7);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 调用绘图函数
  gl.drawArrays(gl.POINTS, 0, 1);
}