// MobX 스토리지 생성 방법
// 1) 자리에 새로운 스토리지 경로 작성
// 2) 자리에 스토리지명과 객체 생성

import React from 'react';

import { analysis } from './stores/analysis';
import { common } from './stores/common';
import { dashboard } from './stores/dashboard';
import { delivery } from './stores/delivery';
import { inflow } from './stores/inflow';
import { order } from './stores/order';
import { payments } from './stores/payments';
import { product } from './stores/product';
import { reference } from './stores/reference';
import { restrict } from './stores/restrict';
import { sourcing } from './stores/sourcing';
// 1)

export function createStores() {
	return {
		analysis: new analysis(),
		common: new common(),
		dashboard: new dashboard(),
		delivery: new delivery(),
		inflow: new inflow(),
		order: new order(),
		payments: new payments(),
		product: new product(),
		reference: new reference(),
		restrict: new restrict(),
		sourcing: new sourcing(),
		// 2)
	};
}

// 스토리지 정보를 포함하는 객체 생성
export const stores = createStores();

// 객체를 리액트 전역에서 사용할 수 있도록 컨텍스트 생성
export const AppContext = React.createContext(stores);
