import type AppApi from "./AppApi.ts";
import type AppStore from "../store/AppStore.ts";
import type {AxiosResponse} from "axios";
import {Equipment, EquipmentInfo} from "../../domain/equipment.ts";
import {WAREHOUSE_ID} from "../../lib/config.ts";
import * as z from "zod/v4";
import {Operation} from "../../domain/operation.ts";

const Remains = z.object({
    onStock: z.number(),
    onLoan: z.number(),
})
type Remains = z.infer<typeof Remains>

const RemainsResponse = z.object({
    remains: z.array(z.object({
        warehouseId: z.string(),
        ...Remains.shape
    }))
})

const EquipmentResponse = z.object({
    equipments: z.array(z.object({
        ...Equipment.shape
    })),
})

const OperationResponse = z.object({
    operations: z.array(Operation)
});

type OperationResponse = z.infer<typeof OperationResponse>

export default class EquipmentApi {
    constructor(private api: AppApi, private store: AppStore) {}

    async loadEquipment(id: string): Promise<EquipmentInfo> {
        let equipment: Equipment;

        return this.api.client
            .get("/Equipment", { params: { EquipmentId: id } })
            .then((response) => {
                const res = EquipmentResponse.safeParse(response.data)

                if (res.error) {
                    return Promise.reject(res.error.message)
                }

                equipment = res.data?.equipments[0]
                return this.remains(id)
            })
            .then((response) => {
                const res = EquipmentInfo.safeParse({
                    ...equipment,
                    onStock: response.onStock,
                    onLoan: response.onLoan,
                })

                if (res.error) {
                    return Promise.reject(res.error.message)
                }

                return res.data
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    async loadPage(page: number): Promise<void> {
        return this.api.client
            .get("/Equipment", { params: { Page: page } })
            .then((res: AxiosResponse<{ equipments: Equipment[] }>) => {
                if (res.data.equipments) {
                    const equipments = res.data.equipments;
                    const equipmentInfos: EquipmentInfo[] = [];
                    const promises: Promise<void>[] = [];

                    for (let i = 0; i < equipments.length; i++) {
                        promises.push(this.remains(equipments[i].id)
                            .then(({ onStock, onLoan }) => {
                                const equipmentInfo: EquipmentInfo = {
                                    ...equipments[i],
                                    onStock,
                                    onLoan
                                }

                                equipmentInfos.push(equipmentInfo);
                            })
                            .catch(() => {
                                const equipmentInfo: EquipmentInfo = {
                                    ...equipments[i],
                                    onStock: NaN,
                                    onLoan: NaN
                                }

                                equipmentInfos.push(equipmentInfo);
                            }))
                    }

                    return Promise.all(promises).then(() => {
                        this.store.equipment.appendPage(equipmentInfos);
                    })
                } else {
                    return Promise.reject(res);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            })
    }

    async remains(equipmentId: string): Promise<Remains> {
        return this.api.client
            .get("/Warehouse/GetRemains", {
                params: {
                    EquipmentId: equipmentId,
                    WarehouseId: WAREHOUSE_ID,
                    Page: 1
                }
            })
            .then((res) => {
                const response = RemainsResponse.safeParse(res.data)

                if (response.success) {
                    return {
                        onStock: response.data.remains[0].onStock,
                        onLoan: response.data.remains[0].onLoan,
                    }
                } else {
                    return Promise.reject(res);
                }
            })
            .catch((error) => {
                return {
                    onStock: NaN,
                    onLoan: NaN
                }
            })
    }

    async create(equipment: Omit<Equipment, "id">, count: number): Promise<void> {
        return this.api.client
            .post("/Equipment", equipment)
            .then((res) => {
                const equipment = Equipment.safeParse(res.data);

                if (equipment.error) {
                    return Promise.reject(res);
                }
                if (equipment.success) {
                    const equipmentInfo: EquipmentInfo = {
                        ...equipment.data,
                        onStock: NaN,
                        onLoan: NaN
                    }

                    return this.warehouseInit(equipment.data.id, count)
                        .then(() => {
                            equipmentInfo.onStock = count;
                            equipmentInfo.onLoan = 0;
                        })
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            })
    }

    async warehouseInit(equipmentId: string, count: number): Promise<void> {
        return this.api.client
            .post("/Warehouse/AddOnStock", {
                equipmentId: equipmentId,
                warehouseId: WAREHOUSE_ID,
                count: count
            })
    }

    async warehouseChangeCount(equipmentId: string, count: number): Promise<void> {
        if (count >= 0) return this.api.client
                .post("/Warehouse/AddOnStock", {
                    equipmentId: equipmentId,
                    warehouseId: WAREHOUSE_ID,
                    count: count
                })
        else return this.api.client
            .post("/Warehouse/ExtractFromStock", {
                equipmentId: equipmentId,
                warehouseId: WAREHOUSE_ID,
                count: -count
            })
    }

    async delete(equipmentId: string): Promise<void> {
        return this.api.client
            .delete("/Equipment", { params: { EquipmentId: equipmentId } })
    }

    async give(equipmentId: string, recipientId: string): Promise<void> {
        return this.api.client
            .put("/EquipmentOperation", {
                warehouseId: WAREHOUSE_ID,
                equipmentId,
                recipientId
            })
    }

    async receive(operationId: string, date: Date): Promise<void> {
        return this.api.client
            .post("/EquipmentOperation/Return", {
                operationId,
                returnDate: date.toISOString()
            })
    }

    async getTransactionsByEquipmentIdNotEnded(id: string): Promise<Operation[]> {
        return this.api.client
            .get("/EquipmentOperation", { params: { EquipmentId: id, WithoutReturnDate: true } })
            .then((res) => {
                const response = OperationResponse.safeParse(res.data)

                if (response.error) {
                    return Promise.reject(res);
                }

                return response.data.operations
            })
    }

    async getTransactionsEnded(page: number = 1): Promise<Operation[]> {
        return this.api.client
            .get("/EquipmentOperation", { params: { OnlyWithReturnDate: true, Page: page } })
            .then((res) => {
                const response = OperationResponse.safeParse(res.data)

                if (response.error) {
                    return Promise.reject(res);
                }

                return response.data.operations
            })
    }

    async getTransactionsNotEnded(page: number = 1): Promise<Operation[]> {
        return this.api.client
            .get("/EquipmentOperation", { params: { WithoutReturnDate: true, Page: page } })
            .then((res) => {
                const response = OperationResponse.safeParse(res.data)

                if (response.error) {
                    return Promise.reject(res);
                }

                return response.data.operations
            })
    }

    async getCard(equipmentId: string, studentId: string): Promise<Blob> {
        return this.api.client
            .get("/EquipmentCard", { params: {
                    EquipmentId: equipmentId,
                    studentId: studentId
                },
                responseType: "blob"
            })
            .then(res => {
                return res.data
            })
    }

}