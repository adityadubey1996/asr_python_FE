import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";
import baseUrl from "../../../utils/url";
import { useDispatch } from "react-redux";
import { userLoginSuccess } from "../../../reducers/auth.reducer";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";

const Google = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const onSuccessResponse = async (res) => {
    axios
      .post(baseUrl() + "/api/google-login", { tokenId: res.tokenId })
      .then((res) => {
        dispatch(userLoginSuccess(res.data));
        localStorage.setItem("user", JSON.stringify(res.data));
        cookies.set("x-auth-token", res.data.data.access_token, { path: "/" });
        navigate("/");
      })
      .catch((err) => console.log(err));
  };
  const onFailureResponse = (res) => {
    if (res.error === "popup_closed_by_user") {
      console.log("User closed the Google authentication popup");
    } else {
      console.error("Google authentication failed:", res.error);
    }
  };

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        plugin_name: "chat",
      });
    });
  });

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Sign in with Google"
        onSuccess={onSuccessResponse}
        onFailure={onFailureResponse}
        style={{ width: "400px" }}
      />
    </div>
  );
};

export default Google;
