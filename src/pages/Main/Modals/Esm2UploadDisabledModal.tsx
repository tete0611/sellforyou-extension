import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import {
  styled,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Table,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

// 커스텀 테이블 열 스타일 설정
const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  borderBottom: "1px solid ghostwhite",
  padding: 0,
  fontSize: 12,
});

// 빙글빙글 돌아가는 로딩 아이콘 안에 퍼센테이지와 함께 표기되는 뷰
function CircularProgressWithLabel(props: any) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <CircularProgress variant="determinate" {...props} size="2rem" />

      {props.value > 0 ? (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" fontSize={10} fontWeight="bold">
            {`${Math.round(props.value)}`}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

// 상품 등록해제 모달 뷰
export const Esm2UploadDisabledModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  return (
    <Modal open={product.modalInfo.Esm2uploadDisabled}>
      <Paper
        className="uploadModal"
        sx={{
          width: 600,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography fontSize={16} sx={{}}>
            ESM2.0 상품 등록해제
          </Typography>

          <IconButton
            size="small"
            onClick={() => {
              product.toggleEsm2UploadDisabledModal(-1, false, common);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            height: 300,
          }}
        >
          <Box
            sx={{
              p: 1,
            }}
          >
            <Table>
              <TableRow>
                <StyledTableCell
                  colSpan={2}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={(e) => {
                          common.toggleUploadDisabledInfoMarketAll(e.target.checked);
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          fontSize: 12,
                          alignItems: "center",
                        }}
                      >
                        오픈마켓 전체선택
                      </Box>
                    }
                  />
                </StyledTableCell>

                <StyledTableCell colSpan={2}></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell
                  width={"35%"}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  오픈마켓
                </StyledTableCell>

                <StyledTableCell width={"15%"}>상태</StyledTableCell>

                <StyledTableCell
                  width={"35%"}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  오픈마켓
                </StyledTableCell>

                <StyledTableCell width={"15%"}>상태</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        disabled={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A523").disabled}
                        checked={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A523").upload}
                        onChange={(e) => {
                          common.toggleUploadDisabledInfoMarket("A523", e.target.checked);
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          fontSize: 12,
                          alignItems: "center",
                        }}
                      >
                        <img src="/resources/icon-gmarket.png" />
                        &nbsp; 지마켓2.0
                      </Box>
                    }
                  />
                </StyledTableCell>

                <StyledTableCell>
                  {common.uploadDisabledInfo.markets.find((v: any) => v.code === "A523").progress > 0 ? (
                    <CircularProgressWithLabel color="error" value={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A523").progress} />
                  ) : common.uploadDisabledInfo.markets.find((v: any) => v.code === "A523").disabled ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: 12,
                      }}
                    >
                      삭제불가
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        color: "green",
                        fontSize: 12,
                      }}
                    >
                      삭제가능
                    </Typography>
                  )}
                </StyledTableCell>

                <StyledTableCell
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        disabled={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A522").disabled}
                        checked={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A522").upload}
                        onChange={(e) => {
                          common.toggleUploadDisabledInfoMarket("A522", e.target.checked);
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          fontSize: 12,
                          alignItems: "center",
                        }}
                      >
                        <img src="/resources/icon-auction.png" />
                        &nbsp; 옥션2.0
                      </Box>
                    }
                  />
                </StyledTableCell>

                <StyledTableCell>
                  {common.uploadDisabledInfo.markets.find((v: any) => v.code === "A522").progress > 0 ? (
                    <CircularProgressWithLabel color="error" value={common.uploadDisabledInfo.markets.find((v: any) => v.code === "A522").progress} />
                  ) : common.uploadDisabledInfo.markets.find((v: any) => v.code === "A522").disabled ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: 12,
                      }}
                    >
                      삭제불가
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        color: "green",
                        fontSize: 12,
                      }}
                    >
                      삭제가능
                    </Typography>
                  )}
                </StyledTableCell>
              </TableRow>
            </Table>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            height: 100,
            overflowY: "auto",
            mt: 1,
          }}
        >
          {product.uploadConsole?.map((v: any) => (
            <Typography
              sx={{
                fontSize: 12,
              }}
            >
              {v}
            </Typography>
          ))}
        </Paper>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Button
            disabled={!common.uploadInfo.uploadable}
            disableElevation
            variant="contained"
            color="info"
            sx={{
              width: "33%",
              mx: 0.5,
            }}
            onClick={async () => {
              await common.setUploadable(false);

              await product.Esm2DisableItems(common);
              await product.toggleEsm2UploadDisabledModal(-1, false, common);
            }}
          >
            {!common.uploadInfo.uploadable && !common.uploadInfo.stopped ? "등록해제 중..." : "등록해제"}
          </Button>

          <Button
            disabled={common.uploadInfo.stopped}
            disableElevation
            variant="contained"
            color="error"
            sx={{
              width: "33%",
              mx: 0.5,
            }}
            onClick={async () => {
              let accept = confirm("상품등록을 중단하시겠습니까?\n상품등록이 중단되더라도 이전에 등록된 상품은 삭제되지 않을 수 있습니다.");

              if (accept) {
                await common.setStopped(true);
              }
            }}
          >
            {!common.uploadInfo.uploadable && common.uploadInfo.stopped ? "중단 중..." : "중단"}
          </Button>

          <Button
            disableElevation
            variant="contained"
            color="inherit"
            sx={{
              width: "33%",
              mx: 0.5,
            }}
            onClick={() => {
              product.toggleEsm2UploadDisabledModal(-1, false, common);
            }}
          >
            닫기
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
});
