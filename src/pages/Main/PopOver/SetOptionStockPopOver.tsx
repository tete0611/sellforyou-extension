import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Button, Grid, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import { ComboBox, MyButton } from '../Common/UI';

// 옵션 재고수량 일괄설정 팝업
export const SetOptionStockPopOver = observer(() => {
  // MobX 스토리지 로드
  const { product } = React.useContext(AppContext);

  // 팝업이 닫혔을 경우 데이터를 초기화
  const onClose = () => {
    product.setOptionStockPopOver({
      ...product.popOverInfo.setOptionStock,

      index: -1,
      element: null,
      open: false,

      data: {
        nameIndex: -1,
        valueIndex: -1,
        stock: '',
      },
    });
  };

  return (
    <Popover
      open={product.popOverInfo.setOptionStock.open}
      anchorEl={product.popOverInfo.setOptionStock.element}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box
        sx={{
          p: 3,
          width: 300,
        }}
      >
        <Box>
          <Grid container spacing={1}>
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <Typography fontSize={14}>적용할 옵션명</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <ComboBox
                sx={{
                  width: '100%',
                }}
                value={product.popOverInfo.setOptionStock.data.nameIndex}
                onChange={(e) => {
                  product.setOptionStockPopOver({
                    ...product.popOverInfo.setOptionStock,

                    data: {
                      ...product.popOverInfo.setOptionStock.data,

                      nameIndex: e.target.value,
                    },
                  });
                }}
              >
                <MenuItem value={-2}>{'<체크된 옵션>'}</MenuItem>

                <MenuItem value={-1}>{'<모든 옵션명>'}</MenuItem>

                {product.popOverInfo.setOptionStock.index > -1
                  ? product.itemInfo.items[product.popOverInfo.setOptionStock.index].productOptionName.map(
                      (v: any, i: number) => <MenuItem value={i}>{v.name}</MenuItem>
                    )
                  : null}
              </ComboBox>
            </Grid>

            {product.popOverInfo.setOptionStock.data.nameIndex < 0 ? null : (
              <>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <Typography fontSize={14}>적용할 옵션값</Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <ComboBox
                    sx={{
                      width: '100%',
                    }}
                    value={product.popOverInfo.setOptionStock.data.valueIndex}
                    onChange={(e) => {
                      product.setOptionStockPopOver({
                        ...product.popOverInfo.setOptionStock,

                        data: {
                          ...product.popOverInfo.setOptionStock.data,

                          valueIndex: e.target.value,
                        },
                      });
                    }}
                  >
                    <MenuItem value={-1}>{'<옵션값 선택>'}</MenuItem>

                    {product.popOverInfo.setOptionStock.index > -1
                      ? product.itemInfo.items[product.popOverInfo.setOptionStock.index].productOptionName[
                          product.popOverInfo.setOptionStock.data.nameIndex
                        ].productOptionValue.map((v: any, i: number) => <MenuItem value={i}>{v.name}</MenuItem>)
                      : null}
                  </ComboBox>
                </Grid>
              </>
            )}

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <Typography fontSize={14}>설정할 재고수량</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: 'auto',
              }}
            >
              <TextField
                id={'set_option_stock'}
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
                onBlur={(e) => {
                  product.setOptionStockPopOver({
                    ...product.popOverInfo.setOptionStock,

                    data: {
                      ...product.popOverInfo.setOptionStock.data,

                      stock: e.target.value,
                    },
                  });
                }}
              />
            </Grid>
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
              const index = product.popOverInfo.setOptionStock.index;

              const stock = parseInt(product.popOverInfo.setOptionStock.data.stock);

              const nameIndex = parseInt(product.popOverInfo.setOptionStock.data.nameIndex);
              const valueIndex = parseInt(product.popOverInfo.setOptionStock.data.valueIndex);

              if (!stock || isNaN(stock)) {
                alert('설정할 재고수량은 숫자 형식으로만 입력 가능합니다.');

                return;
              }

              if (nameIndex < 0) {
                if (nameIndex === -1) {
                  product.calcProductOptionPrice(stock, 'setStock', index, null, false);
                } else if (nameIndex === -2) {
                  product.calcProductOptionPrice(stock, 'setStock', index, null, true);
                }
              } else {
                if (valueIndex === -1) {
                  alert('적용할 옵션값을 선택해주세요.');

                  return;
                }

                const valueId =
                  product.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].id;

                product.calcProductOptionPrice(stock, 'setStock', index, valueId, null);
              }

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
