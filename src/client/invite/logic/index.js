import menu from '$lib/common/menu';
import container from './container';
import doctorList from './doctorList';
import rotate from './rotate';

export default function execute(bus) {
  function ingather(args) {
    for (const key in args) {
      bus.on(key, args[key]);
    }
  }

  ingather(menu);
  ingather(container);
  ingather(doctorList);
  ingather(rotate);
}
