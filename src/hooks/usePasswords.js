import * as styles from '../css/styles.scss';

const Functor = v => ({
  map: f => Functor(f(v)),
  out: f => f(v)
});

export function renderPasswords(howMany, length, options) {
  return Functor([])
    .out(passwords => {
      for (let i = 1; i <= howMany; i++) {
        Functor()
          .map(() => generateCharactersList(options))
          .map(charList => generateSinglePassword(charList, length))
          .out(password => passwords.push(password))
      }

      return passwords;
    })
}

function generateCharactersList(options) {
  return Functor('')
    .out(charList => {
      options.forEach(option => {
        if (option.selected) {
          charList += option.characters;
        }
      });

      return charList;
    })
}

function generateSinglePassword(characterList, passwordLength) {
  return Functor()
    .map(() => new Uint16Array(passwordLength))
    .map(randomNumbersArray => crypto.getRandomValues(randomNumbersArray))
    .out(randomNumbersArray => {
      let password = '';
      for (const number of randomNumbersArray) {
        Functor()
        // Calculating random integer in the range of 0-(charactersList.length-1)
        // inspired by: https://stackoverflow.com/questions/1527803/
        // (only we do not need Math.floor() as bitwise operator >> is used)
          .map(() => number * characterList.length >> 16)
          .out(randomIndex => password += characterList[randomIndex])
      }

      return password;
    });
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
  }, 1291);
}

// Below function was shamelessly copied from https://stackoverflow.com/questions/45071353
function copyToClipboard(str) {
  const el = document.createElement('textarea'); // Create a <textarea> element
  el.value = str;                                         // Set its value to the string that you want copied
  el.setAttribute('readonly', '');      // Make it readonly to be tamper-proof
  document.body.appendChild(el);                          // Append the <textarea> element to the HTML document
  const selected = document.getSelection().rangeCount > 0 // Check if there is any content selected previously
    ? document.getSelection().getRangeAt(0)         // Store selection if found
    : false;                                              // Mark as false to know no selection existed before
  el.select();                                            // Select the <textarea> content
  document.execCommand('copy');                // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el);                          // Remove the <textarea> element
  if (selected) {                                         // If a selection existed before copying
    document.getSelection().removeAllRanges();            // Unselect everything on the HTML document
    document.getSelection().addRange(selected);           // Restore the original selection
  }
}