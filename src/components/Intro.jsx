import React from 'react';

const text = 'Select a topic and indicator to view either a map or a chart. Clicking a neighborhood on the map or chart will bring up detailed information on that neighborhood. See all neighborhoods in the table below.';

const Intro = () => (
	<div className="Intro">
		<h1>Hartford / West Hartford Neighborhood Profiles, 2016</h1>
		<p>{text}</p>
	</div>
);

export default Intro;
