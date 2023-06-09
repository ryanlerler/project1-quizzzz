import React from "react";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class Results extends React.Component {
  render() {
    const {
      questions,
      userChoices,
      originalChoices,
      currentCorrectAnswers,
      answeredQuestions,
      accumulatedCorrectAnswers,
    } = this.props;
    const currentScore = (currentCorrectAnswers / questions.length) * 100;

    console.log(questions);

    return (
      <div>
        <h2>Leaderboard</h2>
        <Table striped bordered hover variant="primary">
          <thead>
            <tr>
              <th>User</th>
              <th>Current Score</th>
              <th>Current No. of Questions</th>
              <th>Total Score</th>
              <th>Total No. of Questions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{/**ToDo */}</td>
              <td>{currentCorrectAnswers}</td>
              <td>{questions.length} </td>
              <td>{accumulatedCorrectAnswers}</td>
              <td>{answeredQuestions}</td>
            </tr>
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
                        <li>
                          Question {index + 1}: <br />
                          {question}
                        </li>
                      </Row>

                      <Row>
                        <Col>
                          <p>
                            Your Answer: <br /> {userChoices[index]}
                          </p>
                        </Col>
                        <Col>
                          <p>
                            Correct Answer: <br /> {originalChoices[index][0]}
                          </p>
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
                        <p>
                          Incorrect Answers: <br/>
                          {[
                            originalChoices[index][1],
                            "; ",
                            originalChoices[index][2],
                            "; ",
                            originalChoices[index][3],
                          ]}
                        </p>
                      </Row>
                      <hr/>
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
