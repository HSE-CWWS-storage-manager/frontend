import React, {type ReactNode} from "react";

interface InfoProps {
    name: string;
    children: ReactNode;
}

const Info: React.FC<InfoProps> = ({ name, children }) => {
    return <div>
        <p className="text-sm text-gray-400">{name}</p>
        <p>{children}</p>
    </div>
}

export default Info;