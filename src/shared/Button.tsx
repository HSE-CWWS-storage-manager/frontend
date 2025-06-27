import React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({className, children, ...props}) => {
    return <button {...props} className={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 " + (className ?? "")}>
        {children}
    </button>
}

export default Button