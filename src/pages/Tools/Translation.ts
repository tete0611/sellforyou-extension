import CryptoJS from "crypto-js";

async function papagoTranslation(textdict: any, source: string, target: string, input: any) {
    let input_string = "";

    if (!input) {
        for (let i in textdict) {
            input_string += textdict[i];
            input_string += "\n";
        }
    } else {
        input_string = input;
    }

    let device_json: any = {
        url: "https://papago.naver.com/apis/n2mt/translate",
        id: "364961ac-efa2-49ca-a998-ad55f7f9d32d",
        timestamp: new Date().getTime()
    };

    device_json['hash'] = CryptoJS.HmacMD5(`${device_json.id}\n${device_json.url}\n${device_json.timestamp}`, 'v1.7.0_0d2601d5cf').toString(CryptoJS.enc.Base64);

    let output = await fetch(device_json.url, {
        "headers": {
            "authorization": `PPG ${device_json.id}:${device_json.hash}`,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "timestamp": device_json.timestamp,
            "x-apigw-partnerid": "papago",
        },

        "body": `deviceId=${device_json.id}&locale=ko&dict=true&dictDisplay=30&honorific=false&instant=false&paging=false&source=${source}&target=${target}&text=${encodeURI(input_string)}`,
        "method": "POST",
    });

    try {
        let result = await output.json();

        let result_array = result.translatedText.split("\n");

        if (!input) {
            let result_count = 0;

            for (let i in textdict) {
                let translated = result_array[result_count];

                translated = translated.replace(/[*]/gi, 'x');				// * => X 처리
                translated = translated.replace(/[\\\?\"<>,]/gi, ' ');		// \ / : * ? " < > , => 공백 처리

                textdict[i] = translated;

                result_count += 1;
            }

            return textdict;
        } else {
            return result_array;
        }
    } catch (e) {
        console.log(e);

        return null;
    }
}

export default papagoTranslation;