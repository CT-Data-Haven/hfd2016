import React from 'react';
import { nest } from 'd3-collection';
import { format } from 'd3-format';
import * as _ from 'underscore';

import SortAsc from 'react-icons/lib/fa/sort-asc';
import SortDesc from 'react-icons/lib/fa/sort-desc';
import Sort from 'react-icons/lib/fa/sort';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../styles/CityTable.css';


const percent = format('.0%');
const comma = format(',');

const formatNumber = (s) => (s > 0 && s < 1) ? percent(s) : comma(s);

export default class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sorted: []
		};
		this.getSorted = this.getSorted.bind(this);
		this.handleClick = props.handleClick.bind(this);
	}

	getSorted = (id) => {
		let sortInfo = this.state.sorted.filter((item) => item.id === id);
		if (sortInfo.length) {
			if (sortInfo[0].desc === true) return <SortDesc />;
			if (sortInfo[0].desc === false) return <SortAsc />;
		}
		return <Sort />;
	};

	hiliteHood = (state, rowInfo, column) => {
		let hood = rowInfo ? rowInfo.row.Neighborhood : null;
		let style = {};
		if (hood === this.props.hood) {
			style = {
				background: '#e7e1ef'
			};
		}
		return {
			onClick: (e) => this.handleClick(rowInfo),
			style: style
		};

	};

	render() {
		let data = this.props.data

		data.forEach((d) => {
			d.long = d.Town.length ? d.neighborhood + ',' + d.Town : d.neighborhood;
		});

		let nested = nest()
			.key((d) => d.long)
			// .key((d) => d.Town)
			.rollup((d) => {
				return d.reduce((prev, curr) => {
					prev.long = curr.long;
					prev[curr.indicator] = curr.value;
					return prev;
				}, {});
			})
			.entries(data);

		let table = _.chain(nested)
			.pluck('value')
			.each((d) => {
				let split = d.long.split(',');
				d.Neighborhood = split[0];
				d.Town = split[1];
			})
			.value();
		let columns = _.chain(table[0])
			.keys()
			.without('long', 'Neighborhood', 'Town')
			.map((d, i) => (
				{
					Header: props => (
						<span>{d} {this.getSorted(props.column.id)}</span>
					),
					// Header: d,
					headerStyle: { boxShadow: 'none' },
					accessor: d,
					Cell: row => (
						<span>{formatNumber(row.value)}</span>
					),
					resizable: false,
					className: 'right-cell'
				}
			))
			.value();
		columns.unshift({
			Header: props => (
				<span>Neighborhood {this.getSorted(props.column.id)}</span>
			),
			headerStyle: { boxShadow: 'none' },
			accessor: 'Neighborhood',
			resizable: false
		}, {
			Header: props => (
				<span>Town {this.getSorted(props.column.id)}</span>
			),
			headerStyle: { boxShadow: 'none' },
			accessor: 'Town',
			resizable: false
		});

		let rows = table.length || 29;

		return (
			<div className="CityTable">
				<ReactTable
					data={table}
					columns={columns}
					className="-highlight table-responsive"
					defaultPageSize={rows}
					// pageSizeOptions={[5, 10, rows]}
					showPageSizeOptions={false}
					showPagination={false}
					style={{
						height: '400px'
					}}
					getTrProps={this.hiliteHood}
					// sorted={sorted}
					onSortedChange={(sorted) => this.setState({sorted})}
				/>
			</div>
		);
	}
}
