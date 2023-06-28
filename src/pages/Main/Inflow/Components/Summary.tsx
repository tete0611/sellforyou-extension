import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../../containers/AppContext";
import { styled, Box, Chip, TableCell, TableRow, Typography } from "@mui/material";
import { Image } from "../../Common/UI";

// 커스텀 테이블 컬럼 스타일 설정
const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  padding: 0,
  fontSize: 14,
});

// 유입수 페이지 하단 테이블 행 뷰
export const Summary = observer((props: any) => {
  // MobX 스토리지 로드
  const { product } = React.useContext(AppContext);

  return (
    <>
      <TableRow hover>
        <StyledTableCell width={90}>
          <Chip
            size="small"
            color="info"
            sx={{ fontSize: 12, width: 85 }}
            label={props.item[0].product.productCode}
            onClick={() => {
              navigator.clipboard.writeText(props.item[0].product.productCode).then(
                function () {
                  alert("클립보드에 복사되었습니다.");
                },
                function () {
                  alert("클립보드에 복사할 수 없습니다.");
                }
              );
            }}
          />
        </StyledTableCell>

        <StyledTableCell width={50}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <Image
              src={
                JSON.parse(props.item[0].product.imageThumbnailData)[0].includes("http")
                  ? JSON.parse(props.item[0].product.imageThumbnailData)[0]
                  : `https://img.sellforyou.co.kr/sellforyou/${JSON.parse(props.item[0].product.imageThumbnailData)[0]}`
              }
              width={40}
              height={40}
              style={{
                background: "black",
                objectFit: "contain",
              }}
              onClick={(e) => {
                product.setImagePopOver({
                  element: e.target,
                  data: {
                    src: JSON.parse(props.item[0].product.imageThumbnailData)[0].includes("http")
                      ? JSON.parse(props.item[0].product.imageThumbnailData)[0]
                      : `https://img.sellforyou.co.kr/sellforyou/${JSON.parse(props.item[0].product.imageThumbnailData)[0]}`,
                  },
                  open: true,
                });
              }}
            />
          </Box>
        </StyledTableCell>

        <StyledTableCell
          sx={{
            textAlign: "left",
          }}
        >
          <Box
            sx={{
              width: "400px",
            }}
          >
            <Typography noWrap fontSize={14}>
              {props.item[0].product.name}
            </Typography>
          </Box>
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.length}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A077")?.length ?? null}

          {/* <Typography
            fontSize={14}
            sx={{
              textDecoration: "underline",
            }}
            onClick={() => {
              const storeUrl = props.item.find((v) => v.siteCode === "A077")?.product_store.storeUrl ?? null;

              if (!storeUrl) {
                alert("상품 URL을 가져올 수 없습니다.");

                return;
              }

              window.open(storeUrl);
            }}
          >
            {props.item.filter((v) => v.siteCode === "A077")?.length ?? null}
          </Typography> */}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "B378")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A112")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A113")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A006")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A001")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A027")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "B719")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A524")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A525")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "B956")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A523")?.length ?? null}
        </StyledTableCell>

        <StyledTableCell
          width={50}
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            textAlign: "center",
          }}
        >
          {props.item.filter((v) => v.siteCode === "A522")?.length ?? null}
        </StyledTableCell>
      </TableRow>
    </>
  );
});
