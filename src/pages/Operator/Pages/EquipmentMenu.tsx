import React, {type FormEvent, type JSX, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import Button from "../../../shared/Button.tsx";
import type {Equipment, EquipmentInfo} from "../../../domain/equipment.ts";
import {useAppContext} from "../../../app/context/AppContext.ts";
import {EquipmentCard} from "../Widgets/EquipmentCard.tsx";

enum State {
    List, Creation
}

const EquipmentList: React.FC = observer(() => {
    const {store, api} = useAppContext()

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const loadNextPage = async () => {
        setLoading(true);
        api.equipment
            .loadPage(store.equipment.getPage)
            .then(() => {
                setError("")
            })
            .catch(() => {
                setError("Произошла непредвиденная ошибка при загрузке")
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (store.equipment.equipments.length === 0) {
            loadNextPage()
        }

        return () => {
            store.equipment.clear()
        }
    }, [])

    return <>
        { error && <p>{error}</p> }
        <ul className="gap-4 flex flex-col mb-4">
            { store.equipment.equipments.map((equipment: EquipmentInfo) => {
                return <li key={equipment.id}>
                    <EquipmentCard equipment={equipment} />
                </li>
            }) }
        </ul>
        {
            loading ? <p>Загрузка...</p> : <Button className="w-full" onClick={() => loadNextPage()}>Загрузить еще</Button>
        }
    </>
})

const EquipmentCreation: React.FC = () => {
    const {api} = useAppContext()

    const [name, setName] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [serial, setSerial] = useState<string>("");
    const [inventory, setInventory] = useState<string>("");
    const [count, setCount] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const equipment : Omit<Equipment, "id"> = {
            name: name,
            model: model === "" ? undefined : model,
            serialNumber: serial === "" ? undefined : serial,
            inventoryNumber: inventory === "" ? undefined : inventory
        };

        await api.equipment.create(equipment, count).then(() => {
            setName("");
            setModel("");
            setSerial("");
            setInventory("");
            setCount(1);
            setError(null);
        }).catch(error => {
            setError(error);
        });
    }

    return <>
        { error && <div>Произошла ошибка при создании оборудования, попробуйте еще раз</div> }
        <form onSubmit={handleSubmit}>
            <input
                className="w-full p-2 mb-4 border rounded"
                type={"text"}
                placeholder={"Наименование"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
            <input
                className="w-full p-2 mb-4 border rounded"
                type={"text"}
                placeholder={"Модель"}
                value={model}
                onChange={(e) => setModel(e.target.value)} />
            <input
                className="w-full p-2 mb-4 border rounded"
                type={"text"}
                placeholder={"Серийный номер"}
                value={serial}
                onChange={(e) => setSerial(e.target.value)} />
            <input
                className="w-full p-2 mb-4 border rounded"
                type={"text"}
                placeholder={"Инвентарный номер"}
                value={inventory}
                onChange={(e) => setInventory(e.target.value)} />
            <input
                className="w-full p-2 mb-4 border rounded"
                type={"number"}
                placeholder={"Количество на складе"}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))} />
            <Button type={"submit"}>Создать</Button>
        </form>
    </>
}

const EquipmentMenu: React.FC = () => {
    const [mode, setMode] = useState<State>(State.List);

    let pageElement : JSX.Element = <></>;
    if (mode === State.List) {
        pageElement = <EquipmentList />
    } else if (mode === State.Creation) {
        pageElement = <EquipmentCreation />
    }

    return <MainLayout>
        <PageHeader pageName="Оборудование" backlink="/operator" />
        <nav className="flex items-center justify-between gap-1 mb-4">
            <Button className="w-full" onClick={() => setMode(State.List)}>Список</Button>
            <Button className="w-full" onClick={() => setMode(State.Creation)}>Создать</Button>
            <Link to="/operator/scan"><Button className="w-full">Сканировать</Button></Link>
        </nav>
        <article>
            { pageElement }
        </article>
    </MainLayout>
}

export {EquipmentMenu}