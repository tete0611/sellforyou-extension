import React from 'react';

/** 각종 테스트에 사용되는 버튼 컴포넌트 */
export const TestButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<table className='SELLFORYOU-TEST'>
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button className='SELLFORYOU-COLLECT' onClick={onClick}>
						<p>테스트</p>
					</button>
				</td>
			</tr>
		</table>
	);
};
