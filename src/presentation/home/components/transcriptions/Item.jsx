// Item.js
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMicrophone,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FormatSize } from "@mui/icons-material";
import { red ,grey } from "@mui/material/colors";

const Item = ({ item, onShowTranscription }) => {
  return (
    <div className="flex items-center p-4 mb-4 border border-gray-800 rounded-lg bg-gray-800">
      <Checkbox className="mr-4" style={{color : grey[100]}}/>
      <div className="flex flex-1">
        <div>
          {" "}
          <span className="mr-4 font-semibold text-gray-200">
            {item.fileName}
          </span>
          <div>
            <span className="mr-4 text-gray-500">
              <FontAwesomeIcon icon={FormatSize} /> {item.size}
            </span>
            <span className="mr-4 text-gray-500">
              <FontAwesomeIcon icon={faGlobe} />
              &nbsp; {item.language}
            </span>
            <span className="mr-4 text-gray-500">
              <FontAwesomeIcon icon={faUser} />
              &nbsp;{item.noOfSpeakers}
            </span>
            <span className="mr-4 text-gray-500">
              <FontAwesomeIcon icon={faMicrophone} />
              &nbsp; {item.audioType}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="contained"
          size="small"
          onClick={() => onShowTranscription(item.id)}
        >
          Show Transcriptions
        </Button>

        <Tooltip title="Delete">
          <IconButton size="small">
            <DeleteIcon style={{ color: red[500] }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Item;
