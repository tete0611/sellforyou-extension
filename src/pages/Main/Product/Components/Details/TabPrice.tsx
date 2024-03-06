import React from 'react';
import { Error as ErrorIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../../containers/AppContext';
import { List, AutoSizer } from 'react-virtualized';
import {
	Box,
	IconButton,
	MenuItem,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Button,
	Checkbox,
	Paper,
} from '@mui/material';
import { ComboBox, Image, Input, Title } from '../../../Common/UI';
import { Item, Shop } from '../../../../../type/type';
import { formatToEachShop } from '../../../../../../common/function';

interface Props {
	item: Item;
	index: number;
}
// MUI Box 사용자 지정 스타일
// const useStyles = makeStyles((theme) => ({
// 	defaultBox: {
// 		background: '#d1e8ff',
// 	},

// 	errorBox: {
// 		background: '#ffd1d1',
// 	},
// }));

// 가격 탭 하위 컴포넌트
export const TabPrice = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		setProductOption,
		updateManyProductOption,
		setImagePopOver,
		setProductOptionPrice,
		updateProductOptionPrice,
		setProductPrice,
		updateProductPrice,
		calcProductOptionPrice,
		setAddOptionPricePopOver,
		popOverInfo,
		setSubtractOptionPricePopOver,
		setOptionPricePopOver,
		setOptionStockPopOver,
		toggleProductOption,
	} = product;
	const { darkTheme } = common;

	// 가격 수정 또는 변경사항 발생 시
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 가격정보를 저장하는 중입니다...
			</div>
		</div>
	);

	// 가상화 렌더링 요소
	const rowRenderer = (x) => {
		const v = props.item.productOption[x.index];

		return (
			<div key={x.key} style={x.style}>
				<Box>
					<Table>
						<TableRow hover>
							{/* 체크박스 */}
							<TableCell
								width={50}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								<Checkbox
									size='small'
									color='info'
									checked={v.isActive}
									onChange={(e) => {
										setProductOption(common, { ...v, isActive: e.target.checked }, props.index, x.index, true);
										updateManyProductOption(props.index, [v.id]);
									}}
								/>
							</TableCell>

							{/* 이미지 */}
							<TableCell
								width={50}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								{props.item.productOptionName.map((w) => {
									const matched = w.productOptionValue.find(
										(x) =>
											x.image &&
											(x.id === v.optionValue1Id ||
												x.id === v.optionValue2Id ||
												x.id === v.optionValue3Id ||
												x.id === v.optionValue4Id ||
												x.id === v.optionValue5Id),
									);
									if (matched)
										return (
											<Image
												src={matched.image}
												alt={matched.name}
												width={30}
												height={30}
												style={{
													objectFit: 'contain',
												}}
												onClick={(e) =>
													setImagePopOver({
														element: e.target,
														data: { src: matched.image },
														open: true,
													})
												}
											/>
										);
								})}
							</TableCell>

							{/* 옵션명 */}
							<TableCell
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									textAlign: 'left',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								{v.name}
							</TableCell>

							{/* 등록불가마켓 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									textAlign: 'center',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								{Math.ceil((v.price / props.item.price - 1) * 100) > 300 ? (
									<Tooltip
										title={`11번가 글로벌 - [${(props.item.price * 4).toLocaleString(
											'ko-KR',
										)}]원을 초과할 수 없습니다.`}
									>
										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
										>
											<img src={'/resources/icon-street-global.png'} />
										</IconButton>
									</Tooltip>
								) : null}

								{Math.ceil((v.price / props.item.price - 1) * 100) > 100 ? (
									<Tooltip
										title={`11번가 일반 - [${(props.item.price * 2).toLocaleString('ko-KR')}]원을 초과할 수 없습니다.`}
									>
										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
										>
											<img src={'/resources/icon-street-normal.png'} />
										</IconButton>
									</Tooltip>
								) : null}

								{Math.ceil((v.price / props.item.price - 1) * 100) > 50 ? (
									<Tooltip
										title={`옥션 - [${(props.item.price * 1.5).toLocaleString('ko-KR')}]원을 초과할 수 없습니다.`}
									>
										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
										>
											<img src={'/resources/icon-auction.png'} />
										</IconButton>
									</Tooltip>
								) : null}

								{Math.ceil((v.price / props.item.price - 1) * 100) > 50 ? (
									<Tooltip
										title={`지마켓 - [${(props.item.price * 1.5).toLocaleString('ko-KR')}]원을 초과할 수 없습니다.`}
									>
										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
										>
											<img src={'/resources/icon-gmarket.png'} />
										</IconButton>
									</Tooltip>
								) : null}
							</TableCell>

							{/* 도매가 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								{v.priceCny.toLocaleString('ko-KR')}
								{formatToEachShop().cny({ shopName: props.item.activeTaobaoProduct.shopName as Shop })}
							</TableCell>

							{/* 배대지배송비 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_detail_defaultShippingFee_${x.index}`}
									options={{
										textAlign: 'right',
									}}
									value={v.defaultShippingFee}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOption(
													common,
													{ ...v, defaultShippingFee: parseInt(e.target.value.replace(/[^0-9]/g, '')) },
													props.index,
													x.index,
													false,
											  )
											: setProductOption(common, { ...v, defaultShippingFee: 0 }, props.index, x.index, false)
									}
									onBlur={(e: any) => updateManyProductOption(props.index, [v.id])}
								/>
							</TableCell>

							{/* 기본판매가대비 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								{Math.ceil((v.price / props.item.price - 1) * 100) === 0
									? '기본판매가'
									: `${Math.ceil((v.price / props.item.price - 1) * 100)}%`}
							</TableCell>

							{/* 옵션판매가 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									fontSize: 13,
									padding: '5px',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_detail_price_${x.index}`}
									options={{
										textAlign: 'right',
									}}
									value={v.price}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOption(
													common,
													{ ...v, price: parseInt(e.target.value.replace(/[^0-9]/g, '')) },
													props.index,
													x.index,
													true,
											  )
											: setProductOption(common, { ...v, price: 0 }, props.index, x.index, true)
									}
									onBlur={(e: any) => updateManyProductOption(props.index, [v.id])}
								/>
							</TableCell>

							{/* 재고수량 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive ? 'unset' : darkTheme ? 'gray' : 'lightgray',
									padding: '5px',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
								}}
							>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_detail_stock_${x.index}`}
									options={{
										textAlign: 'right',
									}}
									value={v.stock}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOption(
													common,
													{ ...v, stock: parseInt(e.target.value.replace(/[^0-9]/g, '')) },
													props.index,
													x.index,
													true,
											  )
											: setProductOption(common, { ...v, stock: 0 }, props.index, x.index, true)
									}
									onBlur={(e: any) => updateManyProductOption(props.index, [v.id])}
								/>
							</TableCell>

							{/* 예상순이익 */}
							<TableCell
								width={120}
								sx={{
									background:
										Math.ceil((v.price / props.item.price - 1) * 100) === 0
											? darkTheme
												? '#8d8d8d'
												: '#ffffcc'
											: 'unset',
									color: v.isActive
										? Math.round(
												((v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee) /
													(v.priceCny * props.item.cnyRate + v.defaultShippingFee)) *
													100,
										  ) >= 0
											? 'info.main'
											: 'error.main'
										: darkTheme
										? 'gray'
										: 'lightgray',
									fontSize: 13,
									padding: '5px',
									borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
									textAlign: 'right',
								}}
							>
								{Math.floor(v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee).toLocaleString('ko-KR')}원
								(
								{Math.round(
									((v.price - v.priceCny * props.item.cnyRate - v.defaultShippingFee) /
										(v.priceCny * props.item.cnyRate + v.defaultShippingFee)) *
										100,
								)}
								%)
							</TableCell>
						</TableRow>
					</Table>
				</Box>
			</div>
		);
	};

	return (
		<>
			{props.item.edited.option === 2 || props.item.edited.price === 2 ? loading : null}

			<Paper
				variant='outlined'
				sx={{
					mb: 0.5,
				}}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								도매가
							</TableCell>

							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								환율
							</TableCell>

							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								배대지배송비
							</TableCell>

							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								마진율
							</TableCell>

							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								마진율단위
							</TableCell>

							<TableCell
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							></TableCell>

							{/* <TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								반품배송비
							</TableCell> */}

							<TableCell
								width={120}
								style={{ background: darkTheme ? '#303030' : '#ebebeb', fontSize: 13, padding: '4.5px' }}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									기본판매가 &nbsp;
									<Tooltip title='판매가 = {(도매가 * 환율) + 배대지배송비} * 마진율'>
										<HelpOutlineIcon
											color='info'
											sx={{
												fontSize: 14,
											}}
										/>
									</Tooltip>
								</Box>
							</TableCell>

							<TableCell
								width={120}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: '4.5px',
									textAlign: 'center',
								}}
							>
								유료배송비
							</TableCell>

							<TableCell
								width={120}
								style={{ background: darkTheme ? '#303030' : '#ebebeb', fontSize: 13, padding: '4.5px' }}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									예상순이익 &nbsp;
									<Tooltip title='오픈마켓 수수료는 예상순이익 계산에 포함되어 있지 않습니다.'>
										<HelpOutlineIcon
											color='info'
											sx={{
												fontSize: 14,
											}}
										/>
									</Tooltip>
								</Box>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow>
							{/* 도매가 인풋 */}
							<TableCell
								sx={{
									color: darkTheme ? 'error.light' : 'error.dark',
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								{props.item.activeTaobaoProduct.price.toLocaleString('ko-KR')}
								{formatToEachShop().cny({ shopName: props.item.activeTaobaoProduct.shopName as Shop })}
							</TableCell>

							{/* 환율 인풋 */}
							<TableCell
								sx={{
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_cnyRate_${props.index}`}
									options={{
										textAlign: 'right',
									}}
									disabled={formatToEachShop().cnyRateDisabled({ shopName: props.item.activeTaobaoProduct.shopName })}
									value={props.item.cnyRate}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOptionPrice(
													{
														cnyRate: parseFloat(e.target.value.replace(/[^0-9\.]/g, '').replace(/(\..*)\./g, '$1')),
													},
													props.index,
											  )
											: setProductOptionPrice(
													{
														cnyRate: 0,
													},
													props.index,
											  )
									}
									onBlur={(e: any) =>
										updateProductOptionPrice(
											common,
											{
												cnyRate: parseFloat(e.target.value),
											},
											props.index,
										)
									}
								/>
							</TableCell>

							{/* 배대지배송비 인풋 */}
							<TableCell
								sx={{
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								{props.item.activeTaobaoProduct.shopName === 'express' ? (
									<ComboBox
										sx={{
											width: '100%',
										}}
										value={props.item.localShippingFee}
										onChange={(e) => {
											setProductOptionPrice(
												{
													localShippingFee: parseFloat(e.target.value),
												},
												props.index,
											);

											updateProductOptionPrice(
												common,
												{
													localShippingFee: parseInt(e.target.value),
												},
												props.index,
											);
										}}
									>
										{JSON.parse(props.item.activeTaobaoProduct.originalData).props.map((v: any) => (
											<MenuItem value={v.value}>
												({v.format}) {v.name}
											</MenuItem>
										))}
									</ComboBox>
								) : (
									<Input
										color={props.item.edited.option ? 'warning' : 'info'}
										id={`product_row_localShippingFee_${props.index}`}
										options={{
											textAlign: 'right',
										}}
										value={props.item.localShippingFee}
										onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
											e.target.value
												? setProductOptionPrice(
														{
															localShippingFee: parseFloat(
																e.target.value.replace(/[^0-9\.]/g, '').replace(/(\..*)\./g, '$1'),
															),
														},
														props.index,
												  )
												: setProductOptionPrice(
														{
															localShippingFee: 0,
														},
														props.index,
												  )
										}
										onBlur={(e: any) =>
											updateProductOptionPrice(
												common,
												{
													localShippingFee: parseInt(e.target.value),
												},
												props.index,
											)
										}
									/>
								)}
							</TableCell>

							{/* 마진율 인풋 */}
							<TableCell
								sx={{
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_marginRate_${props.index}`}
									options={{
										textAlign: 'right',
									}}
									value={props.item.marginRate}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOptionPrice(
													{
														marginRate: parseFloat(e.target.value.replace(/[^0-9\.]/g, '').replace(/(\..*)\./g, '$1')),
													},
													props.index,
											  )
											: setProductOptionPrice(
													{
														marginRate: 0,
													},
													props.index,
											  )
									}
									onBlur={(e: any) =>
										updateProductOptionPrice(
											common,
											{
												marginRate: parseFloat(e.target.value),
											},
											props.index,
										)
									}
								/>
							</TableCell>

							{/* 마진율단위 인풋 */}
							<TableCell
								sx={{
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								<ComboBox
									sx={{
										width: '100%',
									}}
									defaultValue={`${props.item.marginUnitType}`}
									onChange={(e) => {
										setProductOptionPrice(
											{
												marginUnitType: parseFloat(e.target.value),
											},
											props.index,
										);

										updateProductOptionPrice(
											common,
											{
												marginUnitType: e.target.value,
											},
											props.index,
										);
									}}
								>
									<MenuItem value='PERCENT'>%</MenuItem>
									<MenuItem value='WON'>원</MenuItem>
								</ComboBox>
							</TableCell>

							{/* 여백 인풋 */}
							<TableCell sx={{ fontSize: 13, padding: '5px', textAlign: 'right' }}></TableCell>

							{/* 반품배송비 인풋 */}
							{/* <TableCell sx={{ fontSize: 13, padding: '5px', textAlign: 'right' }}>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_refundShippingFee_${props.index}`}
									options={{
										textAlign: 'right',
									}}
									value={props.item.refundShippingFee}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOptionPrice(
													{
														refundShippingFee: parseInt(e.target.value.replace(/[^0-9]/g, '')),
													},
													props.index,
											  )
											: setProductOptionPrice(
													{
														refundShippingFee: 0,
													},
													props.index,
											  )
									}
									onBlur={(e) =>
										updateProductOptionPrice(
											common,
											{
												refundShippingFee: parseInt(e.target.value),
											},
											props.index,
										)
									}
								/>
							</TableCell> */}

							{/* 기본판매가 인풋 */}
							<TableCell sx={{ fontSize: 13, padding: '5px', textAlign: 'right' }}>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_price_${props.index}`}
									options={{
										textAlign: 'right',
									}}
									disabled={props.item.productOption.length > 0}
									value={props.item.price}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductPrice(parseInt(e.target.value.replace(/[^0-9]/g, '')), props.index)
											: setProductPrice(0, props.index)
									}
									onBlur={(e) => updateProductPrice(props.index)}
								/>
							</TableCell>

							{/* 유료배송비 인풋 */}
							<TableCell sx={{ fontSize: 13, padding: '5px', textAlign: 'right' }}>
								<Input
									color={props.item.edited.option ? 'warning' : 'info'}
									id={`product_row_shippingFee_${props.index}`}
									options={{
										textAlign: 'right',
									}}
									value={props.item.shippingFee}
									onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
										e.target.value
											? setProductOptionPrice(
													{
														shippingFee: parseInt(e.target.value.replace(/[^0-9]/g, '')),
													},
													props.index,
											  )
											: setProductOptionPrice(
													{
														shippingFee: 0,
													},
													props.index,
											  )
									}
									onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) =>
										updateProductOptionPrice(
											common,
											{
												shippingFee: parseInt(e.target.value),
											},
											props.index,
										)
									}
								/>
							</TableCell>

							{/* 예상순이익 인풋 */}
							<TableCell
								sx={{
									color:
										Math.round(
											((props.item.price -
												props.item.activeTaobaoProduct.price * props.item.cnyRate -
												props.item.localShippingFee) /
												(props.item.activeTaobaoProduct.price * props.item.cnyRate + props.item.localShippingFee)) *
												100,
										) >= 0
											? 'info.main'
											: 'error.main',
									fontSize: 13,
									padding: '5px',
									textAlign: 'right',
								}}
							>
								{Math.floor(
									props.item.price -
										props.item.activeTaobaoProduct.price * props.item.cnyRate -
										props.item.localShippingFee,
								).toLocaleString('ko-KR')}
								원 (
								{Math.round(
									((props.item.price -
										props.item.activeTaobaoProduct.price * props.item.cnyRate -
										props.item.localShippingFee) /
										(props.item.activeTaobaoProduct.price * props.item.cnyRate + props.item.localShippingFee)) *
										100,
								)}
								%)
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>

			{props.item.productOption.length > 0 ? (
				<Paper variant='outlined'>
					<Title subTitle dark={darkTheme} error={props.item.optionPriceError}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							옵션세부정보 ({props.item.productOption.filter((v: any) => v.isActive).length}) &nbsp;
							{props.item.optionPriceError ? (
								<>
									<Paper
										sx={{
											color: darkTheme ? 'error.light' : 'error.main',

											display: 'flex',
											alignItems: 'center',

											p: 0.5,

											textAlign: 'left',
										}}
									>
										<ErrorIcon
											color='error'
											sx={{
												fontSize: 18,
												mx: 0.5,
											}}
										/>
										&nbsp; 기본판매가와 옵션최저가가 다릅니다.
									</Paper>
								</>
							) : null}
						</Box>

						<Box
							sx={{
								alignItems: 'center',
								justifyContent: 'right',
								display: 'flex',
							}}
						>
							<Button
								disableElevation
								variant='contained'
								color='info'
								sx={{
									fontSize: 13,
									height: 26,
								}}
								onClick={() => {
									const input = prompt('기본판매가대비 최대 허용치를 설정해주세요. (%)');
									if (!input) return;
									else if (isNaN(Number(input))) return alert('숫자만 입력해주세요');

									calcProductOptionPrice(parseInt(input), 'setActive', props.index, null, null);
								}}
							>
								옵션가 범위설정
							</Button>

							<Button
								disableElevation
								variant='contained'
								color='info'
								sx={{
									fontSize: 13,
									height: 26,
									ml: 0.5,
								}}
								onClick={(e) =>
									setAddOptionPricePopOver({
										...popOverInfo.addOptionPrice,

										index: props.index,
										element: e.target,
										open: true,
									})
								}
							>
								판매가 일괄인상
							</Button>

							<Button
								disableElevation
								variant='contained'
								color='info'
								sx={{
									fontSize: 13,
									height: 26,
									ml: 0.5,
								}}
								onClick={(e) =>
									setSubtractOptionPricePopOver({
										...popOverInfo.subtractOptionPrice,

										index: props.index,
										element: e.target,
										open: true,
									})
								}
							>
								판매가 일괄인하
							</Button>

							<Button
								disableElevation
								variant='contained'
								color='info'
								sx={{
									fontSize: 13,
									height: 26,
									ml: 0.5,
								}}
								onClick={(e) =>
									setOptionPricePopOver({
										...popOverInfo.setOptionPrice,

										index: props.index,
										element: e.target,
										open: true,
									})
								}
							>
								판매가 일괄설정
							</Button>

							<Button
								disableElevation
								variant='contained'
								color='info'
								sx={{
									fontSize: 13,
									height: 26,
									ml: 0.5,
								}}
								onClick={(e) =>
									setOptionStockPopOver({
										...popOverInfo.setOptionStock,

										index: props.index,
										element: e.target,
										open: true,
									})
								}
							>
								재고수량 일괄설정
							</Button>
						</Box>
					</Title>

					<Table stickyHeader>
						<TableRow>
							<TableCell
								width={50}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								<Checkbox
									size='small'
									color='info'
									checked={props.item.productOption.every((v) => v.isActive)}
									onChange={(e) => toggleProductOption(e.target.checked, props.index)}
								/>
							</TableCell>

							<TableCell
								width={51}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								이미지
							</TableCell>

							<TableCell
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								옵션명
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								등록불가마켓
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								도매가
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								배대지배송비
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								기본판매가대비
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								옵션판매가
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								재고수량
							</TableCell>

							<TableCell
								width={131}
								style={{
									background: darkTheme ? '#303030' : '#ebebeb',
									fontSize: 13,
									padding: 0,
									textAlign: 'center',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									예상순이익
								</Box>
							</TableCell>
						</TableRow>
					</Table>

					<div
						style={{
							height: 275,
						}}
					>
						<AutoSizer>
							{({ height, width }) => (
								<List
									width={width}
									height={height}
									rowCount={props.item.productOption.length}
									rowRenderer={rowRenderer}
									rowHeight={42}
								/>
							)}
						</AutoSizer>
					</div>
				</Paper>
			) : null}
		</>
	);
});
