import { validateField } from '../../helpers/validation';

let inputs;
let saveBtnContainer;
let footer;

document.addEventListener("DOMContentLoaded", () => {
  inputs = Array.from(document.getElementById('profileForm').elements);
  saveBtnContainer = document.getElementById('saveBtnContainer');
  footer = document.getElementById('footer');

  inputs.forEach(input => {
    if (input.nodeName === 'INPUT') {
      input.addEventListener('blur', () => validateField(input.name, input.value));
    }
  });

  document.getElementById('backPanel').addEventListener('click', () => {
    window.location.href = '/src/pages/chats/chats.html';
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    footer.style.display = 'block';
    saveBtnContainer.style.display = 'none';

    inputs.forEach(input => {
      if (input.nodeName === 'INPUT') {
        validateField(input.name, input.value);
        input.setAttribute('disabled', 'true');
      }
    });
  });

  document.getElementById('changeDataBtn').addEventListener('click', () => {
    saveBtnContainer.style.display = 'block';
    footer.style.display = 'none';

    inputs.forEach(input => {
      if (input.nodeName === 'INPUT') {
        input.removeAttribute('disabled');
      }
    });
  })
});
