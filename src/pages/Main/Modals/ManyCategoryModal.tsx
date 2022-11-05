import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Grid, Modal, Paper, Typography } from '@mui/material';
import { Search } from "../Common/UI";

export const ManyCategoryModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.category} onClose={() => product.toggleManyCategoryModal(false)}>
        <Paper className='uploadModal' sx={{
            width: 600
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                카테고리 일괄설정
            </Typography>

            <Paper variant="outlined" sx={{
                mb: 1
            }}>
                <Box sx={{
                    p: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <img src="/resources/icon-smartstore.png" />

                                <Typography fontSize={14} sx={{
                                    ml: 1
                                }}>
                                    자동매칭
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA077}
                                onChange={(e: any, value: any) => {
                                    product.updateManyCategoryAuto(value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A077", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A077').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A077').data : [product.manyCategoryInfo.categoryInfoA077]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A077") }}
                                onClose={() => { product.setCategoryInput("A077", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A077').loading}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-smartstore.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA077}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A077", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A077", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A077').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A077').data : [product.manyCategoryInfo.categoryInfoA077]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A077") }}
                                onClose={() => { product.setCategoryInput("A077", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A077').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-coupang.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoB378}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("B378", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("B378", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'B378').input ? product.categoryInfo.markets.find((v: any) => v.code === 'B378').data : [product.manyCategoryInfo.categoryInfoB378]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("B378") }}
                                onClose={() => { product.setCategoryInput("B378", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'B378').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-street-global.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA112}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A112", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A112", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A112').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A112').data : [product.manyCategoryInfo.categoryInfoA112]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A112") }}
                                onClose={() => { product.setCategoryInput("A112", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A112').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-street-normal.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA113}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A113", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A113", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A113').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A113').data : [product.manyCategoryInfo.categoryInfoA113]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A113") }}
                                onClose={() => { product.setCategoryInput("A113", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A113').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-gmarket.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA006}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A006", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A006", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A006').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A006').data : [product.manyCategoryInfo.categoryInfoA006]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A006") }}
                                onClose={() => { product.setCategoryInput("A006", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A006').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-auction.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA001}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A001", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A001", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A001').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A001').data : [product.manyCategoryInfo.categoryInfoA001]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A001") }}
                                onClose={() => { product.setCategoryInput("A001", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A001').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-interpark.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA027}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A027", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A027", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A027').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A027').data : [product.manyCategoryInfo.categoryInfoA027]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A027") }}
                                onClose={() => { product.setCategoryInput("A027", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A027').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-wemakeprice.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoB719}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("B719", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("B719", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'B719').input ? product.categoryInfo.markets.find((v: any) => v.code === 'B719').data : [product.manyCategoryInfo.categoryInfoB719]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("B719") }}
                                onClose={() => { product.setCategoryInput("B719", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'B719').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-lotteon-global.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA524}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A524", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A524", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A524').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A524').data : [product.manyCategoryInfo.categoryInfoA524]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A524") }}
                                onClose={() => { product.setCategoryInput("A524", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A524').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-lotteon-normal.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoA525}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("A525", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("A525", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'A525').input ? product.categoryInfo.markets.find((v: any) => v.code === 'A525').data : [product.manyCategoryInfo.categoryInfoA525]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("A525") }}
                                onClose={() => { product.setCategoryInput("A525", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'A525').loading}
                            />
                        </Grid>

                        <Grid item xs={6} md={3} sx={{
                            m: "auto"
                        }}>
                            <img src="/resources/icon-tmon.png" />
                        </Grid>

                        <Grid item xs={6} md={9} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <Search
                                value={product.manyCategoryInfo.categoryInfoB956}
                                onChange={(e: any, value: any) => {
                                    product.setManyCategory("B956", value);
                                }}
                                onInputChange={(e, value, reason) => {
                                    if (reason !== 'input') {
                                        return;
                                    }

                                    product.setCategoryInput("B956", value);
                                }}
                                options={product.categoryInfo.markets.find((v: any) => v.code === 'B956').input ? product.categoryInfo.markets.find((v: any) => v.code === 'B956').data : [product.manyCategoryInfo.categoryInfoB956]}
                                getOptionLabel={(option: any) => option.name ?? ""}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                onOpen={async () => { product.getCategoryList("B956") }}
                                onClose={() => { product.setCategoryInput("B956", "") }}
                                loading={product.categoryInfo.markets.find((v: any) => v.code === 'B956').loading}
                            />
                        </Grid>
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
                }} onClick={() => {
                    product.updateManyCategory(null);
                }}>
                    적용
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={() => { product.toggleManyCategoryModal(false) }}>
                    취소
                </Button>
            </Box>
        </Paper>
    </Modal>
});