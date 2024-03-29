import React from 'react';
import usePasswords from '../hooks/usePasswords';
import {
  MAX_NUMBER_OF_PASSWORDS,
  MAX_PASSWORD_LENGTH,
  MIN_NUMBER_OF_PASSWORDS,
  MIN_PASSWORD_LENGTH,
  handleClipboardCopy,
} from '../model/model';
import * as styles from '../css/styles.scss';

function App() {
  const { state, pwdArray, change, handleCharListChange } = usePasswords();
  const { options, numberOfPasswords, passwordLength } = state;

  return (
    <div className={styles.container}>
      <table>
        <tbody>
          {options.map((option, index) => {
            return (
              <tr key={option.name}>
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
              </tr>
            );
          })}
          <tr>
            <td>
              <div className={styles.description}>
                Password Length <span>(max: {MAX_PASSWORD_LENGTH})</span>
              </div>
            </td>
            <td>
              <input
                type="number"
                min={MIN_PASSWORD_LENGTH}
                max={MAX_PASSWORD_LENGTH}
                value={passwordLength}
                onChange={(e) => change('passwordLength', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.description}>
                Number of Passwords{' '}
                <span>(max: {MAX_NUMBER_OF_PASSWORDS})</span>
              </div>
            </td>
            <td>
              <input
                type="number"
                min={MIN_NUMBER_OF_PASSWORDS}
                max={MAX_NUMBER_OF_PASSWORDS}
                value={numberOfPasswords}
                onChange={(e) => change('numberOfPasswords', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h1>Generated passwords</h1>
      <h3>Please click on text to copy it to clipboard</h3>
      <div className={styles.generatedPasswords} id="notification">
        {pwdArray.map((value, index) => {
          return (
            <p key={index} className={styles.password}>
              <span
                role="none"
                id={`password${index}`}
                onClick={handleClipboardCopy}
              >
                {value}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default App;
