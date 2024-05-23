// import React, { useState } from 'react';

// const QuizComponent = ({ questions }) => {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [responses, setResponses] = useState({});
  
//     const currentQuestion = questions[currentQuestionIndex];
//     const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
//     const handleOptionChange = (option) => {
//       const updatedResponses = {
//         ...responses,
//         [currentQuestion.id]: {
//           ...responses[currentQuestion.id],
//           selectedOption: option
//         }
//       };
  
//       if (!(currentQuestion.type === 'boolean' && option === 'Yes') && currentQuestion.type !== 'multi-choice') {
//         delete updatedResponses[currentQuestion.id].additionalText; // Clear additional text if not needed
//       }
  
//       setResponses(updatedResponses);
//     };
  
//     const handleTextChange = (text) => {
//       setResponses({
//         ...responses,
//         [currentQuestion.id]: {
//           ...responses[currentQuestion.id],
//           additionalText: text
//         }
//       });
//     };
  
//     const goToNext = () => {
//       if (!responses[currentQuestion.id] || !responses[currentQuestion.id].selectedOption) {
//         alert('Please select an option.');
//         return;
//       }
  
//       if ((currentQuestion.type === 'boolean' && responses[currentQuestion.id].selectedOption === 'Yes' && !responses[currentQuestion.id].additionalText)
//           || (currentQuestion.options.includes('Other') && responses[currentQuestion.id].selectedOption === 'Other' && !responses[currentQuestion.id].additionalText)) {
//         alert('Additional information required.');
//         return;
//       }
  
//       if (!isLastQuestion) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//       } else {
//         submitResponses(); // Submit responses when it's the last question
//       }
//     };
  
//     const submitResponses = () => {
//       console.log('Final Responses:', JSON.stringify(responses));
//       // Here you would typically send a request to your server
//     };

//     const goToPrevious = () => {
//         if (currentQuestionIndex > 0) {
//           setCurrentQuestionIndex(currentQuestionIndex - 1);
//         }
//       };

//   return (





// <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h1 className="text-2xl font-bold mb-4">{currentQuestion.text}</h1>
//         <div className="space-y-4">
//           {currentQuestion.options?.map((option, index) => (
//             <label key={index} className="block">
//               <input
//                 type={currentQuestion.type === 'multi-choice' ? 'checkbox' : 'radio'}
//                 name={`question_${currentQuestion.id}`}
//                 value={option}
//                 checked={responses[currentQuestion.id] === option}
//                 onChange={(e) => handleOptionChange(e.target.value, index)}
//                 className="mr-2"
//               />
//               {option}
//               {(option === "Other" && responses[currentQuestion.id] === "Other") && (
//                 <input
//                   type="text"
//                   placeholder="Please specify"
//                   value={responses[currentQuestion.id].additionalText || ''}
//                   onChange={(e) => handleTextChange(e.target.value)}
//                   maxLength={50}
//                   className="ml-4 mt-2 block w-full p-2 bg-gray-700 text-white rounded"
//                 />
//               )}
//             </label>
//           ))}
//           {currentQuestion.type === 'boolean' && (
//             <>
//               <label className="block">
//                 <input
//                   type="radio"
//                   name={`question_${currentQuestion.id}`}
//                   value="Yes"
//                   checked={responses[currentQuestion.id] === "Yes"}
//                   onChange={(e) => handleOptionChange("Yes")}
//                   className="mr-2"
//                 /> Yes
//                 {responses[currentQuestion.id] === "Yes" && (
//                   <input
//                     type="text"
//                     placeholder={currentQuestion.followUpQuestion}
//                     value={responses[currentQuestion.id].additionalText || ''}
//                     onChange={(e) => handleTextChange(e.target.value)}
//                     required
//                     className="ml-4 mt-2 block w-full p-2 bg-gray-700 text-white rounded"
//                   />
//                 )}
//               </label>
//               <label className="block">
//                 <input
//                   type="radio"
//                   name={`question_${currentQuestion.id}`}
//                   value="No"
//                   checked={responses[currentQuestion.id] === "No"}
//                   onChange={(e) => handleOptionChange("No")}
//                   className="mr-2"
//                 /> No
//               </label>
//             </>
//           )}
//         </div>
//         <div className="flex justify-between mt-6">
//           <button onClick={goToPrevious} disabled={currentQuestionIndex === 0} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Previous</button>
//           <button onClick={goToNext} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Next</button>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default QuizComponent;


import React, { useState } from 'react';

const questions = [
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

      followUp: true,
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
      options: ['Yes', 'No'],

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

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionChange = (option) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: option
    };
    setAnswers(newAnswers);

    if (!["Yes", "Other"].includes(option)) {
      const newFollowUpAnswers = {...followUpAnswers};
      delete newFollowUpAnswers[currentQuestion.id];
      setFollowUpAnswers(newFollowUpAnswers);
    }
  };

  const handleFollowUpAnswer = (text) => {
    setFollowUpAnswers({
      ...followUpAnswers,
      [currentQuestion.id]: text
    });
  };

  const goToNext = () => {
    if (!answers[currentQuestion.id]) {
      alert('This question requires an answer.');
      return;
    }
    if ((currentQuestion.followUp && answers[currentQuestion.id] === 'Yes' && !followUpAnswers[currentQuestion.id]) ||
        (currentQuestion.options.includes('Other') && answers[currentQuestion.id] === 'Other' && !followUpAnswers[currentQuestion.id])) {
      alert('Please provide additional information.');
      return;
    }
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {

        let updatedQuestion = [...questions.map((e) => {
            return {question: e.text, answerSelected : answers[e.id] || null, textInfoTyped : followUpAnswers[e.id] || null}
        })]
        console.log('updatedQuestion', JSON.stringify(updatedQuestion))
      console.log('Final Answers:', answers, 'Follow Up Answers:', followUpAnswers); // Implement submission logic here
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">{currentQuestion.text}</h1>
        <div className="space-y-4">
          {currentQuestion.options?.map((option, index) => (
            <label key={option} className="block">
            <input
              type={currentQuestion.type === 'multi-choice' ? 'checkbox' : 'radio'}
              name={`question_${currentQuestion.id}`}
              value={option}
              checked={answers[currentQuestion.id] === option}
              onChange={(e) => handleOptionChange(e.target.value)}
              className="mr-2"
            />
            {option}
            {(option === "Other" && answers[currentQuestion.id] === "Other") && (
              <input
                type="text"
                placeholder="Please specify"
                value={followUpAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleFollowUpAnswer(e.target.value)}
                className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              />
            )}
          </label>
            
          ))}
        
           
          {currentQuestion.followUp && answers[currentQuestion.id] === 'Yes' && (
            <input
              type="text"
              placeholder={currentQuestion.followUpQuestion}
              value={followUpAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleFollowUpAnswer(e.target.value)}
              className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              maxLength="50"
            />
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={goToPrevious} disabled={currentQuestionIndex === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            Previous
          </button>
          <button onClick={goToNext}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            {isLastQuestion ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;

