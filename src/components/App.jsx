import React, { useState } from 'react';
import * as styles from '../css/styles.scss';
import { handleClipboardCopy, renderPasswords } from '../hooks/usePasswords';

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

  const pwdArray = renderPasswords(numberOfPasswords, passwordLength, options);

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
