import jColor from '$lib/jquery.color-2.1.2';

jColor($);

export default {
  ready() {
    const queue = 'span.btn.submitInfo'
      , $target = $('span.btn.submitInfo')
      , step = now => $target.css('box-shadow', `0 0 ${now}rem 0 #6AA8E9`);

    $target.hover(
      () => $target
        .stop(queue, true, false)
        .animate({ boxShadow: 0.16 }, {
          step,
          queue,
          duration: 200,
        })
        .dequeue(queue),
      () => $target
        .stop(queue, true, false)
        .animate({ boxShadow: 0 }, {
          step,
          queue,
          duration: 200,
        })
        .dequeue(queue),
    );
  },
};
