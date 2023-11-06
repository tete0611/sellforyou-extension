import React from 'react';
import ReactQuill from 'react-quill';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';
import { observer } from 'mobx-react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { AppContext } from '../../../../../containers/AppContext';
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Image, Title } from '../../../Common/UI';
import { makeStyles } from '@material-ui/core/styles';
import { Item } from '../../../../../type/type';

interface Props {
	item: Item;
	index: number;
	// tableRef: any;
}

// MUI Box 사용자 지정 스타일
const useStyles = makeStyles((theme) => ({
	defaultBox: {
		background: '#d1e8ff',
	},

	errorBox: {
		background: '#ffd1d1',
	},
}));

// 상세페이지 탭 하위 컴포넌트
export const TabDescriptions = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 상세페이지 에디터 환경설정
	const modules = React.useMemo(
		() => ({
			toolbar: false,
		}),
		[],
	);

	// 상세페이지 수정 및 변경사항 발생 시
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 상세이미지정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					margin: 'auto',
				}}
			>
				<Grid container spacing={0.5}>
					{props.item.edited.descriptions === 2 ? loading : null}
					<Grid item xs={6} md={6}>
						<Paper variant='outlined'>
							<Title subTitle dark={common.darkTheme} error={props.item.descriptionImageError}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									이미지목록&nbsp;
									{props.item.descriptionImageError ? (
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
											if (common.user.purchaseInfo2.level < 3) return alert('[프로] 등급부터 사용 가능한 기능입니다.');

											product.autoImageTranslate(props.index, 3);
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
											if (common.user.purchaseInfo2.level < 3) return alert('[프로] 등급부터 사용 가능한 기능입니다.');

											window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=3`));
										}}
									>
										전체 이미지 편집/번역
									</Button>
								</Box>
							</Title>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									p: 1,
									height: 379,
									overflowY: 'auto',
								}}
							>
								<Box>
									<ListManager
										items={props.item.descriptionImages}
										direction='horizontal'
										maxItems={4}
										render={(img) => (
											<Paper
												ref={(elem: any) => {
													if (!elem || !elem.parentNode) return;

													let fixed = elem.parentNode.getAttribute('fixed');

													if (!fixed) return elem.parentNode.setAttribute('fixed', 'false');

													let left = parseFloat(elem.parentNode.style.left);
													let top = parseFloat(elem.parentNode.style.top);

													if (isNaN(left) || isNaN(top)) return elem.parentNode.setAttribute('fixed', 'false');

													if (fixed === 'false') {
														const frame = document.getElementsByClassName(
															'ReactVirtualized__Grid ReactVirtualized__List',
														)[0];
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
												{props.item.descriptionImages.map((v: any, i: number) => {
													if (v !== img) return null;
													else
														return (
															<>
																<Title
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
																			{`상세이미지 ${(i + 1).toString().padStart(2, '0')} `}
																		</Typography>
																		{props.item.imageCheckList && props.item.imageCheckList[img] ? (
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
																		onClick={() => product.filterDescription(props.index, i)}
																	>
																		<ClearIcon />
																	</IconButton>
																</Title>
																<Image
																	src={img}
																	width={140}
																	height={140}
																	style={{
																		objectFit: 'contain',
																	}}
																	onClick={(e) =>
																		product.setImagePopOver({
																			element: e.target,
																			data: { src: img },
																			open: true,
																		})
																	}
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
																					`/trangers_single.html?id=${props.item.id}&type=3&index=${i}`,
																				),
																			)
																		}
																	>
																		이미지 편집/번역
																	</Button>
																</Title>
															</>
														);
												})}
											</Paper>
										)}
										onDragEnd={(src, dst) => product.switchDescription(src, dst, props.index)}
									/>
								</Box>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={6} md={6}>
						<Paper variant='outlined'>
							<Title subTitle dark={common.darkTheme}>
								미리보기
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
										onClick={() => product.toggleDescriptionModal(true, props.index)}
									>
										상세설명 에디터열기
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
										onClick={() => product.initProductDescription(props.item.id, props.index)}
									>
										상세설명 복구
									</Button>
								</Box>
							</Title>
							<Box
								sx={{
									p: 1,
									height: 380,
									overflowY: 'auto',
								}}
							>
								<ReactQuill readOnly value={product.itemInfo.items[props.index]?.description} modules={modules} />
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</>
	);
});
