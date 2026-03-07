import "./style.css";
import TopBar from "./components/TopBar/TopBar.tsx";
import ModTab, {ModTabVariant} from "./components/ModTab/ModTab.tsx";

function App() {

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

    }

    return (
        <main className="flex h-screen flex-col">
            <TopBar/>
            <div className="flex flex-1">
                <ModTab variant={ModTabVariant.UnloadedMods}/>
                <ModTab variant={ModTabVariant.LoadedMods}/>
            </div>
        </main>
    );
}

export default App;
