import * as z from "zod/v4"

const Student = z.object({
    id: z.string(),
    name: z.string(),
    group: z.string(),
})

type Student = z.infer<typeof Student>

export default Student;