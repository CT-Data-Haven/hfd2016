import { csv } from 'd3-request';
import { queue } from 'd3-queue';
import { format } from 'd3-format';
import { nest } from 'd3-collection';
import * as _ from 'underscore';

const url = './data/hfddata.csv';

export const loadData = (callback = _.noop) => {
	queue()
		.defer(csv, url)
		.await((error, datacsv) => {
			if (error) throw error;

			// let data = cleanData(datacsv);
			let data = _.sortBy(cleanData(datacsv), 'topicOrder', 'order', 'geoType', 'Town', 'neighborhood');
			let indics = makeIndicators(data);

			callback({
				data: data,
				indics: indics
			});
		});
};

const cleanData = (data) => {
	data.forEach((d) => {
		d.value = +d.value;
		let dataFormat = format(d.format);
		d.displayVal = dataFormat(d.value);
	});

	return nest()
		.key((d) => d.topic)
		.entries(data);
};

const makeIndicators = (data) => {
	let indics = _.map(data, (d) => {
		let display = d.values[0].displayTopic;
		let vals = _.chain(d.values)
			.filter((d) => d.type === 'map')
			.pluck('indicator')
			.uniq()
			.value();
		return { topic: d.key, displayTopic: display, indicators: vals };
	});
	return indics;
};
