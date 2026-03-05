import "./style.css";
import Button from "./components/Button.tsx";

function App() {

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

    }

    return (
        <main className="flex h-screen flex-col">
            <div className="w-full bg-sky-400 p-4 flex justify-between">
                <h1 className="font-extrabold text-3xl block">Deadlock Mod Manager</h1>
                <div className="flex gap-4">
                    <Button>Load Mod</Button>
                    <Button>Select game path</Button>
                </div>
            </div>
            <div className="flex flex-1">
                <div className="flex-1 bg-red-500">Unloaded</div>
                <div className="flex-1 bg-red-500">Loaded</div>
            </div>
        </main>
    );
}

export default App;
