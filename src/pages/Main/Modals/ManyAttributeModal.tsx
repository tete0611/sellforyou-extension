import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { MyButton } from "../Common/UI";

// 상품속성 일괄설정 모달 뷰
export const ManyAttributeModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 사용자 정보를 불러온 뒤
  React.useEffect(() => {
    if (!common.loaded) {
      return;
    }

    // 기본설정에 저장된 값을 토대로 초기값 설정
    product.setManyPriceInfo({
      cnyRate: common.user.userInfo.cnyRate,
      marginRate: common.user.userInfo.marginRate,
      marginUnitType: common.user.userInfo.marginUnitType,
      localShippingFee: common.user.userInfo.defaultShippingFee,
      shippingFee: common.user.userInfo.extraShippingFee,
    });
  }, [common.loaded]);

  return (
    <Modal open={product.modalInfo.attribute} onClose={() => product.toggleManyAttributeModal(false)}>
      {common.user.userInfo ? (
        <Paper
          className="uploadModal"
          sx={{
            width: 350,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography fontSize={16}>상품속성 일괄설정</Typography>

            <Box>
              <MyButton
                color="info"
                sx={{
                  minWidth: 60,
                }}
                onClick={() => {
                  product.updateManyAttribute(common);
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
                  product.toggleManyAttributeModal(false);
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
                    m: "auto",
                  }}
                >
                  <Typography fontSize={14}>제조사</Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: "auto",
                    textAlign: "right",
                  }}
                >
                  <TextField
                    id={`modal_many_price_cnyRate`}
                    variant="outlined"
                    sx={{
                      width: "100%",
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                      },
                    }}
                    defaultValue={product.manyAttributeInfo.manufacturer}
                    onBlur={(e) => {
                      product.setManyAttributeInfo({
                        ...product.manyAttributeInfo,

                        manufacturer: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: "auto",
                  }}
                >
                  <Typography fontSize={14}>브랜드</Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: "auto",
                    textAlign: "right",
                  }}
                >
                  <TextField
                    id={`modal_many_price_cnyRate`}
                    variant="outlined"
                    sx={{
                      width: "100%",
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                      },
                    }}
                    defaultValue={product.manyAttributeInfo.brandName}
                    onBlur={(e) => {
                      product.setManyAttributeInfo({
                        ...product.manyAttributeInfo,

                        brandName: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={4}
                  sx={{
                    m: "auto",
                  }}
                >
                  <Typography fontSize={14}>모델명</Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={8}
                  sx={{
                    m: "auto",
                    textAlign: "right",
                  }}
                >
                  <TextField
                    id={`modal_many_price_cnyRate`}
                    variant="outlined"
                    sx={{
                      width: "100%",
                    }}
                    inputProps={{
                      style: {
                        fontSize: 14,
                        padding: 5,
                      },
                    }}
                    defaultValue={product.manyAttributeInfo.modelName}
                    onBlur={(e) => {
                      product.setManyAttributeInfo({
                        ...product.manyAttributeInfo,

                        modelName: e.target.value,
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
