import React from 'react';
import { Clear as ClearIcon, Error as ErrorIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { AppContext } from '../../../../../containers/AppContext';
import { Box, Chip, CircularProgress, IconButton, Button, Paper, Typography } from '@mui/material';
import { Image, Title } from '../../../Common/UI';
import { readFileDataURL } from '../../../../../../common/function';

// MUI Box 사용자 지정 스타일
// const useStyles = makeStyles((theme) => ({
// 	defaultBox: {
// 		background: '#d1e8ff',
// 	},

// 	errorBox: {
// 		background: '#ffd1d1',
// 	},
// }));

// 썸네일이미지 탭 하위 컴포넌트
export const TabThumbnails = observer((props: any) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		itemInfo,
		autoImageTranslate,
		addProductThumbnailImage,
		initProductThumbnailImage,
		updateProductThumbnailImage,
		setImagePopOver,
	} = product;

	// 썸네일이미지 수정 및 변경 사항 발생 시
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 썸네일이미지정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			{props.item.edited.thumbnailImages === 2 ? loading : null}

			<Paper variant='outlined'>
				<Title subTitle dark={common.darkTheme} error={props.item.thumbnailImageError}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						이미지목록 &nbsp;
						{props.item.thumbnailImageError ? (
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
									&nbsp; 600x600 이상, JPG/PNG 형식만 가능합니다.
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
							disabled={itemInfo.items.find((v) => v.translate)}
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

								autoImageTranslate(props.index, 1);
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

								window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=1`));
							}}
						>
							전체 이미지 편집/번역
						</Button>

						<Button
							disableElevation
							variant='contained'
							component='label'
							color='info'
							sx={{
								ml: 0.5,
								fontSize: 13,
								height: 26,
							}}
						>
							이미지 추가
							<input
								hidden
								accept='image/*'
								multiple
								type='file'
								onChange={async (e) => {
									const fileList = e.target.files ?? [];
									const fileData = await readFileDataURL(fileList[0]);

									addProductThumbnailImage(fileList[0], fileData, props.index);
								}}
							/>
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
							onClick={() => initProductThumbnailImage(props.item.id, props.index)}
						>
							이미지 복구
						</Button>
					</Box>
				</Title>

				<Box
					sx={{
						height: 396,
						overflowY: 'auto',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Box
						sx={{
							width: 1210,
							p: 1,
						}}
					>
						<ListManager
							items={props.item.imageThumbnail}
							direction='horizontal'
							maxItems={5}
							render={(img) => (
								<Paper
									key={img}
									ref={(elem: any) => {
										if (!elem || !elem.parentNode) {
											return;
										}

										let fixed = elem.parentNode.getAttribute('fixed');

										if (!fixed) {
											elem.parentNode.setAttribute('fixed', 'false');

											return;
										}

										let left = parseFloat(elem.parentNode.style.left);
										let top = parseFloat(elem.parentNode.style.top);

										if (isNaN(left) || isNaN(top)) {
											elem.parentNode.setAttribute('fixed', 'false');

											return;
										}

										if (fixed === 'false') {
											const frame = document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List')[0];
											const framePos = frame.getBoundingClientRect();

											const fixedWidth = (common.innerSize.width - framePos.width) / 2;

											elem.parentNode.style.setProperty('left', `${left - fixedWidth}px`, 'important');
											elem.parentNode.style.setProperty('top', `${frame.scrollTop + top - 177}px`, 'important');
											elem.parentNode.setAttribute('fixed', 'true');
										}
									}}
									sx={{
										m: '2px',
									}}
									variant='outlined'
								>
									{props.item.imageThumbnail.map((v: string, imageIndex: number) => {
										if (v !== img) return null;

										return (
											<>
												<Title
													key={imageIndex}
													subTitle
													dark={common.darkTheme}
													error={props.item.imageCheckList && props.item.imageCheckList[img]}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
														}}
													>
														<Typography noWrap fontSize={13}>
															{imageIndex === 0 ? '대표이미지' : `추가이미지 ${imageIndex.toString().padStart(2, '0')}`}
														</Typography>
													</Box>

													<Box
														sx={{
															alignItems: 'center',
															display: 'flex',
														}}
													>
														{props.item.imageThumbnailExtensions && props.item.imageThumbnailExtensions[imageIndex] ? (
															<Chip size='small' label={props.item.imageThumbnailExtensions[imageIndex]} />
														) : null}
														&nbsp;
														<IconButton
															color='error'
															sx={{
																p: 0,
															}}
															size='small'
															onClick={() => {
																updateProductThumbnailImage(imageIndex, -1, props.index);
															}}
														>
															<ClearIcon />
														</IconButton>
													</Box>
												</Title>

												<Image
													src={img}
													width={232}
													height={232}
													style={{
														objectFit: 'contain',
													}}
													onClick={(e) => {
														setImagePopOver({
															element: e.target,
															data: { src: img },
															open: true,
														});
													}}
												/>

												<Title
													subTitle
													dark={common.darkTheme}
													error={props.item.imageCheckList && props.item.imageCheckList[img]}
												>
													<Button
														disableElevation
														variant='contained'
														color='info'
														sx={{
															fontSize: 13,
															width: '100%',
															height: 26,
														}}
														onClick={() =>
															window.open(
																chrome.runtime.getURL(
																	`/trangers_single.html?id=${props.item.id}&type=1&index=${imageIndex}`,
																),
															)
														}
													>
														이미지 편집/번역
													</Button>
													{/* <Button
														disableElevation
														variant='contained'
														color='error'
														sx={{
															fontSize: 13,
															width: '35%',
															height: 26,
														}}
														onClick={() => initProductThumbnailImage(props.item.id, props.index, imageIndex)}
													>
														복구
													</Button> */}
												</Title>
											</>
										);
									})}
								</Paper>
							)}
							onDragEnd={(src, dst) => {
								updateProductThumbnailImage(src, dst, props.index);
							}}
						/>
					</Box>
				</Box>
			</Paper>
		</>
	);
});
