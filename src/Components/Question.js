import React from "react";

export default class Question extends React.Component {
  render() {
    const { questions, currentQuestionIndex } = this.props;
    const allQuestions = questions.map((question) => (
      <li key={question} value={currentQuestionIndex + 1}>
        {question}
      </li>
    ));

    return (
      <div>
        <ol>{allQuestions[currentQuestionIndex]}</ol> 
      </div>
    );
  }
}
