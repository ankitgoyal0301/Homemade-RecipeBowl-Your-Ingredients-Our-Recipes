import React, { useState, useEffect } from 'react';
import './feed.css';
import LeftPanel from './leftPanel.js';
import RightPanel from './rightPanel.js';

function Feed()
{
	return(
		<div style={{position:"static"}} className="feed-container">
			<div className="left-panel shadow-5">
				<LeftPanel/>
			</div>
			<div className="right-panel">
				<RightPanel/>
			</div>
		</div>
	);

}

export default Feed;
