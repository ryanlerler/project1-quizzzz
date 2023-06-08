// ToDo: refactor callApi function

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
      currentQuestionIndex: 0,
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
        // Store data in local storage
        if (data.data.response_code === 1) {
          alert(
            "The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)"
          );
        } else {
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
        }
      })
      .catch(() => {
        //Get questions from local storage
        axios
          .get(
            `https://the-trivia-api.com/api/questions?limit=${questionCount}&categories=${category}&difficulty=${difficulty}&types=text_choice,image_choice`
          )
          .then((data) => {
            console.log(data);
            const randomChoices = data.data.map((result) => {
              const unshuffledChoices = [
                result.correctAnswer,
                ...result.incorrectAnswers,
              ];
              return this.randomizeChoicesOrder(unshuffledChoices);
            });

            this.setState({
              questions: data.data.map((result) => result.question),
              originalChoices: data.data.map((result) => [
                result.correctAnswer,
                ...result.incorrectAnswers,
              ]),
              shuffledChoices: randomChoices,
            });
          });
      });
  };

  handleNextButtonClick = () => {
    this.setState((state) => ({
      userChoice: "",
      currentQuestionIndex: state.currentQuestionIndex + 1,
      score:
        this.state.userChoice ===
        this.state.originalChoices[this.state.currentQuestionIndex][0]
          ? state.score + 1
          : state.score,
      isQuizCompleted:
        this.state.currentQuestionIndex === this.state.questions.length - 1
          ? true
          : false,
    }));
  };

  render() {
    const {
      questions,
      originalChoices,
      shuffledChoices,
      currentQuestionIndex,
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
            <Question
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
            />
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
            onClick={this.handleNextButtonClick}
            className="button"
            disabled={!userChoice}
          >
            {isQuizCompleted
              ? "REFRESH FOR ANOTHER QUIZ"
              : currentQuestionIndex === questions.length - 1
              ? "SUBMIT"
              : "NEXT"}
          </Button>
        )}
      </div>
    );
  }
}

export default Quiz;
