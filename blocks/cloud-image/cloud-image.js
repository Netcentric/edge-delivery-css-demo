function addClassToDivsWithPicture() {
  const cloudImageElements = document.querySelectorAll('.cloud-image');
  cloudImageElements.forEach((cloudImage) => {
    const childDivs = cloudImage.querySelectorAll(':scope > div');
    if (childDivs.length >= 2) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('cloud-image__header', 'text-center');
      childDivs[0].before(wrapper);
      wrapper.appendChild(childDivs[0]);
      wrapper.appendChild(childDivs[1]);
    }

    childDivs.forEach((div) => {
      if (div.querySelector('picture')) {
        div.classList.add('cloud-image__picture');
      }
    });
  });
}

function setDataAttributes() {
  // Arrays for top and left values calculation (mocked from the original site that seems random)
  const topValues = [
    20, 0, 50, 70, 100, 60, 90, 20, 0, 40,
    90, 80, 60, 60, 90, 10, 40, 50, 80,
  ];
  const leftValues = [
    50, 90, 60, 80, 30, 80, 0, 20, 60, 90,
    10, 70, 100, 30, 90, 0, 50, 90, 90, 30,
  ];
  const delayValues = [
    4, 5, 2, 34, 3, 7, 8,
    9, 15, 15, 12, 22, 20, 26, 33, 31, 25, 27,
  ];
  const cloudImagePictureElements = document.querySelectorAll('.cloud-image__picture');

  cloudImagePictureElements.forEach((div, index) => {
    const leftIndex = index % leftValues.length;
    const topIndex = index % topValues.length;
    const delayIndex = index % delayValues.length;
    div.setAttribute('data-left', leftValues[leftIndex]);
    div.setAttribute('data-top', topValues[topIndex]);
    div.setAttribute('data-delay', delayValues[delayIndex]);
  });
}

function positionImageInTheCloud() {
  const cloudImgContainer = document.querySelector('.cloud-image-wrapper');
  const cloudImagePictureElements = document.querySelectorAll('.cloud-image__picture');

  const {
    width: containerWidth,
    height: containerHeight
  } = cloudImgContainer.getBoundingClientRect();

  cloudImagePictureElements.forEach((element) => {
    const img = element.querySelector('img');
    if (!img) return;
    const { width: imgWidth, height: imgHeight } = img;
    const elementStyleTop = `${element.dataset.left * (1 - imgWidth / containerWidth)}`;
    const elementStyleLeft = `${element.dataset.top * (1 - imgHeight / containerHeight) * 0.96}`;
    element.style.left = (elementStyleLeft > 60) ? `${60}%` : `${elementStyleLeft}%`;
    element.style.top = (elementStyleTop > 57) ? `${57}%` : `${elementStyleTop}%`;
    element.style.animationDelay = `${element.dataset.delay - 36}s`;
  });
}

export default { positionImageInTheCloud };

addClassToDivsWithPicture();
setDataAttributes();
