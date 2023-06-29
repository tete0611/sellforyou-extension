import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Button, Grid, Popover, TextField, Typography } from '@mui/material';
import { MyButton } from '../Common/UI';

interface sillInfoType {
  code: string;
  name: string;
  data: any;
}

// 상품 고시정보 세부내용 설정 팝업
export const SetProductSillDataPopOver = observer(() => {
  // MobX 스토리지 로드
  const { product } = React.useContext(AppContext);

  // 상품고시정보 상태관리
  const [sillInfo, setSillInfo] = React.useState<sillInfoType>({
    code: '',
    name: '',
    data: [],
  });

  // 팝업이 동작할때
  React.useEffect(() => {
    // 팝업이 열리지 않은 경우
    if (product.popOverInfo.setProductSillData.index === -1) {
      return;
    }

    const info = product.popOverInfo.setProductSillData.data;

    // 내가 가진 상품의 고시정보데이터를 찾아 설정
    let result = product.itemInfo.items[product.popOverInfo.setProductSillData.index][`categoryInfo${info.marketCode}`][
      `activeSillData${info.marketCode}`
    ].find((v) => v.code === info.sillCode);

    setSillInfo({
      code: product.popOverInfo.setProductSillData.data.sillCode,
      name: result.name,
      data: JSON.parse(product.popOverInfo.setProductSillData.data.sillData),
    });
  }, [product.popOverInfo.setProductSillData.index]);

  // 팝업이 닫히면 데이터를 초기화
  const onClose = () => {
    product.setProductSillDataPopOver({
      ...product.popOverInfo.setProductSillData,

      index: -1,
      element: null,
      open: false,
      data: {
        marketCode: null,
        sillCode: '',
        sillData: '',
      },
    });
  };

  return (
    <Popover
      open={product.popOverInfo.setProductSillData.open}
      anchorEl={product.popOverInfo.setProductSillData.element}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box
        sx={{
          p: 3,
          width: 500,
        }}
      >
        <Box>
          <Grid
            container
            spacing={1}
            sx={{
              mb: 3,
            }}
          >
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <Typography fontSize={14}>상품정보제공고시명</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <Typography fontSize={14}>{sillInfo.name}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {sillInfo.data.map((v) => (
              <>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <Typography fontSize={14}>{v.name}</Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    m: 'auto',
                  }}
                >
                  {v.type === 'input' ? (
                    <>
                      <TextField
                        id={v.code}
                        variant="outlined"
                        sx={{
                          width: '100%',
                        }}
                        inputProps={{
                          style: {
                            fontSize: 14,
                            padding: 5,
                          },
                        }}
                        defaultValue={v.value ? v.value : '상세설명참조'}
                        onBlur={(e) => {
                          v.value = e.target.value;

                          setSillInfo({
                            ...sillInfo,

                            data: sillInfo.data,
                          });
                        }}
                      />
                    </>
                  ) : null}
                </Grid>
              </>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <MyButton
            color="info"
            sx={{
              width: 100,
            }}
            onClick={() => {
              product.updateProdutSillDatas(
                product.popOverInfo.setProductSillData.data.marketCode,
                {
                  productIds: product.itemInfo.items[product.popOverInfo.setProductSillData.index].id,
                  value: JSON.stringify(sillInfo.data),
                },
                product.popOverInfo.setProductSillData.index
              );

              onClose();
            }}
          >
            적용
          </MyButton>
          &nbsp;
          <MyButton
            color="error"
            sx={{
              width: 100,
            }}
            onClick={onClose}
          >
            취소
          </MyButton>
        </Box>
      </Box>
    </Popover>
  );
});
