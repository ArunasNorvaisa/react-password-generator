import React, { Component } from 'react';

class Form extends Component {
    state = {
        options: [
            {
                name: "Lowercase characters",
                characters: "abcdefghijklmnopqrstuvwxyz",
                selected: true
            },
            {
                name: "Uppercase characters",
                characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                selected: true
            },
            {
                name: "Symbols",
                characters: "!@#$%^&*()_-+=|{}[]].,;:?\\/<>'\"",
                selected: true
            },
            {
                name: "Digits",
                characters: "0123456789",
                selected: true
            }
        ],
        passwordLength: 16,
        numberOfPasswords: 9
    }

    // We can't run any loops in render(), so a separate method should be created
    renderPasswords = numberOfPasswords => {
        let passwordArray = [];
        for(let i = 1; i <= numberOfPasswords; i++) {
            passwordArray.push(`${ this.generatePassword() }`);
        }
        return passwordArray;
    }

    // Generating string of all characters that we'll need (depending on state.options.selected)
    generateCharactersList = () => {
        let charactersList = "";
        let { options } = this.state;
        options.map(option => {
            if(option.selected) {
                charactersList += option.characters;
            }
            return false;
        });
        return charactersList;
    }

    // Generating single password
    generatePassword = () => {
        const charactersList = this.generateCharactersList();
        // Creating Uint8Array-type array
        const randomNumbersArray = new Uint8Array( this.state.passwordLength );
        // populating the new Uint8Array with random integers in the range of 0-255
        // (because this is what it can hold)
        window.crypto.getRandomValues( randomNumbersArray );
        let password = "";
        randomNumbersArray.map(value => {
            // Calculating random integer in the range of 0-(charactersList.length-1)
            // idea: https://stackoverflow.com/questions/1527803/
            let j = Math.floor((value * charactersList.length) >> 8);
            password += charactersList[j];
            return false;
        });
        return password;
    };

    render() {
        const pwdArray = this.renderPasswords(this.state.numberOfPasswords);
        return <div className="container">
            {
                pwdArray.map(value => {
                    return <div key = { value } className="password">
                        <input type="text" value={ value } readOnly />
                    </div>
                })
            }
        </div>
    }
}

export default Form;
