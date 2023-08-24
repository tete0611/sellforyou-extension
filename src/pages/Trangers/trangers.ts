import CryptoJS from 'crypto-js';
import { fabric } from 'fabric';

import gql from '../Main/GraphQL/Requests';
import { createTabCompletely, getLocalStorage, sendTabMessage } from '../Tools/ChromeAsync';
import { floatingToast, getClock, readFileDataURL, sleep } from '../Tools/Common';
import { fi } from 'date-fns/locale';

const ENDPOINT_IMAGE = 'https://img.sellforyou.co.kr';
const FLASK_URL = 'http://www.sellforyou.co.kr:5003/trangers/';
let papagoApiKey = '';

/** 크롬스토리지 파파고 키 가져오기 */
getLocalStorage('ppgKey').then((apiKey) => {
	if (apiKey) papagoApiKey = apiKey as string;
});

let applyWaterMarkText: any = document.getElementById('applyWaterMarkText');
let applyWaterMarkOpacity: any = document.getElementById('applyWaterMarkOpacity');
let applyOriginWidthPC: any = document.getElementById('applyOriginWidthPC');
let originWidthPC: any = document.getElementById('originWidthPC');
let applyOriginWidthThumbnail: any = document.getElementById('applyOriginWidthThumbnail');
let originWidthThumbnail: any = document.getElementById('originWidthThumbnail');
let applyOriginWidthOption: any = document.getElementById('applyOriginWidthOption');
let originWidthOption: any = document.getElementById('originWidthOption');
let applyOriginWidthDescription: any = document.getElementById('applyOriginWidthDescription');
let originWidthDescription: any = document.getElementById('originWidthDescription');
let applySensitive: any = document.getElementById('applySensitive');
let previewSize: any = document.getElementById('previewSize');
let startRegion: any = document.getElementById('startRegion');
let endRegion: any = document.getElementById('endRegion');
let toolTextBold: any = document.getElementById('toolTextBold');
let toolTextFont: any = document.getElementById('toolTextFont');
let toolTextSize: any = document.getElementById('toolTextSize');
let toolTextItalic: any = document.getElementById('toolTextItalic');
let toolTextLineThrough: any = document.getElementById('toolTextLineThrough');
let toolTextUnderLine: any = document.getElementById('toolTextUnderLine');
let imageList: any = document.getElementById('imageList');
let headerSub: any = document.getElementById('headerSub');
let floatingTextTool: any = document.getElementById('floatingTextTool');
let floatingShapeTool: any = document.getElementById('floatingShapeTool');
let textOriginal: any = document.getElementById('textOriginal');
let textTranslated: any = document.getElementById('textTranslated');
let toolTextColor: any = document.getElementById('toolTextColor');
let toolTextBackground: any = document.getElementById('toolTextBackground');
let toolShapeOutlineColor: any = document.getElementById('toolShapeOutlineColor');
let toolShapeBackground: any = document.getElementById('toolShapeBackground');
let toolShapeStrokeWidth: any = document.getElementById('toolShapeStrokeWidth');
let loading: any = document.getElementById('loading');
let areaRemove: any = document.getElementById('areaRemove');
let areaRecovery: any = document.getElementById('areaRecovery');
let areaRemoveSelect: any = document.getElementById('areaRemoveSelect');
let areaRecoverySelect: any = document.getElementById('areaRecoverySelect');
let mainCrop: any = document.getElementById('mainCrop');
let mainTextEditor: any = document.getElementById('mainTextEditor');
let mainWaterMark: any = document.getElementById('mainWaterMark');
let mainDownload: any = document.getElementById('mainDownload');
let originWidthPCLayout: any = document.getElementById('originWidthPCLayout');
let originWidthURLLayout: any = document.getElementById('originWidthURLLayout');
let multipleTranslation: any = document.getElementById('multipleTranslation');
let singleTranslation: any = document.getElementById('singleTranslation');
let areaTranslation: any = document.getElementById('areaTranslation');
let areaRemoveDrag: any = document.getElementById('areaRemoveDrag');
let areaRemoveBrush: any = document.getElementById('areaRemoveBrush');
let areaRemoveType: any = document.getElementById('areaRemoveType');
let shapeSelect: any = document.getElementById('shapeSelect');
let areaRecoveryDrag: any = document.getElementById('areaRecoveryDrag');
let areaRecoveryBrush: any = document.getElementById('areaRecoveryBrush');
let areaRecoveryType: any = document.getElementById('areaRecoveryType');
let cropStart: any = document.getElementById('cropStart');
let cropCancel: any = document.getElementById('cropCancel');
let cropAccept: any = document.getElementById('cropAccept');
let shapeStart: any = document.getElementById('shapeStart');
let shapeType: any = document.getElementById('shapeType');
let textStart: any = document.getElementById('textStart');
let textSelect: any = document.getElementById('textSelect');
let textType: any = document.getElementById('textType');
let horizontal: any = document.getElementById('horizontal');
let vertical: any = document.getElementById('vertical');
let alignLeft: any = document.getElementById('alignLeft');
let alignCenter: any = document.getElementById('alignCenter');
let alignRight: any = document.getElementById('alignRight');
let alignTop: any = document.getElementById('alignTop');
let alignMiddle: any = document.getElementById('alignMiddle');
let alignBottom: any = document.getElementById('alignBottom');
let playOriginal: any = document.getElementById('playOriginal');
let previewZoomOut: any = document.getElementById('previewZoomOut');
let previewZoomIn: any = document.getElementById('previewZoomIn');
let playUndo: any = document.getElementById('playUndo');
let playRedo: any = document.getElementById('playRedo');
let displayDouble: any = document.getElementById('displayDouble');
let doubleFrame: any = document.getElementById('doubleFrame');
let doubleBorder: any = document.getElementById('doubleBorder');
let shapeFill: any = document.getElementById('shapeFill');
let toolTextAlignLeft: any = document.getElementById('toolTextAlignLeft');
let toolTextAlignCenter: any = document.getElementById('toolTextAlignCenter');
let toolTextAlignRight: any = document.getElementById('toolTextAlignRight');
let floatingTextToolDragger: any = document.getElementById('floatingTextToolDragger');
let imageRecovery: any = document.getElementById('imageRecovery');
let imageSave: any = document.getElementById('imageSave');
let saveCancel: any = document.getElementById('saveCancel');
let saveAccept: any = document.getElementById('saveAccept');
let uploadAccept: any = document.getElementById('uploadAccept');
let imageExit: any = document.getElementById('imageExit');
let btnSetting: any = document.getElementById('btnSetting');
let setting: any = document.getElementById('setting');
let settingAccept: any = document.getElementById('settingAccept');
let thisImageRecovery: any = document.getElementById('thisImageRecovery');
let thisImageSave: any = document.getElementById('thisImageSave');
// let thisDownload: any = document.getElementById('thisDownload');
// let thisSaveCancel: any = document.getElementById('thisSaveCancel');
// let thisUploadAccept: any = document.getElementById('thisUploadAccept');
let headerSider: any = document.getElementById('header-sider');
let menuToolbar: any = document.getElementById('menuToolbar');
let floatingShapeToolDragger: any = document.getElementById('floatingShapeToolDragger');
let checkAll: any = document.getElementById('checkAll');
let checkDel: any = document.getElementById('checkDel');
let fixedTextTool: any = document.getElementById('fixedTextTool');
let fixedShapeTool: any = document.getElementById('fixedShapeTool');
let textTab: any = document.getElementById('textTab');
let shapeTab: any = document.getElementById('shapeTab');
let fixedTextColor: any = document.getElementById('fixedTextColor');
let fixedTextBackground: any = document.getElementById('fixedTextBackground');
let fixedTextFont: any = document.getElementById('fixedTextFont');
let fixedTextSize: any = document.getElementById('fixedTextSize');
let fixedTextBold: any = document.getElementById('fixedTextBold');
let fixedTextItalic: any = document.getElementById('fixedTextItalic');
let fixedTextLineThrough: any = document.getElementById('fixedTextLineThrough');
let fixedTextUnderLine: any = document.getElementById('fixedTextUnderLine');
let toolShapeStrokeShape: any = document.getElementById('toolShapeStrokeShape');
let fixedShapeOutlineColor: any = document.getElementById('fixedShapeOutlineColor');
let fixedShapeBackground: any = document.getElementById('fixedShapeBackground');
let fixedShapeStrokeWidth: any = document.getElementById('fixedShapeStrokeWidth');
let fixedShapeStrokeShape: any = document.getElementById('fixedShapeStrokeShape');
let fixedTextAlignLeft: any = document.getElementById('fixedTextAlignLeft');
let fixedTextAlignCenter: any = document.getElementById('fixedTextAlignCenter');
let fixedTextAlignRight: any = document.getElementById('fixedTextAlignRight');

let product: any = null;
let appData: any = null;
let areaPos: any = {};

let cancel = false;
let copyBox: any = [];

let cropRectangle: any = null;
let cropRatioType: any = '3';

let currentImageIndex: any = null;
let currentType: any = null;

let dragImage: any = null;

let editorMode = 'idle';

let isShapeFill = true;
let isDrag = false;
let isOriginal = false;

let layers: any = [];

let maskCanvas: any = new fabric.Canvas('mask');
let myCanvas: any = new fabric.Canvas('main');

let orgCanvas: any = new fabric.Canvas('original');

let visionKey: any = null;

let removeType = 'area-remove-drag';
let recoveryType = 'area-recovery-drag';

/** 쿼리스트링 파싱 */
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams: any, prop) => searchParams.get(prop),
});

const loadLocalSettings = () => {
	applyWaterMarkText.value = appData.settings.waterMarkText ?? appData.user.id;
	applyWaterMarkOpacity.value = appData.settings.waterMarkOpacity ?? '20';
	applyOriginWidthPC.value = appData.settings.originWidthPC ?? 'Y';
	originWidthPC.value = appData.settings.originWidthPCSize ?? '';
	applyOriginWidthThumbnail.value = appData.settings.originWidthThumbnail ?? 'Y';
	originWidthThumbnail.value = appData.settings.originWidthThumbnailSize ?? '';
	applyOriginWidthOption.value = appData.settings.originWidthOption ?? 'Y';
	originWidthOption.value = appData.settings.originWidthOptionSize ?? '';
	applyOriginWidthDescription.value = appData.settings.originWidthDescription ?? 'Y';
	originWidthDescription.value = appData.settings.originWidthDescriptionSize ?? '';
	applySensitive.value = appData.settings.originSensitive ?? '0.03';

	if (applyOriginWidthPC.value === 'N') {
		originWidthPC.disabled = false;
	}

	if (applyOriginWidthThumbnail.value === 'N') {
		originWidthThumbnail.disabled = false;
	}

	if (applyOriginWidthOption.value === 'N') {
		originWidthOption.disabled = false;
	}

	if (applyOriginWidthDescription.value === 'N') {
		originWidthDescription.disabled = false;
	}

	let radioExtensionType: any = document.getElementsByName('extensionType');

	for (let i = 0; i < radioExtensionType.length; i++) {
		if (radioExtensionType[i].value === appData.settings.extensionType) {
			radioExtensionType[i].parentNode.className = 'radio activated';
		}

		radioExtensionType[i].addEventListener('change', (e: any) => {
			for (let j = 0; j < radioExtensionType.length; j++) {
				if (e.target.value === radioExtensionType[j].value) {
					radioExtensionType[j].parentNode.className = 'radio activated';

					saveLocalSettings('extensionType', e.target.value);
				} else {
					radioExtensionType[j].parentNode.className = 'radio default';
				}
			}
		});
	}

	let waterMarkType: any = document.getElementsByName('waterMarkType');

	for (let i = 0; i < waterMarkType.length; i++) {
		if (waterMarkType[i].value === appData.settings.waterMarkType) {
			waterMarkType[i].parentNode.className = 'radio activated';
		}

		waterMarkType[i].addEventListener('change', (e: any) => {
			for (let j = 0; j < waterMarkType.length; j++) {
				if (e.target.value === waterMarkType[j].value) {
					waterMarkType[j].parentNode.className = 'radio activated';

					saveLocalSettings('waterMarkType', e.target.value);

					displayImage(currentImageIndex, 0);
				} else {
					waterMarkType[j].parentNode.className = 'radio default';
				}
			}
		});
	}
};

const getProductList = async (id: string) => {
	let list_query = `query TEST($where: ProductWhereInput) {
        selectProductsBySomeone(where: $where) {
            productCode
            id
            description
            imageThumbnail
            productOptionName {
                productOptionValue {
                    id
                    image
                }
            }
            activeTaobaoProduct {
              shopName
            }
        }
    }`;

	let list_json = await gql(list_query, { where: { id: { equals: parseInt(id) } } }, false);

	if (list_json.errors) {
		alert(list_json.errors[0].message);

		return null;
	}

	return list_json;
};

const saveLocalSettings = (key: string, value: string) => {
	appData = {
		...appData,

		settings: {
			...appData.settings,

			[key]: value,
		},
	};

	localStorage.setItem('appInfo', JSON.stringify(appData));
};

const getCurrentLayer = () => {
	let layer = layers.filter((v: any) => {
		if (v.index !== currentImageIndex || v.type !== currentType) {
			return false;
		}
		return true;
	});

	return layer[0];
};

const mergeImage = (dataUrl: any) => {
	return new Promise((resolve, reject) => {
		let cropped = new Image();

		cropped.src = dataUrl;
		cropped.onload = () => {
			resolve(cropped);
		};

		cropped.onerror = reject;
	});
};

const saveCanvas = () => {
	layers.map((v: any) => {
		if (v.index !== currentImageIndex || v.type !== currentType) {
			v.state.undo = {
				canvas: [],
				object: [],
			};
		}

		v.state.redo = {
			canvas: [],
			object: [],
		};
	});

	let layer = getCurrentLayer();

	if (!layer || !layer.object) {
		return;
	}

	let canvas = JSON.stringify(myCanvas.toObject(['id', 'selectable']));
	let object = JSON.stringify(layer.object);

	if (layer.state.current.canvas) {
		if (layer.state.undo.canvas.length > 9) {
			layer.state.undo.canvas.shift();
		}

		layer.state.undo.canvas.push(layer.state.current.canvas);
	}

	if (layer.state.current.object) {
		if (layer.state.undo.object.length > 9) {
			layer.state.undo.object.shift();
		}

		layer.state.undo.object.push(layer.state.current.object);
	}

	layer.state.current.canvas = canvas;
	layer.state.current.object = object;
};

