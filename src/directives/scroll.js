// 创建自定义指令
const scroll = {
    mounted(el, binding) {
      const callback = binding.value; // 指令的绑定值是回调函数
  
      if (typeof callback !== 'function') {
        console.warn('The binding value must be a function.');
        return;
      }
  
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          // 滚动到底部时调用回调函数
          callback();
        }
      };
  
      // 绑定滚动事件
      el.__handleScroll__ = handleScroll; // 将事件处理器保存到元素上，便于卸载时清理
      el.addEventListener('scroll', handleScroll);
    },
    unmounted(el) {
      // 清理事件绑定
      el.removeEventListener('scroll', el.__handleScroll__);
      delete el.__handleScroll__;
    },
};

export default scroll
  