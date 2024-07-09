import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExpandMore } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMicrophone, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { red, grey } from "@mui/material/colors";

const HardCodedItem = () => {
  const [isExpanded, setIsExpanded] = useState(false);



  const onDeleteClick = () => {
    console.log("Delete Clicked");
    // Add deletion logic here
  };


  return (
    <div className="flex flex-col p-4 mb-4 border border-gray-800 rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-200 ease-in-out">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-200">
          File Title
        </span>
        <div className="flex items-center space-x-2">
          <Tooltip title="Expand/Collapse">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              <ExpandMore style={{ color: grey[300] }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDeleteClick}>
              <DeleteIcon style={{ color: red[500] }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          {[1,2].map((qa, index) => (
            <div key={index} className="text-gray-200">
              <p><strong>Q:</strong> question1</p>
              <p><strong>A:</strong> answer1</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HardCodedItem;
