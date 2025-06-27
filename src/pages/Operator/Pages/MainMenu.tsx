import {Link} from "react-router-dom";
import React, {useRef, useState} from "react";
import MainLayout from "../../../shared/MainLayout.tsx";
import PageHeader from "../../../shared/Header.tsx";
import Button from "../../../shared/Button.tsx";
import {useAppContext} from "../../../app/context/AppContext.ts";
import QRCode from "react-qr-code";
import {qrDataToString} from "../../../domain/qr-data.ts";
import {useReactToPrint} from "react-to-print";
import {observer} from "mobx-react-lite";

const MainMenu: React.FC = observer(() => {
    const {store} = useAppContext()
    const [qrinfos, setQrinfos] = useState(store.qr.text)

    const printRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: () => {
            store.qr.clear()
            setQrinfos(store.qr.text)
        }
    })

    return <MainLayout>
        <PageHeader pageName="Главное меню" />
        <div className="space-y-4">
            <Link className="block" to="/operator/equipment"><Button className="w-full">Оборудование</Button></Link>
            <Link className="block" to="/operator/accounting"><Button className="w-full">Отчеты</Button></Link>
            <Link className="block" to="/operator/scan"><Button className="w-full">Сканировать</Button></Link>
            <Button className="w-full" onClick={reactToPrintFn}>Печать QR-кодов</Button>
            <>
                {
                    store.auth.user?.roles.includes('Admin')
                    && <Link className="block" to="/admin"><Button className="w-full">Перейти в админку</Button></Link>
                }
            </>
        </div>

        <div className="not-print:hidden grid gap-4 m-4 absolute grid-cols-7" ref={printRef}>
            {
                qrinfos.map((qrinfo, i) => {
                    return <div key={qrinfo.data.id.toString() + i}>
                        <QRCode
                            value={qrDataToString(qrinfo.data)}
                            size={64}
                        />
                        <div className="text-xs mt-2">
                            {qrinfo.name}
                        </div>
                    </div>
                })
            }
        </div>
    </MainLayout>
})

export default MainMenu;