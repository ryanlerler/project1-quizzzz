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

export default class Quiz extends React.Component {
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
            html: "The database doesn't have enough questions for your selection.<br>(Eg. Asking for 50 Questions in a Category that only has 20.)",
            icon: "error",
            confirmButtonText: "Cool",
          });
        } else if (data.data.response_code === 2) {
          Swal.fire({
            title: "Error!",
            text: "Invalid request - Make sure you choose a Category within Open TDB.",
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
  };

  updateLeaderboard = () => {
    const {
      currentUser,
      questionCount,
      currentCorrectAnswers,
      answeredQuestions,
      accumulatedCorrectAnswers,
      leaderboard,
    } = this.state;

    const userObject = {
      name: currentUser,
      currentQuestionCount: questionCount,
      currentCorrectAnswers: currentCorrectAnswers,
      answeredQuestions: answeredQuestions,
      accumulatedCorrectAnswers: accumulatedCorrectAnswers,
    };

    const allUsers = [...leaderboard, userObject];
    const jsonStrings = JSON.stringify(allUsers);
    localStorage.setItem("leaderboard", jsonStrings);
    this.setState({
      leaderboard: allUsers,
    });
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
          this.updateLeaderboard();
        }
      }
    );
  };

  componentDidMount() {
    const storedCorrectAnswers = localStorage.getItem("quizCorrectAnswers");
    const storedAnsweredQuestions = localStorage.getItem(
      "quizAnsweredQuestions"
    );
    if (storedCorrectAnswers && storedAnsweredQuestions) {
      // When the component is mounted each time, initialize the numbers of accumulatedCorrectAnswers and answeredQuestions to those of values stored in the local storage so that they do not start with 0 even after user has closed the app
      this.setState({
        accumulatedCorrectAnswers: parseInt(storedCorrectAnswers),
        answeredQuestions: parseInt(storedAnsweredQuestions),
      });
    }

    const storedLeaderboard = localStorage.getItem("leaderboard");
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

    this.updateLeaderboard();
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

    console.log("questions", questions);
    console.log("ori", originalChoices);
    console.log("shuffled", shuffledChoices);
    console.log("userChoices", userChoices);
    console.log("leaderboard", leaderboard);

    return (
      <div>
        {isQuizCompleted ? (
          <Results
            questions={questions}
            originalChoices={originalChoices}
            userChoices={userChoices}
            leaderboard={leaderboard}
            stopTimer={this.stopTimer}
          />
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
            <Form.Label>Click on the Database:</Form.Label>
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
              className="button"
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
              className="button"
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
            className="button"
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
