const maxRange = 1.6;
const originalPosition = [0, 0.2, 0.21, -0.09, 0.39, 0.38];

export default {
  '4.before': () => {
    $('.page-4 .dynamic-phone>.phone').each(function (index) {
      // eslint-disable-next-line
      const $target = $(this)
        , queueName = `dynamic-phone-${index}`
        , originalValue = originalPosition[index]
        , segment = maxRange / 5
        , finalValue = Math.round((originalValue + maxRange - segment * (5 - index)) * 100) / 100;

      index && $target
        .stop(queueName, true, true)
        .css({ bottom: `${originalValue}rem` })
        .animate({ bottom: `${finalValue}rem` }, {
          duration: 1500,
          queue: queueName,
          easing: 'easeOutQuad',
        })
        .dequeue(queueName);
    });
  },
};
