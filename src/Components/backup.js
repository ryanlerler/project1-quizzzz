callApi = () => {
  const { questionCount, category, difficulty } = this.state;

  // Keep the original choices for result comparison and then shuffle the choices for quiz purpose

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
