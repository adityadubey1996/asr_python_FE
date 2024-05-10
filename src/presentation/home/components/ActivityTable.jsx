import React from "react";
import constants from "../../../utils/constants";

const ActivityTable = () => {
  const tableItems = [
    {
      fileName: "A",
      transcription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae.",
      status: "cancelled",
      date: "2022-02-01",
      encoding: ".wav",
    },
    {
      fileName: "B",
      transcription: "Epsum",
      status: "approve",
      date: "2022-02-01",
      encoding: ".mp3",
    },
    {
      fileName: "C",
      transcription: "Lorem",
      status: "pending",
      date: "2022-02-01",
      encoding: ".mp4",
    },
    {
      fileName: "D",
      transcription: "Epsum",
      status: "cancelled",
      date: "2022-02-01",
      encoding: ".mp3",
    },
  ];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    } else {
      return text;
    }
  };

  return (
    <div className="w-[70%]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-lg text-headingColor font-semibold">
            My Activity
          </h1>
          <p className="text-sm mt-2 text-lighttextGray">
            Your recent activities are shown below. You can switch workspace to
            find other recordings in other workspaces.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full divide-y border border-gray-300 divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 border border-r-gray-300 py-3 text-left text-xs  text-headingColor font-bold  tracking-wider">
                  FileName
                </th>
                <th className="px-6 py-3 border border-r-gray-300 text-left text-xs text-headingColor font-bold  tracking-wider">
                  Transcription
                </th>
                <th className="px-6 py-3 border border-r-gray-300 text-left text-xs text-headingColor font-bold  tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3  border border-r-gray-300 text-left text-xs text-headingColor font-bold  tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3  text-left text-xs text-headingColor font-bold tracking-wider">
                  Encoding
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableItems.map((x, index) => (
                <tr key={index}>
                  <td className="px-6 border border-r-gray-300 py-2 text-[13px] font-medium whitespace-nowrap">
                    {x.fileName}
                  </td>
                  <td className="px-6 border font-medium border-r-gray-300 py-2 text-[13px] whitespace-nowrap">
                    {truncateText(x.transcription, 2)}{" "}
                  </td>
                  <td className="px-6  py-2 text-[13px] whitespace-nowrap">
                    <span
                      className={
                        x.status === constants.STATUS_APPROVE
                          ? "text-green-500 border-green-500 px-3 text-[12px] rounded-md font-semibold bg-green-100  border p-[2px]"
                          : x.status === constants.STATUS_CANCELLED
                          ? "text-red-500 border-red-500 bg-red-100 px-3 text-[12px] font-semibold rounded-md border p-[2px]"
                          : "text-orange-500 border p-[2px] font-semibold px-3 text-[12px] bg-orange-100  rounded-md border-orange-500"
                      }
                    >
                      {capitalizeFirstLetter(x.status)}{" "}
                    </span>
                  </td>
                  <td className="px-6 border font-medium border-r-gray-300 py-2 text-[13px] whitespace-nowrap">
                    {x.date}
                  </td>
                  <td className="px-6 text-blue-400 font-medium  py-2  text-[13px] whitespace-nowrap">
                    {x.encoding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityTable;
