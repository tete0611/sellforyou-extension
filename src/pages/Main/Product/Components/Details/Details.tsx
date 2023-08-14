import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../../containers/AppContext';
import {
	Badge,
	Box,
	Collapse,
	TableCell,
	TableRow,
	Tab,
	Tabs,
	Typography,
	Button,
	Paper,
	CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TabBase } from './TabBase';
import { TabESM2 } from './TabESM2';
import { TabOption } from './TabOption';
import { TabPrice } from './TabPrice';
import { TabThumbnails } from './TabThumbnails';
import { TabOptionImages } from './TabOptionImages';
import { TabDescriptions } from './TabDescriptions';
import { TabAttribute } from './TabAttribute';
import { Title } from '../../../Common/UI';

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
}

// 탭 뷰 설정 (기본정보, 상품속성, 옵션, 가격, 썸네일이미지, 옵션이미지, 상세페이지로 구분)
function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box
					sx={{
						height: 432,
						p: 0.5,
						position: 'relative',
					}}
				>
					{children}
				</Box>
			)}
		</div>
	);
}

// 탭 엘리먼트 속성 설정
function tabProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}

// 상품관리 페이지에서 상품 상세보기(펼치기) 했을 경우
export const Details = observer((props: any) => {
	const theme = useTheme();

	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	return (
		<>
			<TableRow>
				<TableCell
					colSpan={4}
					sx={{
						textAlign: 'center',
						background: common.darkTheme ? '#2a2a2a' : 'ghostwhite',
						borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
						padding: 0,
						fontSize: 14,
					}}
				>
					<Collapse in={props.item.collapse} timeout={0} unmountOnExit>
						<Box>
							<Tabs
								style={{
									background: common.darkTheme ? '#2a2a2a' : 'ghostwhite',
								}}
								value={props.item.tabs}
								onChange={(e, value) => {
									product.switchTabs(props.index, value);
								}}
							>
								<Tab
									label={
										<Badge badgeContent={props.item.searchTagError ? 1 : 0} color='error' variant='dot'>
											<Typography
												fontSize={14}
												sx={{
													px: 1,
												}}
											>
												기본정보
											</Typography>
										</Badge>
									}
									{...tabProps(0)}
								/>

								<Tab
									label={
										<Typography
											fontSize={14}
											sx={{
												px: 1,
											}}
										>
											상품속성
										</Typography>
									}
									{...tabProps(1)}
								/>

								<Tab disabled={!props.item.productOptionName.length} label={'옵션'} {...tabProps(2)} />

								<Tab
									label={
										<Badge badgeContent={props.item.optionPriceError ? 1 : 0} color='error' variant='dot'>
											<Typography
												fontSize={14}
												sx={{
													px: 1,
												}}
											>
												가격
											</Typography>
										</Badge>
									}
									{...tabProps(3)}
								/>

								<Tab
									label={
										<Badge badgeContent={props.item.thumbnailImageError ? 1 : 0} color='error' variant='dot'>
											<Typography
												fontSize={14}
												sx={{
													px: 1,
												}}
											>
												썸네일이미지
											</Typography>
										</Badge>
									}
									{...tabProps(4)}
								/>

								<Tab
									disabled={!props.item.productOptionName.length}
									label={
										<Badge badgeContent={props.item.optionImageError ? 1 : 0} color='error' variant='dot'>
											<Typography
												fontSize={14}
												sx={{
													px: 1,
												}}
											>
												옵션이미지
											</Typography>
										</Badge>
									}
									{...tabProps(5)}
								/>

								<Tab
									label={
										<Badge badgeContent={props.item.descriptionImageError ? 1 : 0} color='error' variant='dot'>
											<Typography
												fontSize={14}
												sx={{
													px: 1,
												}}
											>
												상세이미지
											</Typography>
										</Badge>
									}
									{...tabProps(6)}
								/>
								{/* 주석필요 */}

								{/* {props.item.state === 7 ? (
                  <Tab
                    label={
                      <Badge badgeContent={props.item.descriptionImageError ? 1 : 0} color="error" variant="dot">
                        <Typography
                          fontSize={14}
                          sx={{
                            px: 1,
                          }}
                        >
                          esm2.0
                        </Typography>
                      </Badge>
                    }
                    {...tabProps(7)}
                  />
                ) : null} */}
							</Tabs>
							{/* 기본정보 탭 */}
							<TabPanel value={props.item.tabs} index={0} dir={theme.direction}>
								<TabBase item={props.item} index={props.index} />
							</TabPanel>

							{/* 상품속성 탭 */}
							<TabPanel value={props.item.tabs} index={1} dir={theme.direction}>
								<TabAttribute item={props.item} index={props.index} />
							</TabPanel>

							{/* 옵션 탭 */}
							<TabPanel value={props.item.tabs} index={2} dir={theme.direction}>
								<TabOption item={props.item} index={props.index} />
							</TabPanel>

							{/* 가격 탭 */}
							<TabPanel value={props.item.tabs} index={3} dir={theme.direction}>
								<TabPrice item={props.item} index={props.index} />
							</TabPanel>

							{/* 썸네일이미지 탭 */}
							<TabPanel value={props.item.tabs} index={4} dir={theme.direction}>
								<TabThumbnails item={props.item} index={props.index} />
							</TabPanel>

							{/* 옵션이미지 탭 */}
							<TabPanel value={props.item.tabs} index={5} dir={theme.direction}>
								<TabOptionImages item={props.item} index={props.index} />
							</TabPanel>

							{/* 상세이미지 탭 */}
							<TabPanel value={props.item.tabs} index={6} dir={theme.direction}>
								<TabDescriptions item={props.item} index={props.index} />
							</TabPanel>
							{/* 주석필요 */}
							{/* 
              {props.item.state === 7 ? (
                <TabPanel value={props.item.tabs} index={7} dir={theme.direction}>
                  <TabESM2 item={props.item} index={props.index} />
                </TabPanel>
              ) : null} */}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
});
