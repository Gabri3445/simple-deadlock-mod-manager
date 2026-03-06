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
                {/*TODO: move these into their own components*/}
                <div className="flex-1 bg-cream p-3">
                    <div className="border-3 h-full border-t-0 border-darker-cream">
                        <div className="bg-darker-cream text-white h-8.75 leading-8.75 pl-2">Unloaded Mods</div>
                    </div>
                </div>
                <div className="flex-1 bg-cream p-3">
                    <div className="border-3 h-full border-t-0 border-darker-cream">
                        <div className="bg-darker-cream text-white h-8.75 leading-8.75 pl-2">Loaded Mods</div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
