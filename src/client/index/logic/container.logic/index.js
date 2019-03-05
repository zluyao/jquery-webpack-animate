import menu from './menu';
import page2 from './page2';
import page3 from './page3';
import number from './number';
import lazyload from './lazyload';
import dynamicPhone from './dynamicPhone';

export default function execute(bus) {
  function ingather(args) {
    for (const key in args) {
      bus.on(key, args[key]);
    }
  }

  ingather(menu);
  ingather(page2);
  ingather(page3);
  ingather(number);
  ingather(lazyload);
  ingather(dynamicPhone);
}
