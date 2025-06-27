import type AppStore from "./AppStore.ts";
import type {EquipmentInfo} from "../../domain/equipment.ts";
import {action, makeAutoObservable} from "mobx";

export default class EquipmentStore {
    equipments: EquipmentInfo[] = [];
    private page: number = 1;

    constructor(private store: AppStore) {
        makeAutoObservable(this)
    }

    @action appendPage(page: EquipmentInfo[]) {
        if (page.length === 0) {
            return;
        }

        this.equipments = this.equipments.concat(page);
        this.page += 1;
    }

    get getPage() {
        return this.page
    }

    getById(id: string): EquipmentInfo | undefined {
        return this.equipments.find(eq => {
            return eq.id === id
        })
    }

    @action changeCountById(id: string, count: number) {
        const item = this.getById(id)

        if (item !== undefined) {
            item.onStock += count
        }
    }

    @action deleteById(id: string) {
        const index = this.equipments.findIndex(eq => {
            return eq.id === id
        })

        console.log(index)

        if (index > -1) {
            this.equipments.splice(index, 1)
        }
    }

    @action clear() {
        this.equipments = [];
        this.page = 1
    }
}