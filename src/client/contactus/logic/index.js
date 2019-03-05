import menu from '$lib/common/menu';

import container from './container';
import submitBtn from './submitBtn';
import placehodler from './placeholder';

export default function execute(bus) {
  function ingather(args) {
    for (const key in args) {
      bus.on(key, args[key]);
    }
  }

  ingather(menu);
  ingather(container);
  ingather(submitBtn);
  ingather(placehodler);
}
