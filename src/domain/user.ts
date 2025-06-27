
type Role = 'User' | 'Admin' | 'Operator'

type User = {
    id: string
    email: string
    roles: Role[]
}

export type { User, Role }