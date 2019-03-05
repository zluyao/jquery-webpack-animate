import menu from '$lib/common/menu';
import container from './container';
import video from './video';
import moreBtn from './moreBtn';

export default function execute(bus) {
  function ingather(args) {
    for (const key in args) {
      bus.on(key, args[key]);
    }
  }

  ingather(menu);
  ingather(video);
  ingather(moreBtn);
  ingather(container);
}
