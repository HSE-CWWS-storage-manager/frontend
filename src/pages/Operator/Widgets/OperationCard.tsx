import React from "react";
import {useAppContext} from "../../../app/context/AppContext.ts";
import {useNavigate} from "react-router-dom";
import Button from "../../../shared/Button.tsx";
import type {FullOperation} from "../../../domain/operation.ts";
import Divider from "../../../shared/Divider.tsx";

export interface OperationCardProps {
    operation: FullOperation;
    callback?: (o: FullOperation) => void;
    shouldEquipmentName?: boolean;
}

export const OperationCard: React.FC<OperationCardProps> = ({operation, callback, shouldEquipmentName = false}) => {
    const {api} = useAppContext()
    const navigate = useNavigate();

    const createTransaction = () => {
        api.equipment
            .receive(operation.operation.id, new Date())
            .then(() => {
                if (callback) callback(operation)
            })
            .catch((err) => {
                console.log(err)
                alert("По неизвестным причинам не удалось вернуть ТМЦ, попробуйте еще раз позже")
            })
    };

    return <div className="p-2 border border-gray-300 rounded-md">
        {
            shouldEquipmentName &&
            <>
                <div>{operation.equipment.name}</div>
                <Divider />
            </>
        }
        <div className="flex justify-between gap-x-4">
            <div className="grow">
                <div>{operation.recipient.name}</div>
                <div className="flex justify-between">
                    <span>{operation.recipient.group}</span>
                    <span>
                    {
                        operation.operation.returnDate &&
                        <>
                            <span>{new Date(operation.operation.returnDate).toLocaleDateString("ru-ru")}</span>
                            -
                        </>
                    }
                        <span>{new Date(operation.operation.date).toLocaleDateString("ru-ru")}</span>
                </span>
                </div>
            </div>

            { !operation.operation.returnDate && <Button onClick={() => createTransaction()} className="my-4">Вернуть</Button> }
        </div>
    </div>
}