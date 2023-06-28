import React from "react";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";

import { DeleteAction, ResizeAction, ImageSpec } from "quill-blot-formatter";
import { ImageDrop } from "quill-image-drop-module";
import { observer } from "mobx-react";
import { AppContext } from "../../../containers/AppContext";
import { Box, Modal, Paper, Typography } from "@mui/material";
import { readFileDataURL } from "../../Tools/Common";
import { MyButton } from "../Common/UI";

// 에디터 스타일 설정
import "react-quill/dist/quill.snow.css";

// 에디터 이미지 삭제/리사이징 플러그인
class CustomImageSpec extends ImageSpec {
  getActions() {
    return [DeleteAction, ResizeAction];
  }
}

// 에디터 텍스트 정렬, 폰트, 사이즈 커스터마이징 허용
const quill_align = Quill.import("attributors/style/align");
const quill_font = Quill.import("attributors/style/font");
const quill_size = Quill.import("attributors/style/size");

// 실제 커스터마이징한 값
quill_align.whitelist = ["left", "center", "right", "justify"];
quill_font.whitelist = ["Sans-Serif", "Serif", "Monospace"];
quill_size.whitelist = ["10px", "12px", "16px", "20px", "28px", "36px", "44px"];

// 커스마이징 값 적용
Quill.register(quill_align, true);
Quill.register(quill_font, true);
Quill.register(quill_size, true);

// 이미지 플러그인 적용
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/ImageDrop", ImageDrop);

// 텍스트/배경 색상 변경 시 선택 가능한 리스트
const colors = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];

export const DescriptionModal = observer(() => {
  // 엘리먼트 상태 저장
  const quillRef = React.useRef<ReactQuill>(null);

  // MobX 스토리지 로드
  const { common, product } = React.useContext(AppContext);

  // 에디터 내용이 바뀌면
  const descriptionHandler = (html) => {
    if (product.itemInfo.current > -1) {
      product.setDescription(html, product.itemInfo.current);
    } else {
      product.setManyDescriptionInfo({
        html,
      });
    }
  };

  // 이미지 단일/다중 업로드 시 동작
  const imageHandler = () => {
    const range = quillRef.current?.getEditor().getSelection()?.index;

    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("multiple", "true");
    input.setAttribute("accept", "image/jpeg, image/png, image/gif, image/bmp");

    input.click();

    input.addEventListener("change", async function (e: any) {
      var files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        try {
          var image = await readFileDataURL(files[files.length - (i + 1)]);

          if (range !== null && range !== undefined) {
            let quill = quillRef.current?.getEditor();

            quill?.setSelection(range, 1);
            quill?.clipboard.dangerouslyPasteHTML(range, `<img src=${image} alt="" />`);
          }
        } catch (e) {
          continue;
        }
      }
    });
  };

  // 에디터 환경설정
  const modules = React.useMemo(
    () => ({
      blotFormatter: {
        specs: [CustomImageSpec],
        overlay: {
          style: {
            border: "2px solid #1976d2",
          },
        },
      },

      clipboard: {
        matchVisual: false,
      },

      toolbar: {
        container: "#toolbar",

        handlers: {
          image: imageHandler,
        },
      },

      ImageDrop: true,
    }),
    []
  );

  // 에디터에 포함시킬 기능들
  // header: h1, h2, h3 사이즈
  // bold: 굵게
  // italic: 기울임
  // underline: 밑줄
  // strike: 가운데줄
  // font: 텍스트 폰트
  // size: 텍스트 크기
  // color: 텍스트 색
  // background: 텍스트 배경색
  // link: 링크 걸기
  // image: 이미지 업로드
  // align: 텍스트 정렬
  const formats = ["header", "bold", "italic", "underline", "strike", "font", "size", "color", "background", "link", "image", "align"];

  // 상세페이지 모달
  return (
    <Modal
      open={product.modalInfo.description}
      onClose={() => {
        if (product.itemInfo.current > -1) {
          // product.updateDescription(product.itemInfo.current);
          product.updateDescriptionImages(product.itemInfo.current);
        }

        product.toggleDescriptionModal(false, 0);
      }}
    >
      <Paper className="uploadModal">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography fontSize={16}>{product.itemInfo.current > -1 ? "상세설명 에디터" : "상세설명 일괄추가(앞)"}</Typography>

          {product.itemInfo.current > -1 ? null : (
            <Box>
              <MyButton
                color="info"
                sx={{
                  minWidth: 60,
                }}
                onClick={() => {
                  product.updateManyDescription(common);
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
                  product.toggleDescriptionModal(false, 0);
                }}
              >
                취소
              </MyButton>
            </Box>
          )}
        </Box>

        <div id="toolbar">
          <select className="ql-font" defaultValue={"Sans-Serif"} onChange={(e) => e.persist()}>
            <option value="Sans-Serif" selected>
              San-Serif
            </option>
            <option value="Serif">Serif</option>
            <option value="Monospace">Monospace</option>
          </select>

          <select className="ql-header" defaultValue={""} onChange={(e) => e.persist()}>
            <option value="1">H1</option>

            <option value="2">H2</option>

            <option value="3">H3</option>

            <option value="" selected>
              기본
            </option>
          </select>

          <select className="ql-size" defaultValue={"12px"} onChange={(e) => e.persist()}>
            <option value="10px">10px</option>
            <option value="12px" selected>
              12px
            </option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="28px">28px</option>
            <option value="36px">36px</option>
            <option value="44px">44px</option>
          </select>

          <select className="ql-align" />

          <select className="ql-color">
            {colors.map((v) => {
              return <option value={v} />;
            })}
          </select>

          <select className="ql-background">
            {colors.map((v) => {
              return <option value={v} />;
            })}
          </select>

          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-stroke" />

          <button className="ql-link" />
          <button className="ql-image" />
        </div>

        <Box
          className="parent-scroll"
          sx={{
            width: "800px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <ReactQuill
            placeholder="상품 상세설명 입력"
            scrollingContainer=".parent-scroll"
            ref={quillRef}
            defaultValue={product.itemInfo.current > -1 ? product.itemInfo.items[product.itemInfo.current]?.description : product.manyDescriptionInfo.html}
            modules={modules}
            formats={formats}
            onChange={(html) => {
              descriptionHandler(html);
            }}
          />
        </Box>
      </Paper>
    </Modal>
  );
});
