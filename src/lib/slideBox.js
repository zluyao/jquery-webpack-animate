function slideBoxFunction($, options) {
  //默认参数
  const defaults = {
    direction: 'left', // left,top
    order: 'asc',
    duration: 0.6, // unit:seconds
    easing: 'swing', // swing,linear
    delay: 3, // unit:seconds
    lengthUnit: 'px',
    startIndex: 0,
    stopOnHover: true,
    width: null,
    height: null, // fill 会充满整个屏幕，其余为特定的数字
    onSlideBefore: null,
    onSlideAfter: null,
    startDelay: 0,
    imgSrc: 'data-href',
    animateQueue: 'slideBox',
  };
  const settings = $.extend(defaults, options || {});

  const getHeightLength = len => {
    if (settings.height === 'fill') {
      return `${len}px`;
    } else {
      return `${len}${settings.lengthUnit}`;
    }
  };

  //计算相关数据
  const wrapper = $(this) // eslint-disable-line
    , ul = wrapper.children('ul.items')
    , lis = ul.children('li');

  // 保存的全局信息
  const info = {
    $wrapper: wrapper,
    $container: ul,
    $startItem: lis.eq(settings.startIndex),
    count: lis.size(),
    height: -1,
    width: -1,
    getIndex: null,
    $activeItem: null,
  };

  //定义滚动顺序:ASC/DESC.ADD.JENA.201208081718
  const order_by = settings.order.toUpperCase();

  //开始轮播
  let moveToFirst = false;
  const start = () => {
    let active = info.$container.children('li.active');
    const index = active.index()
      , getNext = () => order_by === 'ASC' ? active.next() : active.prev();

    info.$activeItem = active;
    info.getIndex = () => active.index() % info.count;

    let param = null;
    if (settings.direction === 'left') {
      param = { 'left': `${index * info.width * -1}${settings.lengthUnit}` };
    } else {
      param = { 'top': `${index * info.height * -1}${settings.lengthUnit}` };
    }

    info.$container.stop();

    const executor = () => {
      if (moveToFirst) {
        info.$container.queue(done => {
          info.$container.css({ [settings.direction]: 0 });
          moveToFirst = false;

          done();
        });
      }

      info
        .$container
        .animate(param, {
          duration: settings.duration * 1000,
          easing: settings.easing,
          queue: settings.animateQueue,
          done() {
            active.removeClass('active');

            if (active.data('first')) {
              moveToFirst = true;

              active = info.$startItem;
              info.$activeItem = active;
            }

            const next = getNext();
            next.addClass('active');

            settings.onSlideAfter && settings.onSlideAfter({
              wrapper: info.$container,
              current: active,
              next,
              getIndex: () => active.index() % info.count,
              count: info.count,
            });
          },
        })
        .dequeue(settings.animateQueue);

      wrapper.data('timeid', window.setTimeout(start, settings.delay * 1000));
    };

    if (settings.onSlideBefore) {
      settings.onSlideBefore({
        executor,
        wrapper: info.$container,
        current: active,
        next: moveToFirst ? info.$startItem : (order_by === 'ASC' ? active.next() : active.prev()),
        getIndex: () => active.index() % info.count,
        count: info.count,
        realIndex: active.index(),
      });
    } else {
      executor();
    }
  };

  //停止轮播
  const stop = () => window.clearTimeout(wrapper.data('timeid'));

  //鼠标经过事件
  settings.stopOnHover && wrapper.hover(stop, () =>
    wrapper.data('timeid', window.setTimeout(start, settings.delay * 1000)));

  //初始化
  const init = () => {
    if (!wrapper.size()) {
      return false;
    }

    const initSize = () => {
      wrapper.css({ width: `${info.width}${settings.lengthUnit}`, height: getHeightLength(info.height) });
      lis.css({ width: `${info.width}${settings.lengthUnit}`, height: getHeightLength(info.height) });
    };

    if (settings.height === 'fill') {
      const resize = () => info.height = window.innerHeight;

      window.addEventListener('resize', () => {
        resize();
        initSize();
      });

      resize();
    } else {
      info.height = settings.height ? settings.height : info.$startItem.height();
    }
    info.width = settings.width ? settings.width : info.$startItem.width();

    initSize();

    if (settings.direction === 'left') {
      info.$container.css({
        height: getHeightLength(info.height),
        width: `${(info.count + 1) * info.width + 1}${settings.lengthUnit}`,
      });
    } else {
      info.$container.css({
        width: `${info.width}${settings.lengthUnit}`,
        height: `${(info.count + 1) * getHeightLength(info.height)}`,
      });
    }

    // loop
    ul.append(lis.first().clone().attr('data-first', '1'));

    info.$container.children(`li:eq(${settings.startIndex})`).addClass('active');

    lis.size() > 1 && setTimeout(start, settings.startDelay * 1000);
  };

  //首张图片加载完毕后执行初始化
  var imgLoader = new Image();
  imgLoader.onload = function () {
    imgLoader.onload = null;
    init();
  };

  let imgSrc = info.$startItem.find('img').attr('src');
  if (!imgSrc) {
    imgSrc = info.$startItem.find('img').attr(settings.imgSrc);
  }
  imgLoader.src = imgSrc;


  return {
    info,
    stop,
    start,
    switch(index) {
      const currentIndex = info.$activeItem.index();

      let newIndex = index;
      if (newIndex === 0 && currentIndex === info.count - 1) {
        newIndex = info.count;
      } else if (currentIndex === 0 && newIndex === info.count - 1) {
        moveToFirst = false;
        if (settings.direction === 'left') {
          ul.css({ 'left': `${info.count * info.width * -1}${settings.lengthUnit}` });
        } else {
          ul.css({ 'top': `${info.count * info.height * -1}${settings.lengthUnit}` });
        }
      }

      ul.find(`li:eq(${newIndex})`)
        .addClass('active')
        .siblings()
        .removeClass('active');

      stop();
      start();
    },
    next() {
      this.switch((info.getIndex() + 1) % info.count);
    },
    prev() {
      const index = info.getIndex()
        , previousIndex = index === 0 ? info.count - 1 : index - 1;

      this.switch((previousIndex) % info.count);
    },
  };
}

export default function slideBox($) {
  $.fn.slideBox = function (opts) {
    return slideBoxFunction.call(this, $, opts);
  };
}
