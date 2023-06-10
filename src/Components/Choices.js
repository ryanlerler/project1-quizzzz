import React from "react";

export default class Choices extends React.Component {
  render() {
    const { shuffledChoices, currentQuestionIndex, userChoices, handleChange } =
      this.props;

    // Some questions come with 4 choices but some with only 2 (true/ false). In the case of true/ false questions, the shuffledChoices array would have 2 undefined elements. Return a radio button only if the element in the shuffledChoices is not undefined
    const radioButtons = shuffledChoices[currentQuestionIndex].map(
      (choice) =>
        choice && (
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
        )
    );

    return <div>{radioButtons}</div>;
  }
}
