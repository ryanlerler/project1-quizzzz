import React from "react";
import OpenTdbCategories from "../utils/opentdb-categories.json";
import Form from "react-bootstrap/Form";
import TheTriviaApiCategories from "../utils/thetriviaapi-categories.json";

export default class HomePage extends React.Component {
  render() {
    const { questionCount, category, difficulty, handleChange } = this.props;

    const questionCountOptionTag = [];
    for (let i = 5; i <= 50; i += 5) {
      questionCountOptionTag.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    const openTdbCategoriesOptionTag = OpenTdbCategories.map((category) => (
      <option value={category.id} key={category.id}>
        Open TDB - {category.name}
      </option>
    ));

    const theTriviaApiCategoriesOptionTag = TheTriviaApiCategories.map(
      (category) => (
        <option value={category} key={category}>
          THE TRIVIA API - {category.toLocaleUpperCase()}
        </option>
      )
    );

    return (
      <div>
        <Form.Label className="form-label">
          Select No. of Questions:
        </Form.Label>
        <br />
        <Form.Select
          name="questionCount"
          value={questionCount}
          required
          onChange={handleChange}
          className="form-select"
        >
          {questionCountOptionTag}
        </Form.Select>

        <Form.Label>Pick a Database & Category:</Form.Label>
        <br />
        <Form.Select
          name="category"
          value={category}
          required
          onChange={handleChange}
        >
          <option value="">Open TDB - Any</option>
          {openTdbCategoriesOptionTag}
          <option></option>
          <option value={TheTriviaApiCategories}>THE TRIVIA API - ANY</option>
          {theTriviaApiCategoriesOptionTag}
        </Form.Select>
        
        <Form.Label>Choose a Difficulty:</Form.Label>
        <br />
        <Form.Select
          name="difficulty"
          value={difficulty}
          required
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Form.Select>
      </div>
    );
  }
}
