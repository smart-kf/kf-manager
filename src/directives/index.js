import focus from './focus'


// 指令对象
const directives = {
    focus
};

export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  }
};
