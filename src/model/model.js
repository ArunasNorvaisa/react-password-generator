import * as styles from '../css/styles.scss';

export const MAX_PASSWORD_LENGTH = 255;
export const MIN_PASSWORD_LENGTH = 2;
export const MAX_NUMBER_OF_PASSWORDS = 199;
export const MIN_NUMBER_OF_PASSWORDS = 1;

export const Functor = (v) => ({
  map: (f) => Functor(f(v)),
  out: (f) => f(v),
});

export function renderPasswords(howMany, length, options) {
  return Functor([]).out((passwords) => {
    for (let i = 1; i <= howMany; i++) {
      Functor()
        .map(() => generateCharactersList(options))
        .map((charList) => generateSinglePassword(charList, length))
        .out((password) => passwords.push(password));
    }

    return passwords;
  });
}

export function generateCharactersList(options) {
  return Functor('').out((charList) => {
    options.forEach((option) => {
      if (option.selected) {
        charList += option.characters;
      }
    });

    return charList;
  });
}

export function generatePassword(array, characterList) {
  let password = '';
  for (const number of array) {
    Functor()
      // Calculating random integer in the range of 0-(charactersList.length-1)
      // inspired by: https://stackoverflow.com/questions/1527803/
      // (only we do not need Math.floor() as bitwise operator >> is used)
      .map(() => (number * characterList.length) >> 16)
      .out((randomIndex) => (password += characterList[randomIndex]));
  }

  return password;
}

export function generateSinglePassword(characterList, passwordLength) {
  return Functor()
    .map(() => new Uint16Array(passwordLength))
    .map((emptyNumbersArray) => crypto.getRandomValues(emptyNumbersArray))
    .out((randomNumbersArray) =>
      generatePassword(randomNumbersArray, characterList)
    );
}

export function handleClipboardCopy(event) {
  const id = event.target.id;
  const container = document.getElementById(id);
  const text = container.innerText;
  copyToClipboard(text);

  const notification = document.createElement('div');
  notification.classList.add(`${styles.red}`);
  notification.innerText = 'COPIED!!!';
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1791);
}

export function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
}

export function validate(field, value) {
  let number = Number(value);
  switch (field) {
    case 'passwordLength':
      if (number > MAX_PASSWORD_LENGTH) {
        number = MAX_PASSWORD_LENGTH;
      } else if (number < MIN_PASSWORD_LENGTH) {
        number = MIN_PASSWORD_LENGTH;
      }
      return number;
    case 'numberOfPasswords':
      if (number > MAX_NUMBER_OF_PASSWORDS) {
        number = MAX_NUMBER_OF_PASSWORDS;
      } else if (number < MIN_NUMBER_OF_PASSWORDS) {
        number = MIN_NUMBER_OF_PASSWORDS;
      }
      return number;
    default:
      return number;
  }
}
