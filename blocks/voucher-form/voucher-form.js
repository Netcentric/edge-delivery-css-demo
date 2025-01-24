import createField from '../form/form-fields.js';
import generateGiftCard from './gift-card.js';

function activateStep(step) {
  document.querySelectorAll('.voucher-form-step').forEach((s, i) => {
    s.classList.toggle('voucher-form-step-active', i === step);
  });
}

function validateStep(form) {
  const activeStep = document.querySelector('.voucher-form-step-active');
  const invalidFields = [...activeStep.querySelectorAll('input, select, textarea')].filter((field) => !field.checkValidity());
  form.querySelector('.voucher-form-next').disabled = invalidFields.length > 0;
}

function updateButtonsVisibility(form, steps, activeStepIndex) {
  const nextButton = document.querySelector('.voucher-form-next');
  const submitButton = document.querySelector('.voucher-form-submit');
  if (activeStepIndex === steps.length - 1) {
    nextButton.style.display = 'none';
    submitButton.style.display = 'inline-block';
    form.dispatchEvent(new CustomEvent('voucher-form:step:last'));
  } else {
    nextButton.style.display = 'inline-block';
    submitButton.style.display = 'none';
  }
}

function generateActions(form) {
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = 'Weiter';
  nextButton.classList.add('voucher-form-next');
  nextButton.addEventListener('click', () => {
    const steps = document.querySelectorAll('.voucher-form-step');
    const activeStepEl = document.querySelector('.voucher-form-step-active');
    const activeStepIndex = [...steps].indexOf(activeStepEl);
    const nextStepIndex = activeStepIndex + 1;
    const nextStep = steps[nextStepIndex];
    if (nextStep) {
      activateStep(nextStepIndex);
      form.dispatchEvent(new CustomEvent('voucher-form:step:change'));
      updateButtonsVisibility(form, steps, nextStepIndex);
    }
  });

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.textContent = 'Zurück';
  prevButton.classList.add('voucher-form-prev');
  prevButton.addEventListener('click', () => {
    const steps = document.querySelectorAll('.voucher-form-step');
    const activeStepEl = document.querySelector('.voucher-form-step-active');
    const activeStepIndex = [...steps].indexOf(activeStepEl);
    const prevStepIndex = activeStepIndex - 1;
    const prevStep = steps[prevStepIndex];
    if (prevStep) {
      activateStep(prevStepIndex);
      form.dispatchEvent(new CustomEvent('voucher-form:step:change'));
      updateButtonsVisibility(form, steps, prevStepIndex);
    }
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Jetzt Gutschein teilen';
  submitButton.classList.add('voucher-form-submit');
  submitButton.style.display = 'none';

  const actions = document.createElement('div');
  actions.classList.add('voucher-form-actions');
  actions.append(prevButton, nextButton, submitButton);

  return actions;
}

async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  form.classList.add('voucher-form-form');

  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset, i) => {
    fieldset.classList.add('voucher-form-step');
    if (i === 0) {
      fieldset.classList.add('voucher-form-step-active');
    }
    const stepCounter = document.createElement('div');
    stepCounter.classList.add('voucher-form-step-counter');
    stepCounter.textContent = `${i + 1} / ${fieldsets.length}`;

    fieldset.appendChild(stepCounter);
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  const voucherFormPreview = document.createElement('div');
  voucherFormPreview.classList.add('voucher-form-preview', 'voucher-form-step');
  form.append(voucherFormPreview);

  form.append(generateActions(form));

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name.startsWith('step-')) return;
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

function generatePreview(form) {
  const preview = form.querySelector('.voucher-form-preview');
  preview.innerHTML = '';
  const data = generatePayload(form);
  generateGiftCard(preview, data);
}

async function submitForm(form, event) {
  event.preventDefault();

  const submit = form.querySelector('button[type="submit"]');

  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    // create payload
    const payload = generatePayload(form);
    // eslint-disable-next-line no-console
    console.log(payload);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    form.setAttribute('data-submitting', 'false');
    submit.disabled = false;
  }
}

function addFormListeners(form) {
  validateStep(form);
  form.addEventListener('voucher-form:step:change', () => validateStep(form));
  form.addEventListener('voucher-form:step:last', () => generatePreview(form));
  form.addEventListener('input', () => validateStep(form));
  form.addEventListener('submit', (e) => submitForm(form, e));

  const fromField = form.querySelector('input[name="from"]');
  const signatureField = form.querySelector('textarea[name="signature"]');
  if (fromField && signatureField) {
    const originalSignature = signatureField.value;
    fromField.addEventListener('change', () => {
      signatureField.value = originalSignature.replace('{FROM}', `\n${fromField.value}`);
    });
  }
}

export default async function decorate(block) {
  const icon = block.querySelector('.icon');
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find((link) => link.startsWith(window.location.origin) && link.endsWith('.json'));
  const submitLink = formLink?.split('.json')[0];
  if (!formLink || !submitLink) return;

  block.innerHTML = '';
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('voucher-form-header');
  iconWrapper.appendChild(icon);
  block.appendChild(iconWrapper);

  const form = await createForm(formLink, submitLink);
  block.appendChild(form);

  addFormListeners(form);
}
