import React, {useEffect, useRef, useState} from "react";
import QRCode from "react-qr-code";
import {useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../../../app/context/AppContext.ts";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import type {EquipmentInfo} from "../../../domain/equipment.ts";
import Divider from "../../../shared/Divider.tsx";
import Button from "../../../shared/Button.tsx";
import {observer} from "mobx-react-lite";
import {EquipmentCardExtended} from "../Widgets/EquipmentCardExtended.tsx";
import {qrDataToString} from "../../../domain/qr-data.ts";
import {useReactToPrint} from "react-to-print";

interface ChangeCountPartProps {
    item: EquipmentInfo;
}

const ChangeCountPart: React.FC<ChangeCountPartProps> = ({ item: equipment }) => {
    const { api, store } = useAppContext();
    const [changeCount, setChangeCount] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const setChangeCountSmart = (count: number) => {
        if (count < 1) {
            setChangeCount(1)
        } else {
            setChangeCount(count)
        }
    }

    const changeCountWarehouse = async (count: number) => {
        if (equipment === undefined) return
        setLoading(true)

        api.equipment.warehouseChangeCount(equipment?.id, count)
            .then(() => {
                store.equipment.changeCountById(equipment.id, count)
            })
            .catch(() => {

            })
            .finally(() => {
                setLoading(false)
            })
    }

    const deleteEquipment = async () => {
        setLoading(true)
        const really = confirm(`Вы действительно хотите удалить ${equipment.name}?`);

        if (!really) {
            setLoading(false)
            return
        }

        api.equipment.delete(equipment.id)
            .then(() => {
                store.equipment.deleteById(equipment.id)
                navigate("/operator/equipment")
            })
            .catch(() => {
                alert("Не удалось удалить предмет")
                setLoading(false)
            })
    }

    return <div className="w-full flex justify-center gap-x-2 relative">
        { equipment.onStock > 0 && <Button onClick={() => changeCountWarehouse(-changeCount)} disabled={equipment.onStock < changeCount}>Списать</Button> }
        { ((equipment.onStock == 0 && equipment.onLoan == 0)
            || Number.isNaN(equipment.onStock) || Number.isNaN(equipment.onLoan))
            && <Button className="bg-red-500 hover:bg-red-600" onClick={() => deleteEquipment()}>Удалить</Button> }
        <input
            className="w-1/5 p-2 border rounded-sm"
            type="number"
            value={changeCount}
            onChange={(e) => { setChangeCountSmart(Number(e.target.value)) }}
        />
        <Button onClick={() => changeCountWarehouse(changeCount)}>Принять</Button>
        { loading &&
            <div className="absolute w-full h-full flex items-center justify-center rounded-md bg-gray-200">
                Обновление информации...
            </div>
        }
    </div>
}

const EquipmentPage: React.FC = observer(() => {
    const { id } = useParams()
    const { store, service } = useAppContext()
    const navigate = useNavigate();

    const [item, setItem] = useState<EquipmentInfo | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const addToList = () => {
        if (!item) return

        store.qr.add({
            data: {
                type: 'equipment',
                id: item.id
            },
            name: item.name
        })
    }

    useEffect(() => {
        if (!id) {
            navigate("/operator/equipment")
            return;
        }

        service.equipment.getById(id)
            .then((equipment: EquipmentInfo) => {
                setItem(equipment)
            })
            .catch((err) => {
                console.log(err)
                alert("Такого предмета не существует")
                navigate("/operator/equipment")
            })
            .finally(() => {
                setLoading(false)
            })

    }, [store.equipment.equipments]);

    if (loading) {
        return <MainLayout>
            <PageHeader pageName="Загрузка..." backlink="/operator/equipment" />
        </MainLayout>
    }

    if (!item) {
        return <MainLayout>
            <PageHeader pageName={"Неизвестное оборудование"} backlink="/operator/equipment" />
        </MainLayout>
    }

    return <MainLayout>
        <PageHeader pageName="Оборудование" backlink="/operator/equipment" />
        <article className="grid grid-cols-1 gap-y-3">
            <EquipmentCardExtended item={item} />

            <Divider />

            <form className="flex flex-col gap-y-3" onSubmit={e => {e.preventDefault()}}>
                <Button className="w-full" disabled={item.onStock == 0} onClick={() => navigate(`/operator/equipment/give/${id}`)}>Выдать</Button>
                <Button className="w-full" disabled={item.onLoan == 0} onClick={() => navigate(`/operator/equipment/return/${id}`)}>Вернуть</Button>
                <ChangeCountPart item={item} />
            </form>

            <Divider />

            <div className="flex flex-row not-print:justify-center m-4">
                <QRCode
                    value={qrDataToString({
                        type: 'equipment',
                        id: item.id
                    })}
                    size={256}
                />
            </div>
            <Button onClick={() => addToList()}>Добавить в список на печать</Button>
        </article>
    </MainLayout>
})

export default EquipmentPage;