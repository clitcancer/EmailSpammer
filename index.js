// node requires
require('./libs/prototypes')

// properties
let data = {
	sender: {
		path: '#emailSender',
		value: ''
	},
	password: {
		path: '#passwordSender',
		value: ''
	},
	reciever: {
		path: '#emailTarget',
		value: ''
	},
	content: {
		path: '#contentTarget',
		value: ''
	},
	subject: {
		path: '#subjectTarget',
		value: ''
	},
	interval: {
		path: '#interval',
		value: ''
	},
	filePath: {
		path: '#filePath',
		value: ''
	}
}


window.addEventListener('load', (e) => {
	// set defaults and do fake binding values with object
	for (let prop in data) {
		let curr = document.querySelector(data[prop].path)

		// file dialog
		if(curr instanceof HTMLAnchorElement ) {
			const {dialog} = require('electron').remote;
			
			curr.addEventListener('click', function (evt) {
				dialog.showOpenDialog((fileNames) => {
					if(fileNames === undefined){
						window.alert('No file selected.')
						return
					} else if (fileNames.length > 1) {
						window.alert('More than one file selected.')
						return
					} else if (fileNames[0].substring(fileNames[0].length - 3) != 'txt') {
						window.alert('Not a txt file.')
						return
					}
					data[prop].value = fileNames[0]
					this.innerHTML = fileNames[0]
				});
			});
			continue
		}

		data[prop].value = curr.value
		curr.addEventListener('input', function (evt) {
			data[prop].value = this.value
		});
	}

	// start sending mails
	document.querySelector('#send').addEventListener('click', (e) => {

		if (window.confirm(`You're about to send an email to ${data.reciever.value} every ${Number(data.interval.value).toDate()}. Is that ok?`)) {

			// opening new window with sending mail
			const remote = require('electron').remote;
			const url = require('url')
			const path = require('path')
			const BrowserWindow = remote.BrowserWindow;

			data.browser = {}
			data.browser.width = 600
			data.browser.height = 600
			var win = new BrowserWindow({
				height: data.browser.height * 1.5,
				width: data.browser.width * 1.2
			});
			win.loadURL(url.format({
				pathname: path.join(__dirname, './sendingMail.html'),
				protocol: 'file:',
				slashes: true
			}));
			
			win.webContents.on('did-finish-load', () => {
				win.show();
				win.focus();
				win.webContents.send('data', JSON.stringify(data))
			});

		} else {
			alert('aborted')
		}


	})


})
