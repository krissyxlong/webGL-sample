// 顶点着色器
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
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

  gl.clearColor(0.0, 0.0, 0.0, 0.4);

  // 写入矩形顶点数据
  var vertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5
  ]);
  var n = initArrayBuffers(gl, vertices, 'a_Position', 2);

  // 写入纹理坐标数据
  var texCoords = new Float32Array([
    0.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
  ]);
  initArrayBuffers(gl, texCoords, 'a_TexCoord', 2);

  // 加载纹理
  var imgSrc = '../resources/sky.jpg';
  initTextures(gl, n, imgSrc, 'u_Sampler');
}

// 往缓存写入数据
function initArrayBuffers (gl, vertices, attribName, num) {
  var vertexBuffer = gl.createBuffer(); // 创建缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定对象到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将数据绑到缓存对象

  var position = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(position, num, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position); // 激活变量

  return vertices.length / 2;
}

// 初始化纹理对象
function initTextures (gl, n, imgSrc, textName) {
  var texture = gl.createTexture();   // 创建纹理对象
  var u_Sampler = gl.getUniformLocation(gl.program, textName); // 获取纹理地址
  var image = new Image();  // 创建图片对象
  // 图片下载完后，加载纹理
  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };
  // 图片地址
  image.src = imgSrc;
  return true;
}

// 加载纹理
function loadTexture (gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行 y 轴反转
  // 开启 0 号纹理单单元
  gl.activeTexture(gl.TEXTURE0);
  // 向 target 绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将 0 号纹理传递给着色器: 唯一能赋值给取样器变量的就是纹理单元编号
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);   // 清空画布
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 画图
}
