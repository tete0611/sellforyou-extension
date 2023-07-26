// 우측 상단 크롬확장프로그램 실행버튼을 클릭했을 때 동작
// 별도 기능 없이 바로 대시보드 페이지를 오픈함
const Popup = () => {
	return window.open('/dashboard.html');
};

export default Popup;
