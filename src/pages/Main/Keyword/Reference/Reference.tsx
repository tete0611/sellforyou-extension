import React from 'react';

import { AppContext } from '../../../../containers/AppContext';
import { Header } from '../../Common/Header';
import { observer } from 'mobx-react';
import { Box, Button, Container, Grid, MenuItem, LinearProgress, Paper, Select } from '@mui/material';
import { Input, Title } from '../../Common/UI';

// 키워드 추천 뷰 (미사용)
export const Reference = observer(() => {
	return <></>;

	// const { common, reference } = React.useContext(AppContext);

	// return (
	//   <>
	//     <Header />

	//     <Container maxWidth={"lg"}>
	//       <Paper
	//         variant="outlined"
	//         sx={{
	//           border: "1px solid #d1e8ff",
	//           fontSize: 14,
	//           p: 0,
	//           mb: 1,
	//         }}
	//       >
	//         <LinearProgress variant="determinate" value={reference.searchInfo.progress} />

	//         <Title>
	//           키워드추천
	//           <Box
	//             sx={{
	//               display: "flex",
	//               alignItems: "center",
	//               justifyContent: "right",
	//             }}
	//           >
	//             <Button
	//               disableElevation
	//               color="error"
	//               sx={{
	//                 fontSize: 13,
	//                 width: 100,
	//                 height: 30,
	//               }}
	//               variant="contained"
	//               onClick={() => {}}
	//             >
	//               초기화
	//             </Button>

	//             <Button
	//               disableElevation
	//               sx={{
	//                 fontSize: 13,
	//                 width: 100,
	//                 height: 30,
	//                 ml: 0.5,
	//               }}
	//               variant="contained"
	//               onClick={() => {}}
	//             >
	//               중복제거
	//             </Button>

	//             <Button
	//               disableElevation
	//               sx={{
	//                 fontSize: 13,
	//                 width: 100,
	//                 height: 30,
	//                 ml: 0.5,
	//               }}
	//               variant="contained"
	//               onClick={() => {}}
	//             >
	//               일괄삭제
	//             </Button>

	//             <Button
	//               disableElevation
	//               sx={{
	//                 fontSize: 13,
	//                 width: 100,
	//                 height: 30,
	//                 ml: 0.5,
	//               }}
	//               variant="contained"
	//               onClick={() => {}}
	//             >
	//               키워드복사
	//             </Button>
	//           </Box>
	//         </Title>

	//         <Grid
	//           container
	//           spacing={1}
	//           sx={{
	//             textAlign: "center",
	//             p: 1,
	//           }}
	//         >
	//           <Grid
	//             item
	//             xs={6}
	//             md={1}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             키워드
	//             <br />
	//             통합검색
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={4}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             <Input
	//               onBlur={(e: any) => {
	//                 reference.setSearchInfo({
	//                   ...reference.searchInfo,

	//                   keyword: e.target.value,
	//                 });
	//               }}
	//               defaultValue={reference.searchInfo.keyword}
	//             />
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={1}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             <Button
	//               disableElevation
	//               sx={{
	//                 fontSize: 13,
	//                 width: "100%",
	//                 height: 30,
	//               }}
	//               variant="contained"
	//               onClick={() => {
	//                 reference.searchKeyword();
	//               }}
	//             >
	//               검색
	//             </Button>
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={1}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             키워드
	//             <br />
	//             추천개수
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={1}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             <Select
	//               sx={{
	//                 fontSize: 13,
	//                 width: "100%",
	//                 height: 30,
	//               }}
	//               defaultValue={reference.searchInfo.expose}
	//               onChange={(e) => {
	//                 reference.setSearchInfo({
	//                   ...reference.searchInfo,

	//                   expose: e.target.value,
	//                 });
	//               }}
	//             >
	//               <MenuItem value={100}>자동</MenuItem>

	//               <MenuItem value={200}>10개</MenuItem>

	//               <MenuItem value={300}>20개</MenuItem>

	//               <MenuItem value={500}>30개</MenuItem>

	//               <MenuItem value={1000}>전체</MenuItem>
	//             </Select>
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={4}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           ></Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={1}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             키워드
	//             <br />
	//             목록
	//           </Grid>

	//           <Grid
	//             item
	//             xs={6}
	//             md={11}
	//             sx={{
	//               margin: "auto",
	//             }}
	//           >
	//             <Input
	//               multiline
	//               rows={5}
	//               onBlur={(e: any) => {
	//                 reference.setSearchInfo({
	//                   ...reference.searchInfo,

	//                   keyword: e.target.value,
	//                 });
	//               }}
	//               defaultValue={reference.searchInfo.keyword}
	//             />
	//           </Grid>
	//         </Grid>
	//       </Paper>

	//       <Paper
	//         variant="outlined"
	//         sx={{
	//           border: "1px solid #d1e8ff",
	//           fontSize: 14,
	//           p: 0,
	//           mb: 1,
	//         }}
	//       >
	//         <Title>검색 결과</Title>

	//         <Box
	//           sx={{
	//             height: 580,
	//             overflowY: "auto",
	//           }}
	//         >
	//           복구 중입니다.
	//         </Box>
	//       </Paper>
	//     </Container>
	//   </>
	// );
});
