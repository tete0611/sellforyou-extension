import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Modal, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';

export const ManyNameModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.name} onClose={() => product.toggleManyNameModal(false)}>
        <Paper className='uploadModal' sx={{
            width: 600
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                상품명 일괄설정
            </Typography>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <FormControl sx={{
                        mb: 1
                    }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => {
                                product.setManyNameInfo({
                                    ...product.manyNameInfo,

                                    type: e.target.value
                                })
                            }}
                            value={product.manyNameInfo.type}
                        >
                            <FormControlLabel value="1" control={<Radio size="small" />} label={
                                <Typography fontSize={14}>
                                    일괄설정
                                </Typography>
                            } />

                            <FormControlLabel value="2" control={<Radio size="small" />} label={
                                <Typography fontSize={14}>
                                    키워드추가
                                </Typography>
                            } />

                            <FormControlLabel value="3" control={<Radio size="small" />} label={
                                <Typography fontSize={14}>
                                    키워드변경
                                </Typography>
                            } />
                        </RadioGroup>
                    </FormControl>

                    <Grid container spacing={1}>
                        {product.manyNameInfo.type === "1" ?
                            <>
                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={14}>
                                        상품명
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <TextField
                                        id={`modal_many_name_body`}
                                        variant='outlined'
                                        sx={{
                                            width: "100%",
                                        }}
                                        inputProps={{
                                            style: {
                                                fontSize: 14,
                                                padding: 5,
                                            }
                                        }}
                                        defaultValue={product.manyNameInfo.body}
                                        onBlur={(e) => {
                                            product.setManyNameInfo({
                                                ...product.manyNameInfo,

                                                body: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                            </>
                            :
                            null
                        }

                        {product.manyNameInfo.type === "2" ?
                            <>
                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={14}>
                                        키워드추가(앞)
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <TextField
                                        id={`modal_many_name_head`}
                                        variant='outlined'
                                        sx={{
                                            width: "100%",
                                        }}
                                        inputProps={{
                                            style: {
                                                fontSize: 14,
                                                padding: 5,
                                            }
                                        }}
                                        defaultValue={product.manyNameInfo.head}
                                        onBlur={(e) => {
                                            product.setManyNameInfo({
                                                ...product.manyNameInfo,

                                                head: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={14}>
                                        키워드추가(뒤)
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <TextField
                                        id={`modal_many_name_tail`}
                                        variant='outlined'
                                        sx={{
                                            width: "100%",
                                        }}
                                        inputProps={{
                                            style: {
                                                fontSize: 14,
                                                padding: 5,
                                            }
                                        }}
                                        defaultValue={product.manyNameInfo.tail}
                                        onBlur={(e) => {
                                            product.setManyNameInfo({
                                                ...product.manyNameInfo,

                                                tail: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                            </>
                            :
                            null
                        }

                        {product.manyNameInfo.type === "3" ?
                            <>
                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={14}>
                                        검색할 키워드
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <TextField
                                        id={`modal_many_name_find`}
                                        variant='outlined'
                                        sx={{
                                            width: "100%",
                                        }}
                                        inputProps={{
                                            style: {
                                                fontSize: 14,
                                                padding: 5,
                                            }
                                        }}
                                        defaultValue={product.manyNameInfo.find}
                                        onBlur={(e) => {
                                            product.setManyNameInfo({
                                                ...product.manyNameInfo,

                                                find: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6} md={4} sx={{
                                    m: "auto"
                                }}>
                                    <Typography fontSize={14}>
                                        변경할 키워드
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={8} sx={{
                                    m: "auto",
                                    textAlign: "right"
                                }}>
                                    <TextField
                                        id={`modal_many_name_replace`}
                                        variant='outlined'
                                        sx={{
                                            width: "100%",
                                        }}
                                        inputProps={{
                                            style: {
                                                fontSize: 14,
                                                padding: 5,
                                            }
                                        }}
                                        defaultValue={product.manyNameInfo.replace}
                                        onBlur={(e) => {
                                            product.setManyNameInfo({
                                                ...product.manyNameInfo,

                                                replace: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                            </>
                            :
                            null
                        }
                    </Grid>
                </Box>
            </Paper>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3
            }}>
                <Button disableElevation variant="contained" color="info" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={async () => {
                    switch (product.manyNameInfo.type) {
                        case "1": {
                            product.updateManyName({
                                head: "",
                                body: product.manyNameInfo.body,
                                tail: ""
                            });

                            break;
                        }

                        case "2": {
                            product.updateManyName({
                                head: product.manyNameInfo.head,
                                body: "",
                                tail: product.manyNameInfo.tail
                            });

                            break;
                        }

                        case "3": {
                            const data = await Promise.all(product.itemInfo.items.map(async (v: any, i: number) => {
                                if (!v.checked) {
                                    return null;
                                }

                                const name = v.name.replaceAll(product.manyNameInfo.find, product.manyNameInfo.replace);

                                return {
                                    productIds: v.id,
                                    name
                                };
                            }));

                            await product.updateMultipleProductName(data);

                            break;
                        }
                    }
                }}>
                    적용
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={() => { product.toggleManyNameModal(false) }}>
                    취소
                </Button>
            </Box>
        </Paper>
    </Modal>
});