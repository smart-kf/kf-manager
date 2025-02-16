export default class DisableDevTool {
  constructor() {}
  //禁止F12调试
  keyF12() {
    document.addEventListener('keydown', function (e) {
      console.log(e)
      // 禁止F12，禁止保存，禁止c+s+I打开开发工具，禁止c+s+C打开开发工具
      if (e.code === 'F12' || (e.ctrlKey && e.code === 'KeyS') || (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || (e.ctrlKey && e.shiftKey && e.code === 'KeyC')) {
        e.preventDefault()
      }
    })
  }
  //禁止右键菜单
  contextmenu() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })
  }
  debuggerOpen() {
    function openDebugger() {
      const before = new Date().getTime()
      debugger
      const after = new Date().getTime()
      if (after - before > 10) {
        alert('禁止打开F12开发者工具！')
        window.location.href = 'about:blank'
      }
    }
    var timerId = setInterval(openDebugger, 1000)

    window.onresize = function () {
      clearInterval(timerId)
      timerId = setInterval(openDebugger, 1000)
    }
  }
  init() {
    this.keyF12()
    this.contextmenu()
    this.debuggerOpen()
  }
}
