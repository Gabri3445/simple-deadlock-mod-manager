import React from "react";

function Button({children, onClick}: { onClick?: () => void, children?: React.ReactNode }) {
    return (
        <button className="bg-white text-black p-1 px-2 rounded-3xl" onClick={onClick}>{children}</button>
    )
}

export default Button;