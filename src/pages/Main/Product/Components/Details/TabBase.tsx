import React from 'react';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../../containers/AppContext';
import {
	Box,
	Chip,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Tooltip,
	Typography,
	Button,
	Paper,
} from '@mui/material';
import { Input, Search, Title } from '../../../Common/UI';
import { floatingToast } from '../../../../Tools/Common';
// import { makeStyles } from '@material-ui/core/styles';
import { SHOPCODE } from '../../../../../type/variable';
import { Item } from '../../../../../type/type';

// MUI Box 사용자 지정 스타일
// const useStyles = makeStyles((theme) => ({
// 	defaultBox: {
// 		background: '#d1e8ff',
// 	},

// 	errorBox: {
// 		background: '#ffd1d1',
// 	},
// }));

// const copyResult = (data: string) => {
//   const textarea: any = document.createElement("textarea");

//   textarea.value = data === null ? "" : data;
//   textarea.style.top = 0;
//   textarea.style.left = 0;
//   textarea.style.position = "fixed";

//   document.body.appendChild(textarea);

//   textarea.focus();
//   textarea.select();

//   document.execCommand("copy");
//   document.body.removeChild(textarea);

//   floatingToast("검색어태그(스마트스토어)가 복사되었습니다.", "information");
// };

interface Props {
	item: Item;
	index: number;
}

