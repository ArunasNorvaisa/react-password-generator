import { useState } from 'react';
import { renderPasswords, validate } from '../model/model';

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
    setState(prevState => {
      prevState.options[index] = {
        ...prevState.options[index],
        selected: !prevState.options[index].selected,
      };
      const isAtLeastOneOptionSelected = prevState.options.some(
        option => option.selected
      );
      if (!isAtLeastOneOptionSelected) {
        options[index] = { ...options[index], selected: true };
      }

      return { ...state };
    });
  }

  return {
    state,
    pwdArray,
    change,
    handleCharListChange,
  };
};

export default usePasswords;
