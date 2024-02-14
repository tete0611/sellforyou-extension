import React from 'react';
import { Add as AddIcon, Clear as ClearIcon, Error as ErrorIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { readFileDataURL } from '../../../../../../common/function';
import { AppContext } from '../../../../../containers/AppContext';
import { Box, CircularProgress, IconButton, ImageList, ImageListItem, Typography, Button, Paper } from '@mui/material';
import { Image, Title } from '../../../Common/UI';

// MUI Box 사용자 지정 스타일
// const useStyles = makeStyles((theme) => ({
// 	defaultBox: {
// 		background: '#d1e8ff',
// 	},

// 	errorBox: {
// 		background: '#ffd1d1',
// 	},
// }));

// 옵션이미지 탭 하위 컴포넌트
export const TabOptionImages = observer((props: any) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 옵션이미지 수정 및 변경이 있을 경우
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 옵션이미지정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			{props.item.edited.optionImages === 2 ? loading : null}

			<Paper variant='outlined'>
				<Title subTitle dark={common.darkTheme} error={props.item.optionImageError}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						이미지목록 &nbsp;
						{props.item.optionImageError ? (
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
									&nbsp; JPG/PNG 형식만 가능합니다.
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
						<Button
							//@ts-ignore
							disabled={product.itemInfo.items.find((v) => v.translate)}
							disableElevation
							variant='contained'
							color='secondary'
							sx={{
								fontSize: 13,
								height: 26,
							}}
							onClick={() => {
								if (common.user.purchaseInfo2.level < 3) {
									alert('[프로] 등급부터 사용 가능한 기능입니다.');

									return;
								}

								product.autoImageTranslate(props.index, 2);
							}}
						>
							{props.item.translate ? (
								<>
									<CircularProgress size='1rem' />
								</>
							) : (
								<>전체 이미지 자동 번역</>
							)}
						</Button>

						<Button
							disableElevation
							variant='contained'
							color='secondary'
							sx={{
								ml: 0.5,
								fontSize: 13,
								height: 26,
							}}
							onClick={() => {
								if (common.user.purchaseInfo2.level < 3) {
									alert('[프로] 등급부터 사용 가능한 기능입니다.');

									return;
								}

								window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=2`));
							}}
						>
							전체 이미지 편집/번역
						</Button>

						<Button
							disableElevation
							variant='contained'
							color='error'
							sx={{
								ml: 0.5,
								fontSize: 13,
								height: 26,
							}}
							onClick={() => {
								product.initProductOptionImage(props.item.id, props.index);
							}}
						>
							이미지 복구
						</Button>
					</Box>
				</Title>

				<Box
					sx={{
						height: 388,
						overflowY: 'auto',
						p: 0.5,
					}}
				>
					{props.item.productOptionName.map(
						(v: { name: string; productOptionValue: { image: string; name: string }[] }, nameIndex: number) => {
							return (
								<Paper
									sx={{
										mb: 0.5,
									}}
									variant='outlined'
								>
									<Title subTitle dark={common.darkTheme}>
										{v.name}
									</Title>

									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											p: 1,
										}}
									>
										<ImageList
											sx={{
												// width: 1208,
												m: 0,
											}}
											cols={5}
										>
											{v.productOptionValue.map((w: any, valueIndex: number) => {
												return (
													<ImageListItem key={`image-${nameIndex}-${valueIndex}`}>
														<Paper variant='outlined'>
															<Title
																subTitle
																dark={common.darkTheme}
																error={props.item.imageCheckList && props.item.imageCheckList[w.image]}
															>
																<Box
																	sx={{
																		display: 'flex',
																		alignItems: 'center',
																	}}
																>
																	<Typography
																		noWrap
																		fontSize={13}
																		sx={{
																			textAlign: 'left',
																			width: 190,
																		}}
																	>
																		{w.name}
																	</Typography>

																	{props.item.imageCheckList && props.item.imageCheckList[w.image] ? (
																		<ErrorIcon
																			color='error'
																			sx={{
																				fontSize: 18,
																				mx: 0.5,
																			}}
																		/>
																	) : null}
																</Box>

																<IconButton
																	color='error'
																	sx={{
																		p: 0,
																	}}
																	size='small'
																	onClick={() => {
																		product.updateProductOptionImage(
																			{
																				...w,

																				image: '',
																			},
																			props.index,
																			nameIndex,
																			valueIndex,
																			'',
																		);
																	}}
																>
																	<ClearIcon />
																</IconButton>
															</Title>

															<Box
																sx={{
																	p: 0.5,
																	height: 215,
																}}
															>
																{w.image ? (
																	<Image
																		src={w.image}
																		alt={w.name}
																		width={215}
																		height={215}
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
																) : (
																	<label htmlFor={`addOptionImage-${nameIndex}-${valueIndex}`}>
																		<input
																			accept='image/*'
																			id={`addOptionImage-${nameIndex}-${valueIndex}`}
																			type='file'
																			style={{
																				display: 'none',
																			}}
																			onChange={async (e) => {
																				const fileList = e.target.files ?? [];
																				const fileData = await readFileDataURL(fileList[0]);

																				product.updateProductOptionImage(
																					{
																						...w,

																						newImage: fileList[0],
																					},
																					props.index,
																					nameIndex,
																					valueIndex,
																					fileData,
																				);
																			}}
																		/>

																		<IconButton
																			component='span'
																			sx={{
																				p: 0,
																				width: 215,
																				height: 215,
																			}}
																		>
																			<AddIcon />
																		</IconButton>
																	</label>
																)}
															</Box>

															<Title
																subTitle
																dark={common.darkTheme}
																error={props.item.imageCheckList && props.item.imageCheckList[w.image]}
															>
																<Button
																	disabled={!w.image}
																	disableElevation
																	variant='contained'
																	color='info'
																	sx={{
																		fontSize: 13,
																		width: '100%',
																		height: 26,
																	}}
																	onClick={() => {
																		window.open(
																			chrome.runtime.getURL(
																				`/trangers_single.html?id=${props.item.id}&type=2&layer=${nameIndex}&index=${valueIndex}`,
																			),
																		);
																	}}
																>
																	이미지 편집/번역
																</Button>
															</Title>
														</Paper>
													</ImageListItem>
												);
											})}
										</ImageList>
									</Box>
								</Paper>
							);
						},
					)}
				</Box>
			</Paper>
		</>
	);
});
