import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "./context/AppContext.ts";

const RoleRedirect: React.FC = () => {
    const {store} = useAppContext()
    const user = store.auth.user

    const navigate = useNavigate()

    useEffect(() => {
        if (user?.roles.includes('Operator')) navigate("/operator")
        else if (user?.roles.includes('Admin')) navigate("/admin")
        else if (user?.roles.includes('User')) navigate("/user")
        else navigate("/auth")
    }, []);

    return <></>
}

export default RoleRedirect