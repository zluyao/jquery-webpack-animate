import 'jquery.easing';

export default {
  ready() {
    $('.operates .border-6').mouseenter(function () {
      // eslint-disable-next-line
      const $target = $(this)
        , queue = `border-6-${$target.next().attr('src')}`;

      if ($target.data('processing')) {
        return;
      }

      $target
        .stop(queue, true, false)
        .css({ transform: 'rotate(0deg)' })
        .data('processing', 1)
        .animate({ transform: 120 }, {
          queue,
          duration: 1600,
          easing: 'easeOutBounce',
          step(now) {
            $target.css({ transform: `rotate(${now}deg)` });
          },
        })
        .queue(queue, n => $target.data('processing', null) && n())
        .dequeue(queue);
    });
  },
};
