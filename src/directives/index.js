import focus from './focus'
import scroll from './scroll';
import scrollToTop from './scrollToTop';


// 指令对象
const directives = {
    focus,
    scroll,
    scrollToTop
};

export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  }
};
