import React from "react";
import Countdown from "react-countdown";

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: Date.now(),
    };
  }

  componentDidMount() {
    this.props.startTimer();
  }

  render() {
    const { difficulty, questions, currentQuestionIndex, showTimer } =
      this.props;
    const { currentTime } = this.state;

    const allQuestions = questions.map((question) => (
      <li key={question} value={currentQuestionIndex + 1}>
        {question}
      </li>
    ));

    // Easy mode: 10 sec per question; medium/ any difficulty mode: 20 sec per question; hard mode: 30 sec per que
    let timeGiven = "";
    difficulty === "easy"
      ? (timeGiven = questions.length * 10000)
      : !difficulty || difficulty === "medium"
      ? (timeGiven = questions.length * 20000)
      : (timeGiven = questions.length * 30000);

    const renderer = ({ minutes, seconds }) => (
      // Render a countdown
      <span>
        ⏱️ <br /> {minutes} m {seconds} s
      </span>
    );

    return (
      <div>
        {showTimer && (
          <Countdown
            date={currentTime + timeGiven}
            onComplete={this.props.handleTimerComplete}
            renderer={renderer}
          />
        )}
        <br /> <br />
        <ol>{allQuestions[currentQuestionIndex]}</ol>
      </div>
    );
  }
}
