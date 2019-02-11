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
                selected: true
            },
            {
                name: "Digits",
                characters: "0123456789",
                selected: true
            }
        ],
        passwordLength: 15,
        numberOfPasswords: 10
    };

    // We can't run any loops in render(), so a separate method should be created
    renderPasswords = numberOfPasswords => {
        let passwordsArray = [];
        const charactersList = this.generateCharactersList();
        for(let i = 1; i <= numberOfPasswords; i++) {
            passwordsArray.push(this.generateSinglePassword(charactersList));
        }
        return passwordsArray;
    };

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
    };

    // Generating single password
    generateSinglePassword = charactersList => {
        // Creating Uint16Array-type array
        const randomNumbersArray = new Uint16Array( this.state.passwordLength );
        // Populating the new Uint16Array with random integers in the range of 0-65535
        // (because this is what it can hold)
        window.crypto.getRandomValues( randomNumbersArray );
        let password = "";
        randomNumbersArray.forEach(value => {
            // Calculating random integer in the range of 0-(charactersList.length-1)
            // inspired by: https://stackoverflow.com/questions/1527803/
            // (only we do not need Math.floor() as bitwise operator >> is used)
            const randomIndex = value * charactersList.length >> 16;
            password += charactersList[randomIndex];
        });
        return password;
    };

    handlePasswordLengthChange = event => {
        this.setState({ passwordLength: event.target.value });
        //the check below prevents from generating passwords less than 2 characters
        if (event.target.value < 2) {
            this.setState({ passwordLength: 2 });
        }
    };

    handleNumberOfPasswordsChange = event => {
        this.setState({ numberOfPasswords: event.target.value });
        //the check below prevents from generating less than 1 password
        if (event.target.value < 1) {
            this.setState({ numberOfPasswords: 1 });
        }
    };

    handleCharListChange = index => {

        this.setState(prevState => {
            const options = [...prevState.options];
            options[index] = { ...options[index], selected: !options[index].selected };
            //Following 2 lines check whether at least one char option is selected and
            //prevent unselecting them all, returning result only if at least 1 is there
            const isAtLeastOneOptionSelected = options.some(option => option.selected);
            if (isAtLeastOneOptionSelected) { return { options: options } };
        });

    };

    handleClipboardCopy = function(event) {
        const id = event.target.id;
        let text = document.getElementById(id).innerText;
        this.copyToClipboard(text);
        const original = text;
        document.getElementById(id).innerText = 'Copied!';

        setTimeout(() => {
            document.getElementById(id).innerText = original;
        }, 1200);
    }

    copyToClipboard(str) {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =
            document.getSelection().rangeCount > 0      // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0) // Store selection if found
                : false;                                // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
            document.getSelection().addRange(selected); // Restore the original selection
        }
      };

    render() {

        const { numberOfPasswords, passwordLength } = this.state;
        const pwdArray = this.renderPasswords( numberOfPasswords );
        return <div className="container">
            <div className="initial_options">
                {
                    this.state.options.map( (option, index) => {
                        return <div key = { option.name } className="option">
                            <div><input type="text" value={ option.name } readOnly /></div>
                            <div><input type="text" value={ option.characters } readOnly /></div>
                            <div><input
                                type="checkbox"
                                checked={ option.selected }
                                onChange={ event => { this.handleCharListChange(index, event) } }
                            /></div>
                        </div>
                    })
                }
                <div className="option">
                    <div><input type="text" value="Password Length" readOnly /></div>
                    <div><input type="number" value={ passwordLength } onChange={ this.handlePasswordLengthChange } /></div>
                </div>
                <div className="option">
                    <div><input type="text" value="Number of Passwords" readOnly /></div>
                    <div><input type="number" value={ numberOfPasswords } onChange={ this.handleNumberOfPasswordsChange } /></div>
                </div>
            </div>
            <h1>Generated passwords</h1>
            <h3>Please left-click on text to get it copied</h3>
            <div className="generated_passwords">
                {
                    pwdArray.map((value, index) => {
                        return <div key = { index } className="password">
                            <span
                                id={`password${index}`}
                                onClick={event => this.handleClipboardCopy(event)}
                            >
                                {value}
                            </span>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

export default Form;
