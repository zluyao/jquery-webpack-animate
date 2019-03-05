import 'jquery.easing';

export default {
  ready() {
    const queue = 'dr-list'
      , $container = $('.page-1 .footer')
      , $list = $container.find('>ul.content')
      , count = $list.children('li').length
      , rows = Math.ceil((count - 1) / 3)
      , height = 2.07 // 这里需要根据 CSS 设置的 footer 高度同步修改
      , minTop = -1 * rows * height;

    $list.find('>li>img.avatar').click(function () {
      // eslint-disable-next-line
      location.href = `/detail?id=${$(this).parent().data('id')}`;
    });

    if (count <= 3) {
      return $('.controller').hide();
    }

    let index = 0;
    $('.controller>a').click(function () {
      // eslint-disable-next-line
      const $target = $(this);
      if ($target.data('disabled')) {
        return;
      }

      const direction = $target.data('direction');

      let top = 0;
      if (direction === 'prev') {
        if (index === 0) {
          return;
        }
        index -= 1;
      } else {
        if (index >= rows - 1) {
          return;
        }
        index += 1;
      }
      top = -1 * index * height;

      if (top < minTop || top > 0) {
        return;
      }

      $list
        .stop(queue, true, true)
        .queue(queue, n => $target.data('disabled', true) && n())
        .animate({ top: `${top}em` }, {
          queue,
          duration: 600,
          easing: 'easeOutSine',
        })
        .queue(queue, n => $target.data('disabled', null) && n())
        .dequeue(queue);
    });
  },
};
