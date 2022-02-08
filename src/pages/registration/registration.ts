import { validateField } from '../../helpers/validation';

let inputs;

document.addEventListener("DOMContentLoaded", () => {
  inputs = Array.from(document.getElementById('registrationForm').elements);

  inputs.forEach(input => {
    if (input.nodeName === 'INPUT') {
      input.addEventListener('blur', () => validateField(input.name, input.value));
    }
  });

  document.getElementById('registerButton').addEventListener('click', () => {
    showFieldsValues();
  })
});

function showFieldsValues() {
  // inputs.some(input => input.nodeName === 'INPUT' ? false : !validateField(input.name, input.value));

  inputs.forEach(input => {
    if (input.nodeName === 'INPUT') {
      validateField(input.name, input.value);
    }
  });
}
