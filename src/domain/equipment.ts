import * as z from "zod/v4"

const Equipment = z.object({
    id: z.string(),
    name: z.string(),
    model: z.string().nullish(),
    serialNumber: z.string().nullish(),
    inventoryNumber: z.string().nullish(),
})

type Equipment = z.infer<typeof Equipment>

const EquipmentInfo = z.object({
    ...Equipment.shape,
    onStock: z.union([z.number(), z.nan()]),
    onLoan: z.union([z.number(), z.nan()]),
})

type EquipmentInfo = z.infer<typeof EquipmentInfo>

export {Equipment, EquipmentInfo};