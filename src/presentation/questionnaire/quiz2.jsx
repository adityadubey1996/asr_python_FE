import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveAnswers } from "reducers/metric.reducer";
import styles from './styles.css'

const questions = [
    {
      id: 1,
      text: "What is the primary purpose of this recording?",
      options: ["Training/Educational", "Meeting/Conversation", "Presentation", "Compliance Review", "Other"],
      type: "single-choice",
      optionsRequiringFollowUp: ["Other"], // Specify options that need follow-up
      followUpQuestion: "Please specify:",
      followUpType: "text"
    },
    {
      id: 2,
      text: "Is this recording related to a specific industry or domain?",
      type: "boolean",
      options: ["Yes", "No"],
      followUp: true,
      optionsRequiringFollowUp: ["Yes"],
      followUpCondition: ["Yes"], // Condition updated for clarity
      followUpQuestion: "If yes, please specify the industry:",
      followUpType: "text"
    },
    {
      id: 3,
      text: "Approximately how many speakers are involved in this recording?",
      type: "text",
      placeholder: "Enter a number"
    },
    {
      id: 4,
      text: "Would you like us to analyze the content for any specific compliance requirements?",
      type: "boolean",
      options: ["Yes", "No"],
      followUp: true,
      followUpCondition: ["Yes"],
      optionsRequiringFollowUp: ["Yes"],
      followUpQuestion: "If yes, please specify the compliance requirements:",
      followUpType: "text"
    },
    {
        id: 5,
        text: "Select the types of analysis you would like us to perform on the recording:",
        options: [
          "Speaker talk time ratios — Analyze the proportion of talk time per participant.",
          "Key topics discussed — Identify main topics covered in the conversation.",
          "Sentiment analysis — Assess the sentiment (positive, neutral, negative) of each speaker.",
          "Compliance issue tracking — Highlight potential compliance risks or violations mentioned.",
          "Custom analysis — Specify any additional or particular insights you need."
        ],
        type: "multi-choice",
        optionsRequiringFollowUp: ["Custom analysis — Specify any additional or particular insights you need.", "Speaker talk time ratios — Analyze the proportion of talk time per participant.", "Key topics discussed — Identify main topics covered in the conversation.", "Sentiment analysis — Assess the sentiment (positive, neutral, negative) of each speaker.", "Compliance issue tracking — Highlight potential compliance risks or violations mentioned."],
        followUpQuestion: "Please describe the custom analysis you need:",
        followUpType: "text"
      },
      {
        id: 6,
        text: "Let's give the template a name before creating it",
        type: "text",
        placeholder: "Enter a Name"
      },
  ];
  
  

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [workflowTitle, setWorkflowTitle] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const user = useSelector(state => state.user.userData);

  useEffect(() => {
    // if (user.metricsExist) {
    //   navigate('/main');
    // }
  }, [user, navigate]);

  const handleOptionChange = (id, option) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: option,
    };
    setAnswers(newAnswers);


    // Automatically clear follow-up answers if the condition is no longer met
    if (!currentQuestion.followUp || (currentQuestion.followUp && option !== "Yes" && option !== currentQuestion.followUpCondition)) {
      const newFollowUpAnswers = { ...followUpAnswers };
      delete newFollowUpAnswers[currentQuestion.id];
      setFollowUpAnswers(newFollowUpAnswers);
    }
  };

  const handleFollowUpAnswer = (id, text) => {
   
    setFollowUpAnswers({
      ...followUpAnswers,
      [currentQuestion.id]: text,
    });
  };

  const handleTextChange = (id, value) => {
    const newText = value;
    // For question type 'text', we ensure only numerical input for question 3
    if (currentQuestion.id === 3 && isNaN(Number(newText))) {
      return;  // Ignore non-numeric input
    }
    if(isLastQuestion){
        setWorkflowTitle(value);
    }
    setAnswers({
      ...answers,
      [currentQuestion.id]: newText,
    });
  };

