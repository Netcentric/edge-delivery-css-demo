export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('testimonial-item');

    row.querySelectorAll('a').forEach((a) => {
      const link = a.href;

      if (!link.startsWith(window.location.origin)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });
}
