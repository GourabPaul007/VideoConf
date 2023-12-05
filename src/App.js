import { Route, Routes } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/LobbyScreen";
import Room from "./screens/Room";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<LobbyScreen />} />
				<Route path="/room/:roomID" element={<Room />} />
			</Routes>
		</div>
	);
}

export default App;
