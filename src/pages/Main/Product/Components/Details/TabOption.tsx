import React from 'react';
import {
	Edit as EditIcon,
	Error as ErrorIcon,
	AutoFixHigh as AutoFixHighIcon,
	Restore as RestoreIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../../containers/AppContext';
import {
	styled,
	Box,
	Collapse,
	FormControlLabel,
	IconButton,
	Switch,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
	Button,
	Checkbox,
	Paper,
} from '@mui/material';
import { Image, Input, Title } from '../../../Common/UI';
import { byteLength } from '../../../../../../common/function';
import { Item } from '../../../../../type/type';

// 커스텀 테이블 컬럼 스타일
const CollapsedTableCell = styled(TableCell)({
	textAlign: 'center',
	background: 'ghostwhite',
	borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	padding: 0,
	fontSize: 14,
});

interface Props {
	item: Item;
	index: number;
}

// 옵션 탭 하위 컴포넌트
export const TabOption = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 옵션정보 수정 및 변경사항이 발생했을 경우
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 옵션정보를 저장하는 중입니다...
			</div>
		</div>
	);
	return (
		<>
			{props.item.edited.option === 2 ? loading : null}

			<Paper variant='outlined'>
				<Title dark={common.darkTheme} subTitle error={props.item.optionNameError}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						옵션목록 &nbsp;
						{props.item.optionNameError ? (
							<>
								<Paper
									sx={{
										color: common.darkTheme ? 'error.light' : 'error.main',

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
									&nbsp; 이름이 동일한 옵션값이 있습니다.
								</Paper>
							</>
						) : null}
					</Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<FormControlLabel
							control={
								<Checkbox
									size='small'
									checked={props.item.optionCollapse}
									onChange={(e) => {
										product.toggleItemOptionCollapse(props.index);
									}}
								/>
							}
							label={
								<Box
									sx={{
										display: 'flex',
										fontSize: 12,
										alignItems: 'center',
									}}
								>
									원문 같이보기
								</Box>
							}
							sx={{
								height: 20,
							}}
						/>

						<Button
							disableElevation
							variant='contained'
							color='info'
							sx={{
								ml: 0.5,
								fontSize: 13,
								height: 26,
							}}
							onClick={async (e) => {
								await product.setAddOptionNamePopOver({
									...product.popOverInfo.addOptionName,

									index: props.index,
									element: e.target,
									open: true,
								});
							}}
						>
							옵션명 키워드추가
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
							onClick={async (e) => {
								await product.setReplaceOptionNamePopOver({
									...product.popOverInfo.replaceOptionName,

									index: props.index,
									element: e.target,
									open: true,
								});
							}}
						>
							옵션명 키워드변경
						</Button>
					</Box>
				</Title>

				<Box
					sx={{
						width: '100%',
						height: 388,
						overflowY: 'auto',
						alignItems: 'center',
						display: 'flex',
						p: 0.5,
					}}
				>
					{props.item.productOptionName.map((v, nameIndex) => {
						const propsList = JSON.parse(props.item.activeTaobaoProduct.originalData).propsList;
						const originalWord =
							propsList[`${v.taobaoPid}:${v.productOptionValue[0].taobaoVid}`]?.split(':')[0] ??
							propsList[`${v.taobaoPid}:${/\d+/g}:${v.productOptionValue[0].taobaoVid}`]?.split(':')[0];
						const paperWidth =
							props.item.productOptionName.length <= 3 ? '30%' : `${100 / props.item.productOptionName.length - 2}%`;
						return (
							<Paper
								sx={{
									m: '2px',
									width: paperWidth,
									height: 362,
									flex: '0 0 auto',
									overflowY: 'auto',
									mr: 0.5,
								}}
								variant='outlined'
							>
								<Table stickyHeader>
									<TableHead>
										<TableRow>
											<TableCell
												width={50}
												style={{
													background: common.darkTheme ? '#303030' : '#ebebeb',
													borderBottom: 'unset',
													fontSize: 13,
													padding: 0,
													textAlign: 'center',
												}}
											>
												<Checkbox
													size='small'
													color='info'
													disabled={!v.isActive}
													checked={v.productOptionValue.every((v) => v.isActive)}
													onChange={async (e) => {
														product.setProductOptionValueAll(
															{
																id: v.id,
																isActive: e.target.checked,
																// name: "test"
															},
															props.index,
															nameIndex,
														);

														await product.updateProductOptionValueAll(
															common,
															{
																id: v.id,
																isActive: e.target.checked,
																// name: "test"
															},
															props.index,
														);
													}}
												/>
											</TableCell>

											<TableCell
												style={{
													background: common.darkTheme ? '#303030' : '#ebebeb',
													borderBottom: 'unset',
													fontSize: 13,
													padding: 0,
												}}
											>
												<Box
													sx={{
														alignItems: 'center',
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<Box
														sx={{
															alignItems: 'center',
															display: 'flex',
														}}
													>
														<Tooltip title='옵션유형이름수정'>
															<IconButton
																size='small'
																onClick={async () => {
																	const name = prompt('변경할 옵션유형이름을 입력해주세요.', v.name);

																	if (!name) return;

																	product.setProductOptionName({ ...v, name }, props.index, nameIndex);
																	await product.updateProductOptionName(common, { ...v, name }, props.index);
																}}
															>
																<EditIcon
																	sx={{
																		width: 18,
																		height: 18,
																	}}
																/>
															</IconButton>
														</Tooltip>

														<Typography
															noWrap
															fontSize={13}
															sx={{
																width: 70,
															}}
														>
															{v.name}
														</Typography>

														<Typography
															fontSize={13}
															color='#1565c0'
															sx={{
																width: 30,
															}}
														>
															X{v.productOptionValue.filter((v) => v.isActive).length}
														</Typography>
													</Box>

													<Box
														sx={{
															alignItems: 'center',
															display: 'flex',
														}}
													>
														<Tooltip title='알파벳으로표시'>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	minWidth: 26,
																	height: 26,
																	p: 0,
																}}
																onClick={async () => {
																	await product.setProductOptionValue(
																		v.productOptionValue.map((v, index: number) => {
																			return { ...v, name: (index + 10).toString(36).toUpperCase() };
																		}),
																		props.index,
																		nameIndex,
																		null,
																	);

																	await product.updateProductOptionValue(
																		common,
																		props.index,
																		nameIndex,
																		v.productOptionValue.map((v) => v.id),
																	);
																}}
															>
																AZ
															</Button>
														</Tooltip>

														<Tooltip title='숫자로표시'>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	ml: 0.5,
																	minWidth: 26,
																	height: 26,
																	p: 0,
																}}
																onClick={async () => {
																	await product.setProductOptionValue(
																		v.productOptionValue.map((v, index: number) => {
																			return { ...v, name: `${index + 1}` };
																		}),
																		props.index,
																		nameIndex,
																		null,
																	);

																	await product.updateProductOptionValue(
																		common,
																		props.index,
																		nameIndex,
																		v.productOptionValue.map((v) => v.id),
																	);
																}}
															>
																09
															</Button>
														</Tooltip>

														<Tooltip title='특수문자제거'>
															<Button
																disableElevation
																size='small'
																color='info'
																variant='contained'
																sx={{
																	ml: 0.5,
																	minWidth: 26,
																	height: 26,
																	p: 0,
																}}
																onClick={async () => {
																	const regExp = /[^가-힣a-zA-Z0-9 ]+/g;

																	await product.setProductOptionValue(
																		v.productOptionValue.map((v) => {
																			return { ...v, name: v.name?.replace(regExp, ' ') };
																		}),
																		props.index,
																		nameIndex,
																		null,
																	);

																	await product.updateProductOptionValue(
																		common,
																		props.index,
																		nameIndex,
																		v.productOptionValue.map((v) => v.id),
																	);
																}}
															>
																<AutoFixHighIcon fontSize='small' />
															</Button>
														</Tooltip>

														<Tooltip title='원본복구'>
															<Button
																disableElevation
																size='small'
																color='error'
																variant='contained'
																sx={{
																	ml: 0.5,
																	minWidth: 26,
																	height: 26,
																	p: 0,
																}}
																onClick={async () => {
																	await product.setProductOptionValue(
																		v.productOptionValue.map((v) => {
																			return { ...v, name: v.originalName };
																		}),
																		props.index,
																		nameIndex,
																		null,
																	);

																	await product.updateProductOptionValue(
																		common,
																		props.index,
																		nameIndex,
																		v.productOptionValue.map((v) => v.id),
																	);
																}}
															>
																<RestoreIcon fontSize='small' />
															</Button>
														</Tooltip>
													</Box>
												</Box>
											</TableCell>

											<TableCell
												width={30}
												style={{
													background: common.darkTheme ? '#303030' : '#ebebeb',
													borderBottom: 'unset',
													fontSize: 13,
													padding: 0,
												}}
											></TableCell>

											<TableCell
												width={45}
												style={{
													background: common.darkTheme ? '#303030' : '#ebebeb',
													borderBottom: 'unset',
													fontSize: 13,
													padding: 0,
													textAlign: 'left',
												}}
											>
												<Switch
													size='small'
													checked={v.isActive ?? false}
													onChange={async (e) => {
														product.setProductOptionName(
															{
																...v,

																isActive: e.target.checked,
															},
															props.index,
															nameIndex,
														);

														await product.updateProductOptionName(
															common,
															{
																...v,

																isActive: e.target.checked,
															},
															props.index,
														);
													}}
												/>
											</TableCell>
										</TableRow>

										<TableRow>
											<CollapsedTableCell colSpan={4}>
												<Collapse in={props.item.optionCollapse} timeout={0} unmountOnExit>
													<Box
														sx={{
															display: 'flex',
															mx: 2,
														}}
													>
														<Typography noWrap color='#1565c0' fontSize={11}>
															{originalWord}
														</Typography>
													</Box>
												</Collapse>
											</CollapsedTableCell>
										</TableRow>
									</TableHead>
									{/* 옵션목록 > 옵션값 */}
									<TableBody>
										{v.productOptionValue.map((w, valueIndex) => (
											<>
												<TableRow>
													<TableCell
														style={{
															borderBottom: 'unset',
															fontSize: 13,
															padding: 0,
															textAlign: 'center',
														}}
													>
														<Checkbox
															size='small'
															color='info'
															tabIndex={-1}
															checked={w.isActive}
															disabled={!v.isActive}
															onChange={async (e) => {
																await product.setProductOptionValue(
																	{
																		...w,

																		isActive: e.target.checked,
																	},
																	props.index,
																	nameIndex,
																	valueIndex,
																);

																await product.updateProductOptionValue(common, props.index, nameIndex, [w.id]);
															}}
														/>
													</TableCell>

													<TableCell
														style={{
															borderBottom: 'unset',
															fontSize: 13,
															padding: 0,
															textAlign: 'center',
														}}
													>
														<Input
															className='option-multiline'
															multiline={true}
															color={props.item.edited.option ? 'warning' : 'info'}
															id={`product_row_optionType_${props.index}_${nameIndex}_${valueIndex}`}
															value={w.name}
															onChange={(e) => {
																product.setProductOptionValue(
																	{
																		...w,
																		name: e.target.value.substring(0, 200),
																	},
																	props.index,
																	nameIndex,
																	valueIndex,
																);
															}}
															onBlur={async (e) => {
																await product.updateProductOptionValue(common, props.index, nameIndex, [w.id]);
															}}
														/>
													</TableCell>

													<TableCell
														style={{
															borderBottom: 'unset',
															fontSize: 13,
															padding: 0,
															textAlign: 'center',
														}}
													>
														<Paper
															variant='outlined'
															sx={{
																ml: 0.5,
																minWidth: 36,
																height: 30,
																p: 0,
															}}
														>
															<Typography
																color='info'
																sx={{
																	fontSize: '10px',
																}}
															>
																{w.name?.length} 자
															</Typography>

															<Typography
																sx={{
																	color: common.darkTheme ? 'info.light' : 'info.dark',
																	fontSize: '10px',
																}}
															>
																{byteLength(w.name)} B
															</Typography>
														</Paper>
													</TableCell>

													<TableCell
														style={{
															borderBottom: 'unset',
															fontSize: 13,
															padding: 0,
															textAlign: 'center',
														}}
													>
														{w.image ? (
															<Image
																src={w.image}
																alt={w.name}
																width={30}
																height={30}
																style={{
																	objectFit: 'contain',
																}}
																onClick={(e) => {
																	product.setImagePopOver({
																		element: e.target,
																		data: { src: w.image },
																		open: true,
																	});
																}}
															/>
														) : null}
													</TableCell>
												</TableRow>

												<TableRow>
													<CollapsedTableCell colSpan={4}>
														<Collapse in={props.item.optionCollapse} timeout={0} unmountOnExit>
															<Box
																sx={{
																	display: 'flex',
																	mx: 2,
																}}
															>
																<Typography noWrap color='#1565c0' fontSize={11}>
																	{
																		JSON.parse(props.item.activeTaobaoProduct.originalData).propsList[
																			`${v.taobaoPid}:${w.taobaoVid}`
																		]?.split(':')[1]
																	}
																</Typography>
															</Box>
														</Collapse>
													</CollapsedTableCell>
												</TableRow>
											</>
										))}
									</TableBody>
								</Table>
							</Paper>
						);
					})}
				</Box>
			</Paper>
		</>
	);
});
