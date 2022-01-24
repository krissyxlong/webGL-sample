function main() {
    // 获取 canvas 元素
    var canvas = document.getElementById('webgl');

    // 获取 webGL 渲染上下文
    var gl = getWebGLContext(canvas); // 适配: canvas.getContext('webgl')
  
    // 设置背景色
    gl.clearColor(0.0, 0.0, 0.0, 0.5); // RGBA 格式
  
    // 执行清空操作：也就是用背景色填充整个画板
    gl.clear(gl.COLOR_BUFFER_BIT);
}
