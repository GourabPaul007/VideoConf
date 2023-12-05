import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import SimpleAppBar from "../Components/Appbar";
import TextBoxWithLabel from "../Components/TextBoxWithLabel";
import VideoCallForm from "../Components/VideoCallForm";

export default function LobbyScreen() {
	const [email, setEmail] = useState(""); //email == userId
	const [room, setRoom] = useState("");

	const handleRoom = (room) => {
		setRoom(room);
	};

	const socket = useSocket();
	const navigate = useNavigate();

	const handlesubmit = useCallback(
		(event) => {
			// event.preventDefault();
			console.log(room);
			socket.emit("room:join", { email, room });
		},
		[email, room, socket]
	);

	const handleJoinRoom = useCallback(
		(data) => {
			const { email, room } = data;
			console.log(data);
			navigate(`/room/${room}`);
		},
		[navigate]
	);

	useEffect(() => {
		socket.on("room:join", handleJoinRoom);
		return () => {
			socket.off("room:join", handleJoinRoom);
		};
	}, [socket, handleJoinRoom]);

	return (
		<>
			<SimpleAppBar />
			&nbsp;
			<VideoCallForm
				handleCreateRoom={handlesubmit}
				handleJoinRoom={handlesubmit}
				room={room}
				setRoom={setRoom}
				handleRoom={handleRoom}
				setEmail={setEmail}
			/>
		</>
	);
}
