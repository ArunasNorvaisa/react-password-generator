import React, {useState} from 'react';
import * as styles from '../css/styles.scss';

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
  passwordLength: 12,
  numberOfPasswords: 10
};

function App () {

  const [state, setState] = useState(initialState);
  const { numberOfPasswords, options, passwordLength } = state;

  function renderPasswords(numberOfPasswords) {
    const passwordsArray = [];
    const charactersList = generateCharactersList();
    for(let i = 1; i <= numberOfPasswords; i++) {
      passwordsArray.push(generateSinglePassword(charactersList));
    }
    return passwordsArray;
  }

  function generateCharactersList() {
    let charactersList = "";
    options.forEach(option => {
      if(option.selected) {
        charactersList += option.characters;
      }
    });
    return charactersList;
  }

  function generateSinglePassword(charactersList) {
    const randomNumbersArray = new Uint16Array(state.passwordLength);
    crypto.getRandomValues(randomNumbersArray);
    let password = "";
    randomNumbersArray.forEach(value => {
      // Calculating random integer in the range of 0-(charactersList.length-1)
      // inspired by: https://stackoverflow.com/questions/1527803/
      // (only we do not need Math.floor() as bitwise operator >> is used)
      const randomIndex = value * charactersList.length >> 16;
      password += charactersList[randomIndex];
    });
    return password;
  }

  function handlePasswordLengthChange(event) {
    setState({...state, passwordLength: event.target.value });
    if (event.target.value < 2) {
      setState({...state, passwordLength: 2 });
    }
  }

  function handleNumberOfPasswordsChange(event) {
    setState({...state, numberOfPasswords: event.target.value });
    if (event.target.value < 1) {
      setState({...state, numberOfPasswords: 1 });
    }
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
    const text = document.getElementById(id).innerText;
    copyToClipboard(text);
    // We prepare to alter copied text to temporary value
    const original = text;
    // Altering the text
    // Not very elegant, so please feel free to comment and recommend something else.
    const tempText = () => {
      let tmpText = 'COPIED!';
      const diff = state.passwordLength - tmpText.length;
      if(diff > 0) {
        // diff >> 1 is the same as diff / 2; diff & 1 - the same as diff % 2
        tmpText = '!'.repeat((diff >> 1) + (diff & 1)) + tmpText + '!'.repeat(diff >> 1);
        return tmpText;
      }
      return tmpText;
    };
    document.getElementById(id).innerText = tempText();
    document.getElementById(id).parentElement.classList.add(`${styles.red}`);

    // Setting timeout of 1.2s and bringing the original password back
    setTimeout(() => {
      document.getElementById(id).innerText = original;
      document.getElementById(id).parentElement.classList.remove(`${styles.red}`);
    }, 1200);
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

  return <div className={ styles.container }>
    <table>
      <tbody>
        {
          options.map((option, index) => {
            return <tr key = { option.name }>
              <td><div className={styles.description}>{ option.name }</div></td>
              <td><div className={styles.description}>{ option.characters }</div></td>
              <td>
                <input
                  type="checkbox"
                  checked={ option.selected }
                  onChange={ () => handleCharListChange(index) }
                />
              </td>
            </tr>
          })
        }
        <tr>
          <td><div className={styles.description}>Password Length</div></td>
          <td><input type="number" value={ passwordLength } onChange={ handlePasswordLengthChange } /></td>
        </tr>
        <tr>
          <td><div className={styles.description}>Number of Passwords</div></td>
          <td><input type="number" value={ numberOfPasswords } onChange={ handleNumberOfPasswordsChange } /></td>
        </tr>
      </tbody>
    </table>
    <h1>Generated passwords</h1>
    <h3>Please left-click on text to get it copied</h3>
    <div className={styles.generatedPasswords}>
      {
        pwdArray.map((value, index) => {
          return <p key = { index } className={ styles.password }>
            <span id={`password${index}`} onClick={ handleClipboardCopy }>
              {value}
            </span>
          </p>
        })
      }
    </div>
  </div>
}

export default App;
