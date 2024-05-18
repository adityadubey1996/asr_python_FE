import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, saveAnswers } from '../../reducers/metric.reducer';

const Questionnaire = () => {
  const { questions, loading, error } = useSelector((state) => state.metrics);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleAnswer = (answer) => {
    const questionId = questions[currentQuestionIndex].metricId;
    setAnswers({ ...answers, [questionId]: answer });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      dispatch(saveAnswers({ userId: 1, answers })); // Assuming userId is 1 for example
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error loading questions!</div>;

  return (
    <div>
      {questions.length > 0 && (
        <div>
          <h3>{questions[currentQuestionIndex].description}</h3>
          <button onClick={() => handleAnswer('Yes')}>Yes</button>
          <button onClick={() => handleAnswer('No')}>No</button>
        </div>
      )}
      <>testing</>
    </div>
  );
};

export default Questionnaire;
