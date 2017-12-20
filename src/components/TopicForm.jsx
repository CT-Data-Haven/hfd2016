import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class TopicForm extends React.Component {
	constructor(props) {
		super(props);

		// bind event handlers
		this.handleTopic = props.handleTopic.bind(this);
		this.handleIndicator = props.handleIndicator.bind(this);
	}

	render() {
		let topics = this.props.indics.map((d) => {
			return (<option value={d.topic} key={d.topic}>{d.displayTopic}</option>);
		});
		let indicators = this.props.indicators.map((d, i) => {
			return (<option value={d} key={i}>{d}</option>);
		});

		return (
			<div className="TopicForm">
				<Form>
					<FormGroup controlId="topicSelect">
						<ControlLabel>Select topic</ControlLabel>
						<FormControl componentClass="select" onChange={this.handleTopic}>{topics}</FormControl>
					</FormGroup>
					<FormGroup controlId="indicatorSelect">
						<ControlLabel>Select indicator</ControlLabel>
						<FormControl componentClass="select" onChange={this.handleIndicator}>{indicators}</FormControl>
					</FormGroup>
				</Form>
			</div>
		);
	}
}
