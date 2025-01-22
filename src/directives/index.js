import focus from './focus'
import scroll from './scroll';


// 指令对象
const directives = {
    focus,
    scroll
};

export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  }
};
