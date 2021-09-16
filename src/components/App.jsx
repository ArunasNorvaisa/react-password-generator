import React from 'react';
import usePasswords, { handleClipboardCopy } from '../hooks/usePasswords';
import * as styles from '../css/styles.scss';

function App() {
  const { state, pwdArray, change, handleCharListChange } = usePasswords();
  const { options, numberOfPasswords, passwordLength } = state;

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
            onChange={e => change('passwordLength', e.target.value)}
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
            onChange={e => change('numberOfPasswords', e.target.value)}
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
