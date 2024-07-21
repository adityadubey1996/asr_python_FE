// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserMetrics } from "reducers/metric.reducer"
// import { Card, CardContent, Typography, CircularProgress, Container } from "@mui/material";
// import { grey } from "@mui/material/colors";
// import WorkFlowTile from './workflow/WorkFlowTile'

// const Workflow = () => {
//   const dispatch = useDispatch();
//   const [userMetrics, setUserMetrics] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const metrics = useSelector(state=> state.metrics.userMetrics)

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const result = await dispatch(getUserMetrics());
        
//         if (result.payload && result.payload.length > 0) {
//           const userMetric = result.payload[0];
//           setUserMetrics(JSON.parse(userMetric.customSettings));
//         } else {
//           console.error("Error fetching user metrics: No data found");
//         }
//       } catch (error) {
//         console.error("Error fetching user metrics:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if(metrics){
//       console.log(metrics[0])
//       setUserMetrics(JSON.parse(metrics[0].customSettings))
//       setLoading(false)
//     } else {
//       fetchData();
//     }
//   }, [dispatch]);

//   return (
//     <Container maxWidth="lg" className="p-4">
//        <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={3}
//         >
//            <Typography variant="h6" fontWeight="bold" className="text-gray-200">
//             <FontAwesomeIcon icon={faEdit} /> Transcriptions
//           </Typography>
//           <div className="flex items-center p-4 mb-4 border border-gray-800 rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-200 ease-in-out">
//   <WorkFlowTile/>
//   </div>
//         </Box>

 

// </Container>
// )

 
// };

// export default Workflow;