const replayCanvas = (type: string) => {
	let layer = getCurrentLayer();

	let playStack: any = null;
	let saveStack: any = null;

	switch (type) {
		case 'undo': {
			playStack = layer.state.undo;
			saveStack = layer.state.redo;

			break;
		}

		case 'redo': {
			playStack = layer.state.redo;
			saveStack = layer.state.undo;

			break;
		}

		default: {
			break;
		}
	}

	let stateCanvas = playStack.canvas.pop();
	let stateObject = playStack.object.pop();

	if (!stateCanvas || !stateObject) {
		return;
	}

	saveStack.canvas.push(layer.state.current.canvas);
	saveStack.object.push(layer.state.current.object);

	myCanvas.clear();
	myCanvas.loadFromJSON(stateCanvas, async () => {
		myCanvas.renderAll();

		layer.image.current = myCanvas.backgroundImage?.src ?? myCanvas.overlayImage.src;
		layer.object = [];

		let object = JSON.parse(stateObject);

		myCanvas.getObjects().map((v: any) => {
			switch (v.type) {
				case 'i-text': {
					layer.object.push({
						...object[v.id],
						text: v,
					});
					break;
				}
				case 'rect': {
					layer.object.push({
						...object[v.id],
						rect: v,
					});
					break;
				}
			}
		});

		layer.state.current.canvas = stateCanvas;
		layer.state.current.object = stateObject;

		await displayImage(currentImageIndex, 0);
	});
};
/** 이미지 번역에 사용되는 파파고 */
const translationPapago = async (input_string: string, source: string, target: string) => {
	if (papagoApiKey === '') return alert('번역 API키 Error , 관리자에게 문의해주세요');

	let deviceid = '364961ac-efa2-49ca-a998-ad55f7f9d32d';
	let url = 'https://papago.naver.com/apis/n2mt/translate';
	let time = new Date().getTime();

	let hash = CryptoJS.HmacMD5(`${deviceid}\n${url}\n${time}`, papagoApiKey).toString(CryptoJS.enc.Base64);
	let encoded = encodeURI(input_string);
	encoded = encoded.replaceAll(';', '%2B');
	encoded = encoded.replaceAll('/', '%2F');
	encoded = encoded.replaceAll('?', '%3F');
	encoded = encoded.replaceAll(':', '%3A');
	encoded = encoded.replaceAll('@', '%40');
	encoded = encoded.replaceAll('=', '%3D');
	encoded = encoded.replaceAll('+', '%2B');
	encoded = encoded.replaceAll(',', '%2C');
	encoded = encoded.replaceAll('$', '%24');
	let output = await fetch('https://papago.naver.com/apis/n2mt/translate', {
		headers: {
			authorization: `PPG ${deviceid}:${hash}`,
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			timestamp: `${time}`,
			'x-apigw-partnerid': 'papago',
		},

		body: `deviceId=${deviceid}&locale=ko&dict=true&dictDisplay=30&honorific=false&instant=false&paging=false&source=${source}&target=${target}&text=${encoded}`,
		method: 'POST',
	});

	try {
		let result = await output.json();
		// console.log(result.translatedText);
		let result_array = result.translatedText.split('\n');
		return result_array;
	} catch (e) {
		return null;
	}
};

const displayImage = async (index: number, customWidth: number) => {
	currentImageIndex = index;

	let imageList = document.getElementsByClassName('image-thumbnail');
	console.log({ imageList });
	for (let i = 0; i < imageList.length; i++) {
		if (imageList[i].getAttribute('key') === currentImageIndex.toString()) {
			imageList[i].className = 'image-thumbnail activated';
		} else {
			imageList[i].className = 'image-thumbnail deactivated';
		}
	}

	orgCanvas.clear();
	myCanvas.clear();

	let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

	let originalImage: any = null;
	let currentImage: any = null;

	let layer = getCurrentLayer();

	if (!layer) {
		return;
	}

	let originalMerged: any = await mergeImage(layer.image.origin);

	originalImage = new fabric.Image(originalMerged);
	originalImage.set({
		selectable: false,
	});

	orgCanvas.setDimensions({
		width: originalImage.width / (100 / percentage),
		height: originalImage.height / (100 / percentage),
	});

	orgCanvas.add(originalImage);
	orgCanvas.zoomToPoint(new fabric.Point(0, 0), percentage / 100);
	orgCanvas.renderAll();

	if (isOriginal) {
		myCanvas.setDimensions({
			width: originalImage.width / (100 / percentage),
			height: originalImage.height / (100 / percentage),
		});

		myCanvas.add(originalImage);
		myCanvas.zoomToPoint(new fabric.Point(0, 0), percentage / 100);
		myCanvas.renderAll();

		return;
	}

	let currentMerged: any = await mergeImage(layer.image.current);

	currentImage = new fabric.Image(currentMerged);
	currentImage.set({
		id: currentImageIndex,
		selectable: false,
	});

	myCanvas.setDimensions({
		width: currentImage.width / (100 / percentage),
		height: currentImage.height / (100 / percentage),
	});

	layer.object.map((v: any, i: number) => {
		switch (v.object) {
			case 'rect': {
				if (!v.rect) {
					const rectOption = {
						id: i,
						left: v.copyX ? v.copyX + v.pos[0].x : currentImage.left + v.pos[0].x,
						top: v.copyY ? v.copyY + v.pos[0].y : currentImage.top + v.pos[0].y,
						width: v.pos[3].x == 0 ? 150 : v.pos[3].x,
						height: v.pos[3].y == 0 ? 150 : v.pos[3].y,
						fill: v.background ? `rgb(${v.background.R},${v.background.G},${v.background.B})` : 'transparent',
						stroke: v.foreground ? `rgb(${v.foreground.R},${v.foreground.G},${v.foreground.B})` : 'black',
						strokeWidth: v.shapeOption.strokeWidth ?? null,
						rx: v.shapeOption.rx ?? null,
						ry: v.shapeOption.ry ?? null,
						noScaleCache: false,
						strokeUniform: true,
						angle: v.angle ?? 0,
					};

					let rect = new fabric.Rect(rectOption);

					v.rect = rect;
				}

				v.rect.set({
					selectable:
						editorMode === 'area-translation' ||
						editorMode === 'area-remove-drag' ||
						editorMode === 'area-remove-brush' ||
						editorMode === 'area-recovery-drag' ||
						editorMode === 'area-recovery-brush' ||
						editorMode === 'crop'
							? false
							: true,
				});

				myCanvas.add(v.rect);
				myCanvas.sendToBack(v.rect);

				break;
			}

			case 'i-text': {
				let pos = v.pos;

				let xList: any = [];
				let yList: any = [];

				pos.map((w: any) => {
					xList.push(w.x);
					yList.push(w.y);

					return;
				});

				let xMax = Math.max(...xList);
				let xMin = Math.min(...xList);
				let yMax = Math.max(...yList);
				let yMin = Math.min(...yList);

				let offset = 0;

				xMax = xMax * (1 + offset);
				xMin = xMin * (1 - offset);
				yMax = yMax * (1 + offset);
				yMin = yMin * (1 - offset);

				let posText = {
					x: currentImage.left + xMin,
					y: currentImage.top + yMin,
					width: xMax - xMin,
					height: yMax - yMin,
				};

				if (!v.text) {
					const textOption = {
						id: i,
						left: v.copyX ? v.copyX + v.pos[0].x : currentImage.left + v.pos[0].x,
						top: v.copyY ? v.copyY + v.pos[0].y : currentImage.top + v.pos[0].y,
						width: v.pos[3].x == 0 ? 300 : v.pos[3].x,
						height: v.pos[3].y == 0 ? 300 : v.pos[3].y,
						fill: v.foreground ? `rgb(${v.foreground.R},${v.foreground.G},${v.foreground.B})` : 'black',
						backgroundColor: v.background
							? `rgb(${v.background.R},${v.background.G},${v.background.B})`
							: 'transparent',
						fontFamily: v.textOption.font,
						fontStyle: v.textOption.italic,
						fontSize: v.textOption.size ?? 1,
						fontWeight: v.textOption.bold,
						linethrough: v.textOption.lineThrough,
						selectable: true,
						noScaleCache: false,
						angle: v.angle ?? 0,
					};
					let text: any = new fabric.IText(v.translated, textOption);

					if (v.textOption.size) {
						text.set({
							fontSize: v.textOption.size,
						});
					} else {
						let fontSize = text.fontSize;

						while (true) {
							if (text.width >= posText.width) {
								break;
							}

							fontSize += 1;

							text.set({
								fontSize: fontSize,
							});
						}

						v.textOption.size = fontSize;
					}

					v.text = text;
				}

				v.text.set({
					selectable:
						editorMode === 'area-translation' ||
						editorMode === 'area-remove-drag' ||
						editorMode === 'area-remove-brush' ||
						editorMode === 'area-recovery-drag' ||
						editorMode === 'area-recovery-brush' ||
						editorMode === 'crop'
							? false
							: true,
				});

				myCanvas.add(v.text);

				break;
			}

			default:
				break;
		}
	});

	if (appData.settings.waterMarkType === 'Y' && applyWaterMarkText.value) {
		let text: any = new fabric.IText(applyWaterMarkText.value, {
			fontFamily: 'NNSQUAREROUNDR',
			fontSize: 2,

			opacity: applyWaterMarkOpacity.value / 100,
		});

		while (true) {
			if (text.width >= currentImage.width / 2) {
				break;
			}

			text.set({
				fontSize: text.fontSize + 1,
				selectable: false,
				evented: false,
			});
		}

		text.set({
			left: currentImage.width / 2 - text.width / 2,
			top: currentImage.height / 2 - text.height / 2,
		});

		myCanvas.add(text);
	}

	myCanvas.setBackgroundImage(currentImage);

	switch (editorMode) {
		case 'crop': {
			myCanvas.uniformScaling = cropRatioType === '3' ? false : true;

			myCanvas.setOverlayImage(
				currentImage,
				() => {
					myCanvas.renderAll();
				},
				{
					globalCompositeOperation: 'destination-atop',
				},
			);

			let overlay = new fabric.Rect({
				left: -1,

				width: currentImage.width + 2,
				height: currentImage.height,

				fill: 'black',
				opacity: 0.5,

				selectable: false,

				globalCompositeOperation: 'source-over',
			});

			myCanvas.add(overlay);

			const cropRectangleOption = {
				id: -1,

				active: true,

				width:
					cropRatioType === '2'
						? currentImage.width < currentImage.height
							? currentImage.width
							: currentImage.height
						: currentImage.width,
				height:
					cropRatioType === '2'
						? currentImage.width < currentImage.height
							? currentImage.width
							: currentImage.height
						: currentImage.height,

				selectable: true,

				lockScalingFlip: true,

				globalCompositeOperation: 'destination-out',
			};

			cropRectangle = new fabric.Rect(cropRectangleOption);
			cropRectangle.setControlsVisibility({
				mtr: false,

				mb: cropRatioType === '3' ? true : false,
				ml: cropRatioType === '3' ? true : false,
				mr: cropRatioType === '3' ? true : false,
				mt: cropRatioType === '3' ? true : false,
			});

			myCanvas.add(cropRectangle);
			myCanvas.setActiveObject(cropRectangle);

			break;
		}

		default: {
			myCanvas.setBackgroundImage(currentImage);

			break;
		}
	}

	let actualWidth: any = null;
	let actualHeight: any = null;

	if (customWidth) {
		let aspectRatio = customWidth / currentImage.width;

		actualWidth = customWidth;
		actualHeight = currentImage.height * aspectRatio;

		myCanvas.zoomToPoint(new fabric.Point(0, 0), aspectRatio);
	} else {
		actualWidth = currentImage.width;
		actualHeight = currentImage.height;

		myCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);
	}

	let resultData = myCanvas.toDataURL({
		width: actualWidth,
		height: actualHeight,

		format: appData.settings.extensionType,
	});

	myCanvas.zoomToPoint(new fabric.Point(0, 0), percentage / 100);
	myCanvas.renderAll();

	return resultData;
};

