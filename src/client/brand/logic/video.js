export default {
  ready() {
    // 防止页面刚加载时视频在首页的闪烁问题
    setTimeout(() => $('video').css({ display: 'inline' }), 300);
  },
};