// 기본정보 탭 하위 컴포넌트
export const TabBase = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		AUCTION_1,
		COUPANG,
		G_MARKET_1,
		INTER_PARK,
		LOTTE_ON_GLOBAL,
		LOTTE_ON_NORMAL,
		SMART_STORE,
		STREET11_GLOBAL,
		STREET11_NORMAL,
		TMON,
		WE_MAKE_PRICE,
	} = SHOPCODE;

	// 상품 수정 및 변경사항 발생 시
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 기본정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			{props.item.edited.baseInfo === 2 ? loading : null}

			<Box
				sx={{
					mb: '6px',
				}}
			>
				<Grid container spacing={0.5}>
					<Grid item xs={6} md={9}>
						<Paper
							variant='outlined'
							sx={{
								height: '100%',
							}}
						>
							<Title dark={common.darkTheme} subTitle>
								검색어태그(스마트스토어)
								{/* <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    disableElevation
                    variant="contained"
                    color="info"
                    sx={{
                      ml: 0.5,
                      fontSize: 13,
                      height: 26,
                    }}
                    onClick={() => {
                      copyResult(props.item.immSearchTags);
                    }}
                  >
                    검색어태그 복사하기
                  </Button>
                </Box> */}
							</Title>

							<Grid
								container
								spacing={0.5}
								sx={{
									p: 0.5,
								}}
							>
								<Grid item xs={6} md={2}>
									<Paper variant='outlined'>
										<Title dark={common.darkTheme} subTitle>
											HOT 키워드
										</Title>

										<List
											sx={{
												height: 100,
												overflowY: 'auto',
												p: 0,
											}}
										>
											{props.item.tagInfo?.hot?.map((v: any) => (
												<ListItem disablePadding>
													<ListItemButton
														sx={{
															pt: 0,
															pb: 0,
														}}
														onClick={(e: any) => product.addProductImmSearchTag(e.target.innerText, props.index)}
													>
														<ListItemText primary={<Typography fontSize={13}>{v.tagNm}</Typography>} />
													</ListItemButton>
												</ListItem>
											))}
										</List>
									</Paper>
								</Grid>

								<Grid item xs={6} md={2}>
									<Paper variant='outlined'>
										<Title dark={common.darkTheme} subTitle>
											감성 키워드
										</Title>

										<List
											sx={{
												height: 100,
												overflowY: 'auto',
												p: 0,
											}}
										>
											{props.item.tagInfo?.emotion?.map((v: any) => (
												<ListItem disablePadding>
													<ListItemButton
														sx={{
															pt: 0,
															pb: 0,
														}}
														onClick={(e: any) => product.addProductImmSearchTag(e.target.innerText, props.index)}
													>
														<ListItemText primary={<Typography fontSize={13}>{v.tagNm}</Typography>} />
													</ListItemButton>
												</ListItem>
											))}
										</List>
									</Paper>
								</Grid>

								<Grid item xs={6} md={2}>
									<Paper variant='outlined'>
										<Title dark={common.darkTheme} subTitle>
											이벤트성 키워드
										</Title>

										<List
											sx={{
												height: 100,
												overflowY: 'auto',
												p: 0,
											}}
										>
											{props.item.tagInfo?.event?.map((v: any) => (
												<ListItem disablePadding>
													<ListItemButton
														sx={{
															pt: 0,
															pb: 0,
														}}
														onClick={(e: any) => product.addProductImmSearchTag(e.target.innerText, props.index)}
													>
														<ListItemText primary={<Typography fontSize={13}>{v.tagNm}</Typography>} />
													</ListItemButton>
												</ListItem>
											))}
										</List>
									</Paper>
								</Grid>

								<Grid item xs={6} md={2}>
									<Paper variant='outlined'>
										<Title dark={common.darkTheme} subTitle>
											타켓성 키워드
										</Title>

										<List
											sx={{
												height: 100,
												overflowY: 'auto',
												p: 0,
											}}
										>
											{props.item.tagInfo?.target?.map((v: any) => (
												<ListItem disablePadding>
													<ListItemButton
														sx={{
															pt: 0,
															pb: 0,
														}}
														onClick={(e: any) => product.addProductImmSearchTag(e.target.innerText, props.index)}
													>
														<ListItemText primary={<Typography fontSize={13}>{v.tagNm}</Typography>} />
													</ListItemButton>
												</ListItem>
											))}
										</List>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper variant='outlined'>
										<Title dark={common.darkTheme} subTitle>
											검색어태그 직접입력
										</Title>

										<Box
											sx={{
												display: 'flex',
												flexWrap: 'wrap',
												alignItems: 'center',
												p: 0.5,
												height: 92,
											}}
										>
											<Input
												color={props.item.edited.baseInfo ? 'warning' : 'info'}
												multiline
												rows={3}
												value={props.item.immSearchTags}
												onChange={(e: any) => product.setProductImmSearchTag(e.target.value, props.index)}
												onBlur={(e: any) => product.verifyProductImmSearchTag(e.target.value, props.index)}
											/>
										</Box>
									</Paper>
								</Grid>
							</Grid>

							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									alignItems: 'center',
									px: 0.5,
									height: 27,
								}}
							>
								{props.item.immSearchTags ? (
									props.item.immSearchTags.split(',').map((v: any) => (
										<Chip
											size='small'
											sx={{
												maxWidth: 150,
												mr: 0.5,
											}}
											onDelete={(e) => product.removeProductImmSearchTag(v, props.index)}
											label={v}
										/>
									))
								) : (
									<Typography color='warning' fontSize={13}>
										검색어태그가 설정되지 않았습니다.
									</Typography>
								)}
							</Box>
						</Paper>
					</Grid>

					<Grid item xs={6} md={3}>
						<Paper
							variant='outlined'
							sx={{
								height: '100%',
							}}
						>
							<Title dark={common.darkTheme} subTitle>
								검색어태그(쿠팡)
							</Title>

							<Box
								sx={{
									p: 0.5,
								}}
							>
								<Input
									color={props.item.edited.baseInfo ? 'warning' : 'info'}
									multiline
									rows={6}
									onChange={(e: any) => product.setProductSearchTag(e.target.value, props.index)}
									onBlur={(e: any) => product.updateProductSearchTag(e.target.value, props.index)}
									value={props.item.searchTags}
								/>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>

			<Box>
				<Grid container spacing={0.5}>
					<Grid item xs={6} md={9}>
						<Paper variant='outlined'>
							<Title dark={common.darkTheme} subTitle>
								카테고리정보
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Button
										disableElevation
										variant='contained'
										color='info'
										sx={{
											ml: 0.5,
											fontSize: 13,
											height: 26,
										}}
										onClick={() => {
											product.setManyCategoryInfo({
												categoryInfoA077: props.item.categoryInfoA077,
												categoryInfoB378: props.item.categoryInfoB378,
												categoryInfoA112: props.item.categoryInfoA112,
												categoryInfoA113: props.item.categoryInfoA113,
												categoryInfoA006: props.item.categoryInfoA006,
												categoryInfoA001: props.item.categoryInfoA001,
												categoryInfoA027: props.item.categoryInfoA027,
												categoryInfoB719: props.item.categoryInfoB719,
												categoryInfoA524: props.item.categoryInfoA524,
												categoryInfoA525: props.item.categoryInfoA525,
												categoryInfoB956: props.item.categoryInfoB956,
											});

											floatingToast('카테고리가 복사되었습니다.', 'information');
										}}
									>
										카테고리 복사하기
									</Button>

									<Button
										disableElevation
										variant='contained'
										color='info'
										sx={{
											ml: 0.5,
											fontSize: 13,
											height: 26,
										}}
										onClick={() => product.updateManyCategory(common, [props.item.id])}
									>
										카테고리 붙여넣기
									</Button>
								</Box>
							</Title>

							<Grid
								container
								spacing={0.5}
								sx={{
									p: 0.5,
								}}
							>
								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-smartstore.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA077}
											onChange={(e: any, value: any) => product.updateCategory(SMART_STORE, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(SMART_STORE, value)
											}
											onOpen={() => product.getCategoryList(SMART_STORE)}
											onClose={() => product.setCategoryInput(SMART_STORE, '')}
											options={
												product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
													? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
													: [props.item.categoryInfoA077]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-coupang.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoB378}
											onChange={(e: any, value: any) => product.updateCategory(COUPANG, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(COUPANG, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === COUPANG)!.input
													? product.categoryInfo.markets.find((v) => v.code === COUPANG)!.data
													: [props.item.categoryInfoB378]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(COUPANG)}
											onClose={() => product.setCategoryInput(COUPANG, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === COUPANG)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-street-global.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA112}
											onChange={(e: any, value: any) => product.updateCategory(STREET11_GLOBAL, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(STREET11_GLOBAL, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.input
													? product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.data
													: [props.item.categoryInfoA112]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(STREET11_GLOBAL)}
											onClose={() => product.setCategoryInput(STREET11_GLOBAL, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-street-normal.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA113}
											onChange={(e: any, value: any) => product.updateCategory(STREET11_NORMAL, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(STREET11_NORMAL, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.input
													? product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.data
													: [props.item.categoryInfoA113]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(STREET11_NORMAL)}
											onClose={() => product.setCategoryInput(STREET11_NORMAL, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-gmarket.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA006}
											onChange={(e: any, value: any) => product.updateCategory(G_MARKET_1, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(G_MARKET_1, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.input
													? product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.data
													: [props.item.categoryInfoA006]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(G_MARKET_1)}
											onClose={() => product.setCategoryInput(G_MARKET_1, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-auction.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA001}
											onChange={(e: any, value: any) => product.updateCategory(AUCTION_1, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(AUCTION_1, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.input
													? product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.data
													: [props.item.categoryInfoA001]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(AUCTION_1)}
											onClose={() => product.setCategoryInput(AUCTION_1, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-interpark.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA027}
											onChange={(e: any, value: any) => product.updateCategory(INTER_PARK, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(INTER_PARK, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.input
													? product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.data
													: [props.item.categoryInfoA027]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(INTER_PARK)}
											onClose={() => product.setCategoryInput(INTER_PARK, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-wemakeprice.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoB719}
											onChange={(e: any, value: any) => product.updateCategory(WE_MAKE_PRICE, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(WE_MAKE_PRICE, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.input
													? product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.data
													: [props.item.categoryInfoB719]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(WE_MAKE_PRICE)}
											onClose={() => product.setCategoryInput(WE_MAKE_PRICE, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-lotteon-global.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA524}
											onChange={(e: any, value: any) => product.updateCategory(LOTTE_ON_GLOBAL, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(LOTTE_ON_GLOBAL, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.input
													? product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.data
													: [props.item.categoryInfoA524]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(LOTTE_ON_GLOBAL)}
											onClose={() => product.setCategoryInput(LOTTE_ON_GLOBAL, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-lotteon-normal.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoA525}
											onChange={(e: any, value: any) => product.updateCategory(LOTTE_ON_NORMAL, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(LOTTE_ON_NORMAL, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.input
													? product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.data
													: [props.item.categoryInfoA525]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(LOTTE_ON_NORMAL)}
											onClose={() => product.setCategoryInput(LOTTE_ON_NORMAL, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											fontSize: 13,
											p: 0.5,
										}}
									>
										<img
											src='/resources/icon-tmon.png'
											width={16}
											height={16}
											style={{
												marginRight: 5,
											}}
										/>

										<Search
											value={props.item.categoryInfoB956}
											onChange={(e: any, value: any) => product.updateCategory(TMON, value, props.index)}
											onInputChange={(e: any, value: any, reason: any) =>
												reason === 'input' && product.setCategoryInput(TMON, value)
											}
											options={
												product.categoryInfo.markets.find((v) => v.code === TMON)!.input
													? product.categoryInfo.markets.find((v) => v.code === TMON)!.data
													: [props.item.categoryInfoB956]
											}
											getOptionLabel={(option: any) => option.name ?? ''}
											isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
											onOpen={() => product.getCategoryList(TMON)}
											onClose={() => product.setCategoryInput(TMON, '')}
											loading={product.categoryInfo.markets.find((v) => v.code === TMON)!.loading}
										/>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}></Grid>
							</Grid>
						</Paper>
					</Grid>

					<Grid item xs={6} md={3}>
						<Paper variant='outlined'>
							<Title dark={common.darkTheme} subTitle>
								오픈마켓수수료적용가
							</Title>

							<Grid
								container
								spacing={0.5}
								sx={{
									p: 0.5,
								}}
							>
								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price / (1 - (props.item.naverFee ?? common.user.userInfo?.naverFee) / 100) / 100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-smartstore.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_naverFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.naverFee}
											onChange={(e: any) => product.setProductFee(SMART_STORE, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														naverFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.coupangFee ?? common.user.userInfo?.coupangFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-coupang.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_coupangFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.coupangFee}
											onChange={(e: any) => product.setProductFee(COUPANG, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														coupangFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.streetFee ?? common.user.userInfo?.streetFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-street-global.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_streetFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.streetFee}
											onChange={(e: any) =>
												product.setProductFee(STREET11_GLOBAL, parseFloat(e.target.value), props.index)
											}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														streetFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.streetNormalFee ?? common.user.userInfo?.streetNormalFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-street-normal.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_streetNormalFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.streetNormalFee}
											onChange={(e: any) =>
												product.setProductFee(STREET11_NORMAL, parseFloat(e.target.value), props.index)
											}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														streetNormalFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.gmarketFee ?? common.user.userInfo?.gmarketFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-gmarket.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_gmarketFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.gmarketFee}
											onChange={(e: any) => product.setProductFee(G_MARKET_1, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														gmarketFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.auctionFee ?? common.user.userInfo?.auctionFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-auction.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_auctionFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.auctionFee}
											onChange={(e: any) => product.setProductFee(AUCTION_1, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														auctionFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.interparkFee ?? common.user.userInfo?.interparkFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-interpark.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_interparkFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.interparkFee}
											onChange={(e: any) => product.setProductFee(INTER_PARK, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														interparkFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.wemakepriceFee ?? common.user.userInfo?.wemakepriceFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-wemakeprice.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_wemakepriceFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.wemakepriceFee}
											onChange={(e: any) =>
												product.setProductFee(WE_MAKE_PRICE, parseFloat(e.target.value), props.index)
											}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														wemakepriceFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.lotteonFee ?? common.user.userInfo?.lotteonFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-lotteon-global.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_lotteonFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.lotteonFee}
											onChange={(e: any) =>
												product.setProductFee(LOTTE_ON_GLOBAL, parseFloat(e.target.value), props.index)
											}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														lotteonFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price /
														(1 - (props.item.lotteonNormalFee ?? common.user.userInfo?.lotteonNormalFee) / 100) /
														100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-lotteon-normal.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_lotteonNormalFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.lotteonNormalFee}
											onChange={(e: any) =>
												product.setProductFee(LOTTE_ON_NORMAL, parseFloat(e.target.value), props.index)
											}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														lotteonNormalFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											display: 'flex',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Tooltip
											title={`${(
												Math.round(
													props.item.price / (1 - (props.item.tmonFee ?? common.user.userInfo?.tmonFee) / 100) / 100,
												) * 100
											).toLocaleString('ko-KR')}원`}
										>
											<img
												src='/resources/icon-tmon.png'
												style={{
													marginRight: 5,
												}}
											/>
										</Tooltip>
										<Input
											color={props.item.edited.baseInfo ? 'warning' : 'info'}
											id={`product_row_tmonFee_${props.index}`}
											options={{
												textAlign: 'right',
											}}
											value={props.item.tmonFee}
											onChange={(e: any) => product.setProductFee(TMON, parseFloat(e.target.value), props.index)}
											onBlur={(e: any) =>
												product.updateProductFee(
													{
														productId: props.item.id,
														tmonFee: parseFloat(e.target.value),
													},
													props.index,
												)
											}
										/>{' '}
										%
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}></Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</>
	);
});
