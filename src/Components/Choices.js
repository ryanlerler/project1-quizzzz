import React, { Component } from "react";

export default class Choices extends Component {

  render() {
    const { shuffledChoices, currentQuestion, userChoice, handleChange } = this.props;
    console.log("choices", shuffledChoices);
    console.log("userChoice", userChoice);

    const radioButtons = shuffledChoices[currentQuestion].map((choice) => (
      <div key={choice}>
        <label>
          <input
            type="radio"
            id={choice}
            name="userChoice"
            value={choice}
            required
            checked={userChoice === choice}
            onChange={handleChange}
          />
          {choice}
        </label>
      </div>
    ));

    return (
      <div>
        <form>{radioButtons}</form>
      </div>
    );
  }
}
