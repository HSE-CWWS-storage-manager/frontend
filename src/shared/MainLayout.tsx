import type {ReactNode} from "react"

interface MainLayoutProps {
    children?: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        {children}
    </div>
}

export default MainLayout