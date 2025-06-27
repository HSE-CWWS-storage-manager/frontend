import React, {useEffect, useState} from 'react'
import { Outlet } from 'react-router-dom'
import type {Role, User} from "../domain/user.ts";
import {reaction} from "mobx";
import RoleRedirect from "./RoleRedirect.tsx";
import {useAppContext} from "./context/AppContext.ts";
import {observer} from "mobx-react-lite";

interface ProtectedRouteProps {
    requiredRole: Role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({requiredRole}) => {
    const {store} = useAppContext()

    const [user, setUser] = useState<User | null>(store.auth.user)

    useEffect(() => {
        const dispose = reaction(
            () => store.auth.user,
            (newUser) => {
                setUser(newUser)
            }
        )

        return () => dispose()
    }, []);

    if (user === null || !user.roles.includes(requiredRole)) {
        return <RoleRedirect />
    } else {
        return <Outlet />
    }
})

export default ProtectedRoute