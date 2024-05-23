import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, saveAnswers } from '../../reducers/metric.reducer';
import QuizComponent from './quiz'
import {questionsSchema} from './questionnaire_schema'
const Questionnaire = () => {


  

  

  return (
    <div>
     
     <QuizComponent questions={questionsSchema}/>
    </div>
  );
};

export default Questionnaire;





    // <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
    //   <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
    //     <h1 className="text-2xl font-bold mb-4">How do services register themselves?</h1>
    //     <p className="text-gray-400 mb-6">Single choice</p>
    //     <div className="space-y-4">
    //       {questions.map((question, index) => (
    //         <label key={index} className="block bg-gray-700 p-4 rounded-lg cursor-pointer">
    //           <input
    //             type="radio"
    //             name="answer"
    //             className="hidden"
    //             checked={selected === index}
    //             onChange={() => handleSelection(index)}
    //           />
    //           <span className="flex items-center">
    //             <span className={`flex items-center justify-center w-4 h-4 mr-2 border-2 ${selected === index ? 'border-green-500' : 'border-gray-500'} rounded-full`}>
    //               {selected === index && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
    //             </span>
    //             {question}
    //           </span>
    //         </label>
    //       ))}
    //     </div>
    //     {selected !== null && (
    //       <p className={`text-${isCorrect ? 'green' : 'red'}-500 mt-4`}>
    //         {isCorrect ? "This answer is correct." : "This answer is incorrect."}
    //       </p>
    //     )}
    //     <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
    //       Next
    //     </button>
    //   </div>
    // </div>