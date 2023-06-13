import React from "react";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class Results extends React.Component {
  componentDidMount() {
    if (this.props.isQuizCompleted) {
      this.props.stopTimer();
    }
  }

  render() {
    const {
      questions,
      originalChoices,
      userChoices,
      leaderboard,
    } = this.props;

    console.log(questions);

    return (
      <div>
        <h2>Leaderboard</h2>
        <Table striped bordered hover variant="primary">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Score</th>
              <th>Current No. of Questions</th>
              <th>Total Score</th>
              <th>Total No. of Questions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr>
                <td>{user.name}</td>
                <td>{user.currentCorrectAnswers}</td>
                <td>{questions.length} </td>
                <td>{user.accumulatedCorrectAnswers}</td>
                <td>{user.answeredQuestions}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Report</Accordion.Header>
              <Accordion.Body>
                <Container fluid>
                  {questions.map((question, index) => (
                    <div key={question}>
                      <Row>
                        <span>
                          <h4>Question {index + 1} </h4>
                          <p>{question}</p>
                        </span>
                      </Row>

                      <Row>
                        <Col>
                          <span>
                            <h5>Your Answer</h5>
                            <p>{userChoices[index]}</p>
                          </span>
                        </Col>
                        <Col>
                          <span>
                            <h5>Correct Answer</h5>
                            <p> {originalChoices[index][0]}</p>
                          </span>
                        </Col>
                        <Col>
                          {userChoices[index] === originalChoices[index][0] ? (
                            <p>You got it correct!</p>
                          ) : (
                            <p>You got it wrong!</p>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <div>
                          <h5>Incorrect Answers</h5>
                          <ul>
                            {originalChoices[index][1] && (
                              <li>{originalChoices[index][1]}</li>
                            )}
                            {originalChoices[index][2] && (
                              <li>{originalChoices[index][2]}</li>
                            )}
                            {originalChoices[index][3] && (
                              <li>{originalChoices[index][3]}</li>
                            )}
                          </ul>
                        </div>
                      </Row>
                      <hr />
                    </div>
                  ))}
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    );
  }
}
