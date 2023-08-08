import React from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';

import { observer } from 'mobx-react';
import { Header } from '../../Common/Header';
import { ProductTables } from '../Components/ProductTables';
import { UploadModal } from '../../Modals/UploadModal';
import { UploadFailedModal } from '../../Modals/UploadFailedModal';
import { Esm2UploadModal } from '../../Modals/Esm2UploadModal';
import { AppContext } from '../../../../containers/AppContext';
import { ManyCategoryModal } from '../../Modals/ManyCategoryModal';
import { ManyNameModal } from '../../Modals/ManyNameModal';
import { ManyLockModal } from '../../Modals/ManyLockModal';
import { ManyPriceModal } from '../../Modals/ManyPriceModal';
import { ManyTagModal } from '../../Modals/ManyTagModal';
import { MyKeywardModal } from '../../Modals/MyKeywardModal';
import { SearchFilterModal } from '../../Modals/SearchFilterModal';
import { Box, Container, IconButton, MenuItem, Pagination, Paper, Tooltip, Typography } from '@mui/material';
import { DescriptionModal } from '../../Modals/DescriptionModal';
import { ImagePopOver } from '../../PopOver/ImagePopOver';
import { AddOptionNamePopOver } from '../../PopOver/AddOptionNamePopOver';
import { UploadDisabledModal } from '../../Modals/UploadDisabledModal';
import { AddOptionPricePopOver } from '../../PopOver/AddOptionPricePopOver';
import { SubtractOptionPricePopOver } from '../../PopOver/SubtractOptionPricePopOver';
import { SetOptionPricePopOver } from '../../PopOver/SetOptionPricePopOver';
import { SetOptionStockPopOver } from '../../PopOver/SetOptionStockPopOver';
import { ManyFeeModal } from '../../Modals/ManyFeeModal';
import { ComboBox, Frame, Input, MyButton, Title } from '../../Common/UI';
import { ManyAttributeModal } from '../../Modals/ManyAttributeModal';
import { SetProductSillDataPopOver } from '../../PopOver/SetProductSillDataPopOver';
import { UpdateManyProductPopOver } from '../../PopOver/UpdateManyProductPopOver';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReplaceOptionNamePopOver } from '../../PopOver/ReplaceOptionNamePopOver';
import { Esm2UploadDisabledModal } from '../../Modals/Esm2UploadDisabledModal';
// import { PreviewModal } from '../../Modals/PreviewModal';

