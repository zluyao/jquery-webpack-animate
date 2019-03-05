export default {
  init() {
    const queue = 'a.btn-download'
      , $target = $('a.btn-download')
      , step = now => $target.css('box-shadow', `0 0 ${now}rem 0 #6AA8E9`);

    $target.attr('href', '/download').hover(
      () => $target
        .stop(queue, true, false)
        .animate({ boxShadow: 0.16 }, {
          step,
          queue,
          duration: 200,
        })
        .dequeue(queue),
      () => $target
        .stop(queue, true, false)
        .animate({ boxShadow: 0 }, {
          step,
          queue,
          duration: 200,
        })
        .dequeue(queue),
    );

    const joinQueue = '.btn-join'
      , $join = $(joinQueue)
      , stepJoin = now => $join.css('box-shadow', `0 0 ${now}rem 0 #aaa`);

    $join.click(() => location.href = '/invite').hover(
      () => $join
        .stop(joinQueue, true, false)
        .animate({ boxShadow: 0.16 }, {
          duration: 200,
          step: stepJoin,
          queue: joinQueue,
        })
        .dequeue(joinQueue),
      () => $join
        .stop(joinQueue, true, false)
        .animate({ boxShadow: 0 }, {
          duration: 200,
          step: stepJoin,
          queue: joinQueue,
        })
        .dequeue(joinQueue),
    );
  },
};
