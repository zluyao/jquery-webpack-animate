import menu from '$lib/common/menu';
import other from './other';
import slideBox from './slideBox';
import container from './container';
import doctorList from './doctorList';

export default function execute(bus) {
  function ingather(args) {
    for (const key in args) {
      bus.on(key, args[key]);
    }
  }

  ingather(menu);
  ingather(other);
  ingather(slideBox);
  ingather(container);
  ingather(doctorList);
}