const processVisionData = async (info: any) => {
	try {
		startRegion.disabled = true;
		endRegion.disabled = true;

		let layer = getCurrentLayer();
		let visionData = {
			requests: [
				{
					features: [
						{
							maxResults: 3,
							type: 'TEXT_DETECTION',
						},
					],

					image: {
						content: info?.image.split(',')[1] ?? layer.image.current.split(',')[1],
					},

					image_context: {
						language_hints: startRegion.value,
					},
				},
			],
		};

		let visionResp = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`, {
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify(visionData),
			method: 'POST',
		});
		let visionJson = await visionResp.json();
		// console.log("visionJson", visionJson.responses[0].fullTextAnnotation.text);
		if (visionJson.responses[0]?.error?.message === 'Bad image data.') {
			await saveBadImage();

			// 1. 데이터 변경된거 products 변수에 적용해줘야함
			const products = await getProductList(params.id);

			for (let i in products.data.selectProductsBySomeone) {
				if (products.data.selectProductsBySomeone[i].id === parseInt(params.id)) {
					product = products.data.selectProductsBySomeone[i];
				}
			}
			testLayer = 2; // 2. 레이어 새로 등록하게 끔 처리 해줘야함
			await addToLayers(); //3. 레이어 새로 적용 product에 있는 것

			await loadImageList(); //4.이미지 리스트 새로 불러와서 그릴수있도록 처리

			await processVisionData(null); //4. 다시 재귀함수 호출
		}

		let visionArray: any = await visionAnalyzer(visionJson.responses[0]); // 여기안에 PPG모듈 번역
		// console.log(visionArray);
		if (visionArray.length === 0) {
			return;
		}

		let pos = info?.pos;

		if (pos) {
			visionArray.map((v: any) => {
				v.pos.map((w: any) => {
					w.x += info.pos.x;
					w.y += info.pos.y;
				});
			});
		}

		let colorResp = await fetch(FLASK_URL + 'getcolor', {
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				image: layer.image.current.split(',')[1],
				data: visionArray,
			}),

			method: 'POST',
		});

		let colorJson = await colorResp.json();
		let objectList: any = [];
		let sensitive = parseFloat(applySensitive.value);
		//현재 에러 발생
		for (let i = 0; i < visionArray.length; i++) {
			let xList: any = [];
			let yList: any = [];

			visionArray[i].pos.map((w: any) => {
				xList.push(w.x);
				yList.push(w.y);

				return;
			});

			let xMax = Math.max(...xList);
			let xMin = Math.min(...xList);
			let yMax = Math.max(...yList);
			let yMin = Math.min(...yList);

			xMax = xMax * (1 + sensitive);
			xMin = xMin * (1 - sensitive);
			yMax = yMax * (1 + sensitive);
			yMin = yMin * (1 - sensitive);
			let rect: any = new fabric.Rect({
				left: xMin,
				top: yMin,
				width: xMax - xMin,
				height: yMax - yMin,
				fill: `white`,
			});
			objectList.push(rect);

			let translated = visionArray[i].translated;
			if (visionArray[i].direction == 'vertical') {
				translated = visionArray[i].translated.match(/.{1}/g).join('\n');
			}

			layer.object.push({
				foreground: colorJson.data[i].foreground,
				object: 'i-text',
				original: visionArray[i].original,
				pos: visionArray[i].pos,
				translated: translated,
				textOption: {
					bold: toolTextBold.checked ? 'bold' : 'normal',
					font: toolTextFont.value,
					italic: toolTextItalic.checked ? 'italic' : 'normal',
					lineThrough: toolTextLineThrough.checked,
					underLine: toolTextUnderLine.checked,
					direction: visionArray[i].direction,
				},
			});
		}

		await getMaskImage(objectList);
	} catch (e) {
		alert('번역 도중 오류가 발생하였습니다.');

		console.log('번역 에러:', e);
	}
};

const dataURItoBlob = (dataURI: string) => {
	const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
	const binary: any = atob(dataURI.split(',')[1]);
	const array: any = [];

	for (let i = 0; i < binary.length; i += 1) {
		array.push(binary.charCodeAt(i));
	}

	return new Blob([new Uint8Array(array)], { type: mime });
};

const getMaskImage = async (itemList: any) => {
	let layer = getCurrentLayer();

	let currentMerged: any = await mergeImage(layer.image.current);
	let currentImage = new fabric.Image(currentMerged);

	let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

	maskCanvas.clear();
	maskCanvas.setDimensions({
		width: myCanvas.width * (100 / percentage),
		height: myCanvas.height * (100 / percentage),
	});

	maskCanvas.setBackgroundImage(currentImage);

	let image = maskCanvas.toDataURL();

	maskCanvas.clear();
	maskCanvas.backgroundColor = 'black';

	itemList.map((v: any) => {
		maskCanvas.add(v);
	});

	let maskImage = maskCanvas.toDataURL();
	let formData = new FormData();
	formData.append('image', dataURItoBlob(image));
	formData.append('mask', dataURItoBlob(maskImage));
	formData.append('ldmSteps', '50');
	formData.append('hdStrategy', 'Original');
	formData.append('hdStrategyCropMargin', '128');
	formData.append('hdStrategyCropTrigerSize', '2048');
	formData.append('hdStrategyResizeLimit', '2048');
	formData.append('sizeLimit', 'Original');

	let dataResp = await fetch('http://101.79.8.236:9999/inpaint', {
		method: 'POST',
		body: formData,
	});

	let dataBlob = await dataResp.blob();
	let dataBase64 = await readFileDataURL(dataBlob);
	let dataMerged: any = await mergeImage(dataBase64);
	let result: any = new fabric.Image(dataMerged);

	result.set({
		id: currentImageIndex,
		selectable: false,
	});

	layer.image.current = dataBase64;

	await displayImage(currentImageIndex, 0);
};

const visionAnalyzer = async (data: any) => {
	if (!data.fullTextAnnotation) {
		return [];
	}
	let vision_count = 0;
	let test = 0;
	let vision_input = data.fullTextAnnotation.text.replaceAll('&', '');
	let vision_text = '';
	let visionInputArray = vision_input.split('\n');
	let vision_text_list = await translationPapago(vision_input, startRegion.value, endRegion.value);
	let visionTransLateCount = vision_text_list.length;
	// 번역이 가끔 젤 첫줄에 이상한 영어들어가면 이상하게 되는경우가있다. 해당 경우는 젤 첫번째줄 제거하고 다시 번역하는 방안으로 (대표님이 요구한 해결책 )
	if (visionInputArray.length !== visionTransLateCount) {
		visionInputArray.shift();
		vision_input = visionInputArray.join('\n');
		vision_text_list = await translationPapago(vision_input, startRegion.value, endRegion.value);
		test = 1;
	}

	let vision_pos: any = [];
	let vision_info: any = [];

	let direction = 'horizontal';
	let vision_blocks = data.fullTextAnnotation.pages[0].blocks;
	if (test === 1) {
		vision_blocks[0].paragraphs.shift();
	}
	for (let a in vision_blocks) {
		let vision_paragraphs = vision_blocks[a].paragraphs;

		for (let b in vision_paragraphs) {
			let vision_words = vision_paragraphs[b].words;

			for (let c in vision_words) {
				let vision_symbols = vision_words[c].symbols;

				for (let d in vision_symbols) {
					vision_text += vision_symbols[d].text;

					if (vision_pos.length === 0) {
						vision_pos = vision_symbols[d].boundingBox.vertices;
					} else {
						vision_pos[1] = vision_symbols[d].boundingBox.vertices[1];
						vision_pos[2] = vision_symbols[d].boundingBox.vertices[2];

						let width: any = '';
						let height: any = '';

						width = vision_symbols[d].boundingBox.vertices[1].x - vision_paragraphs[b].boundingBox.vertices[0].x;
						height = vision_symbols[d].boundingBox.vertices[3].y - vision_paragraphs[b].boundingBox.vertices[0].y;

						if (height > width) {
							direction = 'vertical';
						} else {
							direction = 'horizontal';
						}
					}

					if (vision_symbols[d].property && vision_symbols[d].property.detectedBreak) {
						let breakType = vision_symbols[d].property.detectedBreak.type;

						if (breakType === 'LINE_BREAK' || breakType === 'EOL_SURE_SPACE') {
							vision_pos.map((v: any) => {
								if (!v.x) {
									v.x = 0;
								}

								if (!v.y) {
									v.y = 0;
								}
							});

							let offset = {
								index: currentImageIndex,
								Y: 0,
							};

							let matched = /[\u4e00-\u9fff]/.test(vision_text);
							if (startRegion.value === 'zh-CN') {
								if (!matched) {
									vision_pos = [];
									vision_text = '';
									vision_count += 1;

									continue;
								}
							}

							vision_info.push({
								offset: offset,
								pos: vision_pos,
								original: vision_text,
								translated: vision_text_list[vision_count],
								type: currentType,
								direction: direction,
							});

							vision_pos = [];
							vision_text = '';
							vision_count += 1;
						} else if (breakType === 'SPACE') {
							vision_text += ' ';
						}
					}
				}
			}
		}
	}

	return vision_info;
};

const sortBy = (array: any, key: string, asc: boolean) => {
	let sorted = array.sort((a: any, b: any) => {
		if (a[key] < b[key]) {
			return asc ? -1 : 1;
		}

		if (a[key] > b[key]) {
			return asc ? 1 : -1;
		}

		return 0;
	});

	return sorted;
};

const addToLayers = async () => {
	if (testLayer !== 1) {
		layers = [];
	}
	switch (params.type) {
		case '1': {
			await Promise.all(
				product.imageThumbnail.map(async (v: any, i: number) => {
					currentImageIndex = i;

					let layer = getCurrentLayer();
					let imageUrl = /^https?:/.test(v) ? v : `${ENDPOINT_IMAGE}/sellforyou/${v}`;

					if (!layer || testLayer !== 1) {
						let imageResp = await fetch(imageUrl);
						let imageBlob = await imageResp.blob();
						let imageData = await readFileDataURL(imageBlob);

						layers.push({
							type: params.type,

							index: i,

							image: {
								origin: imageUrl,
								current: imageData,
							},

							object: [],

							state: {
								undo: {
									canvas: [],
									object: [],
								},

								redo: {
									canvas: [],
									object: [],
								},

								current: {},

								check: 'checked',
							},
						});
					}
				}),
			);

			break;
		}

		case '2': {
			let productOption: any = [];

			product.productOptionName.map((v: any) => {
				v.productOptionValue.map((w: any, i) => {
					console.log(`addToLayers 함수에 있는 ${i}번째 w`);
					console.log({ w });
					let imageUrl = '';
					if (w.image) imageUrl = /^https?:/.test(w.image) ? w.image : `${ENDPOINT_IMAGE}/sellforyou/${w.image}`;

					productOption.push(imageUrl);

					return;
				});

				return;
			});

			await Promise.all(
				productOption.map(async (v: any, i: number) => {
					currentImageIndex = i;

					let layer = getCurrentLayer();

					if (!layer || testLayer !== 1) {
						// 옵션이미지의 경우 이미지가 없어도 레이어가 삭제되지않으므로 이미지가 없어도 레이어는 추가한채 전체번역에 포함되지 않도록 처리
						if (v !== '') {
							let imageResp = await fetch(v);
							let imageBlob = await imageResp.blob();
							let imageData = await readFileDataURL(imageBlob);

							layers.push({
								type: params.type,

								index: i,

								image: {
									origin: v,
									current: imageData,
								},

								object: [],

								state: {
									undo: {
										canvas: [],
										object: [],
									},

									redo: {
										canvas: [],
										object: [],
									},

									current: {},

									check: 'checked',
								},
							});
						} else {
							layers.push({
								type: params.type,

								index: i,

								image: {
									origin: v,
									current: '',
								},

								object: [],

								state: {
									undo: {
										canvas: [],
										object: [],
									},

									redo: {
										canvas: [],
										object: [],
									},

									current: {},
									// 체크상태를 disabled 처리
									check: 'disabled',
								},
							});
						}
					}

					return;
				}),
			);

			break;
		}

		case '3': {
			let description: any = null;

			let matched = /product\/[0-9]+\/description.html/.test(product.description);

			if (matched) {
				let desc_resp = await fetch(`${ENDPOINT_IMAGE}/sellforyou/${product.description}?${new Date().getTime()}`);

				description = await desc_resp.text();
			} else {
				description = product.description;
			}

			let elem = new DOMParser();
			let elemImage = elem.parseFromString(description, 'text/html');
			let elemImageList = elemImage.querySelectorAll('img');

			let productDescription: any = [];

			for (let i in elemImageList) {
				if (elemImageList[i].src) {
					let imageUrl: any = elemImageList[i].src;

					productDescription.push(imageUrl);
				}
			}

			await Promise.all(
				productDescription.map(async (v, i) => {
					currentImageIndex = i;

					let layer = getCurrentLayer();

					if (!layer || testLayer !== 1) {
						let imageResp = await fetch(v);
						let imageBlob = await imageResp.blob();
						let imageData = await readFileDataURL(imageBlob);

						layers.push({
							type: params.type,

							index: i,

							image: {
								origin: v,
								current: imageData,
							},

							object: [],

							state: {
								undo: {
									canvas: [],
									object: [],
								},

								redo: {
									canvas: [],
									object: [],
								},

								current: {},

								check: 'checked',
							},
						});
					}
				}),
			);

			break;
		}

		default:
			break;
	}

	layers = sortBy(layers, 'index', true);
	layers = sortBy(layers, 'type', true);
	console.log('====addToLayers() :  만들어진 레이어====');
	console.log({ layers });
};

const loadImageList = async () => {
	imageList.innerHTML = ``;

	let filterdImages: any = [];

	if (params.type) {
		currentType = params.type;
	}

	let newLayer = layers.filter((v: any) => v.type === currentType);
	console.log('===필터로 걸러진 newLayer===');
	console.log({ newLayer });
	switch (currentType) {
		case '1': {
			await Promise.all(
				product.imageThumbnail.map((v: any, i: number) => {
					let imageUrl: any = /^https?:/.test(v) ? v : `${ENDPOINT_IMAGE}/sellforyou/${v}`;

					filterdImages.push(imageUrl);

					return;
				}),
			);

			break;
		}

		case '2': {
			await Promise.all(
				product.productOptionName.map((v: any) => {
					v.productOptionValue.map((w: any, i) => {
						console.log(`loadImageList 에 있는 ${i}번째 w`);
						console.log({ w });
						let imageUrl = '';
						if (w.image) imageUrl = /^https?:/.test(w.image) ? w.image : `${ENDPOINT_IMAGE}/sellforyou/${w.image}`;

						filterdImages.push(imageUrl);

						return;
					});

					return;
				}),
			);

			break;
		}

		case '3': {
			let description: any = null;

			let matched = /product\/[0-9]+\/description.html/.test(product.description);

			if (matched) {
				let desc_resp = await fetch(`${ENDPOINT_IMAGE}/sellforyou/${product.description}?${new Date().getTime()}`);

				description = await desc_resp.text();
			} else {
				description = product.description;
			}

			let elem = new DOMParser();
			let elemImage = elem.parseFromString(description, 'text/html');
			let elemImageList = elemImage.querySelectorAll('img');

			for (let i in elemImageList) {
				if (elemImageList[i].src) {
					let imageUrl: any = elemImageList[i].src;

					filterdImages.push(imageUrl);
				}
			}
			console.log('===만들어진 filterdImages===');
			console.log({ filterdImages });
			break;
		}

		default:
			break;
	}
	console.log(filterdImages.length);
	if (filterdImages.length > 0) {
		for (let i = 0; i < filterdImages.length; i++) {
			if (filterdImages[i] === '') continue;
			console.log(`i는 : ${i}`);
			imageList.innerHTML += `
                <div class="imageListDiv" ${filterdImages[i] === '' ? 'hidden' : ''}>
                    <img class="image-thumbnail" key=${i} src=${
				filterdImages[i]
			} alt="" width="72px" height="72px" style="object-fit: contain; cursor: pointer; margin: 5px;" />
                    <input id="check${i}" class="checkBox" key=${i} type="checkbox" ${newLayer[i].state.check}>
                </div>
                `;
		}
		if (filterdImages.length > 21) {
			headerSider.style.overflowX = 'auto';
		}
	} else {
		imageList.innerHTML += `<div class="imageListDiv"> </div>`;
	}

	let checked: any = document.getElementsByClassName(`checkBox`);
	console.log({ checked });
	for (let i = 0; i < checked.length; i++) {
		console.log(`${i}번 1번루프 들어옴`);
		checked[i].addEventListener('click', () => {
			if (newLayer[i].state.check == 'checked') {
				newLayer[i].state.check = '';
				checked[i].checked = false;
			} else if (newLayer[i].state.check == '') {
				newLayer[i].state.check = 'checked';
				checked[i].checked = true;
			}
		});
	}

	checkAll.addEventListener('click', () => {
		for (let i = 0; i < newLayer.length; i++) {
			console.log(`${i}번 2번루프 들어옴`);

			newLayer[i].state.check = 'checked';
			try {
				checked[i].checked = true;
			} catch (e) {
				continue;
			}
		}
	});

	checkDel.addEventListener('click', () => {
		for (let i = 0; i < newLayer.length; i++) {
			console.log(`${i}번 3번루프 들어옴`);

			newLayer[i].state.check = '';
			try {
				checked[i].checked = false;
			} catch (e) {
				continue;
			}
		}
	});

	let imageElement = document.getElementsByClassName(`image-thumbnail`);
	console.log({ imageElement });

	if (imageElement.length < 0) {
		return;
	}

	for (let i = 0; i < imageElement.length; i++) {
		console.log(`${i}번 4번루프 들어옴`);

		imageElement[i].addEventListener('click', async () => {
			await displayImage(i, 0);

			saveCanvas();
		});
	}
	console.log(params.index);
	if (!params.index) {
		await displayImage(0, 0);
	} else {
		await displayImage(parseInt(params.index) ?? 0, 0);
	}
	console.log('여기서 뻑이나나');
	saveCanvas();

	headerSub.style.display = '';
};

const ColorToHex = (color: any) => {
	let hexadecimal = color.toString(16);

	return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
};

const ConvertRGBtoHex = (red: any, green: any, blue: any) => {
	return '#' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
};

const hexToRgb = (hex: any) => {
	let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

	hex = hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => {
		return r + r + g + g + b + b;
	});

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

const canvasSetting = () => {
	fabric.Object.prototype.set({
		borderColor: 'rgb(41, 136, 255)',
		cornerColor: 'rgb(41, 136, 255)',
		cornerStyle: 'circle',
		cornerSize: 10,
		transparentCorners: false,
	});

	myCanvas.on({
		'text:changed': (e: any) => {
			let object = e.target;
			let layer = getCurrentLayer();
			let objectDirection = layer.object[object.id].textOption.direction;

			switch (objectDirection) {
				case 'vertical': {
					textTranslated.value = object.textLines.join('');
					layer.object[object.id].translated = object.text.match(/.{1}/g).join('\n');
					object.text = textTranslated.value.match(/.{1}/g).join('\n');
					break;
				}

				case 'horizontal': {
					textTranslated.value = object.text;
					layer.object[object.id].translated = object.text;

					break;
				}
			}
		},

		'selection:created': (e: any) => {
			textTranslated.disabled = false;

			if (e.selected) {
				for (let i = 0; i < e.selected.length; i++) {
					if (e.selected.length > 1) {
						if (e.selected[0].stroke && e.selected[i].text) {
							textTab.style.cursor = 'pointer';
							shapeTab.style.cursor = 'pointer';

							floatingTextTool.style.left = `${e.e.x}px`;
							floatingTextTool.style.top = `${e.e.y}px`;
							floatingTextTool.style.display = '';

							floatingShapeTool.style.left = `${e.e.x}px`;
							floatingShapeTool.style.top = `${e.e.y - 50}px`;
							floatingShapeTool.style.display = '';

							return;
						} else if (e.selected[i].text) {
							fixedTextTool.style.display = '';
							fixedShapeTool.style.display = 'none';

							textTab.style.backgroundColor = 'rgb(80, 80, 80)';
							shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';

							textTab.style.cursor = 'pointer';
							shapeTab.style.cursor = '';

							floatingTextTool.style.display = '';
							floatingTextTool.style.left = `${e.e.x}px`;
							floatingTextTool.style.top = `${e.e.y}px`;
						}
						try {
							if (e.selected[e.selected.length - 1].stroke) {
								fixedTextTool.style.display = 'none';
								fixedShapeTool.style.display = '';

								textTab.style.backgroundColor = 'rgb(65, 65, 65)';
								shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';

								textTab.style.cursor = '';
								shapeTab.style.cursor = 'pointer';

								floatingShapeTool.style.display = '';
								floatingShapeTool.style.left = `${e.e.x}px`;
								floatingShapeTool.style.top = `${e.e.y - 50}px`;
							}
						} catch {
							continue;
						}
					}
				}
			}

			let object = e.selected[0];
			let objectType = object.get('type');

			if (object.id === -1) {
				return;
			}

			let layer = getCurrentLayer();
			let v = layer.object[object.id];

			switch (objectType) {
				case 'i-text': {
					let size = Math.round(object.fontSize * object.scaleX);

					object.set({
						fontSize: size,
						scaleX: 1,
						scaleY: 1,
					});

					floatingTextTool.style.left = `${e.e.x}px`;
					floatingTextTool.style.top = `${e.e.y}px`;
					floatingTextTool.style.display = '';

					fixedTextTool.style.display = '';
					fixedShapeTool.style.display = 'none';

					textTab.style.backgroundColor = 'rgb(80, 80, 80)';
					shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';

					textOriginal.value = v.original;
					textTranslated.value = v.text.textLines.join('');
					toolTextColor.value = v.foreground ? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B) : '';
					toolTextBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: '';
					toolTextFont.value = v.textOption.font;
					toolTextSize.value = size;
					toolTextBold.checked = v.textOption.bold === 'bold' ? true : false;
					toolTextItalic.checked = v.textOption.italic === 'italic' ? true : false;
					toolTextLineThrough.checked = v.textOption.lineThrough === 'lineThrough' ? true : false;
					toolTextUnderLine.checked = v.textOption.underLine === 'underLine' ? true : false;

					fixedTextColor.value = v.foreground ? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B) : '';
					fixedTextBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: '';
					fixedTextFont.value = v.textOption.font;
					fixedTextSize.value = size;
					fixedTextBold.checked = v.textOption.bold === 'bold' ? true : false;
					fixedTextItalic.checked = v.textOption.italic === 'italic' ? true : false;
					fixedTextLineThrough.checked = v.textOption.lineThrough === 'lineThrough' ? true : false;
					fixedTextUnderLine.checked = v.textOption.underLine === 'underLine' ? true : false;

					if (toolTextBold.checked) {
						toolTextBold.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextBold.parentNode.style.color = 'white';
					}

					if (toolTextItalic.checked) {
						toolTextItalic.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextItalic.parentNode.style.color = 'white';
					}

					if (toolTextLineThrough.checked) {
						toolTextLineThrough.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextLineThrough.parentNode.style.color = 'white';
					}

					if (toolTextUnderLine.checked) {
						toolTextUnderLine.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextUnderLine.parentNode.style.color = 'white';
					}

					if (fixedTextBold.checked) {
						fixedTextBold.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextBold.parentNode.style.color = 'white';
					}

					if (fixedTextItalic.checked) {
						fixedTextItalic.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextItalic.parentNode.style.color = 'white';
					}

					if (fixedTextLineThrough.checked) {
						fixedTextLineThrough.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextLineThrough.parentNode.style.color = 'white';
					}

					if (fixedTextUnderLine.checked) {
						fixedTextUnderLine.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextUnderLine.parentNode.style.color = 'white';
					}

					break;
				}

				case 'rect': {
					floatingShapeTool.style.left = `${e.e.x}px`;
					floatingShapeTool.style.top = `${e.e.y}px`;
					floatingShapeTool.style.display = '';

					fixedShapeTool.style.display = '';
					fixedTextTool.style.display = 'none';

					textTab.style.backgroundColor = 'rgb(65, 65, 65)';
					shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';

					toolShapeOutlineColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					toolShapeBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					toolShapeStrokeWidth.value = v.shapeOption.strokeWidth;
					toolShapeStrokeShape.value = v.shapeOption.rx;

					fixedShapeOutlineColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					fixedShapeBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					fixedShapeStrokeWidth.value = v.shapeOption.strokeWidth;
					fixedShapeStrokeShape.value = v.shapeOption.rx;

					break;
				}

				default:
					break;
			}
		},

		'selection:updated': (e: any) => {
			textTranslated.disabled = false;

			if (e.selected) {
				for (let i = 0; i < e.selected.length; i++) {
					if (e.selected.length > 1) {
						if (e.selected[0].stroke && e.selected[i].text) {
							fixedTextTool.style.display = '';
							fixedShapeTool.style.display = 'none';

							textTab.style.cursor = 'pointer';
							shapeTab.style.cursor = 'pointer';

							floatingTextTool.style.left = `${e.e.x}px`;
							floatingTextTool.style.top = `${e.e.y}px`;
							floatingTextTool.style.display = '';

							floatingShapeTool.style.left = `${e.e.x}px`;
							floatingShapeTool.style.top = `${e.e.y - 50}px`;
							floatingShapeTool.style.display = '';

							return;
						} else if (e.selected[i].text) {
							fixedTextTool.style.display = '';
							fixedShapeTool.style.display = 'none';

							textTab.style.backgroundColor = 'rgb(80, 80, 80)';
							shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';

							textTab.style.cursor = 'pointer';
							shapeTab.style.cursor = '';

							floatingTextTool.style.display = '';
							floatingTextTool.style.left = `${e.e.x}px`;
							floatingTextTool.style.top = `${e.e.y}px`;
						}
						try {
							if (e.selected[e.selected.length - 1].stroke) {
								fixedTextTool.style.display = 'none';
								fixedShapeTool.style.display = '';

								textTab.style.backgroundColor = 'rgb(65, 65, 65)';
								shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';

								textTab.style.cursor = '';
								shapeTab.style.cursor = 'pointer';

								floatingShapeTool.style.display = '';
								floatingShapeTool.style.left = `${e.e.x}px`;
								floatingShapeTool.style.top = `${e.e.y - 50}px`;
							}
						} catch {
							continue;
						}
					}
				}
			}

			let object = e.selected[0];
			let objectType = object.get('type');

			if (object.id === -1) {
				return;
			}

			let layer = getCurrentLayer();
			let v = layer.object[object.id];

			switch (objectType) {
				case 'i-text': {
					floatingTextTool.style.left = `${e.e.x}px`;
					floatingTextTool.style.top = `${e.e.y}px`;
					floatingTextTool.style.display = '';
					floatingShapeTool.style.display = 'none';

					fixedTextTool.style.display = '';
					fixedShapeTool.style.display = 'none';

					textTab.style.backgroundColor = 'rgb(80, 80, 80)';
					shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';

					textOriginal.value = v.original;
					textTranslated.value = v.text.textLines.join('');
					toolTextColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					toolTextBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					toolTextFont.value = v.textOption.font;
					toolTextSize.value = v.text.fontSize;
					toolTextBold.checked = v.textOption.bold === 'bold' ? true : false;
					toolTextItalic.checked = v.textOption.italic === 'italic' ? true : false;
					toolTextLineThrough.checked = v.textOption.lineThrough === 'lineThrough' ? true : false;
					toolTextUnderLine.checked = v.textOption.underLine === 'underLine' ? true : false;

					fixedTextColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					fixedTextBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					fixedTextFont.value = v.textOption.font;
					fixedTextSize.value = v.text.fontSize;
					fixedTextBold.checked = v.textOption.bold === 'bold' ? true : false;
					fixedTextItalic.checked = v.textOption.italic === 'italic' ? true : false;
					fixedTextLineThrough.checked = v.textOption.lineThrough === 'lineThrough' ? true : false;
					fixedTextUnderLine.checked = v.textOption.underLine === 'underLine' ? true : false;

					if (toolTextBold.checked) {
						toolTextBold.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextBold.parentNode.style.color = 'white';
					}

					if (toolTextItalic.checked) {
						toolTextItalic.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextItalic.parentNode.style.color = 'white';
					}

					if (toolTextLineThrough.checked) {
						toolTextLineThrough.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextLineThrough.parentNode.style.color = 'white';
					}

					if (toolTextUnderLine.checked) {
						toolTextUnderLine.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						toolTextUnderLine.parentNode.style.color = 'white';
					}

					if (fixedTextBold.checked) {
						fixedTextBold.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextBold.parentNode.style.color = 'white';
					}

					if (fixedTextItalic.checked) {
						fixedTextItalic.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextItalic.parentNode.style.color = 'white';
					}

					if (fixedTextLineThrough.checked) {
						fixedTextLineThrough.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextLineThrough.parentNode.style.color = 'white';
					}

					if (fixedTextUnderLine.checked) {
						fixedTextUnderLine.parentNode.style.color = 'rgb(41, 136, 255)';
					} else {
						fixedTextUnderLine.parentNode.style.color = 'white';
					}

					break;
				}

				case 'rect': {
					floatingShapeTool.style.left = `${e.e.x}px`;
					floatingShapeTool.style.top = `${e.e.y}px`;
					floatingTextTool.style.display = 'none';
					floatingShapeTool.style.display = '';

					fixedShapeTool.style.display = '';
					fixedTextTool.style.display = 'none';

					textTab.style.backgroundColor = 'rgb(65, 65, 65)';
					shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';

					toolShapeOutlineColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					toolShapeBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					toolShapeStrokeWidth.value = v.shapeOption.strokeWidth;
					toolShapeStrokeShape.value = v.shapeOption.rx;

					fixedShapeOutlineColor.value = v.foreground
						? ConvertRGBtoHex(v.foreground.R, v.foreground.G, v.foreground.B)
						: undefined;
					fixedShapeBackground.value = v.background
						? ConvertRGBtoHex(v.background.R, v.background.G, v.background.B)
						: undefined;
					fixedShapeStrokeWidth.value = v.shapeOption.strokeWidth;
					fixedShapeStrokeShape.value = v.shapeOption.rx;

					break;
				}

				default:
					break;
			}
		},

		'selection:cleared': (e: any) => {
			textTranslated.disabled = true;

			shapeTab.style.cursor = '';
			textTab.style.cursor = '';

			floatingTextTool.style.display = 'none';
			floatingShapeTool.style.display = 'none';
		},

		'object:modified': (e: any) => {
			try {
				if (e.target.id !== -1) {
					let objectType = e.target.get('type');

					let layer = getCurrentLayer();

					switch (objectType) {
						case 'rect': {
							layer.object[e.target.id].rect = e.target;

							break;
						}

						case 'i-text': {
							layer.object[e.target.id].text = e.target;

							break;
						}

						default:
							break;
					}

					myCanvas.renderAll();
				}

				saveCanvas();
			} catch (e) {
				console.log(e);
			}
		},

		'object:moving': (e: any) => {
			let object = e.target;
			let layer = getCurrentLayer();
			let objects = myCanvas.getActiveObject();
			let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

			let left = Math.floor(object.left / (100 / percentage));
			let top = Math.floor(object.top / (100 / percentage));
			let width = Math.floor((object.width * object.scaleX) / (100 / percentage));
			let height = Math.floor((object.height * object.scaleY) / (100 / percentage));

			if (left < 0) {
				object.set({
					left: 0,
				});
			}

			if (left + width > myCanvas.width) {
				object.set({
					left: (myCanvas.width - width) * (100 / percentage),
				});
			}

			if (top < 0) {
				object.set({
					top: 0,
				});
			}

			if (top + height > myCanvas.height) {
				object.set({
					top: (myCanvas.height - height) * (100 / percentage),
				});
			}

			if (objects.id !== -1) {
				if (objects['_objects']) {
					for (let i in objects['_objects']) {
						let object = objects['_objects'][i];

						objects.set({
							left: parseInt(objects.left),
							top: parseInt(objects.top),
						});
					}
				} else {
					layer.object[objects.id].pos[0].x = parseInt(object.left);
					layer.object[objects.id].pos[0].y = parseInt(object.top);
				}
			}

			myCanvas.renderAll();

			return;
		},

		'object:scaling': (e: any) => {
			let object = e.target;
			let layer = getCurrentLayer();
			let objects = myCanvas.getActiveObject();
			let objectType = e.target.get('type');

			let height = object.getScaledHeight();
			let width = object.getScaledWidth();

			switch (objectType) {
				case 'i-text': {
					let size = Math.round(object.fontSize * object.scaleX);
					object.set({
						fontSize: size,
						scaleX: 1,
						scaleY: 1,
					});

					toolTextSize.value = size;
					if (objects.text !== undefined) {
						layer.object[objects.id].textOption.size = size;
					}
					saveCanvas();
					break;
				}

				default:
					break;
			}

			if (editorMode === 'crop') {
				let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

				let left = Math.floor(object.left / (100 / percentage));
				let top = Math.floor(object.top / (100 / percentage));
				let width = Math.floor((object.width * object.scaleX) / (100 / percentage));
				let height = Math.floor((object.height * object.scaleY) / (100 / percentage));

				if (left < 0 || left + width > myCanvas.width) {
					object.set({
						left: 0,
						width: myCanvas.width * (100 / percentage),
						scaleX: 1.0,
					});
				}

				if (top < 0 || top + height > myCanvas.height) {
					object.set({
						top: 0,
						height: myCanvas.height * (100 / percentage),
						scaleY: 1.0,
					});
				}
			}

			if (objects.id !== -1) {
				if (objects['_objects']) {
					//
				} else {
					layer.object[objects.id].pos[2].x = parseInt(width);
					layer.object[objects.id].pos[3].x = parseInt(width);
					layer.object[objects.id].pos[3].y = parseInt(height);
				}
			}

			myCanvas.renderAll();

			return;
		},

		'object:rotating': (e) => {
			let object = e.target;
			let layer = getCurrentLayer();
			let objects = myCanvas.getActiveObject();

			if (objects.id !== -1) {
				if (objects['_objects']) {
				} else {
					object.set({
						angle: object.angle,
					});
					layer.object[objects.id].pos[0].x = object.left;
					layer.object[objects.id].pos[0].y = object.top;
					layer.object[objects.id].angle = object.angle;
				}
			}

			myCanvas.renderAll();
			return;
		},

		'mouse:over': (e: any) => {
			try {
				if (
					editorMode === 'area-translation' ||
					editorMode === 'area-remove-drag' ||
					editorMode === 'area-remove-brush' ||
					editorMode === 'area-recovery-drag' ||
					editorMode === 'area-recovery-brush' ||
					editorMode === 'crop'
				) {
					return;
				}

				e.target.set('backgroundColor', 'rgba(41, 136, 255, 0.5)');

				myCanvas.renderAll();
			} catch (e) {
				//
			}
		},

		'mouse:out': (e: any) => {
			try {
				if (
					editorMode === 'area-translation' ||
					editorMode === 'area-remove-drag' ||
					editorMode === 'area-remove-brush' ||
					editorMode === 'area-recovery-drag' ||
					editorMode === 'area-recovery-brush' ||
					editorMode === 'crop'
				) {
					return;
				}

				let layer = getCurrentLayer();
				let color = layer.object[e.target.id].background;

				if (layer.object[e.target.id].object === 'i-text') {
					if (color) {
						e.target.set('backgroundColor', `rgb(${color.R}, ${color.G}, ${color.B})`);
					} else {
						e.target.set('backgroundColor', `transparent`);
					}
				} else {
					if (color) {
						e.target.set('backgroundColor', `transparent`);
					}
				}

				myCanvas.renderAll();
			} catch (e) {
				//
			}
		},

		'mouse:down': async (e: any) => {
			isDrag = true;

			areaPos['x'] = [e.absolutePointer.x];
			areaPos['y'] = [e.absolutePointer.y];

			let layer = getCurrentLayer();

			switch (editorMode) {
				case 'area-recovery-drag': {
					let dragArea: any = await mergeImage(layer.image.origin);

					dragImage = new fabric.Image(dragArea);
					dragImage.set({
						visible: false,
					});

					myCanvas.add(dragImage);

					break;
				}

				case 'area-recovery-brush': {
					let dragArea: any = await mergeImage(layer.image.origin);

					dragImage = new fabric.Image(dragArea);
					dragImage.set({
						visible: false,
					});

					myCanvas.add(dragImage);

					break;
				}

				default:
					break;
			}
		},

		'mouse:move': (e: any) => {
			if (!isDrag) {
				return;
			}

			switch (editorMode) {
				case 'area-recovery-drag': {
					let test: any = {
						x: [],
						y: [],
					};

					test['x'].push(areaPos['x'][0]);
					test['y'].push(areaPos['y'][0]);
					test['x'].push(e.absolutePointer.x);
					test['y'].push(e.absolutePointer.y);

					let xMax = Math.max(...test['x']);
					let xMin = Math.min(...test['x']);
					let yMax = Math.max(...test['y']);
					let yMin = Math.min(...test['y']);

					let rect = new fabric.Rect({
						left: xMin - dragImage.width / 2,
						top: yMin - dragImage.height / 2,
						width: xMax - xMin,
						height: yMax - yMin,
					});

					dragImage.set({
						clipPath: rect,
						selectable: false,
						visible: true,
					});

					myCanvas.renderAll();

					break;
				}

				default:
					break;
			}
		},

		'mouse:up': async (e: any) => {
			isDrag = false;

			switch (editorMode) {
				case 'area-translation': {
					loading.style.display = '';

					areaPos['x'].push(e.absolutePointer.x);
					areaPos['y'].push(e.absolutePointer.y);

					let xMax = Math.max(...areaPos['x']);
					let xMin = Math.min(...areaPos['x']);
					let yMax = Math.max(...areaPos['y']);
					let yMin = Math.min(...areaPos['y']);

					let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

					myCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);

					let data = myCanvas.toDataURL({
						left: xMin,
						top: yMin,
						width: xMax - xMin,
						height: yMax - yMin,
					});

					myCanvas.zoomToPoint(new fabric.Point(0, 0), percentage / 100);

					await processVisionData({
						image: data,

						pos: {
							x: xMin,
							y: yMin,
						},
					});

					await toggleToolbar(areaRemove, 'area-translation');
					await saveCanvas();

					loading.style.display = 'none';

					floatingToast(`번역이 완료되었습니다.`, 'information');

					break;
				}

				case 'area-remove-drag': {
					loading.style.display = '';

					areaPos['x'].push(e.absolutePointer.x);
					areaPos['y'].push(e.absolutePointer.y);

					let xMax = Math.max(...areaPos['x']);
					let xMin = Math.min(...areaPos['x']);
					let yMax = Math.max(...areaPos['y']);
					let yMin = Math.min(...areaPos['y']);

					let rect = new fabric.Rect({
						left: xMin,
						top: yMin,
						width: xMax - xMin,
						height: yMax - yMin,
						fill: `white`,
					});

					await getMaskImage([rect]);
					await toggleToolbar(areaRemove, 'area-remove-drag');
					await saveCanvas();

					loading.style.display = 'none';

					floatingToast(`잔상을 제거했습니다.`, 'information');

					break;
				}

				case 'area-remove-brush': {
					loading.style.display = '';

					let objects = myCanvas.getObjects().filter((v: any) => {
						let type = v.get('type');

						if (type !== 'path') {
							return false;
						}

						return true;
					});

					await getMaskImage(objects);

					await toggleToolbar(areaRemove, 'area-remove-brush');
					await saveCanvas();

					loading.style.display = 'none';

					floatingToast(`잔상을 제거했습니다.`, 'information');

					break;
				}

				case 'area-recovery-drag': {
					let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

					loading.style.display = '';

					areaPos['x'].push(e.absolutePointer.x);
					areaPos['y'].push(e.absolutePointer.y);

					let xMax = Math.max(...areaPos['x']);
					let xMin = Math.min(...areaPos['x']);
					let yMax = Math.max(...areaPos['y']);
					let yMin = Math.min(...areaPos['y']);

					let layer = getCurrentLayer();

					let originArea: any = await mergeImage(layer.image.current);
					let originImage = new fabric.Image(originArea);

					let clipArea: any = await mergeImage(layer.image.origin);
					let clipImage: any = new fabric.Image(clipArea);

					let rect = new fabric.Rect({
						left: xMin - clipImage.width / 2,
						top: yMin - clipImage.height / 2,
						width: xMax - xMin,
						height: yMax - yMin,
					});

					clipImage.set({
						clipPath: rect,
						selectable: false,
					});

					myCanvas.clear();

					myCanvas.add(originImage);
					myCanvas.add(clipImage);

					myCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);
					myCanvas.setDimensions({
						width: myCanvas.width * (100 / percentage),
						height: myCanvas.height * (100 / percentage),
					});

					let dataUrl = myCanvas.toDataURL();

					layer.image.current = dataUrl;

					await displayImage(currentImageIndex, 0);
					await toggleToolbar(areaRecovery, 'area-recovery-drag');
					await saveCanvas();

					loading.style.display = 'none';

					floatingToast(`영역이 복구되었습니다.`, 'information');

					break;
				}

				case 'area-recovery-brush': {
					let percentage = Math.round(parseInt(previewSize.value) / 10) * 10 + 10;

					loading.style.display = '';

					areaPos['x'].push(e.absolutePointer.x);
					areaPos['y'].push(e.absolutePointer.y);

					let xMin = Math.min(...areaPos['x']);
					let yMin = Math.min(...areaPos['y']);

					let layer = getCurrentLayer();

					let originArea: any = await mergeImage(layer.image.current);
					let originImage = new fabric.Image(originArea);

					let clipArea: any = await mergeImage(layer.image.origin);
					let clipImage: any = new fabric.Image(clipArea);

					let objects = myCanvas.getObjects().filter((v: any) => {
						let type = v.get('type');

						if (type !== 'path') {
							return false;
						}

						myCanvas.remove(v);

						return true;
					});

					let paths = new fabric.Group(objects, {
						left: xMin - clipImage.width / 2 - 25,
						top: yMin - clipImage.height / 2 - 25,
					});

					clipImage.set({
						clipPath: paths,
						selectable: false,
					});

					myCanvas.clear();

					myCanvas.add(originImage);
					myCanvas.add(clipImage);

					myCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);
					myCanvas.setDimensions({
						width: myCanvas.width * (100 / percentage),
						height: myCanvas.height * (100 / percentage),
					});

					let dataUrl = myCanvas.toDataURL();

					layer.image.current = dataUrl;

					await displayImage(currentImageIndex, 0);
					await toggleToolbar(areaRecovery, 'area-recovery-brush');
					await saveCanvas();

					loading.style.display = 'none';

					floatingToast(`영역이 복구되었습니다.`, 'information');

					break;
				}

				default:
					break;
			}
		},
	});
};

const setTextFont = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			layer.object[object.id].textOption.font = e.target.value;
			layer.object[object.id].text.set({
				fontFamily: e.target.value,
			});
		}
	} else {
		layer.object[objects.id].textOption.font = e.target.value;
		layer.object[objects.id].text.set({
			fontFamily: e.target.value,
		});
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextSize = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].textOption.size = parseInt(e.target.value);
				layer.object[object.id].text.set({
					fontSize: parseInt(e.target.value),
				});
			}
		}
	} else {
		layer.object[objects.id].textOption.size = parseInt(e.target.value);
		layer.object[objects.id].text.set({
			fontSize: parseInt(e.target.value),
		});
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextColor = async (e: any) => {
	let color: any = hexToRgb(e.target.value);
	let objects = myCanvas.getActiveObject();

	if (!objects) {
		return;
	}

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].foreground = {
					R: color.r,
					G: color.g,
					B: color.b,
				};

				object.set({
					fill: e.target.value,
				});
			}
		}
	} else {
		layer.object[objects.id].foreground = {
			R: color.r,
			G: color.g,
			B: color.b,
		};

		objects.set({
			fill: e.target.value,
		});
	}

	myCanvas.renderAll();
};

const setTextBackground = async (e: any) => {
	let color: any = hexToRgb(e.target.value);
	let objects = myCanvas.getActiveObject();

	if (!objects) {
		return;
	}

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].background = {
					R: color.r,
					G: color.g,
					B: color.b,
				};

				object.set({
					backgroundColor: e.target.value,
				});
			}
		}
	} else {
		layer.object[objects.id].background = {
			R: color.r,
			G: color.g,
			B: color.b,
		};

		objects.set({
			backgroundColor: e.target.value,
		});
	}

	myCanvas.renderAll();
};

const setShapeColor = async (e: any) => {
	let color: any = hexToRgb(e.target.value);
	let objects = myCanvas.getActiveObject();

	if (!objects) {
		return;
	}

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'rect') {
				layer.object[object.id].foreground = {
					R: color.r,
					G: color.g,
					B: color.b,
				};

				object.set({
					stroke: `rgb(${color.r}, ${color.g}, ${color.b})`,
				});
			}
		}
	} else {
		layer.object[objects.id].foreground = {
			R: color.r,
			G: color.g,
			B: color.b,
		};

		objects.set({
			stroke: `rgb(${color.r}, ${color.g}, ${color.b})`,
		});
	}

	myCanvas.renderAll();
};

const setShapeStrokeWidth = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	if (!objects) {
		return;
	}

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'rect') {
				layer.object[object.id].shapeOption.strokeWidth = parseInt(e.target.value);

				object.set({
					strokeWidth: parseInt(e.target.value),
				});
			}
		}
	} else {
		layer.object[objects.id].shapeOption.strokeWidth = parseInt(e.target.value);

		objects.set({
			strokeWidth: parseInt(e.target.value),
		});
	}

	myCanvas.renderAll();
};

const setShapeStrokeShape = async (e) => {
	let objects = myCanvas.getActiveObject();
	let layer = getCurrentLayer();

	if (!objects) {
		return;
	}

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'rect') {
				layer.object[object.id].shapeOption.rx = parseInt(e.target.value);
				layer.object[object.id].shapeOption.ry = parseInt(e.target.value);

				object.set({
					rx: parseInt(e.target.value),
					ry: parseInt(e.target.value),
				});
			}
		}
	} else {
		layer.object[objects.id].shapeOption.rx = parseInt(e.target.value);
		layer.object[objects.id].shapeOption.ry = parseInt(e.target.value);

		objects.set({
			rx: parseInt(e.target.value),
			ry: parseInt(e.target.value),
		});
	}
	myCanvas.renderAll();
};

const setShapeBackground = async (e: any) => {
	let color: any = hexToRgb(e.target.value);
	let objects = myCanvas.getActiveObject();

	if (!objects) {
		return;
	}

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'rect') {
				layer.object[object.id].background = {
					R: color.r,
					G: color.g,
					B: color.b,
				};

				object.set({
					fill: e.target.value,
				});
			}
		}
	} else {
		layer.object[objects.id].background = {
			R: color.r,
			G: color.g,
			B: color.b,
		};

		objects.set({
			fill: e.target.value,
		});
	}

	myCanvas.renderAll();
};

const setTextBold = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].textOption.bold = e.target.checked ? 'bold' : 'normal';
				layer.object[object.id].text.set({
					fontWeight: e.target.checked ? 'bold' : 'normal',
				});
			}
		}
	} else {
		layer.object[objects.id].textOption.bold = e.target.checked ? 'bold' : 'normal';
		layer.object[objects.id].text.set({
			fontWeight: e.target.checked ? 'bold' : 'normal',
		});
	}

	if (e.target.checked) {
		e.target.parentNode.style.color = 'rgb(41, 136, 255)';
	} else {
		e.target.parentNode.style.color = 'white';
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextItalic = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].textOption.italic = e.target.checked ? 'italic' : 'normal';
				layer.object[object.id].text.set({
					fontStyle: e.target.checked ? 'italic' : 'normal',
				});
			}
		}
	} else {
		layer.object[objects.id].textOption.italic = e.target.checked ? 'italic' : 'normal';
		layer.object[objects.id].text.set({
			fontStyle: e.target.checked ? 'italic' : 'normal',
		});
	}

	if (e.target.checked) {
		e.target.parentNode.style.color = 'rgb(41, 136, 255)';
	} else {
		e.target.parentNode.style.color = 'white';
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextLineThrough = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].textOption.lineThrough = e.target.checked ? 'lineThrough' : 'normal';
				layer.object[object.id].text.set({
					linethrough: e.target.checked,
				});
			}
		}
	} else {
		layer.object[objects.id].textOption.lineThrough = e.target.checked ? 'lineThrough' : 'normal';
		layer.object[objects.id].text.set({
			linethrough: e.target.checked,
		});
	}

	if (e.target.checked) {
		e.target.parentNode.style.color = 'rgb(41, 136, 255)';
	} else {
		e.target.parentNode.style.color = 'white';
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextUnderLine = async (e: any) => {
	let objects = myCanvas.getActiveObject();

	let layer = getCurrentLayer();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			if (layer.object[object.id].object == 'i-text') {
				layer.object[object.id].textOption.underLine = e.target.checked ? 'underLine' : 'normal';
				layer.object[object.id].text.set({
					underline: e.target.checked,
				});
			}
		}
	} else {
		layer.object[objects.id].textOption.underLine = e.target.checked ? 'underLine' : 'normal';
		layer.object[objects.id].text.set({
			underline: e.target.checked,
		});
	}

	if (e.target.checked) {
		e.target.parentNode.style.color = 'rgb(41, 136, 255)';
	} else {
		e.target.parentNode.style.color = 'white';
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setTextAlign = async (direction: any) => {
	let objects = myCanvas.getActiveObject();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			object.set({
				textAlign: direction,
			});
		}
	} else {
		objects.set({
			textAlign: direction,
		});
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const setGroupAlign = async (direction: any) => {
	let objects = myCanvas.getActiveObject();

	if (objects['_objects']) {
		for (let i in objects['_objects']) {
			let object = objects['_objects'][i];

			switch (direction) {
				case 'left': {
					object.set({
						left: 0 - objects.width / 2,
					});

					break;
				}

				case 'center': {
					object.set({
						left: 0 - object.width / 2,
					});

					break;
				}

				case 'right': {
					object.set({
						left: objects.width / 2 - object.width,
					});

					break;
				}

				case 'top': {
					object.set({
						top: 0 - objects.height / 2,
					});

					break;
				}

				case 'middle': {
					object.set({
						top: 0 - object.height / 2,
					});

					break;
				}

				case 'bottom': {
					object.set({
						top: objects.height / 2 - object.height,
					});

					break;
				}

				default:
					break;
			}
		}
	}

	myCanvas.renderAll();

	await saveCanvas();
};

const toggleInit = (mode: string) => {
	switch (mode) {
		case 'area-translation': {
			startRegion.disabled = false;
			endRegion.disabled = false;

			break;
		}

		case 'area-remove-drag': {
			areaRemoveSelect.style.display = 'none';

			break;
		}

		case 'area-remove-brush': {
			areaRemoveSelect.style.display = 'none';

			myCanvas.isDrawingMode = false;

			break;
		}

		case 'area-recovery-drag': {
			areaRecoverySelect.style.display = 'none';

			break;
		}

		case 'area-recovery-brush': {
			areaRecoverySelect.style.display = 'none';

			myCanvas.isDrawingMode = false;

			break;
		}

		case 'crop': {
			mainCrop.style.display = 'none';
			mainTextEditor.style.display = '';

			break;
		}

		case 'watermark': {
			mainWaterMark.style.display = 'none';
			mainTextEditor.style.display = '';

			break;
		}

		case 'download': {
			mainDownload.style.display = 'none';

			// originWidthPCLayout.style.display = "none";
			// originWidthURLLayout.style.display = "none";

			break;
		}

		// case "this-download": {
		//     thisDownload.style.display = "none";

		//     break;
		// }

		default:
			break;
	}
};

const toggleToolbar = async (element: any, mode: string) => {
	let buttons = document.getElementsByClassName('toolbar');

	for (let i = 0; i < buttons.length; i++) {
		if (element.getAttribute('key') === buttons[i].getAttribute('key')) {
			if (editorMode === mode) {
				editorMode = 'idle';

				buttons[i].className = 'toolbar button default btnTooltip';

				toggleInit(mode);
			} else {
				if (editorMode !== 'idle') {
					toggleInit(editorMode);
				}

				// editorMode = mode;
				// buttons[i].className = "toolbar button primary";

				switch (mode) {
					case 'area-remove-drag': {
						removeType = mode;

						areaRemove.innerHTML = `<span class="btnKeys_bottom">잔상제거 </br> Shift + 4</span> <img src="resources/17eraserdrag.svg" alt="" width="30px" />`;
						areaRemoveSelect.style.display = 'none';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'area-remove-brush': {
						removeType = mode;

						areaRemove.innerHTML = `<span class="btnKeys_bottom">잔상제거 </br> Shift + 4</span> <img src="resources/18eraserbrush.svg" alt="" width="30px" />`;
						areaRemoveSelect.style.display = 'none';

						myCanvas.isDrawingMode = true;
						myCanvas.freeDrawingBrush.width = 50;
						myCanvas.freeDrawingBrush.color = 'white';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'area-recovery-drag': {
						recoveryType = mode;

						areaRecovery.innerHTML = `<span class="btnKeys_bottom">영역복구 </br> Shift + 5</span> <img src="resources/19restoredrag.svg" alt="" width="30px" />`;
						areaRecoverySelect.style.display = 'none';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'area-recovery-brush': {
						recoveryType = mode;

						areaRecovery.innerHTML = `<span class="btnKeys_bottom">영역복구 </br> Shift + 5</span> <img src="resources/20restorebrush.svg" alt="" width="30px" />`;
						areaRecoverySelect.style.display = 'none';

						myCanvas.isDrawingMode = true;
						myCanvas.freeDrawingBrush.width = 50;
						myCanvas.freeDrawingBrush.color = 'white';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'area-translation': {
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'crop': {
						mainCrop.style.display = '';
						mainTextEditor.style.display = 'none';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'watermark': {
						mainWaterMark.style.display = '';
						mainTextEditor.style.display = 'none';
						buttons[i].className = 'toolbar button primary btnTooltip';

						break;
					}

					case 'download': {
						let accept = confirm('모든 이미지가 셀포유에 적용됩니다.\n편집이 모두 완료되었는지 확인 후 저장해주세요.');
						buttons[i].className = 'toolbar button default btnTooltip';

						if (!accept) {
							return;
						}

						mainDownload.style.display = '';
						// thisDownload.style.display = "none";

						// if (currentType === "0") {
						//     originWidthPCLayout.style.display = "";
						//     originWidthURLLayout.style.display = "none";
						// } else {
						//     originWidthPCLayout.style.display = "none";
						//     originWidthURLLayout.style.display = "";
						// }

						break;
					}

					// case "this-download": {

					//     thisDownload.style.display = "";
					//     mainDownload.style.display = "none";
					//     buttons[i].className = "toolbar button default btnTooltip";

					//     break;
					// }

					default:
						break;
				}
				editorMode = mode;
			}

			continue;
		}

		buttons[i].className = 'toolbar button default btnTooltip';
	}

	await displayImage(currentImageIndex, 0);
};

const addShape = async () => {
	let color = {
		r: 0,
		g: 0,
		b: 0,
	};

	let info = {
		object: 'rect',

		pos: [
			{
				x: 0,
				y: 0,
			},
			{
				x: 150,
				y: 0,
			},
			{
				x: 150,
				y: 150,
			},
			{
				x: 0,
				y: 150,
			},
		],

		background: isShapeFill
			? {
					B: color.b,
					G: color.g,
					R: color.r,
			  }
			: undefined,

		shapeOption: {
			strokeWidth: 0,
			rx: 0,
			ry: 0,
		},
	};

	let layer = getCurrentLayer();

	layer.object.push(info);

	await displayImage(currentImageIndex, 0);
	await saveCanvas();
};

const addText = async () => {
	let color: any = hexToRgb(toolTextColor.value);

	let info = {
		object: 'i-text',

		pos: [
			{
				x: 0,
				y: 0,
			},
			{
				x: 300,
				y: 0,
			},
			{
				x: 300,
				y: 300,
			},
			{
				x: 0,
				y: 300,
			},
		],

		original: '',
		translated: '텍스트를 입력해주세요.',

		textOption: {
			font: 'NNSQUAREROUNDR',
			size: 50,
			bold: 'normal',
			italic: 'normal',
			lineThrough: '',
			underLine: '',
		},

		foreground: {
			B: 0,
			G: 0,
			R: 0,
		},
	};

	let layer = getCurrentLayer();

	layer.object.push(info);

	await displayImage(currentImageIndex, 0);
	await saveCanvas();
};

const setTextTab = () => {
	let objects = myCanvas.getActiveObject();
	let layer = getCurrentLayer();
	let length = Object.keys(objects['_objects']).length;

	if (objects['_objects']) {
		for (let i = 0; i < length; i++) {
			if (objects['_objects'][i].text) {
				textTab.style.backgroundColor = 'rgb(80, 80, 80)';
				shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';
				fixedTextTool.style.display = '';
				fixedShapeTool.style.display = 'none';
			}
		}
	} else {
		if (layer.object[objects.id].object == 'i-text') {
			textTab.style.backgroundColor = 'rgb(80, 80, 80)';
			shapeTab.style.backgroundColor = 'rgb(65, 65, 65)';
			fixedTextTool.style.display = '';
			fixedShapeTool.style.display = 'none';
		}
	}
};

const addTextVertical = async () => {
	let info = {
		object: 'i-text',

		pos: [
			{
				x: 0,
				y: 0,
			},
			{
				x: 300,
				y: 0,
			},
			{
				x: 300,
				y: 300,
			},
			{
				x: 0,
				y: 300,
			},
		],

		original: '',
		translated: '텍\n스\n트\n를\n입\n력\n해\n주\n세\n요',

		textOption: {
			font: 'NNSQUAREROUNDR',
			size: 50,
			bold: 'normal',
			italic: 'normal',
			lineThrough: '',
			underLine: '',
			direction: 'vertical',
		},

		foreground: {
			B: 0,
			G: 0,
			R: 0,
		},
	};

	let layer = getCurrentLayer();
	layer.object.push(info);

	await displayImage(currentImageIndex, 0);
	await saveCanvas();
};

const setShapeTab = () => {
	let objects = myCanvas.getActiveObject();
	let layer = getCurrentLayer();
	let length = Object.keys(objects['_objects']).length;

	if (objects['_objects']) {
		for (let i = 0; i < length; i++) {
			if (objects['_objects'][i].stroke) {
				textTab.style.backgroundColor = 'rgb(65, 65, 65)';
				shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';
				fixedTextTool.style.display = 'none';
				fixedShapeTool.style.display = '';
			}
		}
	} else {
		if (layer.object[objects.id].object == 'rect') {
			textTab.style.backgroundColor = 'rgb(65, 65, 65)';
			shapeTab.style.backgroundColor = 'rgb(80, 80, 80)';
			fixedTextTool.style.display = 'none';
			fixedShapeTool.style.display = '';
		}
	}
};

const multiple = async () => {
	console.log('멀티플작동');
	cancel = false;

	loading.style.display = '';
	layers.map((v, i) => {
		console.log(`${i}번 레이어`);
		console.log({ v });
	});
	let filtered = layers.filter((v: any) => v.type === currentType && v.state.check === 'checked');
	for (let i = 0; i < filtered.length; i++) {
		if (cancel) {
			floatingToast(`번역이 중지되었습니다.`, 'failed');

			startRegion.disabled = false;
			endRegion.disabled = false;

			loading.style.display = 'none';

			return;
		}

		await displayImage(filtered[i].index, 0);

		saveCanvas();

		await processVisionData(null);

		floatingToast(`번역 중... (${i + 1}/${filtered.length} 완료)`, 'information');
	}

	startRegion.disabled = false;
	endRegion.disabled = false;

	loading.style.display = 'none';
	if (testLayer !== 1) {
		for (let i = 0; i < filtered.length; i++) {
			if (cancel) {
				floatingToast(`번역이 중지되었습니다.`, 'failed');

				startRegion.disabled = false;
				endRegion.disabled = false;

				loading.style.display = 'none';

				return;
			}

			await displayImage(filtered[i].index, 0);

			saveCanvas();

			await processVisionData(null);

			floatingToast(`번역 중... (${i + 1}/${filtered.length} 완료)`, 'information');
		}
	}

	floatingToast(`번역이 완료되었습니다.`, 'information');
};

const single = async () => {
	console.log('싱글작동');
	loading.style.display = '';

	await processVisionData(null);

	saveCanvas();

	startRegion.disabled = false;
	endRegion.disabled = false;

	loading.style.display = 'none';

	floatingToast(`번역이 완료되었습니다.`, 'information');
};

const recovery = () => {
	let accept = confirm('모든 이미지를 적용 전으로 되돌리시겠습니까?');

	if (accept) {
		window.location.reload();
	}
};

const exit = () => {
	let accept = confirm('편집을 종료하시겠습니까?');

	if (!accept) {
		return;
	}

	window.close();
};

const thisRecovery = async () => {
	let accept = confirm('현재 이미지를 적용 전으로 되돌리시겠습니까?');
	let layer = getCurrentLayer();

	if (accept) {
		let originalMerged: any = await mergeImage(layer.image.origin);
		let originalImage = new fabric.Image(originalMerged);

		layer.object.length = 0;
		layer.state.current = {};

		originalImage.set({
			selectable: false,
		});

		orgCanvas.setDimensions({
			width: originalImage.width,
			height: originalImage.height,
		});

		orgCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);

		let imageData = orgCanvas.toDataURL();

		layer.image.current = imageData;
	}
	displayImage(currentImageIndex, 0);
};

const zoomOut = async () => {
	let percentage = parseInt(previewSize.value);

	if (percentage - 10 < 0) {
		percentage = 0;
	} else {
		percentage = percentage - 10;
	}

	previewSize.value = percentage;

	displayImage(currentImageIndex, 0);
};

const zoomIn = async () => {
	let percentage = parseInt(previewSize.value);
	if (percentage + 10 > 200) {
		percentage = 200;
	} else {
		percentage = percentage + 10;
	}

	previewSize.value = percentage;

	displayImage(currentImageIndex, 0);
};
//avif 확장자의 경우 버킷에 저장하고 다시 번역하게끔 저장하는 부분
const saveBadImage = async () => {
	loading.style.display = '';

	let uploadData: any = {
		productId: product.id,
		thumbnails: [],
		optionValues: [],
	};

	let description: any = null;

	if (currentType === '3') {
		let matched = /product\/[0-9]+\/description.html/.test(product.description);

		if (matched) {
			let desc_resp = await fetch(`${ENDPOINT_IMAGE}/sellforyou/${product.description}?${new Date().getTime()}`);

			description = await desc_resp.text();
		} else {
			description = product.description;
		}
	}

	let layer = getCurrentLayer();

	let dataUrl = null;
	switch (currentType) {
		case '1': {
			if (applyOriginWidthThumbnail.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthThumbnail.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			uploadData.thumbnails.push({
				index: currentImageIndex,
				uploadImageBase64: dataUrl,
			});

			break;
		}

		case '2': {
			if (applyOriginWidthOption.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthOption.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			for (let j in product.productOptionName) {
				console.log({ j });
				for (let k in product.productOptionName[j].productOptionValue) {
					console.log({ k });
					let option = product.productOptionName[j].productOptionValue[k];
					let optionImage = /product\/[0-9]+\/option/.test(option.image)
						? `${ENDPOINT_IMAGE}/sellforyou/${option.image}`
						: option.image;

					if (layer.image.origin === optionImage) {
						uploadData.optionValues.push({
							id: option.id,
							image: optionImage,
							newImageBase64: dataUrl,
						});
					}
				}
			}

			break;
		}

		case '3': {
			if (applyOriginWidthDescription.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthDescription.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			if (description.includes('&amp;')) description = description.replaceAll('&amp;', '&');

			description = description.replaceAll(layer.image.origin, dataUrl);

			break;
		}

		default:
			break;
	}

	if (currentType === '3') {
		if (description) {
			uploadData.description = description;
		}
	}
	console.log({ uploadData });
	let uploadQuery = `mutation TEST($productId: Int!, $thumbnails: [ProductNewThumbnailImageUpdateInput!], $optionValues: [ProductOptionValueImageUpdateInput!]!, $description:String) {
        updateNewProductImageBySomeone(
            productId: $productId, 
            description: $description, 
            thumbnails: $thumbnails,
            optionValues: $optionValues
        )
    }`;

	let upload_json = await gql(uploadQuery, uploadData, false);

	loading.style.display = 'none';

	if (upload_json.errors) {
		alert(upload_json.errors[0].message);

		return;
	}

	if (upload_json.data) {
		chrome.runtime.sendMessage(
			{
				action: 'trangers',
				source: JSON.parse(upload_json.data.updateNewProductImageBySomeone),
			},
			async () => {},
		);
	} else {
		alert(upload_json.errors[0].message);
	}
};
const saveSingle = async () => {
	let accept = confirm('적용 시 이미지를 되돌릴 수 없습니다.');

	if (!accept) {
		return;
	}

	loading.style.display = '';

	let uploadData: any = {
		productId: product.id,
		thumbnails: [],
		optionValues: [],
	};

	let description: any = null;

	if (currentType === '3') {
		let matched = /product\/[0-9]+\/description.html/.test(product.description);

		if (matched) {
			let desc_resp = await fetch(`${ENDPOINT_IMAGE}/sellforyou/${product.description}?${new Date().getTime()}`);

			description = await desc_resp.text();
		} else {
			description = product.description;
		}
	}

	let layer = getCurrentLayer();

	let dataUrl = null;

	switch (currentType) {
		case '1': {
			if (applyOriginWidthThumbnail.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthThumbnail.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			uploadData.thumbnails.push({
				index: currentImageIndex,
				uploadImageBase64: dataUrl,
			});

			break;
		}

		case '2': {
			if (applyOriginWidthOption.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthOption.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			for (let j in product.productOptionName) {
				for (let k in product.productOptionName[j].productOptionValue) {
					let option = product.productOptionName[j].productOptionValue[k];
					let optionImage = /product\/[0-9]+\/option/.test(option.image)
						? `${ENDPOINT_IMAGE}/sellforyou/${option.image}`
						: option.image;

					if (layer.image.origin === optionImage) {
						uploadData.optionValues.push({
							id: option.id,
							image: optionImage,
							newImageBase64: dataUrl,
						});
					}
				}
			}

			break;
		}

		case '3': {
			if (applyOriginWidthDescription.value === 'N') {
				dataUrl = await displayImage(currentImageIndex, originWidthDescription.value);
			} else {
				dataUrl = await displayImage(currentImageIndex, 0);
			}

			if (description.includes('&amp;')) description = description.replaceAll('&amp;', '&');

			description = description.replaceAll(layer.image.origin, dataUrl);

			break;
		}

		default:
			break;
	}

	if (currentType === '3') {
		if (description) {
			uploadData.description = description;
		}
	}

	let uploadQuery = `mutation TEST($productId: Int!, $thumbnails: [ProductNewThumbnailImageUpdateInput!], $optionValues: [ProductOptionValueImageUpdateInput!]!, $description:String) {
        updateNewProductImageBySomeone(
            productId: $productId, 
            description: $description, 
            thumbnails: $thumbnails,
            optionValues: $optionValues
        )
    }`;

	let upload_json = await gql(uploadQuery, uploadData, false);

	loading.style.display = 'none';

	if (upload_json.errors) {
		alert(upload_json.errors[0].message);

		return;
	}

	if (upload_json.data) {
		chrome.runtime.sendMessage(
			{
				action: 'trangers',
				source: JSON.parse(upload_json.data.updateNewProductImageBySomeone),
			},
			() => {
				if (thisImageSave.getAttribute('key') == '5') {
					window.close();
				}
			},
		);

		floatingToast(`현재 이미지가 셀포유에 적용되었습니다.`, 'success');
	} else {
		alert(upload_json.errors[0].message);
	}
};

const saveMultiple = async () => {
	console.log('세이브멀티플 발동');
	loading.style.display = '';

	let uploadData: any = {
		productId: product.id,
		thumbnails: [],
		optionValues: [],
	};

	let description: any = null;

	if (currentType === '3') {
		let matched = /product\/[0-9]+\/description.html/.test(product.description);

		if (matched) {
			let desc_resp = await fetch(`${ENDPOINT_IMAGE}/sellforyou/${product.description}?${new Date().getTime()}`);

			description = await desc_resp.text();
		} else {
			description = product.description;
		}
	}
	console.log({ layers });
	let filtered = layers.filter((v: any) => v.type === currentType && v.image.origin !== '');

	for (let i = 0; i < filtered.length; i++) {
		let dataUrl = null;

		switch (currentType) {
			case '1': {
				if (applyOriginWidthThumbnail.value === 'N') {
					dataUrl = await displayImage(filtered[i].index, originWidthThumbnail.value);
				} else {
					dataUrl = await displayImage(filtered[i].index, 0);
				}

				uploadData.thumbnails.push({
					index: filtered[i].index,
					uploadImageBase64: dataUrl,
				});

				break;
			}

			case '2': {
				if (applyOriginWidthOption.value === 'N') {
					dataUrl = await displayImage(filtered[i].index, originWidthOption.value);
					console.log({ dataUrl });
				} else {
					dataUrl = await displayImage(filtered[i].index, 0);
					console.log({ dataUrl });
				}

				for (let j in product.productOptionName) {
					for (let k in product.productOptionName[j].productOptionValue) {
						let option = product.productOptionName[j].productOptionValue[k];
						if (option.image === '') continue;
						let optionImage = /product\/[0-9]+\/option/.test(option.image)
							? `${ENDPOINT_IMAGE}/sellforyou/${option.image}`
							: option.image;

						if (filtered[i].image.origin === optionImage) {
							console.log('filtered[i].image.origin : ' + filtered[i].image.origin);
							console.log('optionImage : ' + optionImage);
							uploadData.optionValues.push({
								id: option.id,
								image: optionImage,
								newImageBase64: dataUrl,
							});
						}
					}
				}

				break;
			}

			case '3': {
				if (applyOriginWidthDescription.value === 'N') {
					dataUrl = await displayImage(filtered[i].index, originWidthDescription.value);
				} else {
					dataUrl = await displayImage(filtered[i].index, 0);
				}

				if (description.includes('&amp;')) description = description.replaceAll('&amp;', '&');

				description = description.replaceAll(filtered[i].image.origin, dataUrl);

				break;
			}

			default:
				break;
		}
	}

	if (currentType === '3') {
		if (description) {
			uploadData.description = description;
		}
	}
	console.log({ uploadData });
	let uploadQuery = `mutation TEST($productId: Int!, $thumbnails: [ProductNewThumbnailImageUpdateInput!], $optionValues: [ProductOptionValueImageUpdateInput!]!, $description:String) {
        updateNewProductImageBySomeone(
            productId: $productId, 
            description: $description, 
            thumbnails: $thumbnails,
            optionValues: $optionValues
        )
    }`;

	let upload_json = await gql(uploadQuery, uploadData, false);

	loading.style.display = 'none';

	if (upload_json.errors) {
		alert(upload_json.errors[0].message);

		return;
	}
	// return alert('강제종료!');
	if (upload_json.data) {
		console.log(JSON.parse(upload_json.data.updateNewProductImageBySomeone));
		chrome.runtime.sendMessage(
			{
				action: 'trangers',
				source: JSON.parse(upload_json.data.updateNewProductImageBySomeone),
			},
			() => window.close(),
		);
	} else {
		alert(upload_json.errors[0].message);
	}
};

const imageToolHelper = () => {
	if (product.activeTaobaoProduct.shopName === 'express' || product.activeTaobaoProduct.shopName.includes('amazon')) {
		startRegion.value = 'en';
	}

	let radioList: any = document.getElementsByName('cropRatioType');

	for (let i = 0; i < radioList.length; i++) {
		radioList[i].addEventListener('change', (e: any) => {
			for (let j = 0; j < radioList.length; j++) {
				if (e.target.value === radioList[j].value) {
					radioList[j].parentNode.className = 'radio activated';

					cropRatioType = e.target.value;

					displayImage(currentImageIndex, 0);
				} else {
					radioList[j].parentNode.className = 'radio default';
				}
			}
		});
	}

	textTranslated.addEventListener('keyup', (e: any) => {
		let objects = myCanvas.getActiveObject();

		let layer = getCurrentLayer();

		if (objects) {
			if (objects['_objects']) {
				for (let i in objects['_objects']) {
					let object = objects['_objects'][i];
					let objectType = object.get('type');
					let objectDirection = layer.object[object.id].textOption.direction;

					switch (objectType) {
						case 'i-text': {
							if (objectDirection == 'vertical') {
								layer.object[object.id].translated = e.target.value;
								layer.object[object.id].text.set({
									text: e.target.value.match(/.{1}/g).join('\n'),
								});
							} else {
								layer.object[object.id].translated = e.target.value;
								layer.object[object.id].text.set({
									text: e.target.value,
								});
							}

							break;
						}

						default:
							break;
					}
				}
			} else {
				let objectType = objects.get('type');
				let objectDirection = layer.object[objects.id].textOption.direction;

				switch (objectType) {
					case 'i-text': {
						if (objectDirection == 'vertical') {
							layer.object[objects.id].translated = e.target.value;
							layer.object[objects.id].text.set({
								text: e.target.value.match(/.{1}/g).join('\n'),
							});
						} else {
							layer.object[objects.id].translated = e.target.value;
							layer.object[objects.id].text.set({
								text: e.target.value,
							});
						}

						break;
					}

					default:
						break;
				}
			}

			myCanvas.renderAll();
		}
	});

	multipleTranslation.addEventListener('click', multiple);
	singleTranslation.addEventListener('click', single);

	areaTranslation.addEventListener('click', () => toggleToolbar(areaTranslation, 'area-translation'));

	// multipleRemove.addEventListener('click', () => {
	//     props.floatingToast(`전체제거 - 준비 중인 기능입니다.`, 'failed');
	// });

	// singleRemove.addEventListener('click', () => {
	//     props.floatingToast(`영역제거 - 준비 중인 기능입니다.`, 'failed');
	// });

	areaRemoveDrag.addEventListener('click', () => toggleToolbar(areaRemove, 'area-remove-drag'));
	areaRemoveBrush.addEventListener('click', () => toggleToolbar(areaRemove, 'area-remove-brush'));
	areaRemove.addEventListener('click', () => toggleToolbar(areaRemove, removeType));
	areaRemoveType.addEventListener('click', () => {
		if (areaRemoveSelect.style.display === '') {
			areaRemoveSelect.style.display = 'none';
		} else {
			areaRemoveSelect.style.display = '';
		}

		areaRecoverySelect.style.display = 'none';
		shapeSelect.style.display = 'none';
		textSelect.style.display = 'none';
	});

	areaRecoveryDrag.addEventListener('click', () => toggleToolbar(areaRecovery, 'area-recovery-drag'));
	areaRecoveryBrush.addEventListener('click', () => toggleToolbar(areaRecovery, 'area-recovery-brush'));
	areaRecovery.addEventListener('click', () => toggleToolbar(areaRecovery, recoveryType));
	areaRecoveryType.addEventListener('click', () => {
		if (areaRecoverySelect.style.display === '') {
			areaRecoverySelect.style.display = 'none';
		} else {
			areaRecoverySelect.style.display = '';
		}

		areaRemoveSelect.style.display = 'none';
		shapeSelect.style.display = 'none';
		textSelect.style.display = 'none';
	});

	cropStart.addEventListener('click', () => toggleToolbar(cropStart, 'crop'));
	cropCancel.addEventListener('click', () => toggleToolbar(cropStart, 'crop'));
	cropAccept.addEventListener('click', async () => {
		let croppedWidth = cropRectangle.width * cropRectangle.scaleX;
		let croppedHeight = cropRectangle.height * cropRectangle.scaleY;

		myCanvas.zoomToPoint(new fabric.Point(0, 0), 1.0);

		let dataUrl = myCanvas.toDataURL({
			left: cropRectangle.left + 1,
			top: cropRectangle.top + 1,
			width: croppedWidth - 1,
			height: croppedHeight - 1,
			globalCompositeOperation: 'source-over',
		});

		let layer = getCurrentLayer();

		layer.image.current = dataUrl;

		await toggleToolbar(cropStart, 'crop');
		await saveCanvas();

		floatingToast(`변경사항이 저장되었습니다.`, 'success');
	});

	shapeFill.addEventListener('click', () => {
		isShapeFill = true;
		shapeSelect.style.display = 'none';

		shapeStart.innerHTML = `<img src="resources/08figurebox.svg" alt="" width="30px" />`;

		addShape();
	});

	// shapeOutlined.addEventListener('click', () => {
	//     isShapeFill = false;
	//     shapeSelect.style.display = "none";

	//     shapeStart.innerHTML = `<img src="resources/09figureline.svg" alt="" width="34px" />`;

	//     addShape();
	// });

	// ovalOutlined.addEventListener('click', () => {
	//     isShapeFill = false;
	//     shapeSelect.style.display = "none";

	//     shapeStart.innerHTML = `<img src="resources/09figureline.svg" alt="" width="34px" />`;

	//     addShape();
	// });

	shapeStart.addEventListener('click', () => addShape());
	shapeType.addEventListener('click', () => {
		if (shapeSelect.style.display === '') {
			shapeSelect.style.display = 'none';
		} else {
			shapeSelect.style.display = '';
		}

		areaRemoveSelect.style.display = 'none';
		areaRecoverySelect.style.display = 'none';
		textSelect.style.display = 'none';
	});

	textStart.addEventListener('click', () => {
		addText();
		textSelect.style.display = 'none';
	});

	textType.addEventListener('click', () => {
		if (textSelect.style.display === '') {
			textSelect.style.display = 'none';
		} else {
			textSelect.style.display = '';
		}

		areaRemoveSelect.style.display = 'none';
		areaRecoverySelect.style.display = 'none';
		shapeSelect.style.display = 'none';
	});

	horizontal.addEventListener('click', () => {
		addText();
		textSelect.style.display = 'none';
	});

	vertical.addEventListener('click', () => {
		addTextVertical();
		textSelect.style.display = 'none';
	});

	alignLeft.addEventListener('click', () => setGroupAlign('left'));
	alignCenter.addEventListener('click', () => setGroupAlign('center'));
	alignRight.addEventListener('click', () => setGroupAlign('right'));
	alignTop.addEventListener('click', () => setGroupAlign('top'));
	alignMiddle.addEventListener('click', () => setGroupAlign('middle'));
	alignBottom.addEventListener('click', () => setGroupAlign('bottom'));

	playOriginal.addEventListener('mousedown', (e: any) => {
		isOriginal = true;

		displayImage(currentImageIndex, 0);
	});

	playOriginal.addEventListener('mouseup', (e: any) => {
		isOriginal = false;

		displayImage(currentImageIndex, 0);
	});

	previewSize.addEventListener('input', (e: any) => {
		displayImage(currentImageIndex, 0);
	});

	previewZoomOut.addEventListener('click', () => {
		let percentage = parseInt(previewSize.value);

		if (percentage - 10 < 0) {
			percentage = 0;
		} else {
			percentage = percentage - 10;
		}

		previewSize.value = percentage;

		displayImage(currentImageIndex, 0);
	});

	previewZoomIn.addEventListener('click', (e: any) => {
		let percentage = parseInt(previewSize.value);

		if (percentage + 10 > 200) {
			percentage = 200;
		} else {
			percentage = percentage + 10;
		}

		previewSize.value = percentage;

		displayImage(currentImageIndex, 0);
	});

	playUndo.addEventListener('click', () => {
		replayCanvas('undo');
	});

	playRedo.addEventListener('click', () => {
		replayCanvas('redo');
	});

	displayDouble.addEventListener('click', () => {
		if (doubleFrame.style.display === 'none') {
			displayDouble.innerHTML = `<img src="resources/27double.svg" alt="" width="30px" />`;

			doubleFrame.style.display = '';
			doubleBorder.style.display = '';
		} else {
			displayDouble.innerHTML = `<img src="resources/26single.svg" alt="" width="30px" />`;

			doubleFrame.style.display = 'none';
			doubleBorder.style.display = 'none';
		}
	});

	// applyExtension.addEventListener("change", (e) => {
	//     saveLocalSettings("extensionType", e.target.value);
	// })

	// applyWaterMark.addEventListener("change", (e) => {
	//     saveLocalSettings("watermark", e.target.value);

	//     displayImage(currentImageIndex);
	// });

	applyWaterMarkText.addEventListener('keyup', (e: any) => {
		saveLocalSettings('waterMarkText', e.target.value);

		displayImage(currentImageIndex, 0);
	});

	applyWaterMarkOpacity.addEventListener('change', (e: any) => {
		saveLocalSettings('waterMarkOpacity', e.target.value);

		displayImage(currentImageIndex, 0);
	});

	applyOriginWidthPC.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthPC', e.target.value);

		if (e.target.value === 'Y') {
			originWidthPC.disabled = true;
		} else {
			originWidthPC.disabled = false;
		}
	});

	originWidthPC.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthPCSize', e.target.value);
	});

	applyOriginWidthThumbnail.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthThumbnail', e.target.value);

		if (e.target.value === 'Y') {
			originWidthThumbnail.disabled = true;
		} else {
			originWidthThumbnail.disabled = false;
		}
	});

	originWidthThumbnail.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthThumbnailSize', e.target.value);
	});

	applyOriginWidthOption.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthOption', e.target.value);

		if (e.target.value === 'Y') {
			originWidthOption.disabled = true;
		} else {
			originWidthOption.disabled = false;
		}
	});

	originWidthOption.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthOptionSize', e.target.value);
	});

	applyOriginWidthDescription.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthDescription', e.target.value);

		if (e.target.value === 'Y') {
			originWidthDescription.disabled = true;
		} else {
			originWidthDescription.disabled = false;
		}
	});

	originWidthDescription.addEventListener('change', (e: any) => {
		saveLocalSettings('originWidthDescriptionSize', e.target.value);
	});

	btnSetting.addEventListener('click', () => {
		setting.style.display = '';
	});

	applySensitive.addEventListener('change', (e: any) => {
		saveLocalSettings('originSensitive', e.target.value);
	});

	settingAccept.addEventListener('click', () => {
		setting.style.display = 'none';
	});

	toolShapeOutlineColor.addEventListener('input', setShapeColor);
	toolShapeOutlineColor.addEventListener('change', () => {
		saveCanvas();
	});
	toolShapeStrokeWidth.addEventListener('input', setShapeStrokeWidth);
	toolShapeStrokeWidth.addEventListener('change', () => {
		saveCanvas();
	});
	toolShapeStrokeShape.addEventListener('input', setShapeStrokeShape);
	toolShapeStrokeShape.addEventListener('change', () => {
		saveCanvas();
	});
	toolShapeBackground.addEventListener('input', setShapeBackground);
	toolShapeBackground.addEventListener('change', () => {
		saveCanvas();
	});

	toolTextFont.addEventListener('change', setTextFont);
	toolTextSize.addEventListener('change', setTextSize);
	toolTextColor.addEventListener('input', setTextColor);
	toolTextColor.addEventListener('change', () => {
		saveCanvas();
	});
	toolTextBackground.addEventListener('input', setTextBackground);
	toolTextBackground.addEventListener('change', () => {
		saveCanvas();
	});
	toolTextBold.addEventListener('change', setTextBold);
	toolTextItalic.addEventListener('change', setTextItalic);
	toolTextLineThrough.addEventListener('change', setTextLineThrough);
	toolTextUnderLine.addEventListener('change', setTextUnderLine);
	toolTextAlignLeft.addEventListener('click', () => setTextAlign('left'));
	toolTextAlignCenter.addEventListener('click', () => setTextAlign('center'));
	toolTextAlignRight.addEventListener('click', () => setTextAlign('right'));

	fixedShapeOutlineColor.addEventListener('input', setShapeColor);
	fixedShapeOutlineColor.addEventListener('change', () => {
		saveCanvas();
	});
	fixedShapeStrokeWidth.addEventListener('input', setShapeStrokeWidth);
	fixedShapeStrokeWidth.addEventListener('change', () => {
		saveCanvas();
	});
	fixedShapeStrokeShape.addEventListener('input', setShapeStrokeShape);
	fixedShapeStrokeShape.addEventListener('change', () => {
		saveCanvas();
	});
	fixedShapeBackground.addEventListener('input', setShapeBackground);
	fixedShapeBackground.addEventListener('change', () => {
		saveCanvas();
	});

	fixedTextFont.addEventListener('change', setTextFont);
	fixedTextSize.addEventListener('change', setTextSize);
	fixedTextColor.addEventListener('input', setTextColor);
	fixedTextColor.addEventListener('change', () => {
		saveCanvas();
	});
	fixedTextBackground.addEventListener('input', setTextBackground);
	fixedTextBackground.addEventListener('change', () => {
		saveCanvas();
	});
	fixedTextBold.addEventListener('change', setTextBold);
	fixedTextItalic.addEventListener('change', setTextItalic);
	fixedTextLineThrough.addEventListener('change', setTextLineThrough);
	fixedTextUnderLine.addEventListener('change', setTextUnderLine);
	fixedTextAlignLeft.addEventListener('change', () => setTextAlign('left'));
	fixedTextAlignCenter.addEventListener('change', () => setTextAlign('center'));
	fixedTextAlignRight.addEventListener('change', () => setTextAlign('right'));

	floatingTextToolDragger.addEventListener('drag', (e: any) => {
		if (e.x === 0 && e.y === 0) {
			return;
		}

		floatingTextTool.style.left = `${e.x + 224}px`;
		floatingTextTool.style.top = `${e.y + 52}px`;
	});

	floatingShapeToolDragger.addEventListener('drag', (e: any) => {
		if (e.x === 0 && e.y === 0) {
			return;
		}

		floatingShapeTool.style.left = `${e.x + 103}px`;
		floatingShapeTool.style.top = `${e.y + 52}px`;
	});

	imageRecovery.addEventListener('click', recovery);

	textTab.addEventListener('click', setTextTab);
	shapeTab.addEventListener('click', setShapeTab);

	imageSave.addEventListener('click', () => toggleToolbar(imageSave, 'download'));
	saveCancel.addEventListener('click', () => toggleToolbar(imageSave, 'download'));
	saveAccept.addEventListener('click', async () => {
		let now = getClock();

		let filtered = layers.filter((v: any) => v.type === currentType);

		mainDownload.style.display = 'none';

		for (let i = 0; i < filtered.length; i++) {
			let dataUrl: any = null;

			switch (currentType) {
				case '0': {
					if (applyOriginWidthPC.value === 'N') {
						dataUrl = await displayImage(filtered[i].index, originWidthPC.value);
					} else {
						dataUrl = await displayImage(filtered[i].index, 0);
					}

					break;
				}

				case '1': {
					if (applyOriginWidthThumbnail.value === 'N') {
						dataUrl = await displayImage(filtered[i].index, originWidthThumbnail.value);
					} else {
						dataUrl = await displayImage(filtered[i].index, 0);
					}

					break;
				}

				case '2': {
					if (applyOriginWidthOption.value === 'N') {
						dataUrl = await displayImage(filtered[i].index, originWidthOption.value);
					} else {
						dataUrl = await displayImage(filtered[i].index, 0);
					}

					break;
				}

				case '3': {
					if (applyOriginWidthDescription.value === 'N') {
						dataUrl = await displayImage(filtered[i].index, originWidthDescription.value);
					} else {
						dataUrl = await displayImage(filtered[i].index, 0);
					}

					break;
				}

				default:
					break;
			}

			let dataPath = `트랜져스/${now.YY}${now.MM}${now.DD}_${now.hh}${now.mm}${now.ss}/`;

			let indexed = (parseInt(filtered[i].index) + 1).toString().padStart(2, '0');

			switch (currentType) {
				case '1': {
					dataPath += `썸네일/thumb-${indexed}.png`;

					break;
				}

				case '2': {
					dataPath += `옵션/option-${indexed}.png`;

					break;
				}

				case '3': {
					dataPath += `상세페이지/detail-${indexed}.png`;

					break;
				}

				default:
					break;
			}

			chrome.downloads.download({
				url: dataUrl,
				filename: dataPath,
				saveAs: false,
			});
		}

		mainDownload.style.display = 'none';

		floatingToast(`모든 이미지가 PC에 저장되었습니다.`, 'success');
	});

	uploadAccept.addEventListener('click', () => {
		saveMultiple();
	});

	imageExit.addEventListener('click', exit);

	thisImageRecovery.addEventListener('click', thisRecovery);
	thisImageSave.addEventListener('click', () => {
		saveSingle();
	});
};

const setKeyEvents = () => {
	window.addEventListener('wheel', (e) => {
		if (e.shiftKey) {
			if (e.deltaY > 0) {
				zoomOut();
			} else {
				zoomIn();
			}
		}
	});

	window.addEventListener('keydown', (e) => {
		let objects = myCanvas.getActiveObject();
		let layer = getCurrentLayer();

		if (objects == null) {
			switch (e.key) {
				case e.shiftKey && '!': {
					multiple();
					break;
				}

				case e.shiftKey && '@': {
					single();
					break;
				}

				case e.shiftKey && '#': {
					toggleToolbar(areaTranslation, 'area-translation');
					break;
				}

				case e.shiftKey && '$': {
					toggleToolbar(areaRemove, 'area-remove-drag');
					break;
				}

				case e.shiftKey && '%': {
					toggleToolbar(areaRecovery, 'area-recovery-drag');
					break;
				}
			}
		}

		if (copyBox.length != 0) {
			switch (e.key) {
				case e.ctrlKey && 'v':
				case e.ctrlKey && 'V': {
					layer.object.push(copyBox[copyBox.length - 1]);

					let copyXY = layer.object[layer.object.length - 1];

					copyXY.copyX = 20;
					copyXY.copyY = 20;

					delete copyBox[copyBox.length - 1].text;
					delete copyBox[copyBox.length - 1].rect;

					displayImage(currentImageIndex, 0);

					copyBox = [];

					break;
				}
			}
		}

		switch (e.key) {
			case 'Escape': {
				cancel = true;
				break;
			}

			case e.ctrlKey && 'c':
			case e.ctrlKey && 'C': {
				copyBox.push(JSON.parse(JSON.stringify(layer.object[objects.id])));

				break;
			}

			case e.ctrlKey && 'z':
			case e.ctrlKey && 'Z': {
				replayCanvas('undo');
				break;
			}

			case e.ctrlKey && 'x':
			case e.ctrlKey && 'X': {
				replayCanvas('redo');
				break;
			}

			case e.shiftKey && 't':
			case e.shiftKey && 'T': {
				addText();
				textSelect.style.display = 'none';
				break;
			}
			case e.shiftKey && 'a':
			case e.shiftKey && 'A': {
				e.preventDefault();
				recovery();
				break;
			}

			case e.shiftKey && 's':
			case e.shiftKey && 'S': {
				e.preventDefault();
				if (imageSave.getAttribute('key') == '5') {
					toggleToolbar(imageSave, 'download');
				} else if (thisImageSave.getAttribute('key') == '5') {
					saveSingle();
				}
				break;
			}

			case e.shiftKey && 'e':
			case e.shiftKey && 'E': {
				toggleToolbar(cropStart, 'crop');
				break;
			}

			case e.shiftKey && 'd':
			case e.shiftKey && 'D': {
				e.preventDefault();
				exit();
				break;
			}

			// case "F5": {
			//     exit();

			//     e.preventDefault();

			//     break;
			// }

			case 'Delete': {
				let objects = myCanvas.getActiveObject();

				if (objects) {
					if (objects['_objects']) {
						for (let i in objects['_objects']) {
							let object = objects['_objects'][i];
							let objectType = object.get('type');

							switch (objectType) {
								case 'rect': {
									object.set({
										visible: false,
									});

									break;
								}

								case 'i-text': {
									object.set({
										visible: false,
									});

									break;
								}

								default:
									break;
							}
						}
					} else {
						let objectType = objects.get('type');

						switch (objectType) {
							case 'rect': {
								objects.set({
									visible: false,
								});

								break;
							}

							case 'i-text': {
								if (!objects.isEditing) {
									objects.set({
										visible: false,
									});
								}

								break;
							}

							default:
								break;
						}
					}

					myCanvas.renderAll();
				}

				saveCanvas();

				break;
			}
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();

			let objects = myCanvas.getActiveObject();

			if (objects) {
				if (objects['_objects']) {
					for (let i in objects['_objects']) {
						let object = objects['_objects'][i];
						let objectType = object.get('type');

						switch (objectType) {
							case 'rect': {
								object.set({
									top: object.top - 5,
								});

								break;
							}

							case 'i-text': {
								object.set({
									top: object.top - 5,
								});

								break;
							}

							default:
								break;
						}
					}
				} else {
					let objectType = objects.get('type');

					switch (objectType) {
						case 'rect': {
							objects.set({
								top: objects.top - 5,
							});

							break;
						}

						case 'i-text': {
							if (!objects.isEditing) {
								objects.set({
									top: objects.top - 5,
								});
							}

							break;
						}

						default:
							break;
					}
				}

				myCanvas.renderAll();
			}

			saveCanvas();
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();

			let objects = myCanvas.getActiveObject();

			if (objects) {
				if (objects['_objects']) {
					for (let i in objects['_objects']) {
						let object = objects['_objects'][i];
						let objectType = object.get('type');

						switch (objectType) {
							case 'rect': {
								object.set({
									top: object.top + 5,
								});

								break;
							}

							case 'i-text': {
								object.set({
									top: object.top + 5,
								});

								break;
							}

							default:
								break;
						}
					}
				} else {
					let objectType = objects.get('type');

					switch (objectType) {
						case 'rect': {
							objects.set({
								top: objects.top + 5,
							});

							break;
						}

						case 'i-text': {
							if (!objects.isEditing) {
								objects.set({
									top: objects.top + 5,
								});
							}

							break;
						}

						default:
							break;
					}
				}

				myCanvas.renderAll();
			}

			saveCanvas();
		}

		if (e.key === 'ArrowLeft') {
			e.preventDefault();

			let objects = myCanvas.getActiveObject();

			if (objects) {
				if (objects['_objects']) {
					for (let i in objects['_objects']) {
						let object = objects['_objects'][i];
						let objectType = object.get('type');

						switch (objectType) {
							case 'rect': {
								object.set({
									left: object.left - 5,
								});

								break;
							}

							case 'i-text': {
								object.set({
									left: object.left - 5,
								});

								break;
							}

							default:
								break;
						}
					}
				} else {
					let objectType = objects.get('type');

					switch (objectType) {
						case 'rect': {
							objects.set({
								left: objects.left - 5,
							});

							break;
						}

						case 'i-text': {
							if (!objects.isEditing) {
								objects.set({
									left: objects.left - 5,
								});
							}

							break;
						}

						default:
							break;
					}
				}

				myCanvas.renderAll();
			}

			saveCanvas();
		}

		if (e.key === 'ArrowRight') {
			e.preventDefault();

			let objects = myCanvas.getActiveObject();

			if (objects) {
				if (objects['_objects']) {
					for (let i in objects['_objects']) {
						let object = objects['_objects'][i];
						let objectType = object.get('type');

						switch (objectType) {
							case 'rect': {
								object.set({
									left: object.left + 5,
								});

								break;
							}

							case 'i-text': {
								object.set({
									left: object.left + 5,
								});

								break;
							}

							default:
								break;
						}
					}
				} else {
					let objectType = objects.get('type');

					switch (objectType) {
						case 'rect': {
							objects.set({
								left: objects.left + 5,
							});

							break;
						}

						case 'i-text': {
							if (!objects.isEditing) {
								objects.set({
									left: objects.left + 5,
								});
							}

							break;
						}

						default:
							break;
					}
				}

				myCanvas.renderAll();
			}

			saveCanvas();
		}
	});
};

const setTypeEvents = () => {
	let menuList = document.getElementsByClassName('menu');

	for (let i = 0; i < menuList.length; i++) {
		menuList[i].addEventListener('click', async (e: any) => {
			if (currentType === e.target.getAttribute('key')) {
				return;
			}

			currentType = e.target.getAttribute('key');

			for (let j = 0; j < menuList.length; j++) {
				if (menuList[j].getAttribute('key') === currentType) {
					if (menuList[j].className === 'menu') {
						menuList[j].className = 'menu selected';

						await loadImageList();
					}
				} else {
					menuList[j].className = 'menu';
				}
			}
		});
	}
};
const reloadTranslate = async () => {
	while (true) {
		if (loading.style.display === 'none') {
			break;
		}

		await sleep(1000 * 1);
	}
	await single();

	return true;
};
const autoTranslation = async () => {
	console.log('오토트랜스래이션작동');
	while (true) {
		console.log(loading.style.display);
		if (loading.style.display === 'none') {
			break;
		}

		await sleep(1000 * 1);
	}

	await multiple();
	await saveMultiple();

	return true;
};
let testLayer = 1;
let testLayerList: any = [];

const main = async () => {
	loading.style.display = '';

	chrome.runtime.onMessage.addListener((request, sender: any, sendResponse) => {
		switch (request.action) {
			case 'auto-translate': {
				autoTranslation().then(sendResponse);

				return true;
			}
			default:
				break;
		}
	});
	let userQuery = `query {
        selectMyInfoByUser {
            email
            purchaseInfo2 {
                level
            }
        }
    }`;

	let user_json = await gql(userQuery, {}, false);

	if (user_json.errors) {
		alert(user_json.errors[0].message);

		return;
	}

	let appInfo = localStorage.getItem('appInfo');

	if (!appInfo) {
		appData = {
			user: {
				id: user_json.data.selectMyInfoByUser.email,
			},

			login: true,

			settings: {
				extensionType: 'jpeg',
				waterMarkType: 'N',
				originWidthDescription: 'N',
				originWidthOption: 'N',
				originWidthThumbnail: 'N',

				waterMarkOpacity: 20,
				originWidthPCSize: 800,
				originWidthThumbnailSize: 800,
				originWidthOptionSize: 800,
				originWidthDescriptionSize: 800,
				originSensitive: 0.03,
			},
		};

		localStorage.setItem('appInfo', JSON.stringify(appData));
	} else {
		appData = JSON.parse(appInfo);
	}

	loadLocalSettings();

	let keyResp = await fetch(FLASK_URL + 'getkey', {
		headers: {
			'Content-Type': 'application/json',
		},

		method: 'POST',
	});

	visionKey = await keyResp.text();

	const products = await getProductList(params.id);
	console.log('여기는 ?');

	for (let i in products.data.selectProductsBySomeone) {
		if (products.data.selectProductsBySomeone[i].id === parseInt(params.id)) {
			product = products.data.selectProductsBySomeone[i];
		}
	}

	if (!product) {
		alert('상품 정보를 찾을 수 없습니다.');

		loading.style.display = 'none';

		return;
	}
	canvasSetting();

	imageToolHelper();

	setTypeEvents();
	setKeyEvents();
	console.log('이기는 ?');
	await addToLayers();
	console.log('이기1');
	currentType = '1';

	await loadImageList();
	console.log('이기2');

	// headerFromURL.style.display = "";
	menuToolbar.style.display = '';

	loading.style.display = 'none';
	console.log('여기까지 도달 했습니광?');
};

main();
