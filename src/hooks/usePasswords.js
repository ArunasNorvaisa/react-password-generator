import { useState } from 'react';
import { adjustAt, renderPasswords, validate } from '../model/model';

const initialState = {
  options: [
    {
      name: 'Lowercase characters',
      characters: 'abcdefghijklmnopqrstuvwxyz',
      selected: true,
    },
    {
      name: 'Uppercase characters',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      selected: true,
    },
    {
      name: 'Symbols',
      characters: '!@#$%^&*()_-+=|{}[]].,;:?\\/"<>\'',
      selected: true,
    },
    {
      name: 'Digits',
      characters: '0123456789',
      selected: true,
    },
  ],
  passwordLength: 30,
  numberOfPasswords: 11,
};

const usePasswords = () => {
  const [state, setState] = useState(initialState);
  const { numberOfPasswords, passwordLength, options } = state;
  const pwdArray = renderPasswords(numberOfPasswords, passwordLength, options);

  function change(field, value) {
    const validated = validate(field, value);

    setState({ ...state, [field]: validated });
  }

  function handleCharListChange(index) {
    if (state.options.filter((x) => x.selected).length === 1) {
      setState(function (prevState) {
        return {
          ...prevState,
          options: adjustAt(prevState.options, index, (x) => ({
            ...x,
            selected: true,
          })),
        };
      });
    } else {
      setState(function (prevState) {
        return {
          ...prevState,
          options: adjustAt(prevState.options, index, (x) => ({
            ...x,
            selected: !x.selected,
          })),
        };
      });
    }
  }

  return {
    state,
    pwdArray,
    change,
    handleCharListChange,
  };
};

export default usePasswords;
