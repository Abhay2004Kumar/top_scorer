function Badminton_Probability(score1, score2) {
  // Ensure the inputs are parsed correctly as integers
  score1 = parseInt(score1, 10);
  score2 = parseInt(score2, 10);

  // Check if score1 or score2 is NaN
  if (isNaN(score1) || isNaN(score2)) {
    console.error("Invalid input: score1 or score2 is not a number.");
    return NaN;
  }

  // Base calculation
  let probability = 50 + ((score1 - score2) * 100) / 21;

  // Ensure the probability stays within the range [0, 99.99]
  if (probability < 0) {
    probability = 4;
  } 
  if (probability >= 100) {
    probability = 99;
  }

  // If either player has reached 21 points and has a lead of 2 or more, set final probability
  if (score1 >= 21 && score1 - score2 >= 2) {
    probability = 100; // Player 1 wins
  } else if (score2 >= 21 && score2 - score1 >= 2) {
    probability = 0; // Player 2 wins
  }

  console.log("TESTING", probability);
  return Math.round(probability);
}

export default Badminton_Probability;
