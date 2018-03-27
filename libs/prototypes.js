// converts seconds into a string representing time in days, hours etc
if (!Number.prototype.toDate) {
	Number.prototype.toDate = function () {
		let val = this
		let result = ''
		let timeUnits = {
			week: { amount: 0, secsIn: 604800, name: 'week' },
			day: { amount: 0, secsIn: 86400, name: 'day' },
			hour: { amount: 0, secsIn: 3600, name: 'hour' },
			minute: { amount: 0, secsIn: 60, name: 'minute' },
			second: { amount: 0, secsIn: 1, name: 'second' }
		}

		for (const prop in timeUnits) {
			if (timeUnits.hasOwnProperty(prop)) {
				timeUnits[prop].amount = Math.floor(val / timeUnits[prop].secsIn)
				val -= timeUnits[prop].amount * timeUnits[prop].secsIn

				timeUnits[prop].name += (timeUnits[prop].amount > 1 ? 's' : '')
				result += (timeUnits[prop].amount != 0 ? `${timeUnits[prop].amount} ${timeUnits[prop].name} ` : '')
			}
		}

		return result
	}
} else {console.error(`Couldnt create method 'toDate', probably exists already.`)}