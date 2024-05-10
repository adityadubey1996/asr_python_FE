import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faHome,
  faMoneyBill,
  faPerson,
  faSignOut,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../reducers/auth.reducer";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedItem, setSelectedItem, sidebarItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const user = useSelector((state) => state.user.user.data);

  return (
    <div className="bg-[#f8f8f8]">
      <div className="border h-screen flex flex-col gap-5 border-gray-200">
        <div>
          <h1 className="font-bold px-5 pt-8 pb-1 font-sans lg:text-lg">
            {" "}
            Private Workspace
          </h1>
          <h1 className="font-medium text-xs px-5 text-lighttextGray">
            {user.email}
          </h1>
        </div>
        <div className="grid gap-2">
          {sidebarItems.map((x, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(x.title)}
              className="flex hover:bg-slate-200 py-3 px-4 cursor-pointer items-center"
            >
              <span
                className={
                  selectedItem === x.title
                    ? "text-blue-500"
                    : "text-headingColor"
                }
                style={{ width: "2rem" }}
              >
                {x.icon}
              </span>
              <div
                className={
                  selectedItem === x.title
                    ? "text-blue-500 font-sans font-bold"
                    : "text-headingColor font-sans"
                }
              >
                {x.title}
              </div>
            </div>
          ))}
        </div>
        <h1
          onClick={() => handleLogout()}
          className="p-5 cursor-pointer font-semibold text-red-500 mt-20"
        >
          Logout &nbsp; <FontAwesomeIcon icon={faSignOut} />
        </h1>
      </div>
    </div>
  );
};

export default Sidebar;
