import React from 'react';
import { format } from 'd3-format';
import { LegendThreshold } from '@vx/legend';
import * as _ from 'underscore';

import '../styles/Legend.css';

const Legend = (props) => {
	let num = _.max(props.colorscale.domain()) > 1.0 ? '$,' : '.0%';
	let fmt = format(num);
	return (
		<div className="Legend">
			<LegendThreshold
				scale={props.colorscale}
				labelFormat={(label) => label ? fmt(label) : ''}
			/>
		</div>
	);
};

export default Legend;
