import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../reducers/auth.reducer";
import { useNavigate } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ActivityTable from "./components/ActivityTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faHome,
  faMoneyBill,
  faPerson,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import constants from "../../utils/constants";
import MyFiles from "../home/components/MyFiles";
import Settings from "../home/components/Settings";
import ReferAndEarn from "../home/components/ReferAndEarn";
import ActivityDashBoard from "../home/components/ActivityDashBoard";
import TaskManager from "../home/components/TaskManager";

const Home = () => {
  const sidebarItems = [
    { title: "My files", icon: <FontAwesomeIcon icon={faFile} /> },
    { title: "Dashboard", icon: <FontAwesomeIcon icon={faHome} /> },
    { title: "Task Manager", icon: <FontAwesomeIcon icon={faTasks} /> },
    { title: "Refer & Earn", icon: <FontAwesomeIcon icon={faMoneyBill} /> },
    { title: "Settings", icon: <FontAwesomeIcon icon={faPerson} /> },
  ];
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  return (
    <div className="flex flex-row">
      <Sidebar
        sidebarItems={sidebarItems}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <div className="flex flex-col flex-1">
        <span>
          {" "}
          <Header selectedItem={selectedItem} />
        </span>
        {selectedItem === constants.SIDEBAR_FILES && <MyFiles />}
        {selectedItem === constants.SIDEBAR_DASHBOARD && <ActivityDashBoard />}
        {selectedItem === constants.SIDEBAR_TASK_MANAGER && <TaskManager />}
        {selectedItem === constants.SIDEBAR_REFER_AND_EARN && <ReferAndEarn />}
        {selectedItem === constants.SIDEBAR_SETTINGS && <Settings />}
      </div>
    </div>
  );
};

export default Home;
