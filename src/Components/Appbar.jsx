import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const SimpleAppBar = () => {
	return (
		<AppBar position="static" color="warning">
			<Toolbar>
				<Typography variant="h6">Video Conference</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default SimpleAppBar;
