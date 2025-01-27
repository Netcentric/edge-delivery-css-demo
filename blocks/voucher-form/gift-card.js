import GiftCardTemplate from './gift-card.template.js';

export default function generateGiftCard(block, data) {
  const giftCard = GiftCardTemplate(data);
  block.insertAdjacentHTML('beforeend', giftCard);

  const card = block.querySelector('.gift-card');
  card.addEventListener('click', () => {
    card.classList.toggle('gift-card-open');
  });
}
