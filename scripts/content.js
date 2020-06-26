import * as tf from '@tensorflow/tfjs';
import '@babel/polyfill';


//track mouse movement
document.onmousemove = function(e){
    var x = e.pageX;
    var y = e.pageY;
};
//track mouse clicks
document.onclick = function(e){
    var x = e.pageX;
    var y = e.pageY;
    //console.log(" " + x +" " + y);
};


//Add HTML elements for gaze tracking to the webpage the user is browsing
function setUp_HTML_Elements(){

	document.documentElement.style.height = '100%';
	document.body.style.height = '100%';
	document.documentElement.style.width = '100%';
	document.body.style.width = '100%';

	var style_sheet = document.createElement('link');
	style_sheet.rel="stylesheet";
	style_sheet.href="style.css";
	document.head.appendChild(style_sheet);

	var pointer_HTML = document.createElement( 'div' );
	pointer_HTML.id = "pointer";
	pointer_HTML.style = "background-color: rgba(236, 18, 18, 0.89); position: fixed; border-radius: 50%; height: 15px; width: 15px; transition: all 0.1s ease; box-shadow: 0 0 20px 10px white; border: 2px solid rgba(0,0,0,0.5);";
	
	var video_HTML = document.createElement( 'video' );
	video_HTML.id = "video";
	video_HTML.width = "320";
	video_HTML.height = "240";
	video_HTML.style = "position: fixed; left: 0px; top: 0px; -webkit-transform: scaleX(-1); transform: scaleX(-1);"
	video_HTML.autoplay = true;

	var overlay_HTML = document.createElement( 'canvas' );
	overlay_HTML.id = "overlay";
	overlay_HTML.width = "320";
	overlay_HTML.height = "240";
	overlay_HTML.style = "position: fixed; left: 0px; top: 0px; -webkit-transform: scaleX(-1); transform: scaleX(-1);"

	var eyes_HTML = document.createElement( 'canvas' );
	eyes_HTML.id = "eyes";
	eyes_HTML.width = "40";
	eyes_HTML.height = "20";
	eyes_HTML.style = "display:hidden";

	var grey_eyes_HTML = document.createElement( 'canvas' );
	grey_eyes_HTML.id = "geyes";
	grey_eyes_HTML.width = "40";
	grey_eyes_HTML.height = "20";
	grey_eyes_HTML.style = "display:hidden";
	
	var heatmap_HTML = document.createElement( 'canvas' );
	heatmap_HTML.id = "heatmap";

////////////////////////////////////////////////////////////////
//////// COMMENT THIS OUT AFTER POPUP MENU IS FUCNTIONAL////////
////////////////////////////////////////////////////////////////

	Calibration_Menu_Setup();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

	//Add all the created HTML elements to the webpage
	document.body.appendChild(video_HTML);
	document.body.appendChild(overlay_HTML);
	document.body.appendChild(eyes_HTML);
	document.body.appendChild(grey_eyes_HTML);
	document.body.appendChild(pointer_HTML);
	document.body.appendChild(heatmap_HTML);	
}

//Set up the HTML elements for the calibration menu
function Calibration_Menu_Setup(){
	var layer = document.createElement( 'div' );
	layer.id = "layer";


	var menu_table = document.createElement( 'table' );
	var tr1 = document.createElement( 'tr' );
	var td1a = document.createElement( 'td' );
	var td1b = document.createElement( 'td' );
	var tr2 = document.createElement( 'tr' );
	var td2a = document.createElement( 'td' );
	var td2b = document.createElement( 'td' );
	

	td1a.innerHTML = "Training examples";
	td1b.id = "num_train"; 
	td1b.dataset.content = "n-train"; 
	td1b.innerHTML = "0";
	td2a.innerHTML = "Validation examples";
	td2b.id = "num_val"; 
	td2b.dataset.content = "n-val"; 
	td2b.innerHTML = "0";

	tr1.appendChild(td1a);
	tr1.appendChild(td1b);
	tr2.appendChild(td2a);
	tr2.appendChild(td2b);
	menu_table.appendChild(tr1);
	menu_table.appendChild(tr2);
	

	var layer_2 = document.createElement( 'div' );
	
	var button1 = document.createElement( 'button' );
	button1.id = "train_btn";
	button1.className = "button disabled";
	button1.style.display = "block";
	button1.innerHTML = "Start Training";
	button1.disabled = true;

	var button2 = document.createElement( 'button' );
	button2.id = "reset-model";
	button2.className = "button disabled";
	button2.style.display = "block";
	button2.innerHTML = "Reset Model";
	button2.disabled = true;

	var button3 = document.createElement( 'button' );
	button3.id = "toggle-heatmap";
	button3.className = "button disabled";
	button3.style.display = "block";
	button3.innerHTML = "Toggle Heatmap";
	button3.disabled = true;

	layer_2.appendChild(button1);
	layer_2.appendChild(button2);
	layer_2.appendChild(button3);

	var layer_3 = document.createElement( 'div' );
	var instructions = document.createElement('p');
	instructions.innerHTML = "Instructions: Move you cursor around the screen and follow it with your eyes. Capture a sample by focusing your eyes on the cursor and press the Right Alt Key. Get at least 20 samples before training the Neural Network";
	layer_3.appendChild(instructions);

	layer.appendChild(menu_table);
	layer.appendChild(layer_2);
	layer.appendChild(layer_3);

	
	layer.style.position = "fixed";
	layer.style.right = "0px";
	layer.style.top = "100px";


	document.body.appendChild(layer);

	// Return layer for unit testing
	return layer;
}

////////////////////////////////////////////////////////////
// TODO:
// Calibration canvas dots
///////////////////////////////////////////////////////////
function dots() {
	// Instrucations
	var guide = document.createElement("p");
	guide.innerHTML = "Calibration Guide:<br />Please click on each calibration dot with your eyes looking at it until it disappears."
	guide.style.position = "fixed";
	guide.style.top = "13px";
	guide.style.left = "330px";

	// create a div section for calibration layer
	var layer = document.createElement( 'div' );
	layer.id= "dots";
	layer.appendChild(guide);

	// Dot 1
	var dot1 = document.createElement("button");
	dot1.id = "Pt1";
	dot1.className = "Calibration";
	dot1.style.cssText = "top: 70px; left: 330px; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c1 = 0
	dot1.onclick = function onClick() {
		c1 += 1;
		data.getSample();
		if (c1 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 2
	var dot2 = document.createElement("button");
	dot2.id = "Pt2";
	dot2.className = "Calibration";
	dot2.style.cssText = "top: 70px; left: 50vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c2 = 0
	dot2.onclick = function onClick2() {
		c2 += 1;
		data.getSample();
		if (c2 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 3
	var dot3 = document.createElement("button");
	dot3.id = "Pt3";
	dot3.className = "Calibration";
	dot3.style.cssText = "top: 70px; right: 2vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c3 = 0
	dot3.onclick = function onClick3() {
		c3 += 1;
		data.getSample();
		if (c3 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 4
	var dot4 = document.createElement("button");
	dot4.id = "Pt4";
	dot4.className = "Calibration";
	dot4.style.cssText = "top: 50vh; left: 2vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c4 = 0
	dot4.onclick = function onClick4() {
		c4 += 1;
		data.getSample();
		if (c4 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 5
	var dot5 = document.createElement("button");
	dot5.id = "Pt5";
	dot5.className = "Calibration";
	dot5.style.cssText = "top: 50vh; left: 50vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c5 = 0
	dot5.onclick = function onClick5() {
		c5 += 1;
		data.getSample();
		if (c5 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 6
	var dot6 = document.createElement("button");
	dot6.id = "Pt6";
	dot6.className = "Calibration";
	dot6.style.cssText = "top: 50vh; right: 2vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c6 = 0;
	dot6.onclick = function onClick6() {
		c6 += 1;
		data.getSample();
		if (c6 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 7
	var dot7 = document.createElement("button");
	dot7.id = "Pt7";
	dot7.className = "Calibration";
	dot7.style.cssText = "bottom:2vw; left: 2vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c7 = 0;
	dot7.onclick = function onClick7() {
		c7 += 1;
		data.getSample();
		if (c7 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 8
	var dot8 = document.createElement("button");
	dot8.id = "Pt8";
	dot8.className = "Calibration";
	dot8.style.cssText = "bottom:2vw; left: 50vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c8 = 0;
	dot8.onclick = function onClick8() {
		c8 += 1;
		data.getSample();
		if (c8 == 5) {
			layer.removeChild(this);
		}
	};

	// Dot 9
	var dot9 = document.createElement("button");
	dot9.id = "Pt9";
	dot9.className = "Calibration";
	dot9.style.cssText = "bottom:2vw;right:2vw; width: 20px;height: 20px;-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;background-color: red;opacity: 0.2;border-color: black;border-style: solid;position:fixed;";
	var c9 = 0;
	dot9.onclick = function onClick9() {
		c9 += 1;
		data.getSample();
		if (c9 == 5) {
			layer.removeChild(this);
			document.body.removeChild(layer);
		}
	};

	// Add all dots to calibration layer
	layer.appendChild(dot1);
	layer.appendChild(dot2);
	layer.appendChild(dot3);
	layer.appendChild(dot4);
	layer.appendChild(dot5);
	layer.appendChild(dot6);
	layer.appendChild(dot7);
	layer.appendChild(dot8);
	layer.appendChild(dot9);
	
	// adjust the order
	//var power = document.getElementById("video")
	//document.body.appendChipwdld(dots_style);
	document.body.appendChild(layer);

	return 9;
}

//TODO:
/*----------------------------------------- Webpower Toggle ---------------------------------------*/
function Power() {
	var powerLayer = document.createElement("div");
	powerLayer.id = "power";

	var power = document.createElement("button");
	power.id = "powerToggle";
	power.className = "powerToggle";
	power.innerHTML = "ON/OFF";
	power.style.position = "fixed";
	power.style.left = "0px";
	power.style.top = "240px";

	var auxCounter = 0;
	power.onclick = function powerOff(){
		auxCounter += 1;
		if (auxCounter % 2 != 0) {
			var video = document.getElementById("video");
			var overlay = document.getElementById("overlay");
			var eyes = document.getElementById("eyes");
			var geyes = document.getElementById("geyes");
			var pointer = document.getElementById("pointer");
			var heatmap = document.getElementById("heatmap");
			var menu = document.getElementById("layer");
			var dots = document.getElementById("dots");

			document.body.removeChild(video);
			document.body.removeChild(overlay);
			document.body.removeChild(eyes);
			document.body.removeChild(geyes);
			document.body.removeChild(pointer);
			document.body.removeChild(heatmap);
			document.body.removeChild(menu);
			document.body.removeChild(dots);
		}
		else {
			setUp_HTML_Elements();
		}
	};

	powerLayer.appendChild(power);

	document.body.appendChild(powerLayer);
}


setUp_HTML_Elements();
dots();
Power();

////////////////////////////////////////////////////////////////
////////              GAZE TRACKING CODE                ////////
////////////////////////////////////////////////////////////////

$(document).ready(function() {

///////////////////////////////////////////////////////////////////////
/// MOUSE.JS  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

	window.cursor = {
		X: 0.5,
		Y: 0.5,
		//gets the cursor's xy coordinates
		getCursorPos: function() {
			console.log("Cursor Pos: (" + cursor.X + ", " + cursor.Y + ")");
			return [cursor.X, cursor.Y];
		},

		//updates the cursor's XY coordinates every time the mouse is moved
		updateCursorPos: function(event) {
			cursor.X = event.clientX / $('body').width();
			cursor.Y = event.clientY / $('body').height();
		},
	};
	
	//every time the mouse is moved, update the cursor object's X and Y variables
	document.onmousemove = cursor.updateCursorPos;

///////////////////////////////////////////////////////////////////////
/// POINTER.JS  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

	const $pointer = $('#pointer');
	const pointer_size = $pointer.outerWidth();

	//global pointer object
	window.pointer = {
		pointer : $pointer,
		pointer_size : pointer_size,
		
		movePointer: function(){

			//make a prediction using the Convolutional neural network
			//exteracts an image of the user's eyes from the current webpower frame
			//and uses the classifier to predict where the user is gazing
			
			if (model.current_model == null){	
				return;
			} 
			if (model.isTraining == true){
				console.log("model in training");
				return;
			}

			const prediction = model.predict();
			

			console.log($('body').width());
			console.log($('body').height());
			console.log(pointer_size);

			//extract the x and y coordinates of the prediciton
			const x = prediction[0] * ($('body').width() - pointer_size);
			const y = prediction[1] * ($('body').height() - pointer_size);

			console.log("Prediction: (" + x + ", " + y + ")");

			//render the pointer with the correct position in the webpage.
			$pointer.css('left', x + 'px');
			$pointer.css('top', y + 'px');
		},
	};

///////////////////////////////////////////////////////////////////////
/// TRACKER.JS  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

	const video = document.getElementById('video');
	const overlay = document.getElementById('overlay');

	//Video capture functions adapted from cpury @ https://github.com/cpury/lookie-lookie
	window.tracker = {
		video: video,
		//video dimensions
		vid_width: video.width,
		vid_height: video.height,
		vid_vidWidth: video.videoWidth,
		vid_vidHeight: video.videoHeight,
		
		//HTML overlay element for displaying graphics
		overlay: overlay,
		overlay_ctx: overlay.getContext('2d'),
		
		trackingStarted: false,
		
		//stores 64 facial features as coordinates, having been extracted by clmtrackr.js
		face_positions: null,
		//the current image of the user's eyes for a particular frame
		//to be used as an input into the Convolutional Neural network
		eye_canvas: null,


		//set up the video stream
		setUpStream: function(stream) {
		if ('srcObject' in tracker.video) {
			tracker.video.srcObject = stream;
		} else {
			tracker.video.src =
			window.URL && window.URL.createObjectURL(stream);
		}
		tracker.video.onloadedmetadata = function() {
			tracker.video.play();
		};
		tracker.video.onresize = function() {
			if (tracker.trackingStarted) {
			tracker.clm_facetracker.stop();
			tracker.clm_facetracker.reset();
			tracker.clm_facetracker.start(tracker.video);
			}
		};
		},

		//start the webpower stream and display it on the webpage
		startVideo: function() {
		// start webpower stream to page
		tracker.video.play();
		// use clm to track face in video element
		tracker.clm_facetracker.start(tracker.video);
		tracker.trackingStarted = true;
		// use clmtrackr to extract the user's facial features
		tracker.getFacialFeatures();
		},

		getFacialFeatures: function() {
		// Check if a face is detected, and if so, track it.
		requestAnimationFrame(tracker.getFacialFeatures);

		//get the facial feature positions.
		tracker.face_positions = tracker.clm_facetracker.getCurrentPosition();
		
		//clear the overlay canvas so that new graphics can be drawn on the page.
		tracker.overlay_ctx.clearRect(
			0,
			0,
			tracker.vid_width,
			tracker.vid_height,
		);

		//if the clm_facetracker has returned a list of facial feature positions...
		if (tracker.face_positions) {

			
			//extract the eye region of the user from the webpower stream frame
			tracker.trackFace(tracker.face_positions);
			
			////draw over the relevant facial features in the webpage, so that the user can see if their 
			//face is being accurately detected
			tracker.clm_facetracker.draw(tracker.overlay);
		}
		},

		
		//adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
		// get a rectangle surrounding the eyes from clmtrackr vertices
		getEyes: function(position) {
		// Given a tracked face, returns a rectangle surrounding the eyes.
		const minX = position[19][0] + 3;
		const maxX = position[15][0] - 3;
		const minY =
			Math.min(
			position[20][1],
			position[21][1],
			position[17][1],
			position[16][1],
			) + 6;
		const maxY =
			Math.max(
			position[23][1],
			position[26][1],
			position[31][1],
			position[28][1],
			) + 3;

		const width = maxX - minX;
		const height = maxY - minY - 5;

		return [minX, minY, width, height * 1.25];
		},

		//adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
		// draw a rectangle surrounding the user's eyes in an HTML canvas.
		//this will be turned into a tensor and used as inputs into a neural network
		trackFace: function(positions) {
		// Given a tracked face, crops out the eyes and draws them in the eyes canvas.
		const rect = tracker.getEyes(positions);
		tracker.eye_canvas = rect;

		const eyesCanvas = document.getElementById('eyes');
		const eyesCtx = eyesCanvas.getContext('2d');

		// resize the eye canvas to the correct size for input into the neural network
		const resizeFactorX = video.videoWidth / video.width;
		const resizeFactorY =video.videoHeight / video.height; 
		
		//draw the eyes onto the webpage, so that the user can tell that their eyes are being accurately tracked
		eyesCtx.drawImage(
			tracker.video,
			rect[0] * resizeFactorX,
			rect[1] * resizeFactorY,
			rect[2] * resizeFactorX,
			rect[3] * resizeFactorY,
			0,
			0,
			eyesCanvas.width,
			eyesCanvas.height,
		);
		},
	};

	//Alert that the video is ready to start playing
	//callback -> start the video
	video.addEventListener('canplay', tracker.startVideo, false);

	// adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
	// set up video
	if (navigator.mediaDevices) {
		navigator.mediaDevices
		.getUserMedia({
			video: true,
		})
		.then(tracker.setUpStream);
	} else if (navigator.getUserMedia) {
		navigator.getUserMedia(
		{
			video: true,
		},
		tracker.setUpStream,
		);
	} 

///////////////////////////////////////////////////////////////////////
/// MAIN.JS  //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

	//set up a clmtrackr face tracker for tracking the user's face and extracting 
	//the coordinates of 64 major facial features
	tracker.clm_facetracker = new clm.tracker();
	tracker.clm_facetracker.init();



	////////////////////////////////////////////////////////
	// Process a prediction every 50ms                    //
	////////////////////////////////////////////////////////

	setInterval(pointer.movePointer, 50);

	////////////////////////////////////////////////////////
	// Process a prediction every 50ms                    //
	////////////////////////////////////////////////////////




	//when spacebar is pressed, collect a new sample image of the user's eyes
	$('body').keyup(function(e) {
		if (e.keyCode === 18) {
		
		//get a sample image of the user's eyes, and add it to the dataset as a tensor
			data.getSample();
			e.preventDefault();
			return false;
		}
	});


	//toggle the training button and  train the convolutuional neural network
	function onTrainStart(){
		var tbtn = document.getElementById("train_btn");
		if (tbtn != null){
			tbtn.innerHTML = "In Training...";
			tbtn.className = "button disabled";
			tbtn.disabled = true;
		}
		
		//train the convolutional neural network
		model.trainModel();

	}

	//when the training button is clicked, start training.
	$('#train_btn').click(function(e) {
		onTrainStart();
	});
});


///////////////////////////////////////////////////////////////////////
/// DATA.JS  //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//global data object, which stores training and validation datasets
//also features functions for capturing samples and adding them to the datasets
window.data = {
	
	//width and height of training samples
	sampleWidth: $('#eyes').width(),
	sampleHeight: $('#eyes').height(),

	//training and validation data for training a Convolutional Neural Network
	//'a' stores a tensor representing an image of the user's eyes
	//'b' stores a 1D tensor representing the XY coordinates of a cursor.
	//n is the size of each dataset
	training_data: {
		n: 0,
		a: null,
		b: null,
	},
	validation_data: {
		n: 0,
		a: null,
		b: null,
	},
	
	//https://cpury.github.io/learning-where-you-are-looking-at/
	//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
	getTensor: function(){
		return tf.tidy(function() {

			//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
			const image = tf.browser.fromPixels(document.getElementById('eyes'));
			//Adds a batch dimension to the tensor
			const batched_img = image.expandDims(0);
			//converts the batched tensor into appropriate form for input into a Conv. Neural Network
			return batched_img
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
	},

	//collects a training sample by cropping a rectangular image of the user's eyes out of a webpower frame
	getSample: function(){
		tf.tidy(function() {
			//extract an image of the user's eyes and store it as a TF tensor.
			const img_tensor = data.getTensor();
			//get the cursor position on the window
			const mouseXY = cursor.getCursorPos();
			mouseXY[0] = mouseXY[0] -0.5;
			mouseXY[1] = mouseXY[1] -0.5;

			//store the mouse position as a 1D tensor
			var mouse_tensor = tf.tidy(function() {
				return tf.tensor1d(mouseXY).expandDims(0);
			});

			//add sample tensors to a dataset.
			data.addSample(img_tensor, mouse_tensor);

		});
	},
	
	//Add Samples to either a training or validation data set in the global "data" object
	addSample: function(img_tensor, mouse_tensor){
		//choose whether to add to training dataset or validation dataset.
		//80% of the sample will be training data, 20% validation data
		var key = Math.random() > 0.2 ? 'training_data' : 'validation_data';
		const set = data[key];
		
		//if the datasets are empty, add the tensors to the empty set
		if (set.a == null){
			set.a = tf.keep(img_tensor);
			set.b = tf.keep(mouse_tensor);
		
		//if the sets aren't empty, concatenate the new tensor with 
		//the previously stored tensor
		} else {
			const old_img_tensor = set.a;
			set.a = tf.keep(old_img_tensor.concat(img_tensor, 0));

			const old_mouse_tensor = set.b;
			set.b = tf.keep(old_mouse_tensor.concat(mouse_tensor, 0));

			old_img_tensor.dispose();
			old_mouse_tensor.dispose();
			mouse_tensor.dispose();
		}
		//increment the size of the set.
		set.n += 1;

		//update the UI
		data.onAddSample(data.training_data.n + data.validation_data.n, key);
	},
	
	//Update the UI with size of training and val datasets
	onAddSample: function(n, key){
		if (data.validation_data.n > 1){
			var tbtn = document.getElementById("train_btn");
			
			if (tbtn != null){
				tbtn.className = "button";
				tbtn.disabled = false;
			}
		}
		var sample_num = null;
		if (key =='training_data'){
			sample_num = document.getElementById("num_train");
			if (sample_num != null){
				sample_num.innerHTML = data.training_data.n;
			}
			
		} else {
			sample_num = document.getElementById("num_val");
			if (sample_num != null){
				sample_num.innerHTML = data.validation_data.n;
			}
		}	
	},
};


//global variable, which stores a Convolutional Neural Network
// The CNN has 2 hidden convolutional layers, 2 max pooling layers, and a dropout layer
//features functions to train the Neural Network
//and a function to make a prediction when a sample is inputted into the NN

window.model ={
	current_model: null,
	isTraining: false,

	//inspired by
	//https://rubikscode.net/2019/03/25/image-classification-with-tensorflow-js/
	//https://github.com/cpury/lookie-lookie
	//COnvolutional Neural Network with 2 hidden layers and 2 max pooling layers


	createCNNModel: function() {
		
		//define the input format
		const input_img_tensor = tf.input({
			name: 'image',
			shape: [data.sampleHeight, data.sampleWidth, 3],
		});


		//first hidden layer
		const convolutional_layer_1 = tf.layers
		.conv2d({
			kernelSize: 5,
			filters: 20,
			strides: 1,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
		})
		.apply(input_img_tensor);

		//first max pooling layer
		const max_pool_layer_1 = tf.layers
		.maxPooling2d({
			poolSize: [2, 2],
			strides: [2, 2],
		})
		.apply(convolutional_layer_1);

		//second convolutional layer
		const convolutional_layer_2 = tf.layers
		.conv2d({
			kernelSize: 5,
			filters: 40,
			strides: 1,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
		})
		.apply(max_pool_layer_1);

		//second max pooling layer
		const max_pool_layer_2 = tf.layers
		.maxPooling2d({
			poolSize: [2, 2],
			strides: [2, 2],
		})
		.apply(convolutional_layer_2);

		//flatten the data for efficient processing
		const flat = tf.layers.flatten().apply(max_pool_layer_2);

		//dropout layer
		const dropout = tf.layers.dropout(0.2).apply(flat);


		//Use this line when incorporating metainfo for better accuracy
		//const concat = tf.layers.concatenate().apply(dropout);


		//output of the neural network appplies all the previous layers in order, using the .apply() function
		const output = tf.layers
		.dense({
			//output units = 2, because it represents an XY coordinate of a cursor's position 
			//maps the user's gaze to an XY position in the webpage.
			units: 2,
			//use the tanh activation function
			activation: 'tanh',
			kernelInitializer: 'varianceScaling',
		})
		.apply(dropout);

		//the Convolutional Neural Network model is defined by the inputs and output
		const model = tf.model({
			inputs: input_img_tensor,
			outputs: output,
		});

		return model;
	},

	//trains the neural network with the dataset stored in the global "data" object
	trainModel: async function() {
		
		model.isTraining = true;
		
		//if the model hasn't been created yet, generate a new one.
		if (model.current_model == null){
			model.current_model = model.createCNNModel();
		}

		//compile the model 
		model.current_model.compile({
			//use the "Adam" learning rate optimisation algorithm
			optimizer: tf.train.adam(0.0005),
			//set loss function to meanSquaredError
			loss: 'meanSquaredError',
		});
		

		//the following code is adapted from cpury @ https://github.com/cpury/lookie-lookie
		//after all training epochs save the best model based on training and validation loss


		//set the batch size to be 1/10th of the training data as long as the size of the batch is 
		//greater than 4 and no greater than 64
		let batchSize = Math.max(4, Math.min(Math.floor(data.training_data.n * 0.1), 64));
		
		let bestEpoch = -1;
		let bestTrainLoss = Number.MAX_SAFE_INTEGER;
		let bestValLoss = Number.MAX_SAFE_INTEGER;
		const bestModelPath = 'localstorage://best-model';
		
		//Train the Convolutional Neural network with the training data.
		//repeat for 10 epochs
		//and choose the model from the epoch with the smallest loss on the validation data
		await model.current_model.fit(data.training_data.a, data.training_data.b, {
			batchSize: batchSize,
			epochs: 10,
			shuffle: true,
			validationData: [data.validation_data.a, data.validation_data.b],
			callbacks: {
				//At the end of each epoch
				onEpochEnd: async function(epoch, logs) {

					//model.epochsTrained += 1;

					// Store the best model with the smallest loss on the validation data:
					if (logs.val_loss < bestValLoss) {
					// Save model
						bestEpoch = epoch;
						bestTrainLoss = logs.loss;
						bestValLoss = logs.val_loss;
			
						//save the model in local storage
						await model.current_model.save(bestModelPath);
					}
		
					return await tf.nextFrame();
				},
				//When the model is finished training
				onTrainEnd: async function() {
					model.isTraining = false;

					//update the UI
					var tbtn = document.getElementById("train_btn")
					tbtn.innerHTML = "Start Training"
					tbtn.className = "button";
					tbtn.disabled = false;

					//Load the model with the smallest loss on the validation data
					model.current_model = await tf.loadLayersModel(bestModelPath);

					//set a variable in the Chrome storage space to indicate that a model has been trained
					// chrome.storage.sync.set({trained: 'true'}, function(){
					// 	chrome.extension.getBackgroundPage().console.log('Model trained!!!!');
					// });

					
				},
			},
		});
	},


	//Function, which takes an image of the user's eyes, inputs it into a Convolutional Neural network,
	//and returns a prediction as to the coordinates on the webpage, the user is focusing on
	//based on the training data supplied and used to train the neural network
	predict: function(){
		if (model.current_model == null){
			console.log("Prediction was called, but model does not exist.")
			return;
		}

		return tf.tidy(function() {
			//extract the eye region image from a webpower stream and convert it to a tensor
			let img_tensor = data.getTensor();
			//console.log(model.current_model);
			//make a precition using the current conv. NN model
			const prediction = model.current_model.predict(img_tensor);
			//return the results of the prediction -> XY mouse coordinates
			return [prediction.dataSync()[0] + 0.5, prediction.dataSync()[1] + 0.5];
		});
	}
	
}


	













// function initOn() {
//   	var toggleOn = document.getElementById('toggleOn');
// 	chrome.storage.sync.get('state', function(result) {
// 		console.log('Value currently is ' + result.state);
// 		toggleOn.checked = (result.state === 'on'?true:false);
// 	});
// 	toggleOn.onchange = function () {
// 		if(this.checked) {
// 			chrome.storage.sync.set({state: 'on'}, function() {
// 	 		 	chrome.extension.getBackgroundPage().console.log('Turned on');
// 			})
// 			window.open('calibration.html', '_blank');
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

// function initpower() {
// 	var togglepower = document.getElementById('togglepowerera');

// 	chrome.storage.sync.get('showpowerera', function(result) {
// 		console.log('Value currently is ' + result.showpowerera);
// 		togglepower.checked = result.showpowerera;
// 	});
// 	togglepower.onchange = function () {
// 	  	if(this.checked) {
// 	  		chrome.storage.sync.set({'showpowerera': true}, function() {
// 	     		 chrome.extension.getBackgroundPage().console.log('Turned powerera on');
// 	    	})
// 	    	togglepowerera(true);
// 	  	} else {
// 	  		console.log('Turned off');
// 	  		chrome.storage.sync.set({'showpowerera': false}, function() {
// 	     		 chrome.extension.getBackgroundPage().console.log('Turned powerera off');
// 	    	});
// 	  		togglepowerera(false);
// 	    }
//   	}
// }

// function toggleState(truth) {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, {state: truth, togglepowerera: truth}, function(response) {
// 	      console.log(response);
//     	});
// 	});
// }

// function togglepowerera(truth) {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, {togglepowerera: truth}, function(response) {
// 	      console.log(response);
//     	});
// 	});
// }
function sum() {
	return 11;
}


module.exports = sum;