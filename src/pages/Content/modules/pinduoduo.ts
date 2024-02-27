import { sleep } from '../../../../common/function';
import { User } from '../../../type/schema';
import { sendRuntimeMessage } from '../../Tools/ChromeAsync';
import { form } from './common/data';
import { injectScript } from './common/utils';

/** 핀둬둬 상품정보 크롤링 */
const scrape = async (items: any, user: User) => {
	const result = form;
	result.user = user;

	return result;
};

export class pinduoduo {
	constructor() {
		// 추후 필요시 구현
		// checkLogin('pinduoduo').then((auth)=> {
		//   if(!auth) return null;
		// })
	}

	/** 수집하기 버튼 클릭 시 */
	async get(user: User) {
		sessionStorage.removeItem('sfy-pinduoduo-item');

		injectScript('pinduoduo');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo!.collectTimeout)
				return {
					error: '핀둬둬 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			const data = sessionStorage.getItem('sfy-pinduoduo-item');
			if (data) {
				const originalData = JSON.parse(data);

				return await scrape(originalData, user);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	/** 핀둬둬 메인 대량수집 체크박스 함수 */
	async bulkTypeOne(user: User) {
		while (true) {
			const products = document.querySelectorAll('.dczM04Hh') as NodeListOf<HTMLDivElement> | undefined;
			if (products) {
				await sendRuntimeMessage<string>({
					action: 'console',
					source: products as any,
				});

				const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;

				products.forEach((v, i) => {
					// v.addEventListener('click', () => {}, true);
					// const box = v.querySelector('._3fwc9GD8') as HTMLDivElement | null;
					// if (!box) return;
					const input = Object.assign(document.createElement('input'), {
						className: 'SELLFORYOU-CHECKBOX',
						checked: picker?.value !== 'false',
						type: 'checkbox',
						id: i.toString(),
						style: user.userInfo?.collectCheckPosition === 'L' ? 'left: 0px !important' : 'right: 0px !important',
					});
					const sfyBox = v?.querySelector('.SELLFORYOU-CHECKBOX');

					input.addEventListener('click', (e) => {
						e.stopPropagation();
					});

					if (!sfyBox) {
						v.style.position = 'relative';
						v.insertBefore(input, v.firstChild);
					}
				});

				break;
			}

			await sleep(500);
		}
	}
}
