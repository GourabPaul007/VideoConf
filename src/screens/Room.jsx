import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";

import "./style.css";

import { Box } from "@mui/material";
import SimpleAppBar from "../Components/Appbar";

import { useParams } from "react-router-dom";
import StreamPlayer from "../Components/Stream";

import { Button } from "@mui/material";

export default function Room() {
	const { roomID } = useParams();

	const socket = useSocket();
	const [remoteSocketId, setRemoteSocketId] = useState(null);
	const [mystream, setMyStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState();

	const handleUserJoined = useCallback(
		({ email, id }) => {
			console.log(`${email} joined The Room`);
			setRemoteSocketId(id);
		},
		[setRemoteSocketId]
	);

	const handleCallUser = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		const offer = await peer.getOffer();
		socket.emit("user:call", { to: remoteSocketId, offer });
		setMyStream(stream);
	}, [remoteSocketId, socket]);

	const handleIncomingCall = useCallback(
		async ({ from, offer }) => {
			console.log("handleIncomingCall");
			setRemoteSocketId(from);
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			setMyStream(stream);
			console.log(`incomming call`, from, offer);
			const ans = await peer.getAns(offer);
			socket.emit("call:accepted", { to: from, ans });

			// handleCallAccepted(from, offer)
		},
		[socket]
	);

	const sendStreams = useCallback(() => {
		for (const track of mystream.getTracks()) {
			peer.peer.addTrack(track, mystream);
		}
	}, [mystream]);

	const handleCallAccepted = useCallback(
		({ from, ans }) => {
			peer.setLocalDescription(ans);
			console.log("Call Accepted");
			// send my tracks to other users
			sendStreams();
		},
		[sendStreams]
	);

	const handleNegoNeeded = useCallback(async () => {
		const offer = await peer.getOffer();
		socket.emit("peer:negotiation:needed", { offer, to: remoteSocketId });
	}, [remoteSocketId, socket]);

	const handleNegoIcoming = useCallback(
		async ({ from, offer }) => {
			const ans = await peer.getAns(offer);
			socket.emit("peer:negotiation:done", { to: from, ans });
		},
		[socket]
	);

	const handleNegoFinal = useCallback(
		async ({ ans }) => {
			await peer.setLocalDescription(ans);
		},
		[socket]
	);

	useEffect(() => {
		peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
		return () => {
			peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
		};
	}, [handleNegoNeeded, socket]);

	// get other users tracks
	useEffect(() => {
		peer.peer.addEventListener("track", async (ev) => {
			const remoteStream = ev.streams;
			console.log("Got Tracks");
			setRemoteStream(remoteStream[0]);
		});
	}, []);

	useEffect(() => {
		socket.on(`user:joined`, handleUserJoined);
		socket.on(`incoming:call`, handleIncomingCall);
		socket.on(`call:accepted`, handleCallAccepted);
		socket.on(`peer:negotiation:needed`, handleNegoIcoming);
		socket.on(`peer:negotiation:final`, handleNegoFinal);

		return () => {
			socket.off(`user:joined`, handleUserJoined);
			socket.off(`incoming:call`, handleIncomingCall);
			socket.off(`call:accepted`, handleCallAccepted);
			socket.off(`peer:negotiation:needed`, handleNegoIcoming);
			socket.off(`peer:negotiation:final`, handleNegoFinal);
		};
	}, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoIcoming, handleNegoFinal]);

	// useEffect(() => {
	//     (async()=>{
	//         const stream = await navigator.mediaDevices.getUserMedia({
	//             audio: true,
	//             video: true
	//         });
	//     setMyStream(stream);
	//     if(remoteSocketId){
	//         await handleCallUser();
	//     }
	//     })()
	// }, [remoteSocketId,handleCallUser]);

	return (
		<div className="gradient-background">
			<SimpleAppBar />
			&nbsp;
			<Box
				component="header"
				style={{
					margin: "0px 20px 12px 20px",
					background: "#645645",
					background: "linear-gradient(to right, purple, orange)",
					border: "1px solid orange",
					color: "orange",
					padding: 12,
					borderRadius: 8,
					fontSize: 24,
					display: "flex",
				}}
			>
				&nbsp;&nbsp;Room {roomID}
			</Box>
			<h1>{remoteSocketId ? "Connected!" : "No One In This Room"}</h1>
			{remoteSocketId && (
				<Button color="success" variant="contained" onClick={handleCallUser}>
					Call
				</Button>
			)}
			<div style={{ display: "flex", padding: 20, justifyContent: "center", alignItems: "center" }}>
				<div>
					{mystream && (
						<>
							<h1>My Stream</h1>
							<StreamPlayer stream={mystream} />
						</>
					)}
				</div>
				<div>
					{remoteStream && (
						<>
							<h1>Remote Stream</h1>
							<StreamPlayer stream={remoteStream} />
						</>
					)}
				</div>
			</div>
		</div>
	);
}
