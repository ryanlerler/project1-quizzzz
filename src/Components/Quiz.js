// ToDo: question must be answered before going to the next question (or maybe implement a BACK button to switch back & forth); 1st question often takes quite some time to load upon clicking the START button; refactor callApi function; last question's score is not counted

import axios from "axios";
import React from "react";
import HomePage from "./HomePage";
import Question from "./Question";
import { Button } from "react-bootstrap";
import Choices from "./Choices";
import Results from "./Results";

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: 5,
      category: "",
      difficulty: "",
      questions: [],
      originalChoices: [],
      shuffledChoices: [],
      currentQuestion: 0,
      userChoice: "",
      isQuizCompleted: false,
      score: 0,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  randomizeChoicesOrder = (choices) => {
    const numberOfChoices = 4;
    for (let i = 0; i < numberOfChoices; i++) {
      const randomIndex = Math.floor(Math.random() * numberOfChoices);
      const randomChoice = choices[randomIndex];
      const currentChoice = choices[i];
      choices[i] = randomChoice;
      choices[randomIndex] = currentChoice;
    }
    return choices;
  };

  callApi = () => {
    const { questionCount, category, difficulty } = this.state;

    // Set encode=url3986 and use decodeURIComponent to decode special char like '&' etc.
    // Keep the original choices for result comparison and then shuffle the choices for quiz purpose
    axios
      .get(
        `https://opentdb.com/api.php?amount=${questionCount}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`
      )
      .then((data) => {
        console.log(data);
        const randomChoices = data.data.results.map((result) => {
          const unshuffledChoices = [
            decodeURIComponent(result.correct_answer),
            ...result.incorrect_answers.map((answer) =>
              decodeURIComponent(answer)
            ),
          ];
          return this.randomizeChoicesOrder(unshuffledChoices);
        });

        this.setState({
          questions: data.data.results.map((result) =>
            decodeURIComponent(result.question)
          ),
          originalChoices: data.data.results.map((result) => [
            decodeURIComponent(result.correct_answer),
            ...result.incorrect_answers.map((answer) =>
              decodeURIComponent(answer)
            ),
          ]),
          shuffledChoices: randomChoices,
        });
      });
  };

  goToNextQuestion = () => {
    this.setState((state) => ({
      currentQuestion: state.currentQuestion + 1,
      score:
        this.state.userChoice ===
        this.state.originalChoices[this.state.currentQuestion][0]
          ? state.score + 1
          : state.score,
    }));
  };

  backToPreviousQuestion = () => {
    if (this.state.currentQuestion === 0) return;

    this.setState((state) => ({
      currentQuestion: state.currentQuestion - 1,
    }));
  };

  showResults = () => {
    this.setState({
      isQuizCompleted: true,
    });
  };

  render() {
    const {
      questions,
      originalChoices,
      shuffledChoices,
      currentQuestion,
      userChoice,
      score,
      isQuizCompleted,
    } = this.state;
    console.log("ori", originalChoices);
    console.log("shuffled", shuffledChoices);
    console.log("userChoice", userChoice);
    console.log("score", score);

    return (
      <div>
        {isQuizCompleted ? (
          <Results {...this.state} />
        ) : questions && questions.length > 0 ? (
          <>
            <Question questions={questions} currentQuestion={currentQuestion} />
            <Choices {...this.state} handleChange={this.handleChange} />
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
          <Button
            variant="light"
            onClick={
              currentQuestion === questions.length - 1
                ? this.showResults
                : this.goToNextQuestion
            }
            className="button"
          >
            {currentQuestion === questions.length - 1 ? "SUBMIT" : "NEXT"}
          </Button>
        )}

        {questions && questions.length > 0 && (
          <Button variant="light" onClick={this.backToPreviousQuestion}>
            BACK
          </Button>
        )}

        <br />
      </div>
    );
  }
}

export default Quiz;
