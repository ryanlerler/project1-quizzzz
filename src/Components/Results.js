import React, { Component } from "react";

export default class Results extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { questions, userChoice, originalChoices, score } = this.props;

    return <div>Your Result: {(score / questions.length) * 100}</div>;
  }
}