// 상품등록관리 목록 테이블 뷰
export const Registered = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// console.log('common', common);
	// 컴포넌트 초기화
	React.useEffect(() => {
		// 태그사전 데이터 가져오기
		product.getTagDict();

		// 검색조건 설정하기
		product.setState(7);
		product.setSearchWhereAndInput([{ state: { equals: product.state } }]);

		// 상품목록 가져오기
		product.refreshProduct(common);

		// 메시지 이벤트 설정하기 (이미지번역, 새로고침 등)
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			switch (request.action) {
				case 'refresh': {
					product.refreshProduct(common);
					sendResponse(true);

					break;
				}

				case 'trangers': {
					product.updateImageTranslatedData(request.source);
					sendResponse(true);

					break;
				}

				default:
					break;
			}
		});
	}, []);

	// 다크모드 지원 설정
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: common.darkTheme ? 'dark' : 'light',
				},
			}),
		[common.darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={common.darkTheme}>
				<Header />

				<Container maxWidth={'xl'}>
					<Paper variant='outlined'>
						<Title dark={common.darkTheme}>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
								}}
							>
								<Typography color='text.primary'>등록상품목록 ({product.count})</Typography>
							</Box>

							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
								}}
							>
								<MyButton
									color='info'
									sx={{
										minWidth: 100,
									}}
									onClick={() => {
										product.itemToExcel();
									}}
								>
									상품정보저장
								</MyButton>
								&nbsp;
								<ComboBox
									value={product.etcPageSize ? 0 : product.pageSize}
									onChange={async (e: any) => {
										let pageSize = 10;

										if (e.target.value === 0) {
											const input = prompt('페이지 당 조회할 상품 수를 입력해주세요. (최대 50개까지 입력 가능)');

											if (!input) {
												alert('조회할 상품 수 입력이 잘못되었습니다.');

												return;
											}

											pageSize = parseInt(input);

											if (isNaN(pageSize)) {
												alert('조회할 상품 수는 숫자만 입력 가능합니다.');

												return;
											}

											if (pageSize < 1) {
												alert('조회할 상품 수는 1개 이상으로 입력해주세요.');

												return;
											}

											const pageLimit = product.gridView ? 200 : 50;

											if (pageSize > pageLimit) {
												alert(`조회할 상품 수는 ${pageLimit}개 이하로 입력해주세요.`);

												return;
											}

											product.toggleETCPageSize(true);
										} else {
											pageSize = e.target.value;

											product.toggleETCPageSize(false);
										}

										await product.setPageSize(pageSize);
										await product.getProduct(common, 1);
									}}
								>
									<MenuItem value={10}>10개 보기</MenuItem>
									<MenuItem value={20}>20개 보기</MenuItem>
									<MenuItem value={50}>50개 보기</MenuItem>

									{product.gridView ? <MenuItem value={100}>100개 보기</MenuItem> : null}
									{product.gridView ? <MenuItem value={200}>200개 보기</MenuItem> : null}

									<MenuItem>-----------</MenuItem>

									{product.etcPageSize ? (
										<MenuItem value={0}>{product.pageSize}개 보기</MenuItem>
									) : (
										<MenuItem value={0}>직접 입력</MenuItem>
									)}
								</ComboBox>
								<Tooltip title='페이지새로고침'>
									<IconButton
										sx={{
											ml: 0.5,
										}}
										size='small'
										onClick={() => {
											product.refreshProduct(common);
										}}
									>
										<SyncIcon />
									</IconButton>
								</Tooltip>
								<Input
									id='product_page'
									type='number'
									width={50}
									value={product.pageTemp}
									onChange={(e: any) => {
										product.setPageTemp(e.target.value);
									}}
									onBlur={(e: any) => {
										const page = parseInt(e.target.value);

										if (!page || isNaN(page)) {
											return;
										}

										product.setPageTemp(page);
									}}
									onKeyPress={(e: any) => {
										if (e.key !== 'Enter') {
											return;
										}

										const page = parseInt(e.target.value);

										if (!page || isNaN(page)) {
											return;
										}

										product.setPageTemp(page);
										product.getProduct(common, product.pageTemp);
									}}
								/>
								<Tooltip title='페이지이동'>
									<IconButton
										sx={{
											ml: 0.5,
										}}
										size='small'
										onClick={() => {
											product.getProduct(common, product.pageTemp);
										}}
									>
										<SearchIcon />
									</IconButton>
								</Tooltip>
								<Pagination
									size='small'
									count={product.pages}
									page={product.page}
									color='primary'
									shape='rounded'
									onChange={(e, p) => {
										product.setPageTemp(p);
										product.getProduct(common, p);
									}}
								/>
							</Box>
						</Title>

						<ProductTables />
					</Paper>
				</Container>

				<AddOptionNamePopOver />
				<AddOptionPricePopOver />
				<ReplaceOptionNamePopOver />
				<ImagePopOver />
				<SubtractOptionPricePopOver />
				<SetOptionPricePopOver />
				<SetOptionStockPopOver />
				<SetProductSillDataPopOver />
				<UpdateManyProductPopOver />

				<DescriptionModal />
				{/* <PreviewModal /> */}
				<ManyPriceModal />
				<ManyFeeModal />
				<ManyCategoryModal />
				<ManyNameModal />
				<ManyLockModal />
				<ManyAttributeModal />
				<ManyTagModal />
				<MyKeywardModal />
				<SearchFilterModal />
				<UploadModal />
				<Esm2UploadModal />
				<UploadFailedModal />
				<UploadDisabledModal />
				<Esm2UploadDisabledModal />
			</Frame>
		</ThemeProvider>
	);
});
