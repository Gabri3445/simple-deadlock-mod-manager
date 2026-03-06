import React from "react";

function Button({children, onClick}: { onClick?: () => void, children?: React.ReactNode }) {
    return (
        <button
            className="bg-white/80 hover:bg-white active:bg-gray-500 transition-colors duration-200 text-black p-1 px-2 rounded-3xl font-retail-demo font-bold "
                onClick={onClick}>{children}</button>
    )
}

export default Button;