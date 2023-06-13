import axios from "axios";
import React from "react";
import HomePage from "./HomePage";
import Question from "./Question";
import { Button, Form } from "react-bootstrap";
import Choices from "./Choices";
import Results from "./Results";
import Spinner from "react-bootstrap/Spinner";
import Swal from "sweetalert2";
import OpenTdbLogo from "../assets/logo.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
      userChoices: [],
      isQuizCompleted: false,
      currentCorrectAnswers: 0,
      answeredQuestions: 0,
      accumulatedCorrectAnswers: 0,
      showTimer: false,
      currentUser: "",
      leaderboard: [],
    };
  }

  handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      const { userChoices, currentQuestionIndex } = this.state;

      // Create a copy of the userChoices array
      const updatedChoices = [...userChoices];

      // Update the selected choice for the current question
      updatedChoices[currentQuestionIndex] = value;

      this.setState({
        userChoices: updatedChoices,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
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

  handleOpenTdbCall = () => {
    const { questionCount, category, difficulty } = this.state;
    localStorage.setItem("user", this.state.currentUser);

    // Set encode=url3986 and use decodeURIComponent() to decode the data including special char like '&' etc.
    // Keep the original choices for result comparison and then shuffle the choices for quiz purpose
    axios
      .get(
        `https://opentdb.com/api.php?amount=${questionCount}&category=${category}&difficulty=${difficulty}&encode=url3986`
      )
      .then((data) => {
        console.log(data);
        if (data.data.response_code === 1) {
          Swal.fire({
            title: "Error!",
            text: "The API doesn't have enough questions for your query. \n (Ex. Asking for 50 Questions in a Category that only has 20.)",
            icon: "error",
            confirmButtonText: "Cool",
          });
        } else if (data.data.response_code === 2) {
          Swal.fire({
            title: "Error!",
            text: "Request contains an invalid parameter. Arguments passed in aren't valid.",
            icon: "error",
            confirmButtonText: "Cool",
          });
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
      .catch(() =>
        Swal.fire({
          title: "Error!",
          text: "Server down! Please try again later.",
          icon: "error",
          confirmButtonText: "Cool",
        })
      );
  };

  handleTheTriviaApiCall = () => {
    const { questionCount, category, difficulty } = this.state;
    localStorage.setItem("user", this.state.currentUser);

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
      })
  };

  handleNextButtonClick = () => {
    const {
      userChoices,
      currentQuestionIndex,
      originalChoices,
      questions,
      accumulatedCorrectAnswers,
      answeredQuestions,
    } = this.state;

    const isAnswerCorrect =
      userChoices[currentQuestionIndex] ===
      originalChoices[currentQuestionIndex][0];

    // Update the score
    const newAccumulatedCorrectAnswers = isAnswerCorrect
      ? accumulatedCorrectAnswers + 1
      : accumulatedCorrectAnswers;

    const newAnsweredQuestions = answeredQuestions + 1;

    // Store the score in local storage
    localStorage.setItem("quizCorrectAnswers", newAccumulatedCorrectAnswers);
    localStorage.setItem("quizAnsweredQuestions", newAnsweredQuestions);

    this.setState(
      (state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        currentCorrectAnswers: isAnswerCorrect
          ? state.currentCorrectAnswers + 1
          : state.currentCorrectAnswers,
        accumulatedCorrectAnswers: newAccumulatedCorrectAnswers,
        answeredQuestions: newAnsweredQuestions,
        isQuizCompleted:
          currentQuestionIndex === questions.length - 1 ? true : false,
      }),
      () => {
        if (currentQuestionIndex === questions.length - 1) {
          const userObject = {
            name: this.state.currentUser,
            currentCorrectAnswers: this.state.currentCorrectAnswers,
            answeredQuestions: this.state.answeredQuestions,
            accumulatedCorrectAnswers: this.state.accumulatedCorrectAnswers,
          };

          const allUsers = [...this.state.leaderboard, userObject];

          localStorage.setItem("leaderboard", JSON.stringify(allUsers));
          this.setState({
            leaderboard: allUsers,
          });
        }
      }
    );
  };

  componentDidMount() {
    const storedCorrectAnswers = localStorage.getItem("quizCorrectAnswers");
    const storedAnsweredQuestions = localStorage.getItem(
      "quizAnsweredQuestions"
    );
    const storedUser = localStorage.getItem("user");
    const storedLeaderboard = localStorage.getItem("leaderboard");

    // When the component is mounted each time, initialize the numbers of accumulatedCorrectAnswers and answeredQuestions to those of values stored in the local storage so that they do not start with 0 even after user has closed the app
    if (storedCorrectAnswers && storedAnsweredQuestions) {
      this.setState({
        accumulatedCorrectAnswers: parseInt(storedCorrectAnswers),
        answeredQuestions: parseInt(storedAnsweredQuestions),
      });
    }

    if (storedUser) {
      this.setState({
        currentUser: storedUser,
      });
    }

    if (storedLeaderboard) {
      this.setState({
        leaderboard: JSON.parse(storedLeaderboard),
      });
    }
  }

  startTimer = () => {
    this.setState({
      showTimer: true,
    });
  };

  stopTimer = () => {
    this.setState({
      showTimer: false,
    });
  };

  handleTimerComplete = () => {
    Swal.fire({
      title: "Time's up!",
      icon: "warning",
      confirmButtonText: "Cool",
    });

    this.setState({
      showTimer: false,
      isQuizCompleted: true,
    });

    const userObject = {
      name: this.state.currentUser,
      currentCorrectAnswers: this.state.currentCorrectAnswers,
      answeredQuestions: this.state.answeredQuestions,
      accumulatedCorrectAnswers: this.state.accumulatedCorrectAnswers,
    };

    const allUsers = [...this.state.leaderboard, userObject];

    localStorage.setItem("leaderboard", JSON.stringify(allUsers));
    this.setState({
      leaderboard: allUsers,
    });
  };

  reset = () => {
    this.setState({
      questionCount: 5,
      category: "",
      difficulty: "",
      questions: [],
      originalChoices: [],
      shuffledChoices: [],
      currentQuestionIndex: 0,
      userChoices: [],
      isQuizCompleted: false,
      currentCorrectAnswers: 0,
      showTimer: false,
    });
  };

  render() {
    const {
      questionCount,
      category,
      difficulty,
      questions,
      originalChoices,
      shuffledChoices,
      currentQuestionIndex,
      userChoices,
      isQuizCompleted,
      showTimer,
      currentUser,
      leaderboard,
    } = this.state;

    console.log("ori", originalChoices);
    console.log("shuffled", shuffledChoices);
    console.log("userChoices", userChoices);
    console.log("leaderboard", leaderboard);

    return (
      <div>
        {isQuizCompleted ? (
          <Results {...this.state} stopTimer={this.stopTimer} />
        ) : questions && questions.length > 0 ? (
          <>
            <Question
              difficulty={difficulty}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              showTimer={showTimer}
              startTimer={this.startTimer}
              handleTimerComplete={this.handleTimerComplete}
            />
            <Choices
              shuffledChoices={shuffledChoices}
              currentQuestionIndex={currentQuestionIndex}
              userChoices={userChoices}
              handleChange={this.handleChange}
            />
          </>
        ) : (
          <>
            <h1>Welcome to Quizzzz!!!</h1>
            <Form.Control
              type="text"
              name="currentUser"
              value={currentUser}
              onChange={this.handleChange}
              placeholder="What's your name?"
              className="user-input"
            />
            <br />
            <HomePage
              questionCount={questionCount}
              category={category}
              difficulty={difficulty}
              handleChange={this.handleChange}
            />
            <Form.Label>Opt For a Database:</Form.Label>
            <br />
          </>
        )}

        {questions.length === 0 && (
          <OverlayTrigger
            key="open-tdb"
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>Open TDB</strong>
              </Tooltip>
            }
          >
            <Button
              variant="light"
              onClick={this.handleOpenTdbCall}
              className="button glow-button"
            >
              <img
                src={OpenTdbLogo}
                alt="Open TDB "
                className="open-tdb-logo"
              />
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </Button>
          </OverlayTrigger>
        )}

        {questions.length === 0 && (
          <OverlayTrigger
            key="the-trivia-api"
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>THE TRIVIA API</strong>
              </Tooltip>
            }
          >
            <Button
              variant="light"
              onClick={this.handleTheTriviaApiCall}
              className="button glow-button"
            >
              <span className="the-trivia-api-logo">THE TRIVIA API </span>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </Button>
          </OverlayTrigger>
        )}

        {questions && questions.length > 0 && (
          <Button
            variant="light"
            onClick={isQuizCompleted ? this.reset : this.handleNextButtonClick}
            className="button glow-button"
            disabled={!isQuizCompleted && !userChoices[currentQuestionIndex]}
          >
            {isQuizCompleted
              ? "ANOTHER QUIZ"
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
