import { sleep } from "./Common";

const getLocalStorage = (key: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const setLocalStorage = (obj: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, function () {
                resolve(true);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteLocalStorage = (keys: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, function () {
                resolve(true);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const sendRuntimeMessage = (obj: any) => {
    console.log('runtime', obj);

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(obj, function (response) {
            let lastError = chrome.runtime.lastError;

            if (lastError) {
                console.log('runtime rejected', obj, lastError.message);

                resolve(null);

                return;
            }

            console.log('runtime resolved', obj, response);

            resolve(response);
        });
    })
}

const sendTabMessage = (tabid: number, obj: any) => {
    console.log(tabid, obj);

    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabid, obj, function (response) {
            let lastError = chrome.runtime.lastError;

            if (lastError) {
                console.log(`${tabid} rejected`, lastError.message);

                resolve(null);

                return;
            }

            console.log(`${tabid} resolved`, obj, response);

            resolve(response);
        });
    })
}

const queryWindow = (options: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.windows.getAll(options, function (windows) {
                resolve(windows);
            });
        } catch (e) {
            reject(e);
        }
    });
}

const queryTabs = (options: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query(options, function (tabs) {
                resolve(tabs);
            });
        } catch (e) {
            reject(e);
        }
    });
}

const createTab = (options: any) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.create(options, function (tab) {
                resolve(tab.id);
            });
        } catch (e) {
            reject(e);
        }
    })
}

const createTabCompletely = async (options: any) => {
    let timeout = 0;
    let tabId = await createTab(options);

    while (true) {
        if (timeout === 60) {
            return {};
        }

        const tabs: any = await queryTabs({});
        const result: any = tabs.find((v: any) => v.id === tabId && v.status === 'complete');

        if (result) {
            return result;
        }

        timeout += 1;

        await sleep(1000 * 1);
    }
}

export {
    getLocalStorage,
    setLocalStorage,
    deleteLocalStorage,

    sendRuntimeMessage,
    sendTabMessage,

    queryWindow,

    queryTabs,
    createTab,
    createTabCompletely
}