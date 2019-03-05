function animate(selector, initial, final) {
  $(selector)
    .stop(selector, true, true)
    .css(initial)
    .animate(final, {
      duration: 1800,
      queue: selector,
      easing: 'easeOutQuart',
    })
    .dequeue(selector);
}

export default {
  '2.before': () => {
    animate('.page-2>ul.dr-list', { marginTop: '2rem' }, { marginTop: '-0.52rem' });
    animate('.page-2>.img-grid', { marginTop: '-4.74rem' }, { marginTop: '-3rem' });
    animate('.page-2>.img-doctor', { left: '1.6rem', opacity: 0 }, { left: '2.75rem', opacity: 1 });
  },
};
