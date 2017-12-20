import React from 'react';
import { format } from 'd3-format';
import { max } from 'd3-array';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleOrdinal, scaleBand, scaleLinear } from '@vx/scale';
// import { TooltipWithBounds, Tooltip } from '@vx/tooltip';
import Tooltip from 'react-portal-tooltip';
import { Motion, spring } from 'react-motion';

import '../styles/Chart.css';

const color = scaleOrdinal({
	domain: ['1_neighborhood', '2_city', '3_state'],
	range: ['#7c7479', '#9f9f9f', '#9f9f9f']
});

const percent = (x) => format('.0%')(x);
const neighborhood = (d) => d.neighborhood;
const value = (d) => +d.value;
const makeId = (str) => str.toLowerCase().replace(/\W/gi, '');

const tipStyle = {
	style: {
		background: '#333',
		opacity: 0.85,
		boxShadow: 0,
		color: 'white',
		fontFamily: 'Barlow',
		fontSize: '0.85em',
		padding: '3px'
	},
	arrowStyle: {
		color: '#333',
		opacity: 0.85,
		borderColor: false
	}
};

let margin = { left: 135, top: 30, bottom: 50, right: 12 };

export default class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tipString: '',
			hovering: false,
			hoverOver: 'bar-asylumhill',
			oldScale: null,
			newScale: null
		};
		this.handleClick = props.handleClick.bind(this);
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
	}

	componentWillReceiveProps(nextProps) {

	}

	colorNeighborhood = (d) => {
		return d.neighborhood === this.props.hood ? '#980043' : color(d.geoType);
	};

	showTooltip = (d, e) => {
		let id = `bar-${makeId(d.y)}`;
		this.setState({
			tipString: percent(d.x),
			hovering: true,
			hoverOver: id
		});
	};

	hideTooltip = () => {
		this.setState({
			hovering: false
		});
	};


    render() {
		let data = this.props.data;
		let width = this.props.width;
		let height = this.props.height;
		margin.left = 0.25 * width;
		let innerWidth = width - margin.left - margin.right;
		let innerHeight = height - margin.top - margin.bottom;

		let xscale = scaleLinear({
			range: [0, innerWidth],
			domain: [0, max(data, value)],
			nice: true
		});

		let yscale = scaleBand({
			rangeRound: [0, innerHeight],
			domain: data.map(neighborhood),
			padding: 0.2,
		});



		return (
			<div className="Chart">
				<svg width={width} height={height}>
					<Group top={margin.top} left={margin.left}>
						{data.map((d, i) => {
							let barLength = xscale(value(d));
							let y = yscale(neighborhood(d));
							return (
								<Motion key={i}
									defaultStyle={{ width: 0 }}
									style={{ width: spring(barLength, { stiffness: 150, damping: 20 }) }}
								>
									{ (style) => (
										<Group >
											<Bar
												height={yscale.bandwidth()}
												// width={barLength}
												width={style.width}
												y={y}
												x={0}
												id={`bar-${makeId(neighborhood(d))}`}
												fill={ this.colorNeighborhood(d) }
												data={{ x: value(d), y: neighborhood(d) }}
												className="bar"
												onClick={data => e => this.handleClick(data)}
												onMouseEnter={data => e => this.showTooltip(data, e)}
												onMouseLeave={data => e => this.hideTooltip()}
											/>
										</Group>
									)}
								</Motion>
							)
						})}

						<AxisLeft
							hideAxisLine={true}
							hideTicks={true}
							scale={yscale}
							tickLabelProps={(val, i) => ({
								dy: '0.3em',
								fontFamily: 'Barlow Semi Condensed',
								textAnchor: 'end'
							})}
							// tickFormat={(x) => x.length < 20 ? x : x.substr(0, 20) + '...'}
							tickFormat={(x) => {
								let len = Math.floor(0.15 * margin.left);
								return x.length < len ? x : x.substr(0, len) + '...';
							}}
							className={'axis'}
						/>
						<AxisBottom
							scale={xscale}
							top={innerHeight}
							tickLabelProps={(val, i) => ({
								fontFamily: 'Barlow Semi Condensed',
								textAnchor: 'middle'
							})}
							tickFormat={percent}
							numTicks={4}
							className={'axis'}
						/>
					</Group>
				</svg>
				<Tooltip
					active={this.state.hovering}
					position="right"
					// arrow="center"
					parent={`#${this.state.hoverOver}`}
					style={tipStyle}
					tooltipTimeout={300}
				>
					<div className="tooltip-content">{this.state.tipString}</div>
				</Tooltip>
			</div>
		);
    }
}
