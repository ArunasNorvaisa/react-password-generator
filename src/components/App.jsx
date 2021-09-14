import React, { useState } from 'react';
import * as styles from '../css/styles.scss';

const Functor = v => ({
  map: f => Functor(f(v)),
  out: f => f(v)
});

const initialState = {
  options: [
    {
      name: 'Lowercase characters',
      characters: 'abcdefghijklmnopqrstuvwxyz',
      selected: true
    },
    {
      name: 'Uppercase characters',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      selected: true
    },
    {
      name: 'Symbols',
      characters: '!@#$%^&*()_-+=|{}[]].,;:?\\/\"<>\'',
      selected: true
    },
    {
      name: 'Digits',
      characters: '0123456789',
      selected: true
    }
  ],
  passwordLength: 30,
  numberOfPasswords: 11
};

function App() {

  const [state, setState] = useState(initialState);
  const { numberOfPasswords, options, passwordLength } = state;

  function renderPasswords(numberOfPasswords) {
    return Functor([])
      .out(passwords => {
        for (let i = 0; i < numberOfPasswords; i++) {
          Functor(generateCharactersList())
            .map(charList => generateSinglePassword(charList))
            .out(password => passwords.push(password))
        }
        return passwords;
      })
  }

  function generateCharactersList() {
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

  function generateSinglePassword(characterList) {
    const randomNumbersArray = new Uint16Array(passwordLength);
    crypto.getRandomValues(randomNumbersArray);
    let password = '';
    for (const number of randomNumbersArray) {
      // Calculating random integer in the range of 0-(charactersList.length-1)
      // inspired by: https://stackoverflow.com/questions/1527803/
      // (only we do not need Math.floor() as bitwise operator >> is used)
      const randomIndex = number * characterList.length >> 16;
      password += characterList[randomIndex];
    }

    return password;
  }

  function handleCharListChange(index) {
    setState(() => {
      options[index] = { ...options[index], selected: !options[index].selected };
      const isAtLeastOneOptionSelected = options.some(option => option.selected);
      if (!isAtLeastOneOptionSelected) {
        options[index] = { ...options[index], selected: true };
      }

      return { ...state };
    });
  }

  function handleClipboardCopy(event) {
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
    }, 1221);
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

  const pwdArray = renderPasswords(numberOfPasswords);

  return <div className={styles.container}>
    <table>
      <tbody>
      {
        options.map((option, index) => {
          return <tr key={option.name}>
            <td>
              <div className={styles.description}>{option.name}</div>
            </td>
            <td>
              <div className={styles.description}>{option.characters}</div>
            </td>
            <td>
              <input
                type="checkbox"
                checked={option.selected}
                onChange={() => handleCharListChange(index)}
              />
            </td>
          </tr>;
        })
      }
      <tr>
        <td>
          <div className={styles.description}>Password Length</div>
        </td>
        <td>
          <input
            type="number"
            min="2"
            value={passwordLength}
            onChange={e => setState({ ...state, passwordLength: e.target.value })}
          />
        </td>
      </tr>
      <tr>
        <td>
          <div className={styles.description}>Number of Passwords</div>
        </td>
        <td>
          <input
            type="number"
            min="1"
            value={numberOfPasswords}
            onChange={e => setState({ ...state, numberOfPasswords: e.target.value })}
          />
        </td>
      </tr>
      </tbody>
    </table>
    <h1>Generated passwords</h1>
    <h3>Please left-click on text to get it copied</h3>
    <div className={styles.generatedPasswords} id="notification">
      {
        pwdArray.map((value, index) => {
          return <p key={index} className={styles.password}>
            <span id={`password${index}`} onClick={handleClipboardCopy}>
              {value}
            </span>
          </p>;
        })
      }
    </div>
  </div>;
}

export default App;
