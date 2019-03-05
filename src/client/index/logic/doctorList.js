export const mouseEnterImg = $target => {
  const hoverUrl = $target.find('+img').attr('src')
    , originalUrl = $target.attr('src');

  $target.attr('src', hoverUrl).removeClass('original').data('original', originalUrl);
};

export default {
  ready() {
    $('.page-2>ul.dr-list>li[data-href]>img').mouseenter(function () {
      // eslint-disable-next-line
      const $img = $(this)
        , $content = $img.parent()
        , href = $content.data('href')
        , $target = $('.page-2 img.img-doctor')
        , queue = 'img-doctor-opacity'
        , info = 'doctor-info';

      if ($target.attr('src') === href) {
        return;
      }

      // 医生信息模块
      const $container = $('.page-2>.img-grid>.info');
      $container
        .stop(info, true, true)
        .animate({ opacity: 0 }, {
          queue: info,
          duration: 300,
          easing: 'easeOutQuad',
        })
        .queue(info, n => {
          $target.attr('src', href);

          $container.find('.name').text($content.data('name') || '--');
          $container.find('.level').text($content.data('level') || '--');
          $container.find('.hospital').text($content.data('hospital') || '--');
          $container.find('.department').text($content.data('department') || '--');

          n();
        })
        .animate({ opacity: 1 }, {
          queue: info,
          duration: 800,
          easing: 'linear',
        })
        .dequeue(info);

      // 医生大图透明度
      $target
        .stop(queue, true, true)
        .animate({ opacity: 0 }, {
          queue,
          duration: 300,
          easing: 'easeOutQuad',
        })
        .animate({ opacity: 1 }, {
          queue: queue,
          duration: 800,
          easing: 'linear',
        })
        .dequeue(queue);

      // 医生缩略图切换
      $('.page-2>ul.dr-list>li[data-href]>img').each(function () {
        // eslint-disable-next-line
        const $item = $(this)
          , originalUrl = $item.data('original');

        if (originalUrl) {
          $item.attr('src', originalUrl).addClass('original');
        }

      });

      mouseEnterImg($img);
    });
  },
};
