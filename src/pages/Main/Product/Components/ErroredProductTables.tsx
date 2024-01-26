import React, { useState } from 'react';
import { FilterAlt as FilterAltIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';

import {
	styled,
	Box,
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
import { ErroredSummary } from './ErroredSummary';
import { Details } from './Details/Details';
import '../../Common/Styles.css';
import { ImageSummary } from './';
import { SearchType } from '../../../../type/type';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 0,
	fontSize: 14,
});

// 상품관리목록 테이블 뷰
export const ErroredProductTables = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const [searchType, setSearchType] = useState<SearchType>('PCODE');
	const [keyword, setKeyword] = useState('');
	// 테이블 엘리먼트 참조변수 생성
	const tableRef = React.useRef();
	// 가상화 렌더링 요소 (리스트뷰)
	const rowRenderer = (props) => {
		const item = product.itemInfo.items[props.index];

		props.style.height = 83;

		return (
			<div key={props.key} style={props.style}>
				<Box
					sx={{
						position: 'relative',
					}}
				>
					<Table>
						<ErroredSummary tableRef={tableRef} item={item} index={props.index} />
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
		props.style.height = 83;

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
												value={searchType}
												onChange={(e) => setSearchType(e.target.value as SearchType)}
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
												{common?.user?.purchaseInfo2?.level >= 3 ? (
													<MenuItem value='MYKEYWORD'>개인분류</MenuItem>
												) : null}
											</Select>

											<Input
												id='product_tables_keyword'
												onChange={(e) => setKeyword(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === 'Enter') {
														product.setSearchKeyword({ type: searchType, keyword: keyword });
														product.getProduct(common, 1);
													}
												}}
											/>
											<MyButton
												disableElevation
												variant='contained'
												color='info'
												sx={{
													minWidth: 60,
													ml: 0.5,
												}}
												onClick={() => {
													product.setSearchKeyword({ type: searchType, keyword: keyword });
													product.getProduct(common, 1);
												}}
											>
												검색
											</MyButton>
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
											<MyButton
												color='error'
												sx={{
													ml: 0.5,
													minWidth: 60,
												}}
												onClick={() => product.forceDeleteProduct(common, -1)}
											>
												일괄강제삭제
											</MyButton>
										</Box>
									</Grid>
								</Grid>
							</Toolbar>
						</StyledTableCell>
					</TableRow>

					<TableRow>
						<>
							<StyledTableCell width={50}></StyledTableCell>

							<StyledTableCell width={90}>
								<Box
									sx={{
										fontSize: 11,
									}}
								>
									상품코드/수집일
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
									></Grid>

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
															rowHeight={({ index }) => (product.itemInfo.items[index].collapse ? 577 : 83)}
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
