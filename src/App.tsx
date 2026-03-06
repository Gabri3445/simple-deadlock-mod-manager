import "./style.css";
import TopBar from "./components/TopBar/TopBar.tsx";

function App() {

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

    }

    return (
        <main className="flex h-screen flex-col">
            <TopBar/>
            <div className="flex flex-1">
                <div className="flex-1 bg-red-500">Unloaded</div>
                <div className="flex-1 bg-red-500">Loaded</div>
            </div>
        </main>
    );
}

export default App;
