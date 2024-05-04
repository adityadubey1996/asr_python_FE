import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../reducers/auth.reducer";
import { useNavigate } from "react-router";

const Home = () => {
  const { data } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(userLogout());
    navigate('/login')
  };

  return (
    <div className="text-red-500">
      Home <h1>{data?.email}</h1>
      <h1 onClick={() => handleLogout()}>Logout</h1>
    </div>
  );
};

export default Home;
