import React from "react";

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, FormControl, FormControlLabel, Grid, Modal, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { MyButton } from "../Common/UI";

// 상품명 일괄설정 모달 뷰
export const ManyNameModal = observer(() => {
  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  return (
    <Modal open={product.modalInfo.name} onClose={() => product.toggleManyNameModal(false)}>
      <Paper
        className="uploadModal"
        sx={{
          width: 600,
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
          <Typography fontSize={16}>상품명 일괄설정</Typography>

          <Box>
            <MyButton
              color="info"
              sx={{
                minWidth: 60,
              }}
              onClick={async () => {
                switch (product.manyNameInfo.type) {
                  case "1": {
                    product.updateManyName(common, {
                      head: "",
                      body: product.manyNameInfo.body,
                      tail: "",
                    });

                    break;
                  }

                  case "2": {
                    product.updateManyName(common, {
                      head: product.manyNameInfo.head,
                      body: "",
                      tail: product.manyNameInfo.tail,
                    });

                    break;
                  }

                  case "3": {
                    const data = await Promise.all(
                      product.itemInfo.items.map((v: any, i: number) => {
                        if (!v.checked) {
                          return null;
                        }

                        const name = v.name.replaceAll(product.manyNameInfo.find, product.manyNameInfo.replace).replace(/  +/g, " ");

                        return {
                          productIds: v.id,
                          name,
                        };
                      })
                    );

                    await product.updateMultipleProductName(common, data);

                    break;
                  }

                  case "4": {
                    const data = await Promise.all(
                      product.itemInfo.items.map(async (v: any, i: number) => {
                        if (!v.checked) {
                          return null;
                        }
                        let type1Name: any;

                        product.manyNameInfo.findMany.split(",").map((w: any, i: number) => {
                          let pattern = new RegExp(w, "g");

                          type1Name =
                            i === 0
                              ? v.name.replaceAll(w, product.manyNameInfo.replaceMany).replace(/  +/g, " ")
                              : type1Name.replace(pattern, product.manyNameInfo.replaceMany).replace(/  +/g, " ");
                        });

                        return {
                          productIds: v.id,
                          name: type1Name,
                        };
                      })
                    );

                    await product.updateMultipleProductName(common, data);

                    break;
                  }
                  case "5": {
                    function shuffle(array: any) {
                      var m = array.length,
                        t,
                        i;
                      // While there remain elements to shuffle…
                      while (m) {
                        // Pick a remaining element…
                        i = Math.floor(Math.random() * m--);
                        // And swap it with the current element.
                        t = array[m];
                        array[m] = array[i];
                        array[i] = t;
                      }
                      return array;
                    }

                    const data = await Promise.all(
                      product.itemInfo.items.map(async (v: any, i: number) => {
                        if (!v.checked) {
                          return null;
                        }
                        let type1Name: any;

                        let data2 = shuffle(product.manyNameInfo.keward.split(","));
                        type1Name = data2.slice(0, 10).join(" ");
                        return {
                          productIds: v.id,
                          name: type1Name,
                        };
                      })
                    );

                    await product.updateMultipleProductName(common, data);
                    break;
                  }
                }
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
                product.toggleManyNameModal(false);
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
            <FormControl
              sx={{
                mb: 1,
              }}
            >
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(e) => {
                  product.setManyNameInfo({
                    ...product.manyNameInfo,

                    type: e.target.value,
                  });
                }}
                value={product.manyNameInfo.type}
              >
                <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography fontSize={14}>일괄설정</Typography>} />

                <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography fontSize={14}>키워드추가</Typography>} />

                <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography fontSize={14}>단일키워드변경</Typography>} />

                <FormControlLabel value="4" control={<Radio size="small" />} label={<Typography fontSize={14}>복수키워드변경</Typography>} />

                <FormControlLabel value="5" control={<Radio size="small" />} label={<Typography fontSize={14}>키워드조합</Typography>} />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={1}>
              {product.manyNameInfo.type === "1" ? (
                <>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: "auto",
                    }}
                  >
                    <Typography fontSize={14}>상품명</Typography>
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
                      id={`modal_many_name_body`}
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
                      defaultValue={product.manyNameInfo.body}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          body: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}

              {product.manyNameInfo.type === "2" ? (
                <>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: "auto",
                    }}
                  >
                    <Typography fontSize={14}>키워드추가(앞)</Typography>
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
                      id={`modal_many_name_head`}
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
                      defaultValue={product.manyNameInfo.head}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          head: e.target.value,
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
                    <Typography fontSize={14}>키워드추가(뒤)</Typography>
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
                      id={`modal_many_name_tail`}
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
                      defaultValue={product.manyNameInfo.tail}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          tail: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}

              {product.manyNameInfo.type === "3" ? (
                <>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: "auto",
                    }}
                  >
                    <Typography fontSize={14}>검색할 키워드</Typography>
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
                      id={`modal_many_name_find`}
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
                      defaultValue={product.manyNameInfo.find}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          find: e.target.value,
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
                    <Typography fontSize={14}>변경할 키워드</Typography>
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
                      id={`modal_many_name_replace`}
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
                      defaultValue={product.manyNameInfo.replace}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          replace: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}

              {product.manyNameInfo.type === "4" ? (
                <>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: "auto",
                    }}
                  >
                    <Typography fontSize={14}>검색할 키워드</Typography>
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
                      id={`modal_many_name_findMany`}
                      placeholder={"콤마(,)로 구분하여 입력"}
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
                      defaultValue={product.manyNameInfo.findMany}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          findMany: e.target.value,
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
                    <Typography fontSize={14}>변경할 키워드</Typography>
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
                      id={`modal_many_name_replace`}
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
                      defaultValue={product.manyNameInfo.replaceMany}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          replaceMany: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}
              {product.manyNameInfo.type === "5" ? (
                <>
                  <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                      m: "auto",
                    }}
                  >
                    <Typography fontSize={14}>키워드</Typography>
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
                      id={`keward`}
                      placeholder={"콤마(,)로 구분하여 입력"}
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
                      defaultValue={product.manyNameInfo.keward}
                      onBlur={(e) => {
                        product.setManyNameInfo({
                          ...product.manyNameInfo,

                          keward: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
          </Box>
        </Paper>
      </Paper>
    </Modal>
  );
});
