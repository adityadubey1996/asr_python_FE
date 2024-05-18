import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import Login from "../presentation/login/Login";
import Home from "../presentation/home/Home";
import Questionnaire  from "../presentation/questionnaire";

const Routing = () => {
  const user = useSelector((state) => state.user.user);
  const userAnswers = useSelector((state) => state.metrics)

  const isUserLoggedIn = () => {
    if (user.data) {
      return true;
    } else {
      return false;
    }
  };

  const isQuestionnaireComplete = () =>{
    return true
    // return answers && Object.keys(answers).length > 0;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isUserLoggedIn() ? 
                              isQuestionnaireComplete() ? 
                                                      (<Navigate to = '/questions' replace/>):
                                                      ( <Navigate to="/main" replace />)
            : (
              <Navigate to="/login" replace />
            )
          }
        />
                <Route path="/questions" element={<Questionnaire />} />

        
        <Route path="/login" element={<Login />}></Route>
        <Route path="/main" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default Routing;