const handleMultiChoiceChange = (id, isChecked, option) => {
    
    const currentSelections = answers[id] || [];
    if (isChecked) {
      setAnswers({
        ...answers,
        [id]: [...currentSelections, option]
      });
    } else {
      setAnswers({
        ...answers,
        [id]: currentSelections.filter(o => o !== option)
      });
      // Also remove the detailed input associated with this option
      const newFollowUpAnswers = {...followUpAnswers};
      delete newFollowUpAnswers[option];
      setFollowUpAnswers(newFollowUpAnswers);
    }
  };
  const handleDetailedInputChange = (questionId, option, value) => {
    setFollowUpAnswers({
        ...followUpAnswers,
        [questionId]: {
            ...followUpAnswers[questionId],
            [option]: value
        }
    });
};


const renderOptions = () => {
  
    const currentQuestion = questions[currentQuestionIndex];
  
    switch (currentQuestion.type) {
      case "single-choice":
        return currentQuestion.options.map((option, index) => (
          <label key={index} className="block">
            <input
              type="radio"
              name={`question_${currentQuestion.id}`}
              value={option}
              checked={answers[currentQuestion.id] === option}
              onChange={(e) => {
                handleOptionChange(currentQuestion.id, e.target.value)}}
              className="mr-2"
            />
            {option}

            {currentQuestion.optionsRequiringFollowUp.includes(option) && answers[currentQuestion.id] === option && (
              <input
                type="text"
                placeholder={currentQuestion.followUpQuestion}
                value={followUpAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleFollowUpAnswer(currentQuestion.id, e.target.value)}
                className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              />
            )}
          </label>
        ));
  
      case "multi-choice":
        return (
          <div>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="mb-4">
                <label className="block">
                  <input
                    type="checkbox"
                    name={`question_${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id]?.includes(option)}
                    onChange={(e) => handleMultiChoiceChange(currentQuestion.id, e.target.checked, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
               
                {answers[currentQuestion.id]?.includes(option) && currentQuestion.optionsRequiringFollowUp.includes(option) && (
                  <textarea
                    placeholder={currentQuestion.followUpQuestion}
                    value={followUpAnswers[currentQuestion.id]?.[option] || ""}
                    onChange={(e) => handleDetailedInputChange(currentQuestion.id, option, e.target.value)}
                    className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
                    style={{ minHeight: '50px', resize: 'vertical' }}
                  />
                )}
              </div>
            ))}
          </div>
        );
  
      case "boolean":
        return currentQuestion.options.map((option, index) => (
          <label key={index} className="block">
            <input
              type="radio"
              name={`question_${currentQuestion.id}`}
              value={option}
              checked={answers[currentQuestion.id] === option}
              onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
              className="mr-2"
            />
            {option}
            {currentQuestion.followUp && option === "Yes" && answers[currentQuestion.id] === "Yes" && (
              <input
                type="text"
                placeholder={currentQuestion.followUpQuestion}
                value={followUpAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleFollowUpAnswer(currentQuestion.id, e.target.value)}
                className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              />
            )}
          </label>
        ));
  
      case "text":
        return (
          <input
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
          />
        );
  
      default:
        return null;
    }

  };

  const validateAndProceed = () => {
    if (!workflowTitle.trim()) {
        alert("Please enter a title for the workflow.");
        return false;
    }
    return true;
};
  

  const goToNext = async () => {
    console.log('isLastQuestion',isLastQuestion)
    if (!answers[currentQuestion.id]) {
      alert("This question requires an answer.");
      return;
    }
    if (currentQuestion.followUp &&
        answers[currentQuestion.id] === "Yes" &&
        !followUpAnswers[currentQuestion.id]) {
      alert("Please provide additional information for the follow-up question.");
      return;
    }
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }else{

        if(validateAndProceed()){
      let updatedQuestions = questions.map(question => ({
        question: question.text,
        answerSelected: answers[question.id] || null,
        textInfoTyped: followUpAnswers[question.id] || null,
      }));
      try {
        const resultAction = await dispatch(saveAnswers({ answers: updatedQuestions, title : workflowTitle }));
        if (saveAnswers.fulfilled.match(resultAction)) {
          navigate('/main');
        } else {
          console.error("Failed to save answers:", resultAction.error);
        }
      } catch (error) {
        console.error("Error occurred while saving answers:", error);
      }
    }
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
          {renderOptions()}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Previous
          </button>
          <button
            onClick={goToNext}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLastQuestion ? "Submit" :workflowTitle ? "Create Workflow" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
