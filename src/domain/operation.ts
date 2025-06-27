import * as z from 'zod/v4'
import Student from "./student.ts";
import {EquipmentInfo} from "./equipment.ts";

const Operation = z.object({
    id: z.string(),
    warehouseId: z.string(),
    equipmentId: z.string(),
    initiatorId: z.string(),
    date: z.string(),
    type: z.number(),
    recipientId: z.string(),
    quantity: z.number().nullish(),
    returnDate: z.string().nullish(),
})

const FullOperation = z.object({
    operation: Operation.omit({ equipmentId: true, recipientId: true }),
    recipient: Student,
    equipment: EquipmentInfo
})

type Operation = z.infer<typeof Operation>
type FullOperation = z.infer<typeof FullOperation>

export {Operation, FullOperation}