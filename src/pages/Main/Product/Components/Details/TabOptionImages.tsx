import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';

import { observer } from "mobx-react";
import { readFileDataURL } from '../../../../Tools/Common';
import { AppContext } from "../../../../../containers/AppContext";
import { Box, IconButton, ImageList, ImageListItem, Typography, Button, Paper } from "@mui/material";
import { Image } from "../../../Common/UI";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    defaultBox: {
        background: "#d1e8ff",
    },

    defaultPaper: {
        border: "1px solid #d1e8ff"
    },

    errorBox: {
        background: "#ffd1d1",
    },

    errorPaper: {
        border: "1px solid #ffd1d1"
    }
}));

export const TabOptionImages = observer((props: any) => {
    const { product } = React.useContext(AppContext);

    const classes = useStyles();

    return <>
        <Paper className={props.item.optionImageError ? classes.errorPaper : classes.defaultPaper} variant="outlined">
            <Box className={props.item.optionImageError ? classes.errorBox : classes.defaultBox} sx={{
                background: "#d1e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                px: 1,
                py: 0.5
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    이미지목록

                    {props.item.optionImageError ?
                        <>
                            <ErrorIcon color="error" sx={{
                                fontSize: 18,
                                mx: 0.5
                            }} />

                            <Box sx={{
                                position: "relative"
                            }}>
                                <Paper sx={{
                                    top: 0,
                                    color: "red",

                                    p: 1,
                                    position: "absolute",

                                    left: 0,
                                    textAlign: "left",

                                    width: 200,

                                    zIndex: 100
                                }}>
                                    JPG/PNG 형식이 아닌 이미지가 있습니다.
                                </Paper>
                            </Box>
                        </>
                        :
                        null
                    }
                </Box>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Button disableElevation variant="contained" color="info" sx={{
                        fontSize: 13,
                        height: 26
                    }} onClick={() => {
                        window.open(chrome.runtime.getURL(`/trangers_multiple.html?id=${props.item.id}&type=2`))
                    }}>
                        전체 이미지 편집/번역
                    </Button>

                    <Button disableElevation variant="contained" color="error" sx={{
                        ml: 0.5,
                        fontSize: 13,
                        height: 26
                    }} onClick={() => {
                        product.initProductOptionImage(props.item.id, props.index);
                    }}>
                        이미지 복구
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                height: 381,
                overflowY: "auto",
                p: 0.5,
            }}>
                {props.item.productOptionName.map((v: any, nameIndex: number) => <Paper sx={{
                    mb: 0.5
                }} variant="outlined">
                    <Box sx={{
                        background: "whitesmoke",
                        display: "flex",
                        alignItems: "center",
                        fontSize: 13,
                        p: 1,
                    }}>
                        {v.name}
                    </Box>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 1,
                    }}>
                        <ImageList sx={{
                            width: 1208,
                            m: 0
                        }} cols={5}>
                            {v.productOptionValue.map((w: any, valueIndex: number) => <ImageListItem key={`image-${nameIndex}-${valueIndex}`}>
                                <Paper className={props.item.imageCheckList && props.item.imageCheckList[w.image] ? classes.errorPaper : classes.defaultPaper} variant="outlined">
                                    <Box className={props.item.imageCheckList && props.item.imageCheckList[w.image] ? classes.errorBox : classes.defaultBox} sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        p: 0.5,
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            <Typography noWrap fontSize={13} sx={{
                                                textAlign: "left",
                                                width: 200
                                            }}>
                                                {w.name}
                                            </Typography>

                                            {props.item.imageCheckList && props.item.imageCheckList[w.image] ?
                                                <ErrorIcon color="error" sx={{
                                                    fontSize: 18,
                                                    mx: 0.5
                                                }} />
                                                :
                                                null
                                            }
                                        </Box>

                                        <IconButton color="error" sx={{
                                            p: 0
                                        }}
                                            size="small"
                                            onClick={() => {
                                                product.updateProductOptionImage({
                                                    ...w,

                                                    image: "",
                                                }, props.index, nameIndex, valueIndex, "");
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{
                                        p: 0.5,
                                        height: 225
                                    }}>
                                        {w.image ?
                                            <Image src={w.image} alt={w.name} width={225} height={225} style={{
                                                objectFit: "contain"
                                            }}
                                                onClick={(e) => {
                                                    product.setImagePopOver({
                                                        element: e.target,
                                                        data: { src: w.image },
                                                        open: true
                                                    });
                                                }} />
                                            :
                                            <label htmlFor={`addOptionImage-${nameIndex}-${valueIndex}`}>
                                                <input accept="image/*" id={`addOptionImage-${nameIndex}-${valueIndex}`} type="file" style={{
                                                    display: "none"
                                                }} onChange={async (e) => {
                                                    const fileList = e.target.files ?? [];
                                                    const fileData = await readFileDataURL(fileList[0]);

                                                    product.updateProductOptionImage({
                                                        ...w,

                                                        newImage: fileList[0]
                                                    }, props.index, nameIndex, valueIndex, fileData);
                                                }} />

                                                <IconButton component="span" sx={{
                                                    p: 0,
                                                    width: 225,
                                                    height: 225
                                                }} >
                                                    <AddIcon />
                                                </IconButton>
                                            </label>
                                        }
                                    </Box>

                                    <Box sx={{
                                        background: "whitesmoke",
                                        display: "flex",
                                        alignItems: "center",

                                        p: 0.5
                                    }}>
                                        <Button disabled={!w.image} disableElevation variant="contained" color="info" sx={{
                                            fontSize: 13,
                                            width: "100%",
                                            height: 26
                                        }} onClick={() => {
                                            window.open(chrome.runtime.getURL(`/trangers_single.html?id=${props.item.id}&type=2&index=${valueIndex}`))
                                        }}>
                                            이미지 편집/번역
                                        </Button>
                                    </Box>
                                </Paper>
                            </ImageListItem>
                            )}
                        </ImageList>
                    </Box>
                </Paper>
                )}
            </Box>
        </Paper>
    </>
})