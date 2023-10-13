import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Button, Box, Grid, Modal, Paper, Typography } from '@mui/material';
import { readFileBinary } from '../../Tools/Common';
import { createTabCompletely, sendTabMessage } from '../../Tools/ChromeAsync';

const XLSX = require('xlsx');

// 엑셀 상품 수집 모달
export const CollectExcelModal = observer(() => {
	// MobX 스토리지 로드
	const { product } = React.useContext(AppContext);

	return (
		<Modal open={product.modalInfo.collectExcel} onClose={() => product.toggleCollectExcelModal(false)}>
			<Paper
				className='uploadModal'
				sx={{
					width: 350,
				}}
			>
				<Typography
					fontSize={16}
					sx={{
						mb: 3,
					}}
				>
					엑셀대량수집 설정
				</Typography>

				<Box>
					<Paper
						variant='outlined'
						sx={{
							p: 1,
							mb: 1,
						}}
					>
						<Grid container spacing={1}>
							<Grid
								item
								xs={8}
								md={7}
								sx={{
									m: 'auto',
								}}
							>
								<Typography fontSize={14}>상품단위 대량수집하기</Typography>
							</Grid>

							<Grid
								item
								xs={8}
								md={5}
								sx={{
									m: 'auto',
								}}
							>
								<Button
									disableElevation
									variant='contained'
									color='info'
									sx={{
										width: '100%',
										height: 30,
									}}
									onClick={() =>
										window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 상품단위 대량등록 양식.xlsx`)
									}
								>
									XLSX 양식
								</Button>
							</Grid>

							<Grid
								item
								xs={8}
								md={12}
								sx={{
									m: 'auto',
								}}
							>
								<Button
									disableElevation
									component='label'
									variant='contained'
									color='info'
									sx={{
										width: '100%',
										height: 30,
									}}
								>
									시작하기
									<input
										hidden
										accept='.xlsx'
										type='file'
										onChange={async (e) => {
											const fileList = e.target.files ?? [];
											const fileData = await readFileBinary(fileList[0]);

											let workbook = XLSX.read(fileData, { type: 'binary' });
											let excelData = workbook.SheetNames.map((name: any) => {
												return XLSX.utils.sheet_to_json(workbook.Sheets[name], {
													header: ['url', 'productName', 'productTags', 'keywardMemo'],
													defval: '',
													range: 2,
												});
											})[0];

											const tab = await createTabCompletely({ active: false, url: 'https://www.google.com/' }, 10);

											await sendTabMessage(tab.id, {
												action: 'collect-product-excel',
												source: { data: excelData, retry: false },
											});

											product.toggleCollectExcelModal(false);
										}}
									/>
								</Button>
							</Grid>
						</Grid>
					</Paper>

					<Paper
						variant='outlined'
						sx={{
							p: 1,
						}}
					>
						<Grid container spacing={1}>
							<Grid
								item
								xs={8}
								md={7}
								sx={{
									m: 'auto',
								}}
							>
								<Typography fontSize={14}>페이지단위 대량수집하기</Typography>
							</Grid>

							<Grid
								item
								xs={8}
								md={5}
								sx={{
									m: 'auto',
								}}
							>
								<Button
									disableElevation
									variant='contained'
									color='info'
									sx={{
										width: '100%',
										height: 30,
									}}
									onClick={() =>
										window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 페이지단위 대량등록 양식.xlsx`)
									}
								>
									XLSX 양식
								</Button>
							</Grid>

							<Grid
								item
								xs={8}
								md={12}
								sx={{
									m: 'auto',
								}}
							>
								<Button
									disableElevation
									component='label'
									variant='contained'
									color='info'
									sx={{
										width: '100%',
										height: 30,
									}}
								>
									시작하기
									<input
										hidden
										accept='.xlsx'
										type='file'
										onChange={async (e) => {
											const fileList = e.target.files ?? [];
											const fileData = await readFileBinary(fileList[0]);

											let workbook = XLSX.read(fileData, { type: 'binary' });
											let excelData = workbook.SheetNames.map((name: any) =>
												XLSX.utils.sheet_to_json(workbook.Sheets[name], {
													header: ['url'],
													defval: '',
													range: 2,
												}),
											)[0];

											const tab = await createTabCompletely({ active: false, url: 'https://www.google.com/' }, 10);

											await sendTabMessage(tab.id, {
												action: 'collect-page-excel',
												source: { data: excelData, retry: false },
											});

											product.toggleCollectExcelModal(false);
										}}
									/>
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Box>
			</Paper>
		</Modal>
	);
});
