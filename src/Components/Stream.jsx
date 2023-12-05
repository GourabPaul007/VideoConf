import React from "react";
import ReactPlayer from "react-player";

const StreamPlayer = ({ stream }) => {
	return (
		<div style={{ borderRadius: 24 }}>
			<ReactPlayer playing muted height="300px" width="500px" url={stream} />
		</div>
	);
};

export default StreamPlayer;
