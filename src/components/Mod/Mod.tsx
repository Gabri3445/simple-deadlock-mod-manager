function Mod({modName}: { modName: string }) {
    const colors = ["bg-gunItem", "bg-vitalityItem", "bg-spiritItem"];
    return (
        <div
            className={`${colors[Math.floor(Math.random() * colors.length)]}  h-20 leading-20 text-center text-black font-bold`}>{modName}</div>

    )
}

export default Mod;