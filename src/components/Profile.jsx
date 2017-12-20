import React from 'react';
import * as _ from 'underscore';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

import '../styles/Profile.css';

export default class Profile extends React.Component {
	render() {
		let items = _.chain(this.props.table)
			.where({ neighborhood: this.props.hood })
			.map((d, i) => (
				<ListGroupItem key={i} className={`${d.type}-list`}>
					<div className="list-text">
						<span className="strong">{ d.indicator }:</span> { d.displayVal }
					</div>
				</ListGroupItem>
			))
			.value();

		let display = _.where(this.props.indics, { topic: this.props.topic })[0];
		let topicHead = display ? ` - ${display.displayTopic}` : '';
		let header = <h3>{this.props.hood} {topicHead}</h3>;

		return (
			<div className="Profile">
				<Panel header={header}>
					<ListGroup fill>
						{items}
					</ListGroup>
				</Panel>
			</div>
		);
	}
}
