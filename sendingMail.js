const getData = require('electron').ipcRenderer;
const nodeMail = require('nodemailer')
let data = {}


// p5 sketch
function p5Sketch(p) {
	let entryBox = {
		down: null,
		up: null
	}
	let falling = {
		image: null,
		period: data.interval.value,
		y: null
	}
	let startTime = 0
	let reciever = data.reciever.value
	let messageNode = document.querySelector('#msg')

	p.preload = function preload() {
		falling.image = p.loadImage('./assets/poopEnvelope.jpg')
		entryBox.down = p.loadImage('./assets/downerPart.png')
		entryBox.up = p.loadImage('./assets/upperPart.png')
	}

	p.setup = function setup() {
		p.createCanvas(data.browser.width, data.browser.height)
		p.imageMode(p.CENTER)
		startTime = p.millis()
	}

	p.draw = function draw() {
		p.clear()

		// box and envelope
		falling.y = (((p.millis() - startTime) / 1000) % falling.period) * (p.height / falling.period) - (falling.image.height / (8 / 3))
		p.image(entryBox.up, p.width / 2, p.height - entryBox.up.height / 2)
		p.image(falling.image, p.width / 2, falling.y, 162, 124)
		p.image(entryBox.down, p.width / 2, p.height - entryBox.down.height / 2)

		// text on box
		p.stroke(0)
		let max = 288
		let sum = 0
		let mult = 0
		for (mult = 0; sum < max && mult < 300; mult++) {
			sum = 0
			sum = reciever.length * mult
		}
		p.textSize(--mult)
		p.translate(p.width / 3, p.height * .93)
		p.rotate(0.17)
		p.text(reciever, 0, 0)

		// # of messages sent
		messageNode.innerHTML = `Sent ${data.mailsSent} emails`
	}
}

// call once data recieved
getData.on('data', (event, items) => {
	// get data from previous window
	data = JSON.parse(items)
	data.mailsSent = 0
	data.mailText = []

	// create a new p5 sketch instance
	let sketch = new p5(p5Sketch, 'myCanvas')

	// if file was chosen, send lines instead of text from textarea
	if(data.filePath.value) {

		let lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(data.filePath.value)
		});
	
		lineReader.on('line', function (line) {
			data.mailText.push(line)
		});
	} else {
		data.mailText.push(data.content.value)
	}

	// interval for sending mails
	setInterval(() => {
		let transporter = nodeMail.createTransport({
			service: 'gmail',
			auth: {
				user: data.sender.value,
				pass: data.password.value
			}
		});

		let mailOptions = {
			from: data.sender.value,
			to: data.reciever.value,
			subject: data.subject.value,
			text: data.mailText[data.mailsSent % data.mailText.length]
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				if (error.message.includes('Missing credentials')) {
					alert(`FAIL: empty fields found`)
				} else if (error.message.includes('Invalid login')) {
					alert(`FAIL: wrong sender login data`)
				} else if (error.message.includes('No recipients defined')) {
					alert(`FAIL: no such reciever found`)
				} else {
					alert(`FAIL: unidentified error, sorry`)
				}
			} else {
				data.mailsSent++
			}
		});
	}, data.interval.value * 1000)

});
