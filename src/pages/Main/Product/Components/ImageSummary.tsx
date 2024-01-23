import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { styled, Box, Chip, TableCell, Checkbox } from '@mui/material';
import { Image } from '../../Common/UI';
import { Item } from '../../../../type/type';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 0,
	border: 'none',
	fontSize: 14,
});

interface Props {
	item: Item;
	index: number;
	tableRef: any;
}

// 그리드뷰 하위 테이블 행 뷰
export const ImageSummary = observer((props: Props) => {
	// MobX 스토리지 로드
	const { product } = React.useContext(AppContext);

	return (
		<>
			<StyledTableCell width={'10%'}>
				<Box
					sx={{
						border: '1px solid lightgray',
						m: 0.5,
						p: 0.5,
					}}
				>
					<Image
						src={props.item.imageThumbnail[0]}
						width={100}
						height={100}
						style={{
							background: 'black',
							objectFit: 'contain',
						}}
						onClick={(e) => {
							product.setImagePopOver({
								element: e.target,
								data: { src: props.item.imageThumbnail[0] },
								open: true,
							});
						}}
					/>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mt: 1,
						}}
					>
						<Checkbox
							size='small'
							checked={props.item.checked}
							sx={{
								p: 0,
							}}
							onChange={(e) => {
								product.toggleItemChecked(props.index, e.target.checked);
							}}
						/>
						&nbsp;
						<Chip
							size='small'
							color='info'
							sx={{ fontSize: 12, width: 80 }}
							label={props.item.productCode}
							onClick={() => {
								navigator.clipboard.writeText(props.item.productCode).then(
									function () {
										alert('클립보드에 복사되었습니다.');
									},
									function () {
										alert('클립보드에 복사할 수 없습니다.');
									},
								);
							}}
						/>
					</Box>
				</Box>
			</StyledTableCell>
		</>
	);
});
