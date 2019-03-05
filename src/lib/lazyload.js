export default function lazyload(container) {
  $(container).find('img[data-href]:not([src])').each(function () {
    // eslint-disable-next-line
    const $target = $(this);

    $target.attr('src', $target.data('href'));
  });
}
