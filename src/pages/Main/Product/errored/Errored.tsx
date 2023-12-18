import React from 'react';
import { Sync as SyncIcon, Search as SearchIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { Header } from '../../Common/Header';
import { AppContext } from '../../../../containers/AppContext';
import { SearchFilterModal } from '../../Modals';
import { Box, Container, IconButton, MenuItem, Pagination, Paper, Tooltip, Typography } from '@mui/material';
import { ImagePopOver } from '../../PopOver';
import { ComboBox, Frame, Input, Title } from '../../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ErroredProductTables from '../Components/ErroredProductTables';

// 강제관리 탭 목록 테이블 뷰
export const Errored = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 컴포넌트 초기설정
	React.useEffect(() => {
		// 태그사전 데이터 가져오기
		product.getTagDict();

		// 상품 정보 가져오기
		product.refreshProduct(common);

		// 메시지 이벤트 설정 (이미지번역, 새로고침 등의 메시지를 받을 경우 처리)
		chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
			switch (request.action) {
				case 'refresh': {
					product.refreshProduct(common);
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
								<Typography color='text.primary'>상품목록 ({product.count})</Typography>
							</Box>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
								}}
							>
								&nbsp;
								<ComboBox
									value={product.etcPageSize ? 0 : product.pageSize}
									onChange={async (e: any) => {
										let pageSize = 10;

										if (e.target.value === 0) {
											const input = prompt('페이지 당 조회할 상품 수를 입력해주세요. (최대 50개까지 입력 가능)');

											if (!input) return alert('조회할 상품 수 입력이 잘못되었습니다.');
											if (isNaN(Number(input))) return alert('조회할 상품 수는 숫자만 입력 가능합니다.');

											pageSize = parseInt(input);

											if (pageSize < 1) return alert('조회할 상품 수는 1개 이상으로 입력해주세요.');

											const pageLimit = product.gridView ? 200 : 50;

											if (pageSize > pageLimit) return alert(`조회할 상품 수는 ${pageLimit}개 이하로 입력해주세요.`);

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
								&nbsp;
								<Tooltip title='페이지새로고침'>
									<IconButton size='small' onClick={() => product.refreshProduct(common)}>
										<SyncIcon />
									</IconButton>
								</Tooltip>
								&nbsp;
								<Input
									id='product_page'
									type='number'
									width={50}
									value={product.pageTemp}
									onChange={(e) => product.setPageTemp(e.target.value.replace(/[^0-9]/g, ''))}
									onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
										const page = parseInt(e.target.value);
										if (!page) return;

										product.setPageTemp(page);
									}}
									onKeyPress={(e: any) => {
										if (e.key !== 'Enter') return;
										if (!e.target.value) return;

										const page = parseInt(e.target.value);

										product.setPageTemp(page);
										product.getProduct(common, product.pageTemp);
									}}
								/>
								&nbsp;
								<Tooltip title='페이지이동'>
									<IconButton size='small' onClick={() => product.getProduct(common, product.pageTemp)}>
										<SearchIcon />
									</IconButton>
								</Tooltip>
								<Pagination
									size='small'
									count={product.pages}
									page={product.page}
									color='primary'
									shape='rounded'
									onChange={(_, p) => {
										product.setPageTemp(p);
										product.getProduct(common, p);
									}}
								/>
							</Box>
						</Title>
						<ErroredProductTables />
					</Paper>
				</Container>

				<ImagePopOver />

				<SearchFilterModal />
			</Frame>
		</ThemeProvider>
	);
});