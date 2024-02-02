import React from 'react';

interface Props {
	state: 'currentPage' | 'customization';
}

export const BulkSettingPaper = ({ state }: Props) => {
	return (
		<div
			style={{
				background: 'white',
				border: '1px solid black',
				color: 'black',
				fontSize: 16,
				padding: 10,
				textAlign: 'left',
				width: 700,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: 20,
					marginBottom: 20,
				}}
			>
				{state === 'currentPage' ? `현재페이지 대량수집` : `사용자정의 대량수집`}
				<button id='sfyCancel' style={{ padding: 10 }}>
					<i className='fi fi-rs-cross' style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}></i>
				</button>
			</div>
			<table style={{ width: '100%' }}>
				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}>
							<input
								id='sfyCategoryEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							카테고리 수동설정
						</label>
						<table style={{ width: '100%' }}>
							<tr>
								<td style={{ padding: 5, width: '25%' }}>카테고리 검색</td>
								<td style={{ padding: 5, width: '75%' }}>
									<div style={{ position: 'relative' }}>
										<input
											id='sfyCategoryInput'
											disabled
											data-category-id=''
											style={{ border: '1px solid black', width: '100%' }}
										/>

										<div
											id='sfyCategoryList'
											style={{
												background: 'white',
												border: '1px solid black',
												display: 'none',
												fontSize: 13,
												position: 'absolute',
												width: '100%',
												height: 100,
												overflowY: 'scroll',
											}}
										></div>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 10, paddingBottom: 10 }}>
						카테고리를 수동으로 설정하시려면 카테고리 수동설정란을 체크해주세요.
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}>
							<input
								id='sfyMyKeywardEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							개인분류 설정
						</label>

						<table style={{ width: '100%' }}>
							<tr>
								<td style={{ padding: 5, width: '25%' }}>개인분류 입력</td>

								<td style={{ padding: 5, width: '75%' }}>
									<div style={{ position: 'relative' }}>
										<input
											id='sfyMyKeywardInput'
											disabled
											data-myKeyward-id=''
											style={{ border: '1px solid black', width: '100%' }}
										/>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 10, paddingBottom: 10 }}>
						개인분류를 설정하시려면 개인분류 설정란을 체크해주세요.(공백은 제거됩니다.)
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18 }}>
							<input
								id='sfyGoldMedalEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							금메달 상품만 수집하기 (타오바오)
						</label>
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18 }}>
							<input
								id='sfyStandardShippingEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							스탠다드 쉬핑 상품만 수집하기 (알리익스프레스)
						</label>
					</td>
				</tr>

				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 5, paddingBottom: 5 }}></td>
				</tr>
				{state === 'customization' && (
					<tr>
						<td style={{ border: '1px solid black', width: '45%', padding: 10 }}>
							<label
								style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}
							>
								<input
									type='radio'
									name='sfyBulkType'
									value='page'
									checked
									style={{ cursor: 'pointer', width: 20, height: 20 }}
								/>
								&nbsp; 페이지단위 대량수집
							</label>

							<table style={{ width: '100%', marginBottom: 20 }}>
								<tr>
									<td style={{ padding: 5, width: '50%' }}>시작페이지</td>

									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyPageStart'
											value='1'
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>

								<tr>
									<td style={{ padding: 5, width: '50%' }}>종료페이지</td>

									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyPageEnd'
											value='1'
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>
							</table>
						</td>

						<td style={{ textAlign: 'center' }}>또는</td>

						<td style={{ border: '1px solid black', width: '45%', padding: 10 }}>
							<label
								style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}
							>
								<input
									type='radio'
									name='sfyBulkType'
									value='amount'
									style={{ cursor: 'pointer', width: 20, height: 20 }}
								/>
								&nbsp; 수량단위 대량수집
							</label>

							<table style={{ width: '100%', marginBottom: 56 }}>
								<tr>
									<td style={{ padding: 5, width: '50%' }}>목표수량</td>

									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyAmount'
											value='100'
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				)}

				<tr>
					<td colSpan={3} style={{ paddingTop: 10, paddingBottom: 10 }}>
						<button id='sfyStart' style={{ width: '100%', height: 40, fontWeight: 600 }}>
							대량수집 시작하기
						</button>
					</td>
				</tr>
			</table>
		</div>
	);
};
