import React from "react";

export default class Choices extends React.Component {
  render() {
    const { shuffledChoices, currentQuestionIndex, userChoice, handleChange } =
      this.props;

    const radioButtons = shuffledChoices[currentQuestionIndex].map((choice) => (
      <div key={choice}>
        <label>
          <input
            type="radio"
            id={choice}
            name="userChoice"
            value={choice}
            required
            checked={userChoice[currentQuestionIndex] === choice}
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
