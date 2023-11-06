import React from 'react';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../../containers/AppContext';
import {
	styled,
	Box,
	Button,
	Grid,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { ComboBox, Input, Title } from '../../../Common/UI';
import { Item } from '../../../../../type/type';

// 커스텀 테이블 컬럼 스타일 설정
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	borderBottom: '1px solid ghostwhite',
	padding: 5,
	fontSize: 14,
});

interface Props {
	item: Item;
	index: number;
}

// 상품속성 탭 하위 컴포넌트
export const TabAttribute = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 상품에 수정, 변경사항 등이 발생했을 때
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 상품속성정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			{props.item.edited.attribute === 2 ? loading : null}

			<Box
				sx={{
					mb: '6px',
				}}
			>
				<Grid container spacing={0.5}>
					<Grid item xs={6} md={9}>
						<Grid container spacing={0.5}>
							<Grid item xs={6} md={4}>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme} subTitle>
										제조사
									</Title>
									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Input
											color={props.item.edited.attribute ? 'warning' : 'info'}
											id={`product_row_manufacturer_${props.index}`}
											value={props.item.manuFacturer}
											onChange={(e: any) =>
												product.setProductAttribute(
													{
														manufacturer: e.target.value,
													},
													props.index,
												)
											}
											onBlur={(e: any) =>
												product.updateProductAttribute(
													{
														productId: props.item.id,
														manufacturer: e.target.value,
													},
													props.index,
												)
											}
										/>
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={6} md={4}>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme} subTitle>
										브랜드
									</Title>
									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Input
											color={props.item.edited.attribute ? 'warning' : 'info'}
											id={`product_row_brand_name_${props.index}`}
											defaultValue={props.item.brandName}
											onChange={(e: any) =>
												product.setProductAttribute(
													{
														brandName: e.target.value,
													},
													props.index,
												)
											}
											onBlur={(e: any) =>
												product.updateProductAttribute(
													{
														productId: props.item.id,
														brandName: e.target.value,
													},
													props.index,
												)
											}
										/>
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={6} md={4}>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme} subTitle>
										모델명
									</Title>
									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
											alignItems: 'center',
											p: 0.5,
										}}
									>
										<Input
											color={props.item.edited.attribute ? 'warning' : 'info'}
											id={`product_row_model_name_${props.index}`}
											defaultValue={props.item.modelName}
											onChange={(e: any) =>
												product.setProductAttribute(
													{
														modelName: e.target.value,
													},
													props.index,
												)
											}
											onBlur={(e: any) =>
												product.updateProductAttribute(
													{
														productId: props.item.id,
														modelName: e.target.value,
													},
													props.index,
												)
											}
										/>
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={6} md={12}>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme} subTitle>
										상품정보제공고시
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
												onClick={() => product.updateProdutSillsAuto('AUTO', props.index)}
											>
												카테고리에 따라 지정
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
												onClick={() => product.updateProdutSillsAuto('ETC', props.index)}
											>
												기타재화로 일괄 지정
											</Button>
										</Box>
									</Title>
									<Box
										sx={{
											fontSize: 13,
											height: 321,
										}}
									>
										<Grid
											container
											spacing={0.5}
											sx={{
												p: 0.5,
											}}
										>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-smartstore.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA077}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A077',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA077.activeSillDataA077.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A077',
																			sillCode: props.item.sillCodeA077,
																			sillData: props.item.sillDataA077,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-coupang.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeB378}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'B378',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoB378.activeSillDataB378.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'B378',
																			sillCode: props.item.sillCodeB378,
																			sillData: props.item.sillDataB378,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-street-global.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA112}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A112',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA112.activeSillDataA112.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A112',
																			sillCode: props.item.sillCodeA112,
																			sillData: props.item.sillDataA112,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-street-normal.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA113}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A113',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA113.activeSillDataA113.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A113',
																			sillCode: props.item.sillCodeA113,
																			sillData: props.item.sillDataA113,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-gmarket.png' width={16} height={16} />
															</Box>
														</Grid>

														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA006}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A006',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA006.activeSillDataA006.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A006',
																			sillCode: props.item.sillCodeA006,
																			sillData: props.item.sillDataA006,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-auction.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA001}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A001',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA001.activeSillDataA001.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A001',
																			sillCode: props.item.sillCodeA001,
																			sillData: props.item.sillDataA001,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-interpark.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA027}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A027',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA027.activeSillDataA027.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A027',
																			sillCode: props.item.sillCodeA027,
																			sillData: props.item.sillDataA027,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-wemakeprice.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeB719}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'B719',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoB719.activeSillDataB719.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'B719',
																			sillCode: props.item.sillCodeB719,
																			sillData: props.item.sillDataB719,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-lotteon-global.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA524}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A524',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA524.activeSillDataA524.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A524',
																			sillCode: props.item.sillCodeA524,
																			sillData: props.item.sillDataA524,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-lotteon-normal.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeA525}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'A525',
																		{
																			productIds: [props.item.id],

																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoA525.activeSillDataA525.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'A525',
																			sillCode: props.item.sillCodeA525,
																			sillData: props.item.sillDataA525,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													m: 'auto',
												}}
											>
												<Paper
													variant='outlined'
													sx={{
														display: 'flex',
														alignItems: 'center',
														fontSize: 13,
														p: 0.5,
													}}
												>
													<Grid container spacing={0.5}>
														<Grid
															item
															xs={6}
															md={1}
															sx={{
																m: 'auto',
															}}
														>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																}}
															>
																<img src='/resources/icon-tmon.png' width={16} height={16} />
															</Box>
														</Grid>
														<Grid
															item
															xs={6}
															md={8}
															sx={{
																m: 'auto',
															}}
														>
															<ComboBox
																sx={{
																	width: '100%',
																}}
																value={props.item.sillCodeB956}
																onChange={(e) =>
																	product.updateProdutSillCodes(
																		'B956',
																		{
																			productIds: [props.item.id],
																			value: e.target.value,
																		},
																		props.index,
																	)
																}
															>
																{props.item.categoryInfoB956.activeSillDataB956.map((v) => (
																	<MenuItem value={v.code}>{v.name}</MenuItem>
																))}
															</ComboBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={3}
															sx={{
																m: 'auto',
															}}
														>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	width: '100%',
																	height: 30,
																	p: 0,
																}}
																onClick={(e) =>
																	product.setProductSillDataPopOver({
																		...product.popOverInfo.setProductSillData,
																		index: props.index,
																		element: e.target,
																		open: true,
																		data: {
																			marketCode: 'B956',
																			sillCode: props.item.sillCodeB956,
																			sillData: props.item.sillDataB956,
																		},
																	})
																}
															>
																상세설정
															</Button>
														</Grid>
													</Grid>
												</Paper>
											</Grid>
											<Grid item xs={6} md={4}></Grid>
											{common?.user?.purchaseInfo2?.level >= 3 ? (
												<Grid item xs={6} md={12}>
													<Paper variant='outlined'>
														<Title dark={common.darkTheme} subTitle>
															[{props.item.productCode}] 개인 분류
															{/* <Button color='error' size='small' variant='contained' onClick={() => alert('준비중')}>
																삭제
															</Button> */}
														</Title>
														<Box
															sx={{
																display: 'flex',
																flexWrap: 'wrap',
																alignItems: 'center',
																p: 0.5,
															}}
														>
															<Input
																color={props.item.edited.attribute ? 'warning' : 'info'}
																id={`product_keyward_name_${props.index}`}
																defaultValue={props.item.myKeyward === null ? '' : props.item.myKeyward}
																onChange={(e: any) =>
																	product.setProductKeyward(
																		{
																			myKeyward: e.target.value,
																		},
																		props.index,
																	)
																}
																onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
																	if (common.user.purchaseInfo2.level < 3)
																		return alert('[프로] 등급부터 사용 가능한 기능입니다.');
																	else if (e.target.value.replace(/\s*$/, '') !== '') {
																		if (e.target.value.length > 50) return alert('50자 이하로 입력해주세요.');
																		product.updateProductMyKeyward(
																			{
																				productId: props.item.id,
																				myKeyward: e.target.value,
																			},
																			props.index,
																		);
																	}
																}}
															/>
														</Box>
													</Paper>
												</Grid>
											) : null}
										</Grid>
									</Box>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					{/* 삽입테스트 todo */}
					<Grid item xs={4} md={3}>
						<Paper variant='outlined'>
							<Title dark={common.darkTheme} subTitle>
								추가속성정보
							</Title>
							<Box
								sx={{
									fontSize: 13,
									height: 396,
									overflowY: 'scroll',
								}}
							>
								<Table stickyHeader>
									<TableBody>
										{props.item.attribute.map((v: any) => {
											return (
												<TableRow>
													<StyledTableCell width={'40%'}>
														<Typography fontSize={13}>{v.split(':')[0]}</Typography>
													</StyledTableCell>
													<StyledTableCell
														width={'60%'}
														sx={{
															borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														}}
													>
														<Typography
															fontSize={13}
															sx={{
																textAlign: 'left',
															}}
														>
															{v.split(':')[1]}
														</Typography>
													</StyledTableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</>
	);
});
