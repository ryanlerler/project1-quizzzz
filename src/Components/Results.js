import React from "react";

export default class Results extends React.Component {
  
  render() {
    const {
      questions,
      userChoices,
      originalChoices,
      currentCorrectAnswers,
      answeredQuestions,
      accumulatedCorrectAnswers,
    } = this.props;
    const currentScore = (currentCorrectAnswers / questions.length) * 100;
  
    console.log(questions);

    return (
      <div>
        Your Result:
        <br />
        {currentCorrectAnswers} out of {questions.length} questions correct
        <br />
        {currentScore} % 
        <br/>
        You have answered {answeredQuestions} questions and
        answered {accumulatedCorrectAnswers} of them correctly
        <br />
        <br />
        <div>
          Report:
          <br />
          {questions.map((question, index) => (
            <div key={question}>
              <li>
                Question {index + 1}: {question}
              </li>
              Your Answer: {userChoices[index]}
              <br />
              Correct Answer: {originalChoices[index][0]}
              <br />
              {userChoices[index] === originalChoices[index][0]
                ? "You got it correct"
                : "You got it wrong"}
              <br />
              Incorrect Answers:{" "}
              {[
                originalChoices[index][1],
                "; ",
                originalChoices[index][2],
                "; ",
                originalChoices[index][3],
              ]}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
