export const MOCK_RESPONSES = {
  "how to register to vote": "To register to vote, you typically need to visit your local election office website or use a national voter registration portal. Most jurisdictions allow online registration, by mail, or in person at government offices like the DMV.",
  "find polling station": "You can find your polling station by visiting your local election board's website and entering your residential address. Many countries also provide a 'Poll Finder' tool during election season.",
  "what id do i need": "The required ID varies by location. Common forms of acceptable ID include a driver's license, state-issued ID, or a passport. Some places may accept utility bills or bank statements as proof of residence.",
  "ballot counting": "Ballot counting usually begins after polls close. It involves multiple steps: verification of voter eligibility, opening ballot boxes in the presence of observers, and scanning paper ballots through high-speed tabulators. Results are then audited for accuracy.",
  "default": "I am currently in 'Offline Mode' because I couldn't reach the AI service. However, I can still help you with basic election process questions! Try asking about registration, ID requirements, or polling stations."
};

export const getMockResponse = (input) => {
  const normalizedInput = input.toLowerCase();
  for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
    if (normalizedInput.includes(key)) return value;
  }
  return MOCK_RESPONSES.default;
};
