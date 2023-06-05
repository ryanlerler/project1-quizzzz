import React from "react";
import HomePage from "./HomePage";
import Question from "./Question";

class Quiz extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HomePage />
        <Question />

        <a href="https://opentdb.com/" target="/blank">
          Question Bank: Open Trivia Database
        </a>
      </div>
    );
  }
}

export default Quiz;
