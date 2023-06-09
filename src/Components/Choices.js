import React from "react";

export default class Choices extends React.Component {
  render() {
    const { shuffledChoices, currentQuestionIndex, userChoices, handleChange } =
      this.props;

    const radioButtons = shuffledChoices[currentQuestionIndex].map((choice) => (
      <div key={choice} className="radio-div">
        <label>
          <input
            type="radio"
            id={choice}
            name="userChoices"
            value={choice}
            checked={userChoices[currentQuestionIndex] === choice}
            onChange={handleChange}
            className="radio-input"
          />
          {choice}
        </label>
      </div>
    ));

    return (
      <div>
        {radioButtons}
      </div>
    );
  }
}
