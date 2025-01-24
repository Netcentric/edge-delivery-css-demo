import GiftCardCursorSvg from './parts/gift-card-cursor-svg.js';
import GiftCardFrontSvg from './parts/gift-card-front-svg.js';
import GiftCardVoucherSvg from './parts/gift-card-voucher-svg.js';
import GiftCardLogoSvg from './parts/gift-card-logo-svg.js';
import GiftCardInsideLeftSvg from './parts/gift-card-inside-left-svg.js';
import GiftCardCenterSvg from './parts/gift-card-center-svg.js';

export default function GiftCardTemplate({
  to, from, how, message, signature,
}) {
  return `<div class="card-scroller">
    <button class="gift-card" type="button">
        <div class="gift-card-wrapper">
            <div class="gift-card-front">${GiftCardFrontSvg()}
                <div class="gift-card-voucher">${GiftCardVoucherSvg()}</div>
                <div class="gift-card-logo">${GiftCardLogoSvg()}</div>
                <div class="gift-card-name ">Für ${to}</div>
            </div>
            <div class="gift-card-inside-left">${GiftCardInsideLeftSvg()}
                <div class="gift-card-intro">Hallo ${to}, ich schenke dir etwas von meiner Zeit:
                </div>
                <div class="gift-card-title">${how}</div>
                <div class="gift-card-footer">css.ch/zeitschenken</div>
                <div class="gift-card-center">${GiftCardCenterSvg()}</div>
            </div>
        </div>
        <div class="gift-card-inside-right">
            <div class="gift-card-message">${message}</div>
            <div class="gift-card-greeting">${signature}</div>
        </div>
        <div class="gift-card-cursor">${GiftCardCursorSvg()} <span>Karte schliessen</span></div>
    </button>
</div>`;
}
