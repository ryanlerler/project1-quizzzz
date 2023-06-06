// ToDo: Fix that Q1 rendered is Q2; question must be answered before going to the next question (or maybe implement a BACK button to switch back & forth) & sometimes receives no questions upon clicking START button

import axios from "axios";
import React from "react";
import HomePage from "./HomePage";
import Question from "./Question";
import { Button } from "react-bootstrap";
import Choices from "./Choices";

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: 5,
      category: "",
      difficulty: "easy",
      questions: [],
      choices: [],
      currentQuestion: 1,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  // Set encode=url3986 and use decodeURIComponent to decode special char like '&' etc.
  callApi = () => {
    const { questionCount, category, difficulty } = this.state;
    axios
      .get(
        `https://opentdb.com/api.php?amount=${questionCount}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`
      )
      .then((data) => {
        console.log(data);
        this.setState({
          questions: data.data.results.map((result) =>
            decodeURIComponent(result.question)
          ),
          choices: data.data.results.map((result) => [
            decodeURIComponent(result.correct_answer),
            ...result.incorrect_answers.map((answer) =>
              decodeURIComponent(answer)
            ),
          ]),
        });
      });
  };

  updateQuestion = () => {
    this.setState((state) => ({
      currentQuestion: state.currentQuestion + 1,
    }));
  };

  render() {
    const { questions, choices, currentQuestion } = this.state;
    console.log(questions);
    console.log(choices);

    return (
      <div>
        {questions && questions.length > 0 ? (
          <>
            <Question questions={questions} currentQuestion={currentQuestion} />
            <Choices choices={choices} currentQuestion={currentQuestion} />
          </>
        ) : (
          <HomePage {...this.state} handleChange={this.handleChange} />
        )}

        {questions.length === 0 && (
          <Button variant="light" onClick={this.callApi}>
            START
          </Button>
        )}

        {questions && questions.length > 0 && (
          <Button variant="light" onClick={this.updateQuestion}>
            NEXT
          </Button>
        )}
        <br />
      </div>
    );
  }
}

export default Quiz;
