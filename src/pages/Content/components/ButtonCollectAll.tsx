import React from 'react';

interface Props {
	state: 'default' | 'enter' | 'dot';
}

export const ButtonCollectAll = ({ state: type }: Props) => {
	if (type === 'default')
		return <i className='fi fi-rs-list-check' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>;
	else if (type === 'enter')
		return (
			<div style={{ fontSize: 12 }}>
				상품일괄
				<br />
				선택/해제
			</div>
		);
	else return <i className='fi fi-rs-list' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>;
};
