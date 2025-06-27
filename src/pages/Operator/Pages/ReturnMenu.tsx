import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppContext} from "../../../app/context/AppContext.ts";
import type {EquipmentInfo} from "../../../domain/equipment.ts";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import {EquipmentCardExtended} from "../Widgets/EquipmentCardExtended.tsx";
import Divider from "../../../shared/Divider.tsx";
import type {FullOperation} from "../../../domain/operation.ts";
import {OperationCard} from "../Widgets/OperationCard.tsx";

const GiveMenu: React.FC = () => {
    const { id } = useParams()

    const { store, service } = useAppContext()
    const navigate = useNavigate();

    const [item, setItem] = useState<EquipmentInfo | undefined>(undefined)
    const [operations, setOperations] = useState<FullOperation[]>([])
    const [loading, setLoading] = useState(true)

    if (!id) {
        navigate("/operator/equipment")
        return;
    }

    useEffect(() => {
        service.operation.getFullByEquipmentId(id)
            .then(res => {
                setOperations(res)
                setItem(res[0].equipment)
            })
            .catch(() => {
                setOperations([])
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
        <PageHeader pageName="Возврат ТМЦ" backlink={`/operator/equipment/${id}`} />

        <article className="flex flex-col gap-y-4">
            <EquipmentCardExtended item={item} />
            <Divider/>

            <ul className="flex flex-col gap-y-4">
                {
                    operations.map((operation) => {
                        if (operation.operation.returnDate !== null) return;

                        return <li key={operation.operation.id}><OperationCard
                            operation={operation}
                            callback={
                                () => {
                                    navigate(`/operator/equipment/${id}`)
                                }
                            }
                        /></li>
                    })
                }
            </ul>
        </article>
    </MainLayout>
}

export default GiveMenu;