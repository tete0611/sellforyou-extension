import MUTATIONS from "../Main/GraphQL/Mutations";
import gql from "../Main/GraphQL/Requests";

const XLSX = require('xlsx');

function byteLength(str: string) {
    let strLen = str.length;
    let cnt = 0;
    let oneChar = "";

    for (let ii = 0; ii < strLen; ii++) {
        oneChar = str.charAt(ii);
        if (escape(oneChar).length > 4) {
            cnt += 2;
        } else {
            cnt++;
        }
    }
    return cnt;
}

function byteSlice(str: string, limit: number) {
    while (true) {
        let blen;

        blen = byteLength(str);

        if (blen > limit) {
            str = str.slice(0, str.length - 1);
        } else {
            return str;
        }
    }
}

function cartesian(...args: any) {
    var r: any = [], max = args.length - 1;
    function helper(arr: any, i: any) {
        for (var j = 0, l = args[i].length; j < l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i == max)
                r.push(a);
            else
                helper(a, i + 1);
        }
    }
    helper([], 0);
    return r;
}

function convertWebpToJpg(base64: any) {
    return new Promise((resolve, reject) => {
        let image = new Image();

        image.src = base64;
        image.onload = async () => {
            let canvas: any = document.createElement('canvas');

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            canvas.getContext('2d').drawImage(image, 0, 0);

            let fixed_base64 = canvas.toDataURL('image/jpeg');
            let fixed_resp = await fetch(fixed_base64);
            let fixed_blob = await fixed_resp.blob();

            resolve(fixed_blob);

            canvas.remove();
        };

        image.onerror = reject;
    })
}

async function downloadExcel(result_array: any, fileName: string, saveAs: boolean) {
    let t = getClock();

    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(result_array);

    XLSX.utils.book_append_sheet(workbook, worksheet);

    let workdata = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    let workurl = URL.createObjectURL(new Blob([stringToArrayBuffer(workdata)], { type: 'application/octet-stream' }));

    chrome.downloads.download({ url: workurl, filename: `${fileName}${saveAs ? "" : "(자동저장)"}_${t.YY}-${t.MM}-${t.DD}.xlsx`, saveAs: saveAs });
}

function extractContent(s: String) {
    let span: any = document.createElement('div');

    span.innerHTML = s;

    return span.textContent || span.innerText;
};

function extractTmonContent(s: String) {
    return s.replace(/\^.+/g, "");
};

async function floatingToast(message: any, type: any) {
    let toast = document.createElement("div");
    let toastContainer: any = document.getElementById('toastContainer');

    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center;">
            <img src='${chrome.runtime.getURL(`/resources/icon-${type}.png`)}' width="24px" height="24px" /> 

            &nbsp;

            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);

    await sleep(1000 * 3);

    toast.style.setProperty('-webkit-animation', "fadeout 1s");
    toast.style.setProperty('animation', "fadeout 1s");

    await sleep(1000 * 0.8);

    toast.remove();
}

function getClock() {
    let date = new Date();

    return {
        YY: date.getFullYear().toString(),
        MM: (date.getMonth() + 1).toString().padStart(2, '0'),
        DD: date.getDate().toString().padStart(2, '0'),
        hh: date.getHours().toString().padStart(2, '0'),
        mm: date.getMinutes().toString().padStart(2, '0'),
        ss: date.getSeconds().toString().padStart(2, '0'),
    };
}

function getClockOffset(H: number, M: number, D: number, h: number, m: number, s: number) {
    let date = new Date();

    return {
        YY: (date.getFullYear() + H).toString(),
        MM: (date.getMonth() + 1 + M).toString().padStart(2, '0'),
        DD: (date.getDate() + D).toString().padStart(2, '0'),
        hh: (date.getHours() + h).toString().padStart(2, '0'),
        mm: (date.getMinutes() + m).toString().padStart(2, '0'),
        ss: (date.getSeconds() + s).toString().padStart(2, '0'),
    };
}

function getCookie(cookieName: string) {
    let cookieValue = "";

    if (document.cookie) {
        let array = document.cookie.split((escape(cookieName) + '='));

        if (array.length >= 2) {
            let arraySub = array[1].split(';');

            cookieValue = unescape(arraySub[0]);
        }
    }

    return cookieValue;
}

async function getImageMeta(src: string) {
    return new Promise(function (resolve, reject) {
        let image: any = new Image();

        image.onload = function () {
            resolve(image);
        };

        image.onerror = reject;
        image.src = src;
    });
}

