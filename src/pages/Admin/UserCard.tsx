import React from "react";
import type {User} from "../../domain/user.ts";
import Button from "../../shared/Button.tsx";
import RoleChip from "./RoleChip.tsx";
import {useAppContext} from "../../app/context/AppContext.ts";

interface RoleButtonProps {
    disabled?: boolean;
    onClick?: () => void;
    children?: string;
}

const RoleButton: React.FC<RoleButtonProps> = ({disabled, onClick, children}) => {
    return <Button disabled={disabled} className={`m-1 text-sm disabled:bg-gray-400`} onClick={onClick}>
        {children}
    </Button>
}

const UserCard: React.FC<User> = ({roles, email, id}) => {
    const {store, api} = useAppContext()
    const disabled = id === store.auth.user?.id;

    const UpdateUser = (id: string, callback: (id: string) => Promise<void>) => {
        return async () => {
            try {
                await callback.bind(api.admin)(id)
            } catch (error) {
                console.error(error)
            }
        }
    }

    return <div className="mb-2 p-2 bg-white rounded shadow border">
        <div className="flex items-center justify-between">
            <h3>{email}</h3>
            <div>
                {
                    roles.map(role => <RoleChip key={role} role={role} />)
                }
            </div>
        </div>
        <div className="flex items-center justify-between">
            <RoleButton onClick={UpdateUser(id, api.admin.setOperator)}>Сделать оператором</RoleButton>
            <RoleButton onClick={UpdateUser(id, api.admin.setAdmin)}>Сделать администратором</RoleButton>
            <RoleButton disabled={disabled} onClick={UpdateUser(id, api.admin.clearRoles)}>Лишить прав</RoleButton>
        </div>
    </div>
}

export default UserCard;