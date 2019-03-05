import 'jquery.easing';
import { EventEmitter } from 'events';

import slideBox from '$lib/slideBox';
import lazyload from '$lib/lazyload';

slideBox($);

const bus = new EventEmitter();

// 页面设置
bus.on('*.before', ({ getIndex, count }) => {
  const index = getIndex();
  $('.process>.current').text(index + 1);
  $('.process>.count').text(count);
});

// 首屏手机动效
bus.on('0.before', () => {
  $('.img-left')
    .stop('left', true, true)
    .css({ bottom: '2.35rem', left: '9.4rem', opacity: 1 })
    .delay(600, 'left')
    .animate({ bottom: '2.96rem' }, {
      duration: 2000,
      easing: 'easeOutQuart',
      queue: 'left',
    })
    .delay(3300, 'left')
    .animate({ left: '-8rem', opacity: 0.2 }, {
      duration: 1200,
      queue: 'left',
    })
    .dequeue('left');

  $('.img-right')
    .stop('right', true, true)
    .css({ bottom: 0, left: '14.13rem', opacity: 1 })
    .delay(600, 'right')
    .animate({ bottom: '0.61rem' }, {
      duration: 2000,
      easing: 'easeOutQuart',
      queue: 'right',
    })
    .delay(3300, 'right')
    .animate({ left: '-5rem', opacity: 0.2 }, {
      duration: 1200,
      queue: 'right',
    })
    .dequeue('right');
});

// 文字动效
bus.on('*.before', ({ current }) => {
  const $descContainer = current.find('.desc-container')
    , $btn = $descContainer.find('.btn-download')
    , $bgFront = $descContainer.find('.btn-download-bg-container');

  $descContainer
    .stop('desc', true, true)
    .css({ left: '-5.4rem', color: '#187EEA', backgroundColor: 'transparent' })
    .delay(1200, 'desc')
    .animate({ left: '4.6rem' }, {
      duration: 800,
      easing: 'easeOutSine',
      queue: 'desc',
    })
    .dequeue('desc');

  $btn
    .stop('desc-btn', true, true)
    .css({ display: 'none' })
    .delay(3200, 'desc-btn')
    .queue('desc-btn', n => $btn.css({ display: 'block' }) && n())
    .dequeue('desc-btn');

  $bgFront
    .stop('desc-front', true, true)
    .css({ width: 0 })
    .delay(2000, 'desc-front')
    .animate({ width: '1.8rem' }, {
      duration: 1200,
      queue: 'desc-front',
    })
    .dequeue('desc-front');
});

// 翻页按钮可用性设置
bus
  .on('*.before', () => $('.controller>a').data('disabled', true))
  .on('*.after', () => $('.controller>a').data('disabled', false));

// 图片懒加载
bus.on('init.*.before', e => lazyload(`.page-1 .slide-box>ul.items>li:eq(${e.realIndex})`));

export default {
  ready() {
    const bgSlide = $('#bg-container')
      .slideBox({
        delay: 6,
        width: 19.2,
        duration: 1.2,
        lengthUnit: 'rem',
        stopOnHover: false,
        animateQueue: 'bg',
        easing: 'easeOutSine',
        height: 'fill',
        onSlideBefore(e) {
          const index = e.getIndex();

          bus.emit(`init.${index}.before`, e);
          bus.emit('init.*.before', e);
          e.executor();
          bus.emit(`${index}.before`, e);
          bus.emit('*.before', e);
        },
        onSlideAfter(e) {
          const index = e.getIndex();

          bus.emit(`${index}.after`, e);
          bus.emit('*.after', e);
        },
      });

    $('.controller>a').click(function () {
      // eslint-disable-next-line
      const $target = $(this);
      if ($target.data('disabled')) {
        return;
      }

      bgSlide[$target.data('direction')]();
    });

    $('a.btn-download').hover(
      () => {
        bgSlide.stop();

        $('.img-left').stop('left', true);
        $('.img-right').stop('right', true);
      },
      () => bgSlide.start(),
    );
  },
};
