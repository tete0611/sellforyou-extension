import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, Modal, Paper, TextField, Typography } from '@mui/material';
import { MyButton } from '../Common/UI';

// 오픈마켓수수료 일괄설정 모달 뷰
export const ManyFeeModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 사용자 정보 로드
  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }

    // 기본설정에 저장된 값을 토대로 초기값 설정
    product.setManyFeeInfo({
      naverFee: common.user.userInfo.naverFee,
      coupangFee: common.user.userInfo.coupangFee,
      streetFee: common.user.userInfo.streetFee,
      streetNormalFee: common.user.userInfo.streetNormalFee,
      gmarketFee: common.user.userInfo.gmarketFee,
      auctionFee: common.user.userInfo.auctionFee,
      interparkFee: common.user.userInfo.interparkFee,
      wemakepriceFee: common.user.userInfo.wemakepriceFee,
      lotteonFee: common.user.userInfo.lotteonFee,
      lotteonNormalFee: common.user.userInfo.lotteonNormalFee,
      tmonFee: common.user.userInfo.tmonFee,
    });
  }, [common.loaded]);

  return (
    <Modal open={product.modalInfo.fee} onClose={() => product.toggleManyFeeModal(false)}>
      {common.user.userInfo ? (
        <Paper
          className="uploadModal"
          sx={{
            width: 350,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Typography fontSize={16}>오픈마켓 수수료 일괄설정</Typography>

            <Box>
              <MyButton
                color="info"
                sx={{
                  minWidth: 60,
                }}
                onClick={() => {
                  product.updateManyFee(common, null);
                }}
              >
                적용
              </MyButton>
              &nbsp;
              <MyButton
                color="error"
                sx={{
                  minWidth: 60,
                }}
                onClick={() => {
                  product.toggleManyFeeModal(false);
                }}
              >
                취소
              </MyButton>
            </Box>
          </Box>

          <Paper variant="outlined">
            <Box
              sx={{
                p: 1,
              }}
            >
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-smartstore.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_naver`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.naverFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        naverFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-coupang.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_coupang`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.coupangFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        coupangFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-street-global.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_street`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.streetFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        streetFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-street-normal.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_streetNormal`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.streetNormalFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        streetNormalFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-gmarket.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_gmarket`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.gmarketFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        gmarketFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-auction.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_auction`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.auctionFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        auctionFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-interpark.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_interpark`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.interparkFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        interparkFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-wemakeprice.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_wemakepriceFee`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.wemakepriceFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        wemakepriceFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-lotteon-global.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_lotteon`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.lotteonFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        lotteonFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-lotteon-normal.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_lotteonNormal`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.lotteonNormalFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        lotteonNormalFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: 'auto',
                  }}
                >
                  <img src="/resources/icon-tmon.png" />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: 'auto',
                    textAlign: 'right',
                  }}
                >
                  <TextField
                    id={`modal_many_fee_tmon`}
                    variant="outlined"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                        textAlign: 'right',
                      },
                    }}
                    defaultValue={product.manyFeeInfo.tmonFee}
                    onBlur={(e) => {
                      product.setManyFeeInfo({
                        ...product.manyFeeInfo,

                        tmonFee: parseFloat(e.target.value),
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Paper>
      ) : (
        <></>
      )}
    </Modal>
  );
});
