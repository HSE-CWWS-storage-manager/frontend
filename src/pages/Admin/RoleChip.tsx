import type {Role} from "../../domain/user.ts";
import React from "react";

const RoleChip: React.FC<{role: Role}> = ({ role }) => {
    if (!role) { return <></> }

    const text = {
        "Admin" : "Администратор",
        "User" : "Пользователь",
        "Operator" : "Оператор"
    }[role]

    const color = {
        "Admin" : "bg-red-400",
        "User" : "bg-yellow-200",
        "Operator" : "bg-green-300",
    }[role]

    return <div
        className={color + " rounded-md py-0.5 px-2.5 m-1 border border-transparent text-sm transition-all shadow-sm"}>
        {text}
    </div>
}

export default RoleChip;