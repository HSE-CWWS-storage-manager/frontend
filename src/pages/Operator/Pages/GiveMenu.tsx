import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppContext} from "../../../app/context/AppContext.ts";
import type {EquipmentInfo} from "../../../domain/equipment.ts";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import {EquipmentCardExtended} from "../Widgets/EquipmentCardExtended.tsx";
import Divider from "../../../shared/Divider.tsx";
import Button from "../../../shared/Button.tsx";
import useInput from "../../../shared/useInput.tsx";
import {saveAs} from "file-saver";

const GiveMenu: React.FC = () => {
    const { id } = useParams()

    const { store, api, service } = useAppContext()
    const navigate = useNavigate();

    const [item, setItem] = useState<EquipmentInfo | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const [StudentName, studentName] = useInput("ФИО студента")
    const [StudentGroup, studentGroup] = useInput("Группа студента")

    if (!id) {
        navigate("/operator/equipment")
        return;
    }

    const createTransaction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let blob: Blob;

        service.student
            .get(studentName, studentGroup)
            .then(async (res) => {
                blob = await api.equipment.getCard(id, res.id)
                return api.equipment.give(id, res.id)
            })
            .then(() => {
                saveAs(blob, 'card.xlsx')
                navigate(`/operator/equipment/${id}`)
            })
            .catch(() => {
                alert("По неизвестным причинам не удалось передать ТМЦ, попробуйте еще раз позже")
            })
    };

    useEffect(() => {
        service.equipment.getById(id)
            .then((equipment: EquipmentInfo) => {
                setItem(equipment)
            })
            .catch((err) => {
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
        <PageHeader pageName="Передача ТМЦ" backlink={`/operator/equipment/${id}`} />

        <article className="flex flex-col gap-y-4">
            <EquipmentCardExtended item={item} />
            <Divider/>

            <form onSubmit={(e) => createTransaction(e)}>
                { StudentName }
                { StudentGroup }
                <Button type="submit" className="w-full">Передать</Button>
            </form>
        </article>
    </MainLayout>
}

export default GiveMenu;