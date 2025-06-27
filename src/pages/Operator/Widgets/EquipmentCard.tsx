import type {EquipmentInfo} from "../../../domain/equipment.ts";
import Button from "../../../shared/Button.tsx";
import {NavLink} from "react-router-dom";

export const EquipmentCard = (props: { equipment: EquipmentInfo }) => {
    const equipment = props.equipment;

    return <article className="p-2 border rounded-md">
        <NavLink to={`/operator/equipment/${equipment.id}`} className="flex items-center justify-between">
            <h3>{equipment.name}</h3>
            <Button>
                Перейти
            </Button>
        </NavLink>
        <div className="text-right"><span>{`${equipment.onStock}`}</span>/<span>{`${equipment.onStock + equipment.onLoan}`}</span></div>
    </article>
}