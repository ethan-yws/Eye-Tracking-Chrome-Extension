// document.addEventListener('DOMContentLoaded',function() {
// 	start();
// });

// // Toggole ON: run the camera capture over webpage layer
// function start() {
//     var toggleOn = document.getElementById('toggleOn');
//     chrome.storage.sync.get('state', function(result) {
// 		console.log('Value currently is ' + result.state);
// 		toggleOn.checked = (result.state === 'on'?true:false);
//     });
//     toggleOn.onchange = function () {
// 		if(this.checked) {
// 			chrome.storage.sync.set({state: 'on'}, function() {
// 	 		 	chrome.extension.getBackgroundPage().console.log('Turned on');
// 			})
// 			window.open('index.html', '_blank');
// 			toggleState(true);
// 		} else {
// 			console.log('Turned off');
// 			chrome.storage.sync.set({state: 'off'}, function() {
// 	 		 	chrome.extension.getBackgroundPage().console.log('Turned off');
// 			})
// 			toggleState(false);
// 		}
// 	};

// }

document.addEventListener('DOMContentLoaded',function() {
	initOn();
});


function initOn() {
  	var toggleOn = document.getElementById('toggleOn');
	chrome.storage.sync.get('state', function(result) {
		console.log('Value currently is ' + result.state);
		toggleOn.checked = (result.state === 'on'?true:false);
	});
	toggleOn.onchange = function () {
		if(this.checked) {
			chrome.storage.sync.set({state: 'on'}, function() {
	 		 	chrome.extension.getBackgroundPage().console.log('Turned on');
			})
			toggleState(true);
		} else {
			console.log('Turned off');
			chrome.storage.sync.set({state: 'off'}, function() {
	 		 	chrome.extension.getBackgroundPage().console.log('Turned off');
			})
			toggleState(false);
		}
	};
}

function toggleState(truth) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {state: truth, toggleCamera: truth}, function(response) {
	      console.log(response);
    	});
	});
}