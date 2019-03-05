const afterQueueName = 'main-menu-*.after';

export default {
  '1.after': () =>
    $('body>.menu')
      .stop(afterQueueName, true, false)
      .animate({ left: '1.22rem' }, {
        duration: 600,
        queue: afterQueueName,
      })
      .dequeue(afterQueueName),
  '1-*.after': () =>
    $('body>.menu')
      .stop(afterQueueName, true, false)
      .animate({ left: '0.6rem' }, {
        duration: 600,
        queue: afterQueueName,
      })
      .dequeue(afterQueueName),
  '*.before': nextIndex => {
    const queue = 'main-menu-*.before'
      , $target = $('body>.menu');

    $target
      .stop(queue, true, false)
      .animate({ opacity: 0.2 }, {
        queue,
        duration: 300,
        easing: 'easeInExpo',
      })
      .queue(queue, n => {
        const isLight = !(nextIndex % 2);

        $target.children('img[data-type=dark]').css('display', isLight ? 'none' : '');
        $target.children('img[data-type=light]').css('display', isLight ? '' : 'none');

        $target[isLight ? 'addClass' : 'removeClass']('white');
        $target.find('>ul.items>li').removeAttr('style');

        n();
      })
      .animate({ opacity: 1 }, {
        queue,
        duration: 300,
        easing: 'easeOutExpo',
      })
      .dequeue(queue);
  },
};
