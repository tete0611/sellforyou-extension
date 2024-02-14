import React from 'react';

interface Props {
	state: 'default' | 'enter';
	bulk: boolean;
}

export const ButtonCollect = ({ state: type, bulk }: Props) => {
	if (type === 'default')
		return <i className='fi fi-rs-inbox-in' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>;
	else
		return (
			<div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{bulk ? '현재페이지\n수집하기' : '현재상품\n수집하기'}</div>
		);
};
