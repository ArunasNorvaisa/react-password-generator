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
                characters: "!@#$%^&*()_-+=|{}[]].,;:?\\/\"<>'",
                selected: false
            },
            {
                name: "Digits",
                characters: "0123456789",
                selected: true
            }
        ],
        passwordLength: 10,
        numberOfPasswords: 10
    }

    // We can't run any loops in render(), so a separate method should be created
    renderPasswords = numberOfPasswords => {
        let passwordsArray = [];
        const charactersList = this.generateCharactersList();
        for(let i = 1; i <= numberOfPasswords; i++) {
            passwordsArray.push(this.generateSinglePassword(charactersList));
        }
        return passwordsArray;
    }

    // Generating string of all characters that we'll need (depending on state.options.selected)
    generateCharactersList = () => {
        let charactersList = "";
        let { options } = this.state;
        options.forEach(option => {
            if(option.selected) {
                charactersList += option.characters;
            }
        });
        return charactersList;
    }

    // Generating single password
    generateSinglePassword = charactersList => {
        // Creating Uint8Array-type array
        const randomNumbersArray = new Uint8Array( this.state.passwordLength );
        // Populating the new Uint8Array with random integers in the range of 0-255
        // (because this is what it can hold)
        window.crypto.getRandomValues( randomNumbersArray );
        let password = "";
        randomNumbersArray.forEach(value => {
            // Calculating random integer in the range of 0-(charactersList.length-1)
            // inspired by: https://stackoverflow.com/questions/1527803/
            // (only we do not need Math.floor() as bitwise operator >> is used)
            const randomIndex = value * charactersList.length >> 8;
            password += charactersList[randomIndex];
        });
        return password;
    };

    handlePasswordLengthChange = event => {
        this.setState({ passwordLength: event.target.value });
        if (event.target.value < 2) {
            this.setState({ passwordLength: 2 });
        }
    }

    handleNumberOfPasswordsChange = event => {
        this.setState({ numberOfPasswords: event.target.value });
        if (event.target.value < 1) {
            this.setState({ numberOfPasswords: 1 });
        }
    }

    handleCharListChange = index => {

        this.setState(prevState => {
            let options = [...prevState.options];
            options[index] = { ...options[index], selected: !options[index].selected };

            return { options: options };
        });
    }


    render() {
        const pwdArray = this.renderPasswords( this.state.numberOfPasswords );
        return <div className="container">
            <div  className="initial_data">
                {
                    this.state.options.map( (option, index) => {
                        return <div key = { option.name }>
                            <input type="text" value={ option.name } readOnly />
                            <input type="text" value={ option.characters } readOnly />
                            <input
                                type="checkbox"
                                checked={ option.selected }
                                onChange={ event => { this.handleCharListChange(index, event) } }
                            />
                        </div>
                    })
                }
                <div>
                    <input type="text" value="Password Length" readOnly />
                    <input type="number" value={ this.state.passwordLength } onChange={ this.handlePasswordLengthChange } />
                </div>
                <div>
                    <input type="text" value="Number of Passwords" readOnly />
                    <input type="number" value={ this.state.numberOfPasswords } onChange={ this.handleNumberOfPasswordsChange } />
                </div>
            </div>
            <h1>Generated passwords</h1>
            <div className="generated_passwords">
                {
                    pwdArray.map((value, index) => {
                        return <div key = { index } className="password">
                            <input type="text" value={ value } readOnly />
                        </div>
                    })
                }
            </div>
        </div>
    }
}

export default Form;
