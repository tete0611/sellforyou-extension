import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../../../containers/AppContext";
import { Box, Button, Paper, CircularProgress } from "@mui/material";
import { Title } from "../../../Common/UI";

// 옵션 탭 하위 컴포넌트
export const TabESM2 = observer((props: any) => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 옵션정보 수정 및 변경사항이 발생했을 경우
  const loading = (
    <div className="inform">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="loading" />
        &nbsp; 옵션정보를 저장하는 중입니다...
      </div>
    </div>
  );

  return (
    <>
      {props.item.edited.option === 2 ? loading : null}

      <Paper variant="outlined">
        <Title dark={common.darkTheme} subTitle>
          ESM2.0 등록상품 관리
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              disableElevation
              variant="contained"
              color="info"
              sx={{
                ml: 0.5,
                fontSize: 13,
                height: 26,
              }}
              onClick={() => {
                common.setEditedUpload(true); //수정모드

                product.toggleEsm2UploadModal(props.index, true);
              }}
            >
              ESM2.0 상품수정
            </Button>

            <Button
              disableElevation
              variant="contained"
              color="info"
              sx={{
                ml: 0.5,
                fontSize: 13,
                height: 26,
              }}
              onClick={() => {
                common.setEditedUpload(false);

                product.toggleEsm2UploadModal(props.index, true);
              }}
            >
              ESM2.0 상품등록
            </Button>
            <Button
              disableElevation
              variant="contained"
              color="error"
              sx={{
                ml: 0.5,
                fontSize: 13,
                height: 26,
              }}
              onClick={() => {
                if (props.item.myLock === 2) {
                  alert("잠금 상품은 등록해제 불가능 합니다");
                  return;
                }
                product.toggleEsm2UploadDisabledModal(props.index, true, common);
              }}
            >
              {props.item.delete ? (
                <>
                  <CircularProgress size="1rem" />
                </>
              ) : (
                "ESM2.0 등록해제"
              )}
            </Button>
          </Box>
        </Title>

        <Box
          sx={{
            width: 1205,
            height: 388,
            overflowY: "auto",
            alignItems: "center",
            display: "flex",
            p: 0.5,
          }}
        ></Box>
      </Paper>
    </>
  );
});
