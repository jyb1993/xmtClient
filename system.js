const {shell} = require('electron');
const path = require('path')
const notifier = require('node-notifier');
const imgDirectory = path.join(__dirname, 'img')
let system = {
	msg : () => {
		notifier.notify({
		  title: '常明明',
		  message: 'Hello, there!',
		  icon: path.join(imgDirectory, 'icon.png'),
		  'contentImage': void 0,
		  sound: true,
		  wait: true,
		},()=> {
		});
		notifier.on('click', function (notifierObject, options) {
		  shell.openExternal("https://www.baidu.com")
		});
	}
}

module.exports = system