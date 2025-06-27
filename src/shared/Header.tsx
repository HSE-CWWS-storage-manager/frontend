import { NavLink } from "react-router-dom"
import Button from "./Button"
import style from "./Header.module.css"
import React, {useEffect, useState} from "react";
import {useAppContext} from "../app/context/AppContext.ts";
import {reaction} from "mobx";
import Divider from "./Divider.tsx";

interface PageHeaderProps {
    pageName: string
    backlink?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({pageName, backlink}) => {
    const {store, api} = useAppContext();

    const [token, setToken] = useState<string | null>(store.auth.token);

    useEffect(() => {
        const dispose = reaction(
            () => store.auth.token,
            (token) => {
                setToken(token);
            })

        return () => dispose()
    })

    return <>
        <header className="mb-2">
            <NavLink to={backlink ?? "#"} className="flex mb-2">
                <h1 className={"text-2xl flex-auto " + (backlink ? style.backlink : "")}>{pageName}</h1>
                {token && <Button className="flex-initial" onClick={() => api.auth.logout()}>Выйти</Button>}
            </NavLink>
            <Divider />
        </header>
    </>
}

export default PageHeader