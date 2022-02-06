import { showError } from '../../helpers/validation';

let inputs;

function validateField(fieldName, fieldValue) {
  switch (fieldName) {
    case 'login':
      return showError(
        /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
        document.getElementById('loginError'),
        fieldValue,
        'Неверный логин'
      );
    case 'password':
      showError(
        /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
        document.getElementById('passwordError'),
        fieldValue,
        'Пароль должен быть минимум из 8 символов, содержать минимум 1 большую букву и 1 цифру'
      );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  inputs = Array.from(document.getElementById('loginForm').elements);

  inputs.forEach((input) => {
    if (input.nodeName === 'INPUT') {
      input.addEventListener('blur', () => validateField(input.name, input.value));
    }
  });

  document.getElementById('loginButton').addEventListener('click', () => {
    showFieldsValues();
  });
});

function showFieldsValues() {
  inputs.forEach(input => {
    if (input.nodeName === 'INPUT') {
      validateField(input.name, input.value);
      console.log(input.value);
    }
  });
}
