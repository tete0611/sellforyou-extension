import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import {
	styled,
	Box,
	Chip,
	Modal,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';

// 커스텀 테이블 열 스타일 설정
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 8,
	fontSize: 13,
});

// 결제내역 모달 뷰
export const PayHistoryModal = observer(() => {
	// MobX 스토리지 로드
	const { common } = React.useContext(AppContext);

	// 결제데이터 상태관리
	const [planInfo, setPlanInfo] = React.useState([]);

	// 결제데이터 로드
	React.useEffect(() => {
		if (!common.payHistoryInfo.userId) {
			return;
		}

		// 묶음 계정으로부터 현재 로그인된 계정의 결제내역만 불러옴
		const matched = common.user.connectedUsers.find((v) => v.id === common.payHistoryInfo.userId);

		if (!matched) {
			return;
		}

		// 모든 플랜 설정 내역 중 정식 결제 건만 가져옴
		const plan = JSON.parse(matched.purchaseInfo2.history).filter((v) => v.planInfo.planLevel > 1);

		setPlanInfo(plan);
	}, [common.payHistoryInfo.userId]);

	return (
		<Modal open={common.modalInfo.payHistory} onClose={() => common.togglePayHistoryModal(null, false)}>
			<Paper className='uploadModal'>
				<Typography
					fontSize={16}
					sx={{
						mb: 3,
					}}
				>
					결제내역
				</Typography>

				<Box
					sx={{
						borderTop: '1px solid rgba(224, 224, 224, 1)',
						borderLeft: '1px solid rgba(224, 224, 224, 1)',
						borderRight: '1px solid rgba(224, 224, 224, 1)',
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								<StyledTableCell>승인일자</StyledTableCell>

								<StyledTableCell
									sx={{
										borderLeft: '1px solid rgba(224, 224, 224, 1)',
									}}
								>
									플랜
								</StyledTableCell>

								<StyledTableCell
									sx={{
										borderLeft: '1px solid rgba(224, 224, 224, 1)',
									}}
								>
									유효기간
								</StyledTableCell>

								<StyledTableCell
									sx={{
										borderLeft: '1px solid rgba(224, 224, 224, 1)',
									}}
								>
									비고
								</StyledTableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{planInfo.map((v: any, i: number) => (
								<TableRow>
									<StyledTableCell
										sx={{
											bgcolor: i === 0 ? 'rgb(255, 255, 204)' : 'unset',
										}}
									>
										{format(new Date(v.purchasedAt), 'yyyy년 MM월 dd일')}
									</StyledTableCell>

									<StyledTableCell
										sx={{
											bgcolor: i === 0 ? 'rgb(255, 255, 204)' : 'unset',
											borderLeft: '1px solid rgba(224, 224, 224, 1)',
										}}
									>
										{v.planInfo.planLevel === 1 ? (
											<Chip size='small' label='체험판' color='warning' sx={{ width: 65 }} />
										) : v.planInfo.planLevel === 2 ? (
											<Chip size='small' label='베이직' color='info' sx={{ width: 65 }} />
										) : v.planInfo.planLevel === 3 ? (
											<Chip size='small' label='프로' color='secondary' sx={{ width: 65 }} />
										) : v.planInfo.planLevel === 4 ? (
											<Chip size='small' label='프리미엄' color='error' sx={{ width: 65 }} />
										) : (
											<Chip size='small' label='미설정' color='default' sx={{ width: 65 }} />
										)}
									</StyledTableCell>

									<StyledTableCell
										sx={{
											bgcolor: i === 0 ? 'rgb(255, 255, 204)' : 'unset',
											borderLeft: '1px solid rgba(224, 224, 224, 1)',
										}}
									>
										~ {format(new Date(v.expiredAt), 'yyyy년 MM월 dd일까지 사용가능')}
									</StyledTableCell>

									<StyledTableCell
										sx={{
											bgcolor: i === 0 ? 'rgb(255, 255, 204)' : 'unset',
											borderLeft: '1px solid rgba(224, 224, 224, 1)',
										}}
									>
										{i === 0 ? '사용중' : ''}
									</StyledTableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Paper>
		</Modal>
	);
});
