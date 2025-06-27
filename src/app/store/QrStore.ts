import type AppStore from "./AppStore.ts";
import {action} from "mobx";
import {type QrData} from "../../domain/qr-data.ts";

type QrStoreData = {
    data: QrData,
    name: string
}

class QrStore {
    text: QrStoreData[] = [];

    constructor(private store: AppStore) {}

    @action add(text: QrStoreData) {
        this.text.push(text)
    }

    @action clear() {
        this.text = []
    }
}

export {type QrStoreData}
export default QrStore