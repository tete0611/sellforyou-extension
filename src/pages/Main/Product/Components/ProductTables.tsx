import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ReorderIcon from '@mui/icons-material/Reorder';
// import * as XLSX from 'xlsx';
// import path from 'path-browserify';
import { byteSlice } from '../../../Tools/Common';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
// import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';

import {
	styled,
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	CircularProgress,
	Grid,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { List, AutoSizer } from 'react-virtualized';
import { Input, MyButton } from '../../Common/UI';
import { Summary } from './Summary';
import { Details } from './Details/Details';

import '../../Common/Styles.css';
import { ImageSummary } from './ImageSummary';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 0,
	fontSize: 14,
});

// 상품관리목록 테이블 뷰
export const ProductTables = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	// 테이블 엘리먼트 참조변수 생성
	const tableRef = React.useRef();
	// 가상화 렌더링 요소 (리스트뷰)
	const rowRenderer = (props) => {
		const item = product.itemInfo.items[props.index];

		return (
			<div key={props.key} style={props.style}>
				<Box
					sx={{
						position: 'relative',
					}}
				>
					<Table>
						<Summary tableRef={tableRef} item={item} index={props.index} />
						<Details item={item} index={props.index} />
					</Table>
				</Box>
			</div>
		);
	};

	// 가상화 렌더링 요소 (그리드뷰)
	const rowImageRenderer = (props) => {
		const array = new Array(10).fill(null).map((v, i) => props.index * 10 + i);
		const lastIndex = array[array.length - 1];

		let lastRow = false;

		if (!product.itemInfo.items[lastIndex]) lastRow = true;

		return (
			<div key={props.key} style={props.style}>
				<Box
					sx={{
						position: 'relative',
					}}
				>
					<Table>
						<TableRow>
							{array.map((v, i) =>
								product.itemInfo.items[v] ? (
									<ImageSummary tableRef={tableRef} item={product.itemInfo.items[v]} index={v} key={i} />
								) : null,
							)}

							{lastRow ? <TableCell></TableCell> : null}
						</TableRow>
					</Table>
				</Box>
			</div>
		);
	};

	return (
		<>
			<Table stickyHeader size='small'>
				<TableHead>
					<TableRow>
						<StyledTableCell width={50}>
							<Checkbox
								size='small'
								checked={product.itemInfo.checkedAll}
								onChange={(e) => product.toggleItemCheckedAll(e.target.checked)}
							/>
						</StyledTableCell>

						<StyledTableCell colSpan={3}>
							<Toolbar
								disableGutters
								style={{
									minHeight: 50,
								}}
							>
								<Grid container spacing={0.5}>
									<Grid
										item
										xs={6}
										md={5}
										sx={{
											margin: 'auto',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Tooltip title='검색어필터'>
												<IconButton size='small' color='inherit' onClick={() => product.toggleSearchFilterModal(true)}>
													<FilterAltIcon />
												</IconButton>
											</Tooltip>
											<Select
												sx={{
													fontSize: 13,
													height: 30,
													minWidth: 100,
													mx: 0.5,
												}}
												defaultValue={product.searchInfo.searchType}
												onChange={(e: any) =>
													product.setSearchInfo({
														...product.searchInfo,
														searchType: e.target.value,
													})
												}
											>
												{/* <MenuItem value="ALL">
                        통합검색
                      </MenuItem> */}
												<MenuItem value='PCODE'>상품코드</MenuItem>
												<MenuItem value='ONAME'>상품명(원문)</MenuItem>
												<MenuItem value='NAME'>상품명(번역)</MenuItem>
												<MenuItem value='CNAME'>카테고리명</MenuItem>
												<MenuItem value='OID'>구매처상품번호</MenuItem>
												<MenuItem value='MID'>판매채널상품번호</MenuItem>
												{common?.user?.purchaseInfo2?.level >= 3 ? <MenuItem value='KEYWARD'>개인분류</MenuItem> : null}
											</Select>

											<Input
												id='product_tables_keyword'
												onChange={(e: any) =>
													product.setSearchInfo({
														...product.searchInfo,
														searchKeyword: e.target.value,
													})
												}
												onKeyPress={(e: any) => e.key !== 'Enter' && product.getSearchResult(common)}
											/>
											<MyButton
												disableElevation
												variant='contained'
												color='info'
												sx={{
													minWidth: 60,
													ml: 0.5,
												}}
												onClick={() => product.getSearchResult(common)}
											>
												검색
											</MyButton>

											{product.gridView ? null : (
												<Tooltip title='상품명최적화(특수문자제거&길이조절)-일괄'>
													<Button
														disableElevation
														size='small'
														color='info'
														variant='contained'
														sx={{
															ml: 0.5,
															minWidth: 30,
															height: 30,
															p: 0,
														}}
														onClick={async () => {
															const regExp = /[^가-힣a-zA-Z0-9 ]+/g;
															product.itemInfo.items.map((v: any, i: number) => {
																if (!v.checked) return null;

																const name1 = v.name.replace(regExp, ' ');
																const name2 = byteSlice(name1, 100);

																const nameList = name2.split(' ');
																const nameListFixed = [...new Set(nameList)];

																const name3 = nameListFixed.join(' ');
																const name4 = name3.replaceAll('  ', ' ');
																product.setProductName(name4, i);
																product.updateProductName(i);
															});
														}}
													>
														<AutoFixHighIcon fontSize='small' />
													</Button>
												</Tooltip>
											)}
										</Box>
									</Grid>

									<Grid
										item
										xs={6}
										md={7}
										sx={{
											margin: 'auto',
										}}
									>
										<Box
											sx={{
												alignItems: 'center',
												display: 'flex',
												justifyContent: 'right',
												mr: 1,
											}}
										>
											<ButtonGroup
												disableElevation
												variant='contained'
												aria-label='Disabled elevation buttons'
												color='inherit'
											>
												<Tooltip title='유사이미지 순으로 정렬 후 그리드로 보여줍니다.'>
													<MyButton
														color={product.gridView ? 'secondary' : 'inherit'}
														onClick={() => {
															if (common.user.purchaseInfo2.level < 3)
																return alert('[프로] 등급부터 사용 가능한 기능입니다.');

															product.setGridView(common, true);
														}}
													>
														<ViewModuleIcon />
													</MyButton>
												</Tooltip>

												<Tooltip title='최근 수집 순으로 정렬 후 리스트로 보여줍니다.'>
													<MyButton
														color={product.gridView ? 'inherit' : 'secondary'}
														onClick={() => {
															if (common.user.purchaseInfo2.level < 3)
																return alert('[프로] 등급부터 사용 가능한 기능입니다.');

															product.setGridView(common, false);
														}}
													>
														<ReorderIcon />
													</MyButton>
												</Tooltip>
											</ButtonGroup>
											<MyButton
												sx={{
													ml: 0.5,
													minWidth: 60,
												}}
												onClick={(e: any) =>
													product.setUpdateManyProductPopOver({
														...product.popOverInfo.updateManyProduct,
														element: e.target,
														open: true,
													})
												}
											>
												일괄설정
											</MyButton>

											<MyButton
												disabled={product.itemInfo.items.find((v) => v.translate)}
												color='secondary'
												sx={{
													ml: 0.5,
													minWidth: 60,
												}}
												onClick={(e: any) => {
													if (common.user.purchaseInfo2.level < 3)
														return alert('[프로] 등급부터 사용 가능한 기능입니다.');

													product.autoImageTranslate(-1, 0);
												}}
											>
												일괄번역
											</MyButton>
											<span style={{ marginLeft: '5px' }}>|</span>

											{product.state === 7 ? (
												<MyButton
													color='info'
													sx={{
														ml: 0.5,
														minWidth: 60,
													}}
													onClick={() => {
														common.setEditedUpload(true);
														product.toggleUploadModal(-1, true);
													}}
												>
													일괄수정
												</MyButton>
											) : null}
											<MyButton
												color='info'
												sx={{
													ml: 0.5,
													minWidth: 60,
												}}
												onClick={() => {
													common.setEditedUpload(false);
													product.toggleUploadModal(-1, true);
												}}
											>
												일괄등록
											</MyButton>
											{product.state === 7 || product.myLock === 2 ? (
												<MyButton
													color='error'
													sx={{
														ml: 0.5,
														minWidth: 60,
													}}
													onClick={() => product.toggleUploadDisabledModal(-1, true, common)}
												>
													일괄해제
												</MyButton>
											) : null}
											{product.state === 7 || product.myLock === 2 ? (
												<span style={{ marginLeft: '5px' }}>|</span>
											) : null}
											{/* {product.state === 7 ? (
												<MyButton
													color='info'
													sx={{
														ml: 0.5,
														minWidth: 60,
													}}
													onClick={() => {
														common.setEditedUpload(true);

														product.toggleEsm2UploadModal(-1, true);
													}}
												>
													일괄수정(2.0)
												</MyButton>
											) : null}
											<MyButton
												color='info'
												sx={{
													ml: 0.5,
													minWidth: 60,
												}}
												onClick={() => {
													common.setEditedUpload(false);

													product.toggleEsm2UploadModal(-1, true);
												}}
											>
												일괄등록(2.0)
											</MyButton> */}
											{/* {product.state === 7 || product.myLock === 2 ? (
												<MyButton
													color='error'
													sx={{
														ml: 0.5,
														minWidth: 60,
													}}
													onClick={() => {
														product.toggleEsm2UploadDisabledModal(-1, true, common);
													}}
												>
													일괄해제(2.0)
												</MyButton>
											) : null} */}
											{product.state !== 7 && product.myLock !== 2 ? (
												<MyButton
													color='error'
													sx={{
														ml: 0.5,
														minWidth: 60,
													}}
													onClick={() => product.deleteProduct(common, -1)}
												>
													일괄삭제
												</MyButton>
											) : null}
										</Box>
									</Grid>
								</Grid>
							</Toolbar>
						</StyledTableCell>
					</TableRow>

					<TableRow>
						{product.gridView ? (
							<StyledTableCell colSpan={4}>
								<Box
									sx={{
										fontSize: 11,
									}}
								>
									이미지/상품코드
								</Box>
							</StyledTableCell>
						) : (
							<>
								<StyledTableCell width={50}></StyledTableCell>

								<StyledTableCell width={90}>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										상품코드/{product.state === 6 ? '수집일' : '등록일'}
									</Box>
								</StyledTableCell>

								<StyledTableCell width={100}>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										이미지
									</Box>
								</StyledTableCell>

								<StyledTableCell>
									<Grid container spacing={0.5}>
										<Grid
											item
											xs={6}
											md={4.5}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													fontSize: 11,
												}}
											>
												상품명
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={2.7}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													fontSize: 11,
												}}
											>
												도매가/판매가{product.state === 6 ? '' : '/등록마켓'}
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={4.8}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													fontSize: 11,
												}}
											>
												카테고리
											</Box>
										</Grid>
									</Grid>
								</StyledTableCell>
							</>
						)}
					</TableRow>
				</TableHead>

				<TableBody>
					<TableRow>
						<StyledTableCell
							colSpan={4}
							sx={{
								borderBottom: 'none',
								borderTop: 'none',
							}}
						>
							<div
								style={{
									height: common.innerSize.height - 192,
								}}
							>
								{product.itemInfo.loading ? (
									<>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												p: 3,
											}}
										>
											<CircularProgress disableShrink size='1.5rem' />

											<Typography
												sx={{
													ml: 1,
												}}
												fontSize={16}
											>
												상품정보를 가져오는 중입니다...
											</Typography>
										</Box>
									</>
								) : (
									<>
										{product.itemInfo.items.length > 0 ? (
											product.gridView ? (
												<AutoSizer>
													{({ height, width }) => (
														<List
															width={width}
															height={height}
															rowCount={Math.ceil(product.itemInfo.items.length / 10)}
															rowRenderer={rowImageRenderer}
															rowHeight={150}
															ref={tableRef}
														/>
													)}
												</AutoSizer>
											) : (
												<AutoSizer>
													{({ height, width }) => (
														<List
															width={width}
															height={height}
															rowCount={product.itemInfo.items.length}
															rowRenderer={rowRenderer}
															rowHeight={({ index }) =>
																product.itemInfo.items[index].collapse
																	? product.state === 7
																		? 577 + 30
																		: 577
																	: product.state === 7
																	? 83 + 30
																	: 83
															}
															ref={tableRef}
														/>
													)}
												</AutoSizer>
												//여기서 collapse의 높이를 조절할수 있음.
											)
										) : (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													p: 3,
												}}
											>
												<Typography fontSize={16}>상품이 존재하지 않습니다.</Typography>
											</Box>
										)}
									</>
								)}
							</div>
						</StyledTableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
});
export default ProductTables;
