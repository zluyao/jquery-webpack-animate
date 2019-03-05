import 'fullpage.js';
import 'jquery.easing';
import { EventEmitter } from 'events';

import logic from './container.logic';

const bus = new EventEmitter();

logic(bus);

let previewIndex = -1;
export default {
  ready() {
    $('#container').fullpage({
      navigation: true,
      verticalCentered: false,
      anchors: ['page-1', 'page-2', 'page-3', 'page-4'],
      onLeave(index, nextIndex) {
        bus.emit(`${nextIndex}.before`);
        bus.emit('*.before', nextIndex);

        previewIndex = index;
      },
      afterLoad(anchorLink, index) {
        bus.emit(`${previewIndex}-*.after`);
        bus.emit(`${index}.after`);
        bus.emit('*.after', index);
      },
    });
  },
};
