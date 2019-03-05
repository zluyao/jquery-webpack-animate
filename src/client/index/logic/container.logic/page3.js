export default {
  '3.before': () => {
    const $container = $('.page-3>.main');

    $container.find('>.bg')
      .stop('bg', true, true)
      .css({ top: '2.91rem' })
      .animate({ top: '0.91rem' }, {
        duration: 1800,
        easing: 'easeOutQuart',
        queue: 'bg',
      })
      .dequeue('bg');

    $container.find('>.grid')
      .stop('grid', true, true)
      .css({ right: '-2.57rem' })
      .animate({ right: '0.57rem' }, {
        duration: 1800,
        easing: 'easeOutQuart',
        queue: 'grid',
      })
      .dequeue('grid');

    $container.find('>.about')
      .stop('about', true, true)
      .css({ left: '-1.21rem' })
      .animate({ left: '0.79rem' }, {
        duration: 1800,
        easing: 'easeOutQuart',
        queue: 'about',
      })
      .dequeue('about');

    $container.find('>.intro')
      .stop('intro', true, true)
      .css({ left: '-2rem' })
      .animate({ left: 0 }, {
        duration: 1800,
        easing: 'easeOutQuart',
        queue: 'intro',
      })
      .dequeue('intro');
  },
};
