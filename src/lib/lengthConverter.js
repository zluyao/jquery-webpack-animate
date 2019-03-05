const $root = $('html');

const rateContainer = {};
function getRate() {
  const currentWidth = screen.availWidth;

  const rate = rateContainer[currentWidth];
  if (rate) {
    return rate;
  }

  return rateContainer[currentWidth] = parseFloat($root.css('font-size'));
}

export function toRem(px) {
  return px / getRate();
};

export function round(number, length) {
  const pow = Math.pow(10, length);
  return Math.round(number * pow) / 100;
}

export function floor(number, length) {
  const pow = Math.pow(10, length);
  return Math.floor(number * pow) / 100;
}
