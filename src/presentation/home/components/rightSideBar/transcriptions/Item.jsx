// Item.js
import React, {useState} from "react";
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
import { getFileExtensionFromURL, getFileNameFromURL } from "../../../../../utils/functions";

const Item = ({ item, onShowTranscription, onDeleteClick }) => {
  const [showFullFilename, setShowFullFilename] = useState(false);

  const truncateFilename = (filename, length) => {
    return filename.length > length ? `${filename.substring(0, length)}...` : filename;
  };

  return (
    <div className="flex items-center p-4 mb-4 border border-gray-800 rounded-lg bg-gray-800">
      <Checkbox className="mr-4" style={{color : grey[100]}}/>
      <div className="flex flex-1">
        <div>
          {" "}
          <span className="mr-4 font-semibold text-gray-200">
          {showFullFilename ? getFileNameFromURL(item.fileUrl) : truncateFilename(getFileNameFromURL(item.fileUrl), 20)}
          </span>
          <button onClick={() => setShowFullFilename(!showFullFilename)} className="text-blue-500 hover:text-blue-700 text-sm">
            {showFullFilename ? 'Show Less' : 'Read More'}
          </button>
          <div>
            <span className="mr-4 text-gray-500">
            </span>
            <span className="mr-4 text-gray-500">
              <FontAwesomeIcon icon={faGlobe} />
              &nbsp; {getFileExtensionFromURL(item.fileUrl)}
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
        <h1 className="text-white">{item.status}</h1>
        {item && item.status === 'uploaded' && <Button
          variant="contained"
          size="small"
          onClick={() => onShowTranscription(item.id)}
        >
          Start Transcriptions
        </Button>}
        

        <Tooltip title="Delete">
          <IconButton size="small" onClick={onDeleteClick}>
            <DeleteIcon style={{ color: red[500] }}  />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Item;
