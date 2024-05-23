export const questionsSchema = [
    {
        id: 1,
        text: "What is the primary purpose of this video/audio?",
        options: ['Training/Educational', 'Meeting/Conversation', 'Presentation', 'Other'],
        type: 'single-choice'
    },
    {
        id: 2,
        text: "Is this video/audio content related to a specific industry or domain?",
        type: 'boolean',
        options: ['Yes', 'No'],

        followUp: true, // Indicates if there's a follow-up question based on the answer
        followUpQuestion: "If yes, please specify the industry:"
    },
    {
        id: 3,
        text: "Approximately how many speakers are involved in this video/audio?",
        options: ['1', '2-5', '6-10', 'More than 10'],
        type: 'single-choice'
    },
    {
        id: 4,
        text: "Would you like us to analyze the content for any specific compliance requirements?",
        type: 'boolean',
        followUp: true,
        followUpQuestion: "If yes, please specify:"
    },
    {
        id: 5,
        text: "What type of insights would be most valuable initially?",
        options: ['Speaker talk ratios', 'Key topics discussed', 'Sentiment analysis', 'Compliance issues identified', 'Other'],
        type: 'multi-choice'
    }
];