function matchesCharacter(string1: string, string2: string) {
    const s1 = [...string1];
    const s2 = [...string2];

    const substringMatrix = Array(s2.length + 1).fill(null).map(() => {
        return Array(s1.length + 1).fill(null);
    });

    for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
        substringMatrix[0][columnIndex] = 0;
    }

    for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
        substringMatrix[rowIndex][0] = 0;
    }

    let longestSubstringLength = 0;
    let longestSubstringColumn = 0;
    let longestSubstringRow = 0;

    for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
        for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
            if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
                substringMatrix[rowIndex][columnIndex] = substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                substringMatrix[rowIndex][columnIndex] = 0;
            }

            if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
                longestSubstringLength = substringMatrix[rowIndex][columnIndex];
                longestSubstringColumn = columnIndex;
                longestSubstringRow = rowIndex;
            }
        }
    }

    if (longestSubstringLength === 0) {
        return '';
    }

    let longestSubstring = '';

    while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
        longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
        longestSubstringRow -= 1;
        longestSubstringColumn -= 1;
    }

    return longestSubstring;
}

function notificationByEveryTime(message: string) {
    floatingToast(message, "warning");

    // chrome.notifications.create('sellforyou-' + new Date().getTime(), {
    //     type: 'basic',
    //     iconUrl: '/icon128.png',
    //     title: '셀포유',
    //     message: message,
    //     isClickable: true
    // });
}

function parseDecode(blob) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = function (e) {
            var text = reader.result;

            resolve(text)
        }

        reader.readAsText(blob, 'GBK')
    })
}

function request(url: any, opts: any) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open(opts.method, url);

        if (opts.headers) {
            Object.keys(opts.headers).map((v: any) => {
                xhr.setRequestHeader(v, opts.headers[v]);
            });
        }

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };

        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText,
                data: "rejected"
            });
        };

        xhr.send(opts.body);
    });
}

function readFileBinary(blob: any) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsBinaryString(blob);
    })
}

function readFileDataURL(blob: any) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsDataURL(blob);
    })
}

function stringToArrayBuffer(s: any) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);

    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }

    return buf;
}

async function sendCallback(commonStore: any, data: any, code: string, seq: number, state: number, message: string) {
    const today = getClock();

    const progressValue = Math.round((seq + 1) * 100 / data.DShopInfo.prod_codes.length);

    commonStore.setProgressValue(data.DShopInfo.site_code, progressValue);

    const callbackData = JSON.stringify({
        "job_id": "KOOZA",
        "title": "KOOZA",
        "results": {
            "config.json": {
                "sol_code": "KOOZA"
            },

            "result.json": [{
                "state": state,
                "site_code": data.DShopInfo.site_code,
                "site_id": "",
                "code": code,
                "sku_code": null,
                "single_yn": null,
                "groupkey": null,
                "slave_reg_code": data.DShopInfo.site_code !== 'B378' && state === 1 ? message : "0",
                "slave_reg_code_sub": data.DShopInfo.site_code === 'B378' && state === 1 ? message : "",
                "reg_type": "",
                "reg_sell_term": 0,
                "reg_fee": 0,
                "reg_premium": "",
                "slave_wdate": "",
                "slave_edate": "",
                "msg": state === 1 ? "" : message,
                "err_code": null,
                "setdata": "",
                "setName": data.DShopInfo.site_name,
                "toState": "",
                "fromWork": 0,
                "gmp_sale_no": null,
                "isSavedToDB": false
            }],

            "datetime": `${today.hh}:${today.mm}:${today.ss}`
        }
    });

    await gql(MUTATIONS.TEST_ADD_JOB_CALLBACK, { response: callbackData }, false);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sortBy(array: any, key: string, asc: boolean) {
    let sorted = array.sort(function (a: any, b: any) {
        if (a[key] < b[key]) {
            return asc ? -1 : 1;
        }

        if (a[key] > b[key]) {
            return asc ? 1 : -1;
        }

        return 0;
    });

    return sorted;
}

function toISO(date: any) {
    function pad(num: any) {
        let norm = Math.floor(Math.abs(num));

        return (norm < 10 ? '0' : '') + norm;
    };

    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

function transformContent(content: any) {
    const descHtml = new DOMParser().parseFromString(content, 'text/html');
    const chunks = descHtml.querySelectorAll('p');

    for (let i in chunks) {
        try {
            chunks[i].style.margin = "0 auto";
        } catch (e) {
            continue;
        }
    }

    return descHtml.body.innerHTML;
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function urlEncodedObject(urlEncodedData: any) {
    let urlEncodedContent: any = [];

    for (let property in urlEncodedData) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(urlEncodedData[property]);

        urlEncodedContent.push(encodedKey + "=" + encodedValue);
    }

    return urlEncodedContent.join("&");
}

export {
    byteLength,
    byteSlice,

    cartesian,
    convertWebpToJpg,

    downloadExcel,

    extractContent,
    extractTmonContent,

    floatingToast,

    getClock,
    getClockOffset,
    getCookie,
    getImageMeta,

    matchesCharacter,

    notificationByEveryTime,

    parseDecode,

    request,
    readFileBinary,
    readFileDataURL,

    sendCallback,
    sleep,
    sortBy,
    stringToArrayBuffer,

    toISO,
    transformContent,

    updateQueryStringParameter,
    urlEncodedObject
}