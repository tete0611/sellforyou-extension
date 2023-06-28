import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Popover } from "@mui/material";
import { MyButton } from "../Common/UI";

// 일괄설정 선택메뉴 팝업
export const UpdateManyProductPopOver = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);
  // 팝업이 닫힐경우 데이터 초기화
  const onClose = () => {
    product.setUpdateManyProductPopOver({
      ...product.popOverInfo.updateManyProduct,

      element: null,
      open: false,
    });
  };

  return (
    <Popover
      open={product.popOverInfo.updateManyProduct.open}
      anchorEl={product.popOverInfo.updateManyProduct.element}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          p: 1,
        }}
      >
        <MyButton
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyPriceModal(true);
          }}
        >
          판매가격
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyFeeModal(true);
          }}
        >
          수수료
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyCategoryModal(true);
          }}
        >
          카테고리
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyNameModal(true);
          }}
        >
          상품명
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyAttributeModal(true);
          }}
        >
          상품속성
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="info"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            product.toggleManyTagModal(true);
          }}
        >
          검색태그
        </MyButton>
        &nbsp;
        <MyButton
          disableElevation
          variant="contained"
          color="secondary"
          sx={{
            minWidth: 60,
          }}
          onClick={() => {
            if (common.user.purchaseInfo2.level < 3) {
              alert("[프로] 등급부터 사용 가능한 기능입니다.");

              return;
            }

            product.toggleManyMyKeywardModal(true);
          }}
        >
          개인분류
        </MyButton>
        &nbsp;
        {product.state === 7 || product.myLock === 2 ? (
          <MyButton
            disableElevation
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 60,
            }}
            onClick={() => {
              if (common.user.purchaseInfo2.level < 3) {
                alert("[프로] 등급부터 사용 가능한 기능입니다.");

                return;
              }

              product.toggleManyLockModal(true);
            }}
          >
            잠금설정
          </MyButton>
        ) : null}
        &nbsp;
        {product.gridView ? null : (
          <MyButton
            disableElevation
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 60,
            }}
            onClick={() => {
              if (common.user.purchaseInfo2.level < 3) {
                alert("[프로] 등급부터 사용 가능한 기능입니다.");

                return;
              }

              product.toggleDescriptionModal(true, -1);
            }}
          >
            상세설명
          </MyButton>
        )}
      </Box>
    </Popover>
  );
});
