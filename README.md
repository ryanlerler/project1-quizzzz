**Project 1 Frontend - Quiz app**

**Description:** 

Dynamic quiz app with over 10,000 questions to choose from over 30 categories (including Computer & Math). Timer is defined based on number of questions and difficulty selected by the user, coupled with disabled text selection to promote quiz integrity. A simple report with all the questions answered including their correct answers will be available upon completion.
 
**Technologies:**

Javascript, React.js, React-Bootstrap, Trivia API, OpenTDB API, Axios

**App Development Strategy:**

Day 1

 Find quiz questions- API/ JSON/ hard-code at least 2 MCQs with answers

 Set up Instruction Component

Day 2

 Find quiz questions- API/ JSON/ hard-code at least 2 MCQs with answers

 Set up Question Component (may not be necessary)

 Set up Choices Component (may not be necessary)

 Set up MCQ Component - Figure out how to render 1 MCQ then switch to the next MCQ upon clicking ‘Next’ button

Day 3

 Set up MCQ Component - Figure out how to randomize MCQ rendered (IF POSSIBLE)

 Set up Timer Component

Day 4

 Set up Result Component - Render at least time spent & no of questions answered correctly,  best scenario is to render which questions are answered correctly and provide answers to the questions answered wrongly (IF POSSIBLE)

 MVP deadline - at least 10 questions, ideally 20 (IF POSSIBLE)

Day 5

 Feature freeze - improve UI; refactor codes; decompose components; testing

**Learning Points:**

 Render the correct que w the correct ans - add currentQueIndex state + map()

 Randomize the ans (2D array with correct ans being the 1st element) while making sure that the user ans can still be compared to the correct ans - keep both ori & shuffled arrays

 Keep track of all user ans - use array

 Render the report que by que including Q&A & user ans - map()

 Apply local storage to the app as extra feature

 Timer - lift the state up, then down, then up, then up & down

 Include both true/ false que & MCQs - render a radio button only if ans array elements are defined
 
 API’s default encoding returns special char like ‘&’ and ‘△’ in an encoded format, i.e. ‘&’ is displayed as ‘&amp;’

 1st sol: set encode=url3986 in query parameter and use decodeURIComponent() to decode the data including special char - all Q&A can be found in the network response, in readable texts (lack of integrity)

 2nd sol: set encode=base64 in query parameter and use atob() to decode the data - network response returns encoded data (integrity ensured) but special char like ‘π’ and ‘△’ are still encoded

 SERVER DOWN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 Sol: use another API with almost the same data struc as backup without the need to modify chunks of codes

**What I might do differently next time:**

 ‘Encrypt’ the network responses to uphold integrity while ensuring special char like ‘π’ and ‘△’ can be decoded and rendered properly
 Back button & time travel

 Improve leaderboard with the same user’s total score being accumulated

 Let user choose a database 1st only then render the home page for selecting category etc.

 Downloadable report

 Keep track of which question user has stopped at & make continuing to the same question possible even if the app/ browser is closed

 Keep track of which que have been answered & stop getting those que

 Avoid undefined values in the answers array in the case of true/ false que

 Show the difficulty & category if the user chose any

 Customize for assessment purpose - fixed sets of que

 More CSS
