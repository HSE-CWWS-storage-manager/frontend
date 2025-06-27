import type AppStore from "../store/AppStore.ts";
import type AppApi from "../api/AppApi.ts";
import type AppService from "./AppService.ts";
import type {EquipmentInfo} from "../../domain/equipment.ts";

export default class EquipmentService {
    constructor(private service: AppService, private store: AppStore, private api: AppApi) {}

    async getById(id: string): Promise<EquipmentInfo> {
        // const result = this.store.equipment.getById(id)
        //
        // if (result) {
        //     return result
        // }

        return this.api.equipment.loadEquipment(id)
    }
}