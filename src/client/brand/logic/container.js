import 'fullpage.js';
import 'jquery.easing';
import { EventEmitter } from 'events';

const bus = new EventEmitter();

// 手机动效
function phoneAnimation() {
  $('.page-1 .img-left')
    .stop('left', true, true)
    .css({ bottom: '2.15rem' })
    .delay(600, 'left')
    .animate({ bottom: '2.55rem' }, {
      duration: 1800,
      queue: 'left',
      easing: 'easeOutQuart',
    })
    .dequeue('left');

  $('.page-1 .img-right')
    .stop('right', true, true)
    .css({ bottom: '-0.39rem' })
    .delay(600, 'right')
    .animate({ bottom: '0.09rem' }, {
      duration: 1800,
      queue: 'right',
      easing: 'easeOutQuart',
    })
    .dequeue('right');
}

function phoneAnimation2() {
  $('.page-2 .video-box1')
    .stop('v1', true, true)
    .css({ top: '1.27rem' })
    .delay(600, 'v1')
    .animate({ top: '0.87rem' }, {
      duration: 1800,
      queue: 'v1',
      easing: 'easeOutQuart',
    })
    .dequeue('v1');

  $('.page-2 .video-box2')
    .stop('v2', true, true)
    .css({ top: '0.89rem' })
    .delay(600, 'v2')
    .animate({ top: '0.49rem' }, {
      duration: 1800,
      queue: 'v2',
      easing: 'easeOutQuart',
    })
    .dequeue('v2');

  $('.page-2 .video-box3')
    .stop('v3', true, true)
    .css({ top: '4.1rem' })
    .delay(600, 'v3')
    .animate({ top: '3.7rem' }, {
      duration: 1800,
      queue: 'v3',
      easing: 'easeOutQuart',
    })
    .dequeue('v3');

  $('.page-2 .dotright-box')
    .stop('i1', true, true)
    .css({ right: '0.16rem' })
    .delay(600, 'i1')
    .animate({ right: '0.56rem' }, {
      duration: 1800,
      queue: 'i1',
      easing: 'easeOutQuart',
    })
    .dequeue('i1');
}

bus
  .on('1.before', phoneAnimation)
  .on('afterRender', () => (!location.hash || location.hash === '#page-1') && phoneAnimation())
  .on('2.before', phoneAnimation2)
  .on('afterRender', () => (!location.hash || location.hash === '#page-2') && phoneAnimation2());

export default {
  ready() {
    $('#container').fullpage({
      navigation: true,
      verticalCentered: false,
      anchors: ['page-1', 'page-2'],
      onLeave(index, nextIndex) {
        bus.emit(`${nextIndex}.before`);
        bus.emit('*.before');
      },
      afterLoad(anchorLink, index) {
        bus.emit(`${index}.after`);
        bus.emit('*.after');
      },
      afterRender() {
        bus.emit('afterRender');
      },
    });
  },
};
