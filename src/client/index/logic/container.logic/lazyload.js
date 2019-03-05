import lazyload from '$lib/lazyload';

import { mouseEnterImg } from '../doctorList';

let isFirstLoad = true;
export default {
  '2.before': () => {
    lazyload('.page-2');

    if (isFirstLoad) {
      mouseEnterImg($('.page-2>ul.dr-list>li[data-href]:eq(2)>img.original'));

      isFirstLoad = false;
    }
  },
  '3.before': () => lazyload('.page-3'),
  '4.before': () => lazyload('.page-4'),
};
