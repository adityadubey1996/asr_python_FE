import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import Login from "../presentation/login/Login";
import Home from "../presentation/home/Home";
import Questionnaire from "../presentation/questionnaire";
import { useEffect } from "react";
import { fetchQuestions, getUserMetrics } from "../reducers/metric.reducer";

const Routing = () => {
  const testing = useSelector((state) => state)
  console.log('testing from routes', testing)
  const user = useSelector((state) => state?.user?.userData);
  const metrics = useSelector((state) => state.metrics)
  console.log(metrics)
  const dispatch = useDispatch()
  console.log('user from reducer', user)
  const userAnswers = useSelector((state) => state.metrics);

  const isUserLoggedIn = () => {
    
    return !!user?.data;
  };
  console.log('isUserLoggedIn', isUserLoggedIn())

  useEffect(() => {
console.log('user', user)
    console.log('first Time Mounting')
    if(user?.access_token){
    dispatch(getUserMetrics());
    }
    else{
      
    }
   
  }, [dispatch, user?.access_token])

  useEffect(() => {
console.log('metrics', metrics)

  }, [metrics])

//TODO: check is the user token is valid and question metric exist for the user.

  const isQuestionnaireComplete = () => {
    return user.metricsExist;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isUserLoggedIn() ? (
              !isQuestionnaireComplete() ? (
                <Navigate to="/questions" replace />
              ) : (
                <Navigate to="/main" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        /> 

        <Route path="/questions" element={<Questionnaire />} /> 

       <Route path="/login" element={<Login />} /> 
        <Route path="/main" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default Routing;
