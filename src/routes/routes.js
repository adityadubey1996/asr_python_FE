import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import Login from "../presentation/login/Login";
import Home from "../presentation/home/Home";

const Routing = () => {
  const user = useSelector((state) => state.user.user);

  const isUserLoggedIn = () => {
    if (user.data) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isUserLoggedIn() ? (
              <Navigate to="/main" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/main" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default Routing;
