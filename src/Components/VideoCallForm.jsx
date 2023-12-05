import React, { useState, useEffect } from "react";
import { Container, Paper, Grid, Button, TextField, Typography } from "@mui/material";
import generateFourLetterId from "../utils/generateRoomId";
import "./VideoCallForm.css";

const VideoCallForm = ({ handleCreateRoom, handleJoinRoom, room, setRoom, handleRoom, setEmail }) => {
	const [createRoomUserId, setCreateRoomUserId] = useState("");
	const [createRoomId, setCreateRoomId] = useState(generateFourLetterId());
	const [joinRoomUserId, setJoinRoomUserId] = useState("");
	const [joinRoom, setJoinRoom] = useState("");

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		handleRoom(createRoomId);
		console.log(createRoomId);
	}, []);

	return (
		<Container maxWidth="md" style={{ marginTop: "50px" }}>
			{/* Create Room Section */}
			<Paper elevation={3} style={{ padding: "20px" }}>
				<Typography variant="h6" gutterBottom>
					Create a Room
				</Typography>
				&nbsp;
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<TextField
							label="User ID"
							variant="outlined"
							fullWidth
							value={createRoomUserId}
							onChange={(e) => {
								setCreateRoomUserId(e.target.value);
								setEmail(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<div
							className="createRoomIdContainer"
							style={{
								border: "1px solid #bbb",
								height: 54,
								borderRadius: 3,
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
							onClick={() => {
								setCopied(true);
								navigator.clipboard.writeText(createRoomId);
								setTimeout(() => {
									setCopied(false);
								}, 1000);
							}}
						>
							<Typography>&nbsp;&nbsp;&nbsp;{createRoomId}</Typography>
							{copied ? (
								<Typography style={{ color: "green" }}>Copied!&nbsp;&nbsp;</Typography>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="16"
									fill="currentColor"
									className="bi bi-copy"
									viewBox="0 0 16 16"
									color="#777"
								>
									<path
										fillRule="evenodd"
										d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
									/>
								</svg>
							)}
						</div>
					</Grid>
					<Grid item xs={12} md={12}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleCreateRoom}
							style={{ marginTop: "20px" }}
						>
							Create Room
						</Button>
					</Grid>
				</Grid>
			</Paper>
			<div style={{ paddingTop: 24 }}>&nbsp;</div>
			{/* Join Room Section */}
			<Paper elevation={3} style={{ padding: "20px" }}>
				<Typography variant="h6" gutterBottom>
					Join Room
				</Typography>
				&nbsp;
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<TextField
							label="User Id"
							variant="outlined"
							fullWidth
							value={joinRoomUserId}
							onChange={(e) => {
								setJoinRoomUserId(e.target.value);
								setEmail(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Room Name"
							variant="outlined"
							fullWidth
							value={joinRoom}
							onChange={(e) => {
								setJoinRoom(e.target.value);
								handleRoom(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12} md={12}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleJoinRoom}
							style={{ marginTop: "20px" }}
						>
							Join Room
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
};

export default VideoCallForm;
