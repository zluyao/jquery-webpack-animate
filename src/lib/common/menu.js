import jColor from '$lib/jquery.color-2.1.2';

jColor($);

const colors = {
  light: ['#C1DBF5', '#fff'],
  dark: ['#9B9B9B', '#292F43'],
};

const effects = {
  enter(e) {
    const $target = $(e.target);
    if ($target.hasClass('active')) {
      return;
    }

    const name = `menu-items-${$target.index()}`
      , isLight = !!$('body>.menu.white').length
      , [, finalColor] = colors[isLight ? 'light' : 'dark'];

    $target
      .stop(name, true, false)
      .animate({ paddingLeft: '0.2rem', color: finalColor }, {
        duration: 300,
        queue: name,
      })
      .dequeue(name);
  },
  leave(e) {
    const $target = $(e.target);
    if ($target.hasClass('active')) {
      return;
    }

    const name = `menu-items-${$target.index()}`
      , isLight = !!$('body>.menu.white').length
      , [originalColor] = colors[isLight ? 'light' : 'dark'];

    $target
      .stop(name, true, false)
      .animate({ paddingLeft: 0, color: originalColor }, {
        duration: 300,
        queue: name,
      })
      .dequeue(name);
  },
};

export default {
  ready() {
    $('body>.menu>ul.items>li').hover(effects.enter, effects.leave).click(e => {
      const href = $(e.target).data('href');
      href && (location.href = href);
    });
  },
};
