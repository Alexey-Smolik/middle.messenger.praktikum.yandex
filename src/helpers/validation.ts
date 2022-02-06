export function validateField(fieldName, fieldValue) {
  const passwordFieldValue = document.getElementById('password');
  const password2FieldValue = document.getElementById('password2');

  switch (fieldName) {
    case 'email':
      return showError(
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        document.getElementById('emailError'),
        fieldValue,
        'Неверный email'
      );
    case 'login':
      return showError(
        /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
        document.getElementById('loginError'),
        fieldValue,
        'Неверный логин'
      );
    case 'first_name':
    case 'second_name':
      return showError(
        /^[A-ZА-Я][a-zа-я-]*$/,
        document.getElementById(fieldName === 'first_name' ? 'firstNameError' : 'secondNameError'),
        fieldValue,
        'Некорректное значение поля'
      );
    case 'phone':
      return showError(
        /^(\+)?\d{5,15}$/,
        document.getElementById('phoneError'),
        fieldValue,
        'Некорректное значение поля'
      );
    case 'password':
    case 'password2':
      if (fieldName === 'password') {
        if (showError(
          /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
          document.getElementById('passwordError'),
          fieldValue,
          'Пароль должен быть минимум из 8 символов, содержать минимум 1 большую букву и 1 цифру'
        )) {
          if (password2FieldValue.value !== fieldValue) {
            document.getElementById('password2Error').innerHTML = 'Пароли не совпадают';

            return false;
          }

          return true;
        }

        return false;
      }

      if (passwordFieldValue.value && passwordFieldValue.value !== fieldValue) {
        const password2ErrorEl = document.getElementById('password2Error');

        password2ErrorEl.innerHTML = 'Пароли не совпадают';
        password2ErrorEl.style.display = 'block';

        return false;
      }

      return showError(
        /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
        document.getElementById('password2Error'),
        fieldValue,
        'Пароль должен быть минимум из 8 символов, содержать минимум 1 большую букву и 1 цифру'
      );
  }
}

export function showError(regexp, errorTextEl, fieldValue, errorText) {
  if (!regexp.test(fieldValue)) {
    errorTextEl.innerHTML = errorText;
    errorTextEl.style.display = 'block';

    return false;
  }

  errorTextEl.innerHTML = '';
  errorTextEl.style.display = 'none';

  return true;
}
