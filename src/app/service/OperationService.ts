import type AppService from "./AppService.ts";
import type AppStore from "../store/AppStore.ts";
import type AppApi from "../api/AppApi.ts";
import type {FullOperation, Operation} from "../../domain/operation.ts";
import type {EquipmentInfo} from "../../domain/equipment.ts";
import type Student from "../../domain/student.ts";

class OperationService {
    constructor(private service: AppService, private store: AppStore, private api: AppApi) {}

    async getFullByEquipmentId(equipmentId: string): Promise<FullOperation[]> {
        const result: FullOperation[] = []
        const operations: Operation[] = []
        let equipment: EquipmentInfo;

        return this.service.equipment.getById(equipmentId)
            .then((eq: EquipmentInfo) => {
                equipment = eq
            })
            .then(() => {
                return this.api.equipment.getTransactionsByEquipmentIdNotEnded(equipmentId)
            })
            .then((res) => {
                const promises: Promise<Student>[] = []

                res.forEach(oper => {
                    operations.push(oper)
                    promises.push(this.api.student.getById(oper.recipientId))
                })

                return Promise.all(promises)
            })
            .then((res) => {
                for (let i = 0; i < operations.length; i++) {
                    const {recipientId, equipmentId, ...oper} = operations[i]

                    result.push({
                        equipment: equipment,
                        recipient: res[i],
                        operation: oper
                    })
                }

                return result
            })
    }

    async getFull(operation: Operation): Promise<FullOperation> {
        return Promise.all([
            this.service.equipment.getById(operation.equipmentId),
            this.api.student.getById(operation.recipientId)
        ]).then(([eq, st]) => {
            return {
                operation: operation,
                recipient: st,
                equipment: eq
            }
        })
    }
}

export default OperationService;