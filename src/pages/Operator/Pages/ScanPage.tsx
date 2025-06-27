import React, {useState} from "react";
import {Scanner} from "@yudiel/react-qr-scanner";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import {stringToQrData} from "../../../domain/qr-data.ts";
import {useNavigate} from "react-router-dom";


const ScanPage: React.FC = () => {
    const [error, setError] = useState<string>("")
    const navigate = useNavigate()

    return <MainLayout>
        <PageHeader pageName="Сканирование" backlink="/operator" />
        <Scanner
            constraints={{}}
            onScan={(result) => {
                const scan = stringToQrData(result[0].rawValue)

                if (!scan || scan.type !== "equipment") {
                    setError("Вы отсканировали неподходящий QR-код")
                } else {
                    navigate(`/operator/equipment/${scan.id}`)
                }
            }}
            formats={["qr_code"]}
        />
        {error ?? ""}
    </MainLayout>
}

export default ScanPage;