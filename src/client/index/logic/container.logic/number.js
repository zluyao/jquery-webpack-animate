export default {
  '4.before': () => {
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
  },
};
