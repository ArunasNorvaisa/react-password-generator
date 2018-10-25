import React, { Component } from 'react';

class Form extends Component {
    state = {
        options: [
            {
                name: "Lowercase characters",
                characters: "abcdefghijklmnopqrstuvwxyz",
                selected: false
            },
            {
                name: "Uppercase characters",
                characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                selected: false
            },
            {
                name: "Symbols",
                characters: "!@#$%^&*()_-+=|{}[]].,;:?\\/<>'\"",
                selected: false
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

    renderPasswords = (numberOfPasswords) => {
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
            let j = Math.round(value * (charactersList.length - 1) / 255);
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
