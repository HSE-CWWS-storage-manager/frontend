import AuthStore from "./AuthStore.ts";
import AdminStore from "./AdminStore.ts";
import EquipmentStore from "./EquipmentStore.ts";
import QrStore from "./QrStore.ts";

export default class AppStore {
    auth = new AuthStore(this)
    admin = new AdminStore(this)
    equipment = new EquipmentStore(this)
    qr = new QrStore(this)
}