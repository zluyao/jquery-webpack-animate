import 'fullpage.js';
import 'jquery.easing';
import { EventEmitter } from 'events';

const bus = new EventEmitter();

function testAnimation(nextIndex) {
  const $container = $(`.page-${nextIndex}`);

  // 文案动效
  $container
    .find('.case')
    .stop('left', true, true)
    .css({ left: '-2rem', opacity: 0 })
    .animate({ left: 0, opacity: 1 }, {
      duration: 1800,
      easing: 'easeOutQuart',
      queue: 'left',
    })
    .dequeue('left');

  // 手机动效
  $container
    .find('.phone-img')
    .stop('right', true, true)
    .css({ top: '2rem' })
    .animate({ top: 0 }, {
      duration: 1800,
      easing: 'easeOutQuart',
      queue: 'right',
    })
    .dequeue('right');

  // 网格动效
  $container
    .find('.point-img')
    .stop('grid', true, true)
    .css({ left: '2.81rem' })
    .animate({ left: '1.81rem' }, {
      duration: 1800,
      easing: 'easeOutQuart',
      queue: 'grid',
    })
    .dequeue('grid');

  // 手机浮层动效
  if (nextIndex === 2) {
    $container
      .find('.phone-content-img')
      .stop('content', true, true)
      .css({ top: '20%' })
      .animate({ top: '50%' }, {
        duration: 1800,
        easing: 'easeOutQuart',
        queue: 'content',
      })
      .dequeue('content');
  }
}

bus
  .on('*.before', (nextIndex) => testAnimation(nextIndex))
  .on('afterRender', () => (!location.hash || location.hash === '#page-1') && testAnimation(1));

export default {
  ready() {
    $('#container').fullpage({
      navigation: true,
      verticalCentered: false,
      anchors: ['page-1', 'page-2'],
      onLeave(index, nextIndex) {
        bus.emit('*.before', nextIndex);
      },
      afterRender() {
        bus.emit('afterRender');
      },
    });
  },
};
