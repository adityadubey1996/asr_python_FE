import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMetrics } from "reducers/metric.reducer";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { Divider, Box, Button, Paper, Modal } from "@mui/material";
import { grey } from "@mui/material/colors";
import HardCodedItem from './hardCodedItem'

const Workflow = () => {
  const dispatch = useDispatch();
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const metrics = useSelector(state=> state.metrics.userMetrics)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await dispatch(getUserMetrics());
        
        if (result.payload && result.payload.length > 0) {
          const userMetric = result.payload[0];
          setUserMetrics(JSON.parse(userMetric.customSettings));
        } else {
          console.error("Error fetching user metrics: No data found");
        }
      } catch (error) {
        console.error("Error fetching user metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    if(metrics){
      console.log(metrics[0])
      setUserMetrics(JSON.parse(metrics[0].customSettings))
      setLoading(false)
    } else {
      fetchData();
    }
  }, [dispatch]);

  return (
    <Container maxWidth="lg" className="p-4">
    <Box
       display="flex"
       justifyContent="space-between"
       alignItems="center"
       mb={3}
     >
        <Typography variant="h6" fontWeight="bold" className="text-gray-200">
         <FontAwesomeIcon  /> Workflow
       </Typography>
       
     </Box>
    
<HardCodedItem/>



</Container>
)

  // return (
  //   <div className="max-w-md m-10">
  //     <Typography
  //       variant="h5"
  //       component="h2"
  //       sx={{ color: grey[300], fontWeight: "bold" }}
  //     >
  //       Workflow
  //     </Typography>
  //     <br />
  //     <div
  //       style={{
  //         backgroundColor: "",
  //         color: "white",
  //         borderRadius: "16px",
  //         overflow: "hidden",
  //         transition: "transform 0.2s ease-in-out",
  //         "&:hover": {
  //           transform: "scale(1.01)",
  //         },
  //       }}
  //       className="bg-gray-800"
  //     >
       
  //       <CardContent>
  //       <HardCodedItem/>
  //         {loading ? (
  //           <div className="flex justify-center">
  //             <CircularProgress sx={{ color: grey[300] }} />
  //           </div>
  //         ) : (
  //           userMetrics.map((question, index) => (
  //             <div
  //               key={index}
  //               className="mb-4 p-4 rounded-lg bg-gray-900"
  //             >
  //               <Typography
  //                 variant="subtitle1"
  //                 className="font-medium mb-1"
  //                 sx={{ color: grey[300] }}
  //               >
  //                 <span className="text-yellow-400">Question {index + 1}: </span>
  //                 {question.question}
  //               </Typography>
  //               <Typography variant="body1" className="text-gray-300">
  //                 <span className="text-green-400">Answer:</span>{" "}
  //                 {question.answerSelected}
  //               </Typography>
  //             </div>
  //           ))
  //         )}
  //       </CardContent>
  //     </div>
  //   </div>
  // );
};

export default Workflow;
