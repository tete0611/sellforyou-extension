import React from 'react';

import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Button, Checkbox, FormControlLabel, Grid, Modal, Paper, TextField, Typography } from '@mui/material';

export const ManyTagModal = observer(() => {
    const { product } = React.useContext(AppContext);

    return <Modal open={product.modalInfo.tag} onClose={() => product.toggleManyTagModal(false)}>
        <Paper className='uploadModal' sx={{
            width: 600
        }}>
            <Typography fontSize={16} sx={{
                mb: 3
            }}>
                검색어태그 일괄설정
            </Typography>

            <Paper variant="outlined">
                <Box sx={{
                    p: 1,
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={5} sx={{
                            m: "auto"
                        }}>
                            <FormControlLabel control={<Checkbox size="small" checked={!product.manyTagInfo.immSearchTagsDisabled} onChange={(e) => {
                                product.setManyTagInfo({
                                    ...product.manyTagInfo,

                                    immSearchTagsDisabled: !e.target.checked
                                })
                            }} />} label={
                                <Typography fontSize={14}>
                                    검색어태그(스마트스토어)
                                </Typography>
                            }
                            />
                        </Grid>

                        <Grid item xs={6} md={7} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_tag_immSearchTags`}
                                disabled={product.manyTagInfo.immSearchTagsDisabled}
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
                                defaultValue={product.manyTagInfo.immSearchTags}
                                onBlur={(e) => {
                                    product.setManyTagInfo({
                                        ...product.manyTagInfo,

                                        immSearchTags: e.target.value
                                    })
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} md={5} sx={{
                            m: "auto"
                        }}>
                            <FormControlLabel control={<Checkbox size="small" checked={!product.manyTagInfo.searchTagsDisabled} onChange={(e) => {
                                product.setManyTagInfo({
                                    ...product.manyTagInfo,

                                    searchTagsDisabled: !e.target.checked
                                })
                            }} />} label={
                                <Typography fontSize={14}>
                                    검색어태그(쿠팡)
                                </Typography>
                            }
                            />
                        </Grid>

                        <Grid item xs={6} md={7} sx={{
                            m: "auto",
                            textAlign: "right"
                        }}>
                            <TextField
                                id={`modal_many_tag_searchTags`}
                                disabled={product.manyTagInfo.searchTagsDisabled}
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
                                defaultValue={product.manyTagInfo.searchTags}
                                onBlur={(e) => {
                                    product.setManyTagInfo({
                                        ...product.manyTagInfo,

                                        searchTags: e.target.value
                                    })
                                }}
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
                    product.updateManyTag();
                }}>
                    적용
                </Button>

                <Button disableElevation variant="contained" color="inherit" sx={{
                    width: "50%",
                    mx: 0.5
                }} onClick={() => { product.toggleManyTagModal(false) }}>
                    취소
                </Button>
            </Box>
        </Paper>
    </Modal>
});