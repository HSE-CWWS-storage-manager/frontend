import React, {useEffect, useState} from "react";
import PageHeader from "../../shared/Header.tsx";
import type {User} from "../../domain/user.ts";
import UserCard from "./UserCard.tsx";
import Button from "../../shared/Button.tsx";
import MainLayout from "../../shared/MainLayout.tsx";
import {useAppContext} from "../../app/context/AppContext.ts";
import {observer} from "mobx-react-lite";

const AdminPage: React.FC = observer(() => {
    const {store, api} = useAppContext()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const loadNextPage = async () => {
        setLoading(true);
        api.admin
            .loadPage(store.admin.getPage)
            .then(() => {
                setError("")
            })
            .catch(() => {
                setError("Произошла непредвиденная ошибка при загрузке")
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (store.admin.users.length === 0) {
            loadNextPage()
        }
    }, []);

    return <MainLayout>
        <PageHeader pageName={"Админка"} backlink={store.auth.user?.roles.includes('Operator') ? "/operator" : undefined} />
        { error && <p>{error}</p> }
        <ol>
            {
                store.admin.users.map((user: User) => {
                    return <li key={user.id} {...(user.id === store.auth.user?.id) ? {disabled: true} : null}>
                        <UserCard {...user} />
                    </li>
                })
            }
        </ol>
        {
            loading ? <p>Загрузка...</p> : <Button className="w-full" onClick={() => loadNextPage()}>Загрузить еще</Button>
        }
    </MainLayout>
})

export default AdminPage