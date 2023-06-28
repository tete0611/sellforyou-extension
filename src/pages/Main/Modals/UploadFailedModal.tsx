import React from "react";

import { format } from "date-fns";
import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { styled, Box, Modal, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { Title } from "../Common/UI";

// 커스텀 테이블 열 스타일 설정
const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  borderBottom: "1px solid ghostwhite",
  padding: 5,
  fontSize: 12,
});

// 상품등록 실패사유를 보여주는 모달 뷰
export const UploadFailedModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  return (
    <Modal
      open={product.modalInfo.uploadFailed}
      onClose={() => {
        product.toggleUploadFailedModal(0, false);
      }}
    >
      <Paper
        className="uploadModal"
        sx={{
          width: 800,
        }}
      >
        <Typography
          fontSize={16}
          sx={{
            mb: 3,
          }}
        >
          실패사유 ({product.itemInfo.items[product.uploadFailedIndex]?.productCode})
        </Typography>

        {product.itemInfo.items[product.uploadFailedIndex]?.productStore.map((v: any) =>
          v.productStoreLog.length > 0 ? (
            <Paper
              sx={{
                mb: 1,
              }}
              variant="outlined"
            >
              <Title subTitle dark={common.darkTheme}>
                <Typography fontSize={14}>
                  {v.siteCode === "A077"
                    ? "스마트스토어"
                    : v.siteCode === "B378"
                    ? "쿠팡"
                    : v.siteCode === "A112"
                    ? "11번가 글로벌"
                    : v.siteCode === "A113"
                    ? "11번가 일반"
                    : v.siteCode === "A006"
                    ? "지마켓 1.0"
                    : v.siteCode === "A001"
                    ? "옥션 1.0"
                    : v.siteCode === "A523"
                    ? "지마켓2.0"
                    : v.siteCode === "A522"
                    ? "옥션2.0"
                    : v.siteCode === "A027"
                    ? "인터파크"
                    : v.siteCode === "B719"
                    ? "위메프 2.0"
                    : v.siteCode === "A524"
                    ? "롯데온 글로벌"
                    : v.siteCode === "A525"
                    ? "롯데온 일반"
                    : v.siteCode === "B956"
                    ? "티몬"
                    : ""}
                </Typography>
              </Title>

              <Table>
                <TableBody>
                  {v.productStoreLog.map((w: any) => {
                    return (
                      <TableRow hover>
                        <StyledTableCell
                          width="75%"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {w.errorMessage}
                        </StyledTableCell>

                        <StyledTableCell
                          width="25%"
                          style={{
                            textAlign: "right",
                          }}
                        >
                          {format(new Date(w.createdAt), "yyyy-MM-dd HH:mm:ss")}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          ) : null
        )}
      </Paper>
    </Modal>
  );
});
