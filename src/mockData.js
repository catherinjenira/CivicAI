export const MOCK_RESPONSES = {
  "register": "To register to vote, you typically need to visit your local election office website or use a national voter registration portal. Most jurisdictions allow online registration, by mail, or in person at government offices like the DMV.",
  "polling": "You can find your polling station by visiting your local election board's website and entering your residential address. Many countries also provide a 'Poll Finder' tool during election season.",
  "id": "The required ID varies by location. Common forms of acceptable ID include a driver's license, state-issued ID, or a passport. Some places may accept utility bills or bank statements as proof of residence.",
  "counting": "Ballot counting usually begins after polls close. It involves multiple steps: verification of voter eligibility, opening ballot boxes in the presence of observers, and scanning paper ballots through high-speed tabulators.",
  "absentee": "Absentee voting allows you to vote by mail if you cannot make it to the polls on election day. You usually need to request an absentee ballot in advance from your local election office.",
  "deadline": "Voter registration deadlines vary by state and country. Some require registration 30 days before an election, while others allow 'Same Day Registration' at the polling station.",
  "voter rights": "Voter rights include the right to a secret ballot, the right to assistance if needed, and protection against intimidation. If you face issues at the polls, you can often call a national voter protection hotline.",
  "hello": "Hello! I am CivicAI. How can I help you understand the election process today?",
  "hi": "Hi there! Ready to learn about your civic duties and the voting process?",
  "thanks": "You're welcome! It's important to stay informed about our democratic processes.",
  "thank you": "Happy to help! Every vote counts.",
  "who are you": "I am CivicAI, your dedicated assistant for election process education. I'm currently running in Offline Mode to ensure you always have access to civic information.",
  "default": "That's a great question about the election process! While I'm in Offline Mode and don't have a specific answer for that exact query, remember that the most important steps are: 1. Checking your registration, 2. Researching candidates, and 3. Knowing your polling location. Is there something specific about these steps I can help with?"
};

const RANDOM_FACTS = [
  "In many countries, election day is a national holiday to encourage voter turnout.",
  "The first use of paper ballots in the U.S. was in 1629 in the Massachusetts Bay Colony.",
  "In some nations, like Australia and Brazil, voting is compulsory for all citizens.",
  "The concept of 'One Person, One Vote' is a cornerstone of modern representative democracy.",
  "Voter turnout is often higher in countries that use proportional representation systems."
];

export const getMockResponse = (input) => {
  const normalizedInput = input.toLowerCase();
  for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
    if (normalizedInput.includes(key)) return value;
  }
  
  const randomFact = RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)];
  return `${MOCK_RESPONSES.default}\n\n**Quick Civic Fact:** ${randomFact}`;
};
