import React, {useEffect, useState} from "react";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import Button from "../../../shared/Button.tsx";
import {useAppContext} from "../../../app/context/AppContext.ts";
import type {FullOperation} from "../../../domain/operation.ts";
import {OperationCard} from "../Widgets/OperationCard.tsx";

enum State {
    Started,
    Ended
}

const EndedTransactionsList: React.FC = () => {
    const {api, service} = useAppContext()
    const [loading, setLoading] = useState(true)
    const [list, setList] = useState<FullOperation[] | null>(null)
    const [page, setPage] = useState(1)

    const load = async () => {
        setLoading(true)
        api.equipment
            .getTransactionsEnded(page)
            .then(res => {
                return Promise.all(res.map(o => {
                    return service.operation.getFull(o)
                }))
            })
            .then(res => {
                if (!list) {
                    setList(res)
                } else {
                    setList(list.concat(res))
                }

                if (res.length > 0) {
                    setPage(page + 1)
                    console.log(page)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, []);

    if (!list && !loading) {
        return <div>Не удалось загрузить список</div>
    }

    if (list && list.length == 0) {
        return <div>
            <div className="mb-4">Список пустой</div>
            <Button className="w-full" onClick={() => load()}>Попробовать еще раз</Button>
        </div>
    }

    return <div>
        <ul className="gap-y-4 flex flex-col mb-4">
            {
                list && list.map(fo => {
                    return <li key={fo.operation.id}>
                        <OperationCard operation={fo} key={fo.operation.id} shouldEquipmentName={true}/>
                    </li>
                })
            }
        </ul>
        {
            loading ? <div>Загрузка...</div> :
                <Button className="w-full" onClick={() => load()}>Загрузить еще</Button>
        }
    </div>
}

const CurrentTransactionsList: React.FC = () => {
    const {api, service} = useAppContext()
    const [loading, setLoading] = useState(true)
    const [list, setList] = useState<FullOperation[] | null>(null)
    const [page, setPage] = useState(1)

    const load = async () => {
        setLoading(true)
        api.equipment
            .getTransactionsNotEnded(page)
            .then(res => {
                return Promise.all(res.map(o => {
                    return service.operation.getFull(o)
                }))
            })
            .then(res => {
                if (!list) {
                    setList(res)
                } else {
                    setList(list.concat(res))
                }

                if (res.length > 0) {
                    setPage(page + 1)
                    console.log(page)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, []);

    if (!list && !loading) {
        return <div>Не удалось загрузить список</div>
    }

    if (list && list.length == 0) {
        return <div>
            <div className="mb-4">Список пустой</div>
            <Button className="w-full" onClick={() => load()}>Попробовать еще раз</Button>
        </div>
    }

    return <div>
        <ul className="gap-y-4 flex flex-col mb-4">
            {
                list && list.map(fo => {
                    return <li key={fo.operation.id}>
                        <OperationCard operation={fo} key={fo.operation.id} shouldEquipmentName={true}/>
                    </li>
                })
            }
        </ul>
        {
            loading ? <div>Загрузка...</div> :
                <Button className="w-full" onClick={() => load()}>Загрузить еще</Button>
        }
    </div>
}

const AccountingMenu: React.FC = () => {
    const [mode, setMode] = useState(State.Started)

    return <MainLayout>
        <PageHeader pageName="Отчеты" backlink="/operator" />

        <nav className="flex items-center justify-between gap-1 mb-4">
            <Button className="w-full" onClick={() => setMode(State.Started)}>Начатые</Button>
            <Button className="w-full" onClick={() => setMode(State.Ended)}>Завершенные</Button>
        </nav>

        {
            mode === State.Ended && <EndedTransactionsList />
        }
        {
            mode === State.Started && <CurrentTransactionsList />
        }
    </MainLayout>
}

export default AccountingMenu