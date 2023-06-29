// 유입수 분석 스토리지

import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';

import { runInAction, makeAutoObservable } from 'mobx';
import { getClock, getClockOffset } from '../../pages/Tools/Common';

export class inflow {
  chartOption: any = {
    chart: {
      type: 'none',
      toolbar: {
        show: false,
      },
    },
    colors: ['#77B6EA'],
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
      },
    },
    stroke: {
      curve: 'smooth',
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: 'datetime',
      min: undefined,
      max: undefined,
      labels: {
        datetimeFormatter: {
          year: 'yyyy년',
          month: 'MM월',
          day: 'MM월 dd일',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  searchInfo: any = {
    timeStart: '',
    timeEnd: '',
    siteCode: 'ALL',
  };

  filterInfo: any = {
    type: 'PCODE',
    keyword: '',
  };

  dataCounts: any = {
    total: '-',

    a077: '-',
    b378: '-',
    a112: '-',
    a113: '-',
    a001: '-',
    a006: '-',
    a027: '-',
    b719: '-',
    a524: '-',
    a525: '-',
    b956: '-',
    a522: '-',
    a523: '-',
  };

  dataInfos: any = [];
  dataGroup: any = [];

  constructor() {
    // 조회기간 초기값 설정 (일주일 전 ~ 현재)
    const time1 = getClockOffset(0, 0, -14, 0, 0, 0);
    const time2 = getClock();

    this.searchInfo.timeStart = `${time1.YY}-${time1.MM}-${time1.DD}`;
    this.searchInfo.timeEnd = `${time2.YY}-${time2.MM}-${time2.DD}`;

    // 차트 가로축 설정
    this.setChartOption({
      ...this.chartOption,

      xaxis: {
        ...this.chartOption.xaxis,

        min: new Date(`${this.searchInfo.timeStart} 00:00:00`).getTime() + 32400000,
        max: new Date(`${this.searchInfo.timeEnd} 23:59:59`).getTime() + 32400000,
      },
    });

    makeAutoObservable(this);
  }

  setFilterInfo = (value: any) => {
    this.filterInfo = value;
  };

  // 유입수 조회
  getInflowCounts = async (start, end) => {
    const time1 = new Date(start);
    const time2 = new Date(end);

    time1.setDate(time1.getDate() - 1);

    const response = await gql(
      QUERIES.SELECT_PRODUCT_VIEW_LOG_BY_USER,
      {
        timeStart: `${time1.getFullYear()}-${(time1.getMonth() + 1).toString().padStart(2, '0')}-${time1
          .getDate()
          .toString()
          .padStart(2, '0')} 15:00:00`,
        timeEnd: `${time2.getFullYear()}-${(time2.getMonth() + 1).toString().padStart(2, '0')}-${time2
          .getDate()
          .toString()
          .padStart(2, '0')} 14:59:59`,
      },
      false
    );

    if (response.errors) {
      alert(response.errors[0].message);

      return;
    }

    runInAction(() => {
      this.dataCounts = JSON.parse(response.data.selectProductViewLogByUser);
    });
  };

  // 유입데이터 조회
  getInflowInfos = async (start, end) => {
    const time1 = new Date(start);
    const time2 = new Date(end);

    time1.setDate(time1.getDate() - 1);

    let keyword = this.filterInfo.keyword ? this.filterInfo.keyword : undefined;

    if (keyword && this.filterInfo.type === 'PCODE') {
      if (!this.filterInfo.keyword.includes('SFY_')) {
        alert('상품코드는 SFY_000 형식으로 입력해주세요.');

        return;
      }

      keyword = parseInt(this.filterInfo.keyword.split('_')[1], 36);
    }

    const response = await gql(
      QUERIES.SELECT_PRODUCT_VIEW_LOG_DATE_FILTER_BY_USER,
      {
        productId: keyword && this.filterInfo.type === 'PCODE' ? keyword : undefined,
        productName: keyword && this.filterInfo.type === 'PNAME' ? keyword : undefined,
        timeStart: `${time1.getFullYear()}-${(time1.getMonth() + 1).toString().padStart(2, '0')}-${time1
          .getDate()
          .toString()
          .padStart(2, '0')} 15:00:00`,
        timeEnd: `${time2.getFullYear()}-${(time2.getMonth() + 1).toString().padStart(2, '0')}-${time2
          .getDate()
          .toString()
          .padStart(2, '0')} 14:59:59`,
      },
      false
    );

    if (response.errors) {
      alert(response.errors[0].message);

      return;
    }

    const timeDiff = time2.getTime() - time1.getTime();

    let longTerm = false;

    if (timeDiff > 86400000 * 2) {
      longTerm = true;
    }

    runInAction(() => {
      const mapInfos = new Map();
      const mapGroup = new Map();

      const logData = JSON.parse(response.data.selectProductViewLogDatefilterByUser);

      logData.map((v) => {
        const date = new Date(v.viewTime);

        if (!longTerm) {
          date.setHours(date.getHours() + 9);
        }

        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();

        const h = date.getHours();

        const time = new Date(`${Y}-${M}-${D} ${longTerm ? '09' : h}:00:00`).getTime();

        const itemArray = mapInfos.get(time);

        if (!itemArray) {
          mapInfos.set(time, [v]);

          return;
        }

        itemArray.push(v);

        mapInfos.set(time, itemArray);
      });

      const logTime = [...mapInfos];

      this.dataInfos = [
        {
          name: '전체유입수',
          data: logTime.map((v) => {
            return {
              x: v[0],
              y: v[1].length,
            };
          }),
        },
      ];

      if (this.searchInfo.siteCode !== 'ALL') {
        this.dataInfos.push({
          name:
            this.searchInfo.siteCode === 'A077'
              ? '스마트스토어'
              : this.searchInfo.siteCode === 'B378'
              ? '쿠팡'
              : this.searchInfo.siteCode === 'A112'
              ? '11번가(글로벌)'
              : this.searchInfo.siteCode === 'A113'
              ? '11번가(일반)'
              : this.searchInfo.siteCode === 'A006'
              ? '지마켓'
              : this.searchInfo.siteCode === 'A001'
              ? '옥션'
              : this.searchInfo.siteCode === 'A027'
              ? '인터파크'
              : this.searchInfo.siteCode === 'B719'
              ? '위메프'
              : this.searchInfo.siteCode === 'A524'
              ? '롯데온(글로벌)'
              : this.searchInfo.siteCode === 'A525'
              ? '롯데온(일반)'
              : this.searchInfo.siteCode === 'B956'
              ? '티몬'
              : this.searchInfo.siteCode === 'A523'
              ? '지마켓(2.0)'
              : this.searchInfo.siteCode === 'A522'
              ? '옥션(1.0)'
              : null,
          data: logTime.map((v) => {
            return {
              x: v[0],
              y: v[1].filter((w) => w.siteCode === this.searchInfo.siteCode).length,
            };
          }),
        });
      }

      logData.map((v) => {
        const itemArray = mapGroup.get(v.productId);

        if (!itemArray) {
          mapGroup.set(v.productId, [v]);

          return;
        }

        itemArray.push(v);

        mapGroup.set(v.productId, itemArray);
      }),
        (this.dataGroup = [...mapGroup]);
    });

    console.log('test', this.dataInfos);
    console.log('test2', this.dataGroup);
  };

  // 검색 정보
  setSearchInfo = (value: any) => {
    this.searchInfo = value;

    this.getInflowCounts(this.searchInfo.timeStart, this.searchInfo.timeEnd);
    this.getInflowInfos(this.searchInfo.timeStart, this.searchInfo.timeEnd);
  };

  // 차트 설정
  setChartOption = (value: any) => {
    this.chartOption = value;
  };
}
