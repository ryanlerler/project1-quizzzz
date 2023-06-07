import React, { Component } from "react";

export default class Question extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { questions, currentQuestion } = this.props;
    const allQuestions = questions.map((question) => (
      <li key={question} value={currentQuestion + 1}>
        {question}
      </li>
    ));

    return (
      <div>
        <ol>{allQuestions[currentQuestion]}</ol>
      </div>
    );
  }
}
