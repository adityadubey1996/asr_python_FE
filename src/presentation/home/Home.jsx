import React, { useEffect, useState } from "react";
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
import Settings from "../home/components/Settings";
import ReferAndEarn from "../home/components/ReferAndEarn";
import ActivityDashBoard from "../home/components/ActivityDashBoard";
import Recordings from "./components/Recordings";
import Transcriptions from "./components/transcriptions/Transcriptions";
import Workflow from "./components/Workflow";

const Home = () => {
  const sidebarItems = [
    { title: constants.SIDEBAR_RECORDINGS, icon: <FontAwesomeIcon icon={faFile} /> },
    { title: constants.SIDEBAR_TRANSCRIPTIONS, icon: <FontAwesomeIcon icon={faMoneyBill} /> },
    // { title: "Dashboard", icon: <FontAwesomeIcon icon={faHome} /> },
    { title: constants.SIDEBAR_WORKFLOW, icon: <FontAwesomeIcon icon={faTasks} /> },
    // { title: "Refer & Earn", icon: <FontAwesomeIcon icon={faTasks} /> },
    { title: constants.SIDEBAR_SETTINGS, icon: <FontAwesomeIcon icon={faPerson} /> },
  ];
  const [selectedItem, setSelectedItem] = useState(constants.SIDEBAR_TRANSCRIPTIONS);

  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.user)

  useEffect(()=>{
    if(!user){
      navigate('/login')
    }
  },[])

  return (
    
    <div className="flex flex-row bg-gray-900">
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
        {selectedItem === constants.SIDEBAR_RECORDINGS && <Recordings />}
        {selectedItem === constants.SIDEBAR_TRANSCRIPTIONS && <Transcriptions />}
        {selectedItem === constants.SIDEBAR_DASHBOARD && <ActivityDashBoard />}
        {selectedItem === constants.SIDEBAR_REFER_AND_EARN && <ReferAndEarn />}
        {selectedItem === constants.SIDEBAR_SETTINGS && <Settings />}
        {selectedItem === constants.SIDEBAR_WORKFLOW && <Workflow />}
      </div>
    </div>
  );
};

export default Home;
