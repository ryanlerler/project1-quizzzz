import React, { Component } from "react";

export default class Choices extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { choices, currentQuestion } = this.props;
    console.log("choices", choices);
    const radioButtons = choices.map((twoDArray) =>
      twoDArray.map((choiceArray) => (
        <div key={choiceArray}>
          <input
            type="radio"
            id={choiceArray}
            name="choice"
            value={choiceArray}
            required
          />
          <label htmlFor={choiceArray}>{choiceArray}</label>
        </div>
      ))
    );
    console.log(radioButtons);

    return (
      <div>
        <form>{radioButtons[currentQuestion]}</form>
      </div>
    );
  }
}
