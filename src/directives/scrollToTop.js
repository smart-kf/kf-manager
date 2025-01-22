export default {
    mounted(el, binding) {
      const { value } = binding;
  
      if (typeof value !== 'function') {
        console.warn('The binding value must be a function.');
        return;
      }
  
      const handleScroll = () => {
        const { scrollTop } = el;
        if (scrollTop === 0) {
          // 滚动到顶部，触发加载函数
          value();
        }
      };
  
      // 绑定滚动事件
      el.__handleScroll__ = handleScroll;
      el.addEventListener('scroll', handleScroll);
    },
    unmounted(el) {
      // 清理事件
      el.removeEventListener('scroll', el.__handleScroll__);
      delete el.__handleScroll__;
    },
  };
  