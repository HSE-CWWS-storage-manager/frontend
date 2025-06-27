import * as z from 'zod/v4'

const QrData = z.object({
    type: z.string(),
    id: z.string()
})

type QrData = z.infer<typeof QrData>

function qrDataToString(data: QrData): string {
    return `type:${data.type};id:${data.id}`
}

function stringToQrData(str: string): QrData | undefined {
    if (!/^type:[a-zA-Z0-9]+;id:[0-9a-z-]+$/.test(str)) return undefined

    const [typeStr, idStr] = str.split(';')

    const t = typeStr.slice(5)
    const id = idStr.slice(3)

    return {
        type: t,
        id: id
    }
}

export {qrDataToString, stringToQrData, QrData}