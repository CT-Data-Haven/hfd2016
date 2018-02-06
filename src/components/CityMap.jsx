import React from 'react';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Legend from './Legend';

import topology from './hfd_shape.json';
import '../styles/CityMap.css';

const b = topojson.bbox(topology);
const bbox = [[ b[1], b[0] ], [ b[3], b[2] ]];
const shape = topojson.feature(topology, topology.objects.hfd_shape);
const mesh = [topojson.mesh(topology, topology.objects.hfd_shape, (a, b) => a.properties.Town !== b.properties.Town)];
const merge = [topojson.merge(topology, topology.objects.hfd_shape.geometries)];

const cityStyle = {
	fillColor: 'transparent',
	color: '#333',
	weight: 1.5,
	pointerEvents: 'none'
};

export default class CityMap extends React.Component {

	updateColor = (geography) => {
		let name = geography.properties.Neighborhood;
		let color = this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';

		return {
			fillColor: color,
			color: '#eee',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.75
		};
	};

	onEachFeature = (feature, layer) => {
		let name = feature.properties.Neighborhood;

		layer.on('click', this.props.handleClick)
			.on('mouseover', this.addHilite)
			.on('mouseout', this.removeHilite);
		layer.bindTooltip(() => {
			return this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		}, { direction: 'top', offset: [0, -20], className: 'custom-tip' });
	};

	addHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 95,
			weight: 1
		});
		// .bringToFront();
	};

	removeHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.75,
			weight: 0.5
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		return (
			<div className="CityMap" id="map">
				<Map
					bounds={bbox}
					scrollWheelZoom={false}
					zoomSnap={0.25}
					zoomDelta={0.25}
				>
					<TileLayer
						url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}"
						attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						subdomains='abcd'
						minZoom={0}
						maxZoom={20}
						ext='png'
						opacity={0.4}
					/>
					{/* neighborhoods */}
					<GeoJSON
						data={shape}
						key={(feature) => feature.properties.Neighborhood}
						style={this.updateColor}
						onEachFeature={this.onEachFeature}
					/>
					<GeoJSON
						data={mesh}
						style={cityStyle}
						interactive={false}
					/>
					<GeoJSON
						data={merge}
						style={cityStyle}
						interactive={false}
					/>
				</Map>
				<Legend colorscale={this.props.color} />
				{/* <ScaleSVG width={width} height={height}>
					<Mercator
						data={shape.features}
						id={this.makeId}
						scale={210000}
						center={center}
						translate={[ width / 2, height / 2 ]}
						stroke={'#777'}
						fill={this.updateColor}
						onClick={(geography) => (event) => {
					this.props.handleClick(geography);
						}}
						onMouseEnter={(geography) => (event) => {
					this.showTooltip(geography, event);
						}}
						onMouseLeave={(geography) => (event) => {
					this.hideTooltip();
						}}
						className="filled-map"
					/>
					<Mercator
						data={mesh}
						scale={210000}
						center={center}
						translate={[ width / 2, height / 2]}
						stroke={'#222'}
						strokeWidth={2}
						fill={'transparent'}
						className="empty-map"
					/>
					<Mercator
						data={merge}
						scale={210000}
						center={center}
						translate={[ width / 2, height / 2]}
						stroke={'#222'}
						strokeWidth={2}
						fill={'transparent'}
						className="empty-map"
					/>
					</ScaleSVG>

					<div className="legend-container"
					style={{
						position: this.props.collapse ? 'relative' : 'absolute',
						bottom: '3em'
					}}>
					<LegendThreshold
						scale={this.props.color}
						direction="column"
						itemDirection="row"
						labelMargin="2px 0 0 10px"
						shapeMargin="1px 0 0"
						labelFormat={this.percentFormat}
					/>
					</div>

					<Tooltip
					active={this.state.hovering}
					position="top"
					arrow="center"
					parent={`#${this.state.hoverOver}`}
					style={tipStyle}
					tooltipTimeout={300}
					>
					<div className="tooltip-content">{this.state.tipString}</div>
				</Tooltip> */}
			</div>
		);
	}
}
