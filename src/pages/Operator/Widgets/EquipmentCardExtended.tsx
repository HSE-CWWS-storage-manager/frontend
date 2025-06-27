import React from "react";
import type {EquipmentInfo} from "../../../domain/equipment.ts";
import Info from "./Info.tsx";
import Divider from "../../../shared/Divider.tsx";

export const EquipmentCardExtended: React.FC<{ item: EquipmentInfo }> = ({item}) => {
    return <div className="grid grid-cols-1 gap-y-3">
        <Info name="Наименование">{item.name}</Info>
        {item.inventoryNumber && <Info name="Инвентарный номер">{item.inventoryNumber}</Info>}
        {item.serialNumber && <Info name="Серийный номер">{item.serialNumber}</Info>}
        {item.model && <Info name="Модель">{item.model}</Info>}

        <Divider/>

        <div className="grid grid-cols-3 gap-y-2 text-center">
            <div className="text-sm text-gray-400">У студентов</div>
            <div className="text-sm text-gray-400">На складе</div>
            <div className="text-sm text-gray-400">Всего</div>
            <div>{item.onLoan}</div>
            <div>{item.onStock}</div>
            <div>{item.onLoan + item.onStock}</div>
        </div>
    </div>
}