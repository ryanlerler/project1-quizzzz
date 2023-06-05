import axios from "axios";
import React, { Component } from "react";

export default class Question extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   axios
  //     .get(
  //       "https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple"
  //     )
  //     .then((data) => console.log(data,data.data.results[0].question));
  // }

  render() {
    return <div></div>;
  }
}
