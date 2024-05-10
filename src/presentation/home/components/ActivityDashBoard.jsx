import React from "react";
import TextField from "@mui/material/TextField";
import ActivityTable from "./ActivityTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import RecentRecordings from "./RecentRecordings";

const ActivityDashBoard = () => {
  const handleFileUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row ">
        <ActivityTable />
        <div className="flex flex-col mt-10 w-[20%] ml-4">
          <h1 className="mb-2 font-medium text-lg">Transcription Language</h1>
          <TextField
            className="w-full"
            variant="outlined"
            name="language"
            type="text"
            value="en-English (United Kingdom)"
            disabled
          />
          <h1 className="mb-2 font-medium mt-5 text-lg">
            Transcription Options
          </h1>
          <h1
            className="text-center cursor-pointer bg-blue-600 py-2 rounded-md text-white mb-4"
            onClick={handleFileUploadClick}
          >
            <span>
              <FontAwesomeIcon icon={faFileUpload} /> Upload from device
            </span>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </h1>
        </div>
      </div>
      <RecentRecordings />
    </div>
  );
};

export default ActivityDashBoard;
