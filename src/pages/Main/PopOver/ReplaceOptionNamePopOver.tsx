import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Grid, MenuItem, Popover, Select, TextField, Typography } from "@mui/material";
import { ComboBox, MyButton } from "../Common/UI";

// 옵션명 치환 팝업
export const ReplaceOptionNamePopOver = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 팝업이 닫혔을 경우 데이터를 초기화
  const onClose = () => {
    product.setReplaceOptionNamePopOver({
      ...product.popOverInfo.replaceOptionName,

      index: -1,
      element: null,
      open: false,

      data: {
        index: -1,
        find: "",
        replace: "",
      },
    });
  };

  return (
    <Popover
      open={product.popOverInfo.replaceOptionName.open}
      anchorEl={product.popOverInfo.replaceOptionName.element}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
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
                m: "auto",
              }}
            >
              <Typography fontSize={14}>적용할 옵션명</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: "auto",
              }}
            >
              <ComboBox
                sx={{
                  width: "100%",
                }}
                value={product.popOverInfo.replaceOptionName.data.index}
                onChange={(e) => {
                  product.setReplaceOptionNamePopOver({
                    ...product.popOverInfo.replaceOptionName,

                    data: {
                      ...product.popOverInfo.replaceOptionName.data,

                      index: e.target.value,
                    },
                  });
                }}
              >
                <MenuItem value={-1}>{"<모든 옵션명>"}</MenuItem>

                {product.popOverInfo.replaceOptionName.index > -1
                  ? product.itemInfo.items[product.popOverInfo.replaceOptionName.index].productOptionName.map((v: any, i: number) => (
                      <MenuItem value={i}>{v.name}</MenuItem>
                    ))
                  : null}
              </ComboBox>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: "auto",
              }}
            >
              <Typography fontSize={14}>검색할 키워드</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: "auto",
              }}
            >
              <TextField
                id={"replace_option_name_find"}
                placeholder={"콤마(,)입력 시 구분자적용"}
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
                onBlur={(e) => {
                  product.setReplaceOptionNamePopOver({
                    ...product.popOverInfo.replaceOptionName,

                    data: {
                      ...product.popOverInfo.replaceOptionName.data,

                      find: e.target.value,
                    },
                  });
                }}
              />
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: "auto",
              }}
            >
              <Typography fontSize={14}>변경할 키워드</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                m: "auto",
              }}
            >
              <TextField
                id={"replace_option_name_replace"}
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
                onBlur={(e) => {
                  product.setReplaceOptionNamePopOver({
                    ...product.popOverInfo.replaceOptionName,

                    data: {
                      ...product.popOverInfo.replaceOptionName.data,

                      replace: e.target.value,
                    },
                  });
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <MyButton
            color="info"
            sx={{
              width: 100,
            }}
            onClick={async () => {
              const index = product.popOverInfo.replaceOptionName.index;
              const find = product.popOverInfo.replaceOptionName.data.find;
              const replace = product.popOverInfo.replaceOptionName.data.replace ? product.popOverInfo.replaceOptionName.data.replace : "";

              if (!find) {
                alert("검색할 키워드를 입력해주세요.");

                return;
              }

              const productOptionName = product.itemInfo.items[index].productOptionName;

              for (let i = 0; i < productOptionName.length; i++) {
                if (product.popOverInfo.replaceOptionName.data.index !== -1 && product.popOverInfo.replaceOptionName.data.index !== i) {
                  continue;
                }

                // product.manyNameInfo.findMany.split(",").map((w: any, i: number) => {
                //   let pattern = new RegExp(w, "g");

                //   type1Name =
                //     i === 0
                //       ? v.name.replaceAll(w, product.manyNameInfo.replaceMany).replace(/  +/g, " ")
                //       : type1Name.replace(pattern, product.manyNameInfo.replaceMany).replace(/  +/g, " ");
                // });

                await product.setProductOptionValue(
                  productOptionName[i].productOptionValue.map((v: any) => {
                    //작업중
                    let name = v.name;
                    if (find.includes(",")) {
                      find.split(",").map((w: any) => {
                        let pattern = new RegExp(w, "g");
                        name = name.replace(pattern, replace).replace(/  +/g, " ");
                        console.log("name", name);
                      });
                    } else {
                      name = name.replaceAll(find, replace).replace(/  +/g, " ");
                    }
                    //까지
                    return {
                      ...v,
                      // name: v.name.replaceAll(find, replace).replace(/  +/g, " "),
                      name: name,
                    };
                  }),
                  index,
                  i,
                  null
                );

                await product.updateProductOptionValue(
                  common,
                  index,
                  i,
                  productOptionName[i].productOptionValue.map((v: any) => v.id)
                );
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
