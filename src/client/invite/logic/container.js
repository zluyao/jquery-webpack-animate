import 'fullpage.js';

export default {
  ready() {
    $('#container').fullpage({
      navigation: true,
      verticalCentered: false,
      anchors: ['page-1', 'page-2', 'page-3', 'page-4'],
      onLeave(index, nextIndex) {
        if (nextIndex === 4) {
          $('.page-4 .grid .header>.number[data-final]').each(function (index) {
            // eslint-disable-next-line
            const $target = $(this)
              , queueName = `n-${index}`
              , finalValue = $target.data('final')
              , step = (now, fx) => $(fx.elem).text(Math.floor(now).toFixed(0));

            $target
              .stop(queueName, true, true)
              .animate({ finalValue: 0 }, {
                step,
                duration: 0,
                queue: queueName,
              })
              .animate({ finalValue }, {
                step,
                duration: 1800,
                queue: queueName,
                easing: 'easeOutQuad',
              })
              .dequeue(queueName);
          });
        }
      },
    });
  },
};
