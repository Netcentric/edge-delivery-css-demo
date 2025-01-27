import voucherBackgroundSvg from './voucher-background-svg.js';

export default function decorate(block) {
  /* Create the structure */
  const voucherAttributes = block.querySelectorAll(':scope > div:nth-child(odd)');
  const voucherContent = block.querySelectorAll(':scope > div:nth-child(even)');

  voucherAttributes.forEach((attr, index) => {
    const attributes = attr.querySelectorAll('p');
    const { href } = attributes[0].querySelector('a');
    const classString = attributes.length > 1 ? attributes[1].textContent : '';
    const content = voucherContent[index];
    const wrapper = document.createElement('div');

    // Split the text content by commas and add them as classes
    const i = Math.random();
    const classes = [
      'voucher-item',
      // eslint-disable-next-line no-nested-ternary
      i > 0.8 ? 'voucher-item-rotate-l' : i > 0.6 ? 'voucher-item-rotate-r' : 'voucher-item-rotate-default',
      ...classString.split(',').map((cls) => `voucher-item-${cls.trim()}`),
    ];
    wrapper.classList.add(...classes);

    const svg = voucherBackgroundSvg();

    wrapper.insertAdjacentHTML('afterbegin', svg);

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('voucher-item-text');

    // Append the even row content to the wrapper
    while (content.firstChild) {
      textWrapper.appendChild(content.firstChild);
    }
    wrapper.appendChild(textWrapper);

    const findText = textWrapper.querySelectorAll('div');
    const textOriginal = findText[0];
    const textHover = findText[1];

    textOriginal.innerHTML = textOriginal.textContent;
    textOriginal.classList.add('voucher-item-text-original');
    textHover.innerHTML = textHover.textContent;
    textHover.classList.add('voucher-item-text-hover');

    const link = document.createElement('a');
    link.href = href;
    link.classList.add('voucher-link');

    link.appendChild(wrapper);

    // Replace the original odd row with the new wrapper
    block.replaceChild(link, attr);
    // Remove the original even row
    block.removeChild(content);
  });
}
