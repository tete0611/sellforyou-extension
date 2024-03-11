import React, { useState } from 'react';

/** 체크박스 수동삽입 버튼 컴포넌트 */
export const CreateCheckBoxButton = ({ onClick }: { onClick: () => void }) => {
	const [mouseHover, setMouseHover] = useState(false);

	return (
		<button
			className='SELLFORYOU-FLOATING-CIRCLE'
			onClick={onClick}
			onMouseEnter={() => setMouseHover(true)}
			onMouseLeave={() => setMouseHover(false)}
		>
			{!mouseHover ? (
				<i
					className='fi fi-rs-checkbox'
					style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', fontSize: 20, color: 'navy' }}
				/>
			) : (
				<div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
					체크박스
					<br />
					활성화
				</div>
			)}
		</button>
	);
};
