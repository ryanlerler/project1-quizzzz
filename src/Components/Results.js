import React from "react";

export default class Results extends React.Component {
  render() {
    const { questions, userChoice, originalChoices, score } = this.props;
    const currentScore = (score / questions.length) * 100;
  
    console.log(questions);

    return (
      <div>
        Your Result:
        <br />
        {score} out of {questions.length} questions correct
        <br />
        {currentScore} %
        <br />
        <br />
        <div>
          Report:
          <br />
          {questions.map((question, index) => (
            <>
              <li>
                Question {index + 1}: {question}
              </li>
              Correct Answer: {originalChoices[index][0]}
              <br />
              Incorrect Answers:{" "}
              {[
                originalChoices[index][1],
                "; ",
                originalChoices[index][2],
                "; ",
                originalChoices[index][3],
              ]}
            </>
          ))}
        </div>
      </div>
    );
  }
}
