import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import BlotFormatter from 'quill-blot-formatter';

import { ImageDrop } from "quill-image-drop-module";
import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Modal, Paper } from '@mui/material';
import { readFileDataURL } from '../../Tools/Common';

import 'react-quill/dist/quill.snow.css';

const quill_align = Quill.import('attributors/style/align');
const quill_font = Quill.import('attributors/style/font');
const quill_size = Quill.import("attributors/style/size");

quill_align.whitelist = ['left', 'center', 'right', 'justify'];
quill_font.whitelist = ["Sans-Serif", "Serif", "Monospace"];
quill_size.whitelist = ['10px', '12px', '16px', '20px', '28px', '36px', '44px'];

Quill.register(quill_align, true);
Quill.register(quill_font, true);
Quill.register(quill_size, true);

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/ImageDrop', ImageDrop);

const colors = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

export const DescriptionModal = observer(() => {
    const quillRef = React.useRef<ReactQuill>(null);

    const { product } = React.useContext(AppContext);

    const [description, setDescription] = React.useState<string>("");

    const imageHandler = () => {
        const range = quillRef.current?.getEditor().getSelection()?.index;

        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("multiple", "true");
        input.setAttribute("accept", "image/jpeg, image/png, image/gif, image/bmp");

        input.click();

        input.addEventListener('change', async function (e: any) {
            var files = e.target.files;

            for (var i = 0; i < files.length; i++) {
                try {
                    var image = await readFileDataURL(files[files.length - (i + 1)]);

                    if (range !== null && range !== undefined) {
                        let quill = quillRef.current?.getEditor();

                        quill?.setSelection(range, 1);
                        quill?.clipboard.dangerouslyPasteHTML(range, `<img src=${image} alt="" />`);
                    };
                } catch (e) {
                    continue;
                }
            }
        });
    }

    const modules = React.useMemo(() => ({
        blotFormatter: {
            overlay: {
                style: {
                    border: '2px solid #1976d2'
                }
            }
        },

        clipboard: {
            matchVisual: false
        },

        toolbar: {
            container: "#toolbar",

            handlers: {
                image: imageHandler,
            },
        },

        ImageDrop: true
    }), []);

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "font",
        "size",
        "color",
        "background",
        "link",
        "image",
        "align",
    ];

    return <Modal
        open={product.modalInfo.description}
        onClose={() => {
            if (description) {
                product.setDescription(description, product.itemInfo.current);

                product.updateDescription(product.itemInfo.current);
                product.updateDescriptionImages(product.itemInfo.current);
            }

            product.toggleDescriptionModal(false, 0);

            setDescription("");
        }}
    >
        <Paper className='uploadModal'>
            <div id="toolbar">
                <select className="ql-font" defaultValue={"Sans-Serif"} onChange={e => e.persist()}>
                    <option value="Sans-Serif" selected>San-Serif</option>
                    <option value="Serif">Serif</option>
                    <option value="Monospace">Monospace</option>
                </select>

                <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                    <option value="1">
                        H1
                    </option>

                    <option value="2">
                        H2
                    </option>

                    <option value="3">
                        H3
                    </option>

                    <option value="" selected>
                        기본
                    </option>
                </select>

                <select className="ql-size" defaultValue={"12px"} onChange={e => e.persist()}>
                    <option value="10px">10px</option>
                    <option value="12px" selected>12px</option>
                    <option value="16px">16px</option>
                    <option value="20px">20px</option>
                    <option value="28px">28px</option>
                    <option value="36px">36px</option>
                    <option value="44px">44px</option>
                </select>

                <select className="ql-align" />

                <select className="ql-color">
                    {colors.map((v) => {
                        return (
                            <option value={v} />
                        )
                    })}
                </select>

                <select className="ql-background">
                    {colors.map((v) => {
                        return (
                            <option value={v} />
                        )
                    })}
                </select>

                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-stroke" />

                <button className="ql-link" />
                <button className="ql-image" />
            </div>

            <Box className="parent-scroll" sx={{
                width: "800px",
                height: "90vh",
                overflowY: "auto"
            }}>
                <ReactQuill
                    scrollingContainer=".parent-scroll"
                    ref={quillRef}
                    defaultValue={product.itemInfo.items[product.itemInfo.current]?.description}
                    modules={modules}
                    formats={formats}
                    onChange={(html) => {
                        setDescription(html);
                    }}
                />
            </Box>
        </Paper>
    </Modal>
});