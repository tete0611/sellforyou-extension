import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, Modal, Paper, Typography } from '@mui/material';
import { MyButton, Search } from '../Common/UI';
import { SHOPCODE } from '../../../type/variable';

// 카테고리 일괄설정 모달 뷰
export const ManyCategoryModal = observer(() => {
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

	return (
		<Modal open={product.modalInfo.category} onClose={() => product.toggleManyCategoryModal(false)}>
			<Paper
				className='uploadModal'
				sx={{
					width: 700,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 3,
					}}
				>
					<Typography fontSize={16}>카테고리 일괄설정</Typography>

					<Box>
						<MyButton
							color='info'
							sx={{
								minWidth: 60,
							}}
							onClick={() => {
								product.updateManyCategory(common, null);
							}}
						>
							적용
						</MyButton>
						&nbsp;
						<MyButton
							color='error'
							sx={{
								minWidth: 60,
							}}
							onClick={() => {
								product.toggleManyCategoryModal(false);
							}}
						>
							취소
						</MyButton>
					</Box>
				</Box>

				<Paper
					variant='outlined'
					sx={{
						mb: 1,
					}}
				>
					<Box
						sx={{
							p: 1,
						}}
					>
						<Grid container spacing={1}>
							<Grid
								item
								xs={6}
								md={2}
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
									<img src='/resources/icon-smartstore.png' />

									<Typography
										fontSize={14}
										sx={{
											ml: 1,
										}}
									>
										자동매칭
									</Typography>
								</Box>
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA077}
									onChange={(e: any, value: any) => {
										product.updateManyCategoryAuto(value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(SMART_STORE, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
											? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
											: [product.manyCategoryInfo.categoryInfoA077]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => product.getCategoryList(SMART_STORE)}
									onClose={() => product.setCategoryInput(SMART_STORE, '')}
									loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
								/>
							</Grid>
						</Grid>
					</Box>
				</Paper>

				<Paper variant='outlined'>
					<Box
						sx={{
							p: 1,
						}}
					>
						<Grid container spacing={1}>
							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-smartstore.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA077}
									onChange={(e: any, value: any) => {
										product.setManyCategory(SMART_STORE, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(SMART_STORE, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
											? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
											: [product.manyCategoryInfo.categoryInfoA077]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(SMART_STORE);
									}}
									onClose={() => {
										product.setCategoryInput(SMART_STORE, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-coupang.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoB378}
									onChange={(e: any, value: any) => {
										product.setManyCategory(COUPANG, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(COUPANG, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === COUPANG)!.input
											? product.categoryInfo.markets.find((v) => v.code === COUPANG)!.data
											: [product.manyCategoryInfo.categoryInfoB378]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(COUPANG);
									}}
									onClose={() => {
										product.setCategoryInput(COUPANG, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === COUPANG)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-street-global.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA112}
									onChange={(e: any, value: any) => {
										product.setManyCategory(STREET11_GLOBAL, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(STREET11_GLOBAL, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.input
											? product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.data
											: [product.manyCategoryInfo.categoryInfoA112]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(STREET11_GLOBAL);
									}}
									onClose={() => {
										product.setCategoryInput(STREET11_GLOBAL, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-street-normal.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA113}
									onChange={(e: any, value: any) => {
										product.setManyCategory(STREET11_NORMAL, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(STREET11_NORMAL, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.input
											? product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.data
											: [product.manyCategoryInfo.categoryInfoA113]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(STREET11_NORMAL);
									}}
									onClose={() => {
										product.setCategoryInput(STREET11_NORMAL, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === STREET11_NORMAL)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-gmarket.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA006}
									onChange={(e: any, value: any) => {
										product.setManyCategory(G_MARKET_1, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(G_MARKET_1, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.input
											? product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.data
											: [product.manyCategoryInfo.categoryInfoA006]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(G_MARKET_1);
									}}
									onClose={() => {
										product.setCategoryInput(G_MARKET_1, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === G_MARKET_1)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-auction.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA001}
									onChange={(e: any, value: any) => {
										product.setManyCategory(AUCTION_1, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(AUCTION_1, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.input
											? product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.data
											: [product.manyCategoryInfo.categoryInfoA001]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(AUCTION_1);
									}}
									onClose={() => {
										product.setCategoryInput(AUCTION_1, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === AUCTION_1)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-interpark.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA027}
									onChange={(e: any, value: any) => {
										product.setManyCategory(INTER_PARK, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(INTER_PARK, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.input
											? product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.data
											: [product.manyCategoryInfo.categoryInfoA027]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(INTER_PARK);
									}}
									onClose={() => {
										product.setCategoryInput(INTER_PARK, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === INTER_PARK)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-wemakeprice.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoB719}
									onChange={(e: any, value: any) => {
										product.setManyCategory(WE_MAKE_PRICE, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(WE_MAKE_PRICE, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.input
											? product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.data
											: [product.manyCategoryInfo.categoryInfoB719]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(WE_MAKE_PRICE);
									}}
									onClose={() => {
										product.setCategoryInput(WE_MAKE_PRICE, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-lotteon-global.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA524}
									onChange={(e: any, value: any) => {
										product.setManyCategory(LOTTE_ON_GLOBAL, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(LOTTE_ON_GLOBAL, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.input
											? product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.data
											: [product.manyCategoryInfo.categoryInfoA524]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(LOTTE_ON_GLOBAL);
									}}
									onClose={() => {
										product.setCategoryInput(LOTTE_ON_GLOBAL, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-lotteon-normal.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoA525}
									onChange={(e: any, value: any) => {
										product.setManyCategory(LOTTE_ON_NORMAL, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(LOTTE_ON_NORMAL, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.input
											? product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.data
											: [product.manyCategoryInfo.categoryInfoA525]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(LOTTE_ON_NORMAL);
									}}
									onClose={() => {
										product.setCategoryInput(LOTTE_ON_NORMAL, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.loading}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={2}
								sx={{
									m: 'auto',
								}}
							>
								<img src='/resources/icon-tmon.png' />
							</Grid>

							<Grid
								item
								xs={6}
								md={10}
								sx={{
									m: 'auto',
									textAlign: 'right',
								}}
							>
								<Search
									value={product.manyCategoryInfo.categoryInfoB956}
									onChange={(e: any, value: any) => {
										product.setManyCategory(TMON, value);
									}}
									onInputChange={(e, value, reason) => {
										if (reason !== 'input') {
											return;
										}

										product.setCategoryInput(TMON, value);
									}}
									options={
										product.categoryInfo.markets.find((v) => v.code === TMON)!.input
											? product.categoryInfo.markets.find((v) => v.code === TMON)!.data
											: [product.manyCategoryInfo.categoryInfoB956]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onOpen={() => {
										product.getCategoryList(TMON);
									}}
									onClose={() => {
										product.setCategoryInput(TMON, '');
									}}
									loading={product.categoryInfo.markets.find((v) => v.code === TMON)!.loading}
								/>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Paper>
		</Modal>
	);
});
