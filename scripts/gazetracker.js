//FROM A FAILED ITERATION.	


// import * as tf from '@tensorflow/tfjs';
// import '@babel/polyfill';

// window.cursor = {
//     X: 0.5,
//     Y: 0.5,
    
//     //gets the cursor's xy coordinates
//     getCursorPos: function() {
//         return [cursor.X, cursor.Y];
//     },

//     //updates the cursor's XY coordinates every time the mouse is moved
//     updateCursorPos: function(event) {
//         cursor.X = event.clientX / $('body').width();
//         cursor.Y = event.clientY / $('body').height();
//     },
// };
  
// //every time the mouse is moved, update the cursor object's X and Y variables
// document.onmousemove = cursor.updateCursorPos;

// const $pointer = $('#pointer');
// const pointer_size = $pointer.outerWidth();



// // async function loadModel(){
// // 	chrome.storage.sync.get('trained', async function(result) {
// // 		if (result.trained === 'true'){

// // 			console.log(result.trained);
// // 			//var message = (result.trained==='true'?"The model has been trained":"The mode has NOT been trained");

// // 			chrome.storage.sync.set({trained: 'false'}, function() {
// // 				chrome.extension.getBackgroundPage().console.log('Model loaded');
// // 			});

			
// // 			console.log("Loading Model");
// // 			chrome.storage.sync.get('cnn', function(stored_model) {
// // 				model.current_model = stored_model.cnn;
				
// // 			});

// // 			//model.current_model = await tf.loadLayersModel('localstorage://best-model');	
// // 			console.log("model loaded");
			
// // 		}
// // 	});

// // }


// //global pointer object
// window.pointer = {
//     pointer : $pointer,
//     pointer_size : pointer_size,
    
//     getMouseXY: function(){
// 		console.log(cursor.getCursorPos);
//     },

//     movePointer: async function(){

//         //make a prediction using the Convolutional neural network
//         //exteracts an image of the user's eyes from the current webcam frame
//         //and uses the classifier to predict where the user is gazing
		
// 		if (model.current_model == null){	
// 			return;
// 		} 
// 		if (model.isTraining == true){
// 			console.log("model in training");
// 			return;
// 		}

// 		const prediction = model.predict();
		
//         //extract the x and y coordinates of the prediciton
//         const x = prediction[0] * ($('body').width() - pointer_size);
//         const y = prediction[1] * ($('body').height() - pointer_size);

//         //render the pointer with the correct position in the webpage.
//         $pointer.css('left', x + 'px');
// 		$pointer.css('top', y + 'px');
//     },
// };


// //global data object, which stores training and validation datasets
// //also features functions for capturing samples and adding them to the datasets

// window.data = {
	
// 	//width and height of training samples
// 	sampleWidth: $('#eyes').width(),
// 	sampleHeight: $('#eyes').height(),
	
// 	//training and validation data for training a Convolutional Neural Network
// 	//'a' stores a tensor representing an image of the user's eyes
// 	//'b' stores a 1D tensor representing the XY coordinates of a cursor.
// 	//n is the size of each dataset
// 	training_data: {
// 		n: 0,
// 		a: null,
// 		b: null,
// 	  },
// 	  validation_data: {
// 		n: 0,
// 		a: null,
// 		b: null,
// 	  },
	
// 	//https://cpury.github.io/learning-where-you-are-looking-at/
// 	//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
// 	getTensor: function(){
// 		return tf.tidy(function() {
// 			//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
// 			const image = tf.browser.fromPixels(document.getElementById('eyes'));
// 			//Adds a batch dimension to the tensor
// 			const batched_img = image.expandDims(0);
// 			//converts the batched tensor into appropriate form for input into a Conv. Neural Network
// 			return batched_img
// 				.toFloat()
// 				.div(tf.scalar(127))
// 				.sub(tf.scalar(1));
// 		});
// 	},

// 	//collects a training sample by cropping a rectangular image of the user's eyes out of a webcam frame
// 	getSample: function(){
// 		tf.tidy(function() {
// 			//extract an image of the user's eyes and store it as a TF tensor.
// 			const img_tensor = data.getTensor();
// 			//get the cursor position on the window
// 			const mouseXY = cursor.getCursorPos();
// 			mouseXY[0] = mouseXY[0] -0.5;
// 			mouseXY[1] = mouseXY[1] -0.5;

// 			//store the mouse position as a 1D tensor
// 			var mouse_tensor = tf.tidy(function() {
// 				return tf.tensor1d(mouseXY).expandDims(0);
// 			});

// 			//add sample tensors to a dataset.
// 			data.addSample(img_tensor, mouse_tensor);

// 		});
// 	},
	
// 	//Add Samples to either a training or validation data set in the global "data" object
// 	addSample: function(img_tensor, mouse_tensor){
// 		//choose whether to add to training dataset or validation dataset.
// 		//80% of the sample will be training data, 20% validation data
// 		var key = Math.random() > 0.2 ? 'training_data' : 'validation_data';
// 		const set = data[key];
		
// 		//if the datasets are empty, add the tensors to the empty set
// 		if (set.a == null){
// 			set.a = tf.keep(img_tensor);
// 			set.b = tf.keep(mouse_tensor);
		
// 		//if the sets aren't empty, concatenate the new tensor with 
// 		//the previously stored tensor
// 		} else {
// 			const old_img_tensor = set.a;
// 			set.a = tf.keep(old_img_tensor.concat(img_tensor, 0));

// 			const old_mouse_tensor = set.b;
// 			set.b = tf.keep(old_mouse_tensor.concat(mouse_tensor, 0));

// 			old_img_tensor.dispose();
// 			old_mouse_tensor.dispose();
// 			mouse_tensor.dispose();
// 		}
// 		//increment the size of the set.
// 		set.n += 1;

// 		//update the UI
// 		data.onAddSample(data.training_data.n + data.validation_data.n, key);
// 	},
	
// 	//Update the UI with size of training and val datasets
// 	onAddSample: function(n, key){
// 		if (data.validation_data.n > 1){
// 			var tbtn = document.getElementById("train_btn");
			
// 			if (tbtn != null){
// 				tbtn.className = "button";
// 				tbtn.disabled = false;
// 			}
			
			
// 		}
// 		var sample_num = null;
// 		if (key =='training_data'){
// 			sample_num = document.getElementById("num_train");
// 			if (sample_num != null){
// 				sample_num.innerHTML = data.training_data.n;
// 			}
			
// 		} else {
// 			sample_num = document.getElementById("num_val");
// 			if (sample_num != null){
// 				sample_num.innerHTML = data.validation_data.n;
// 			}
// 		}	
// 	},
// };

// //global variable, which stores a Convolutional Neural Network
// // The CNN has 2 hidden convolutional layers, 2 max pooling layers, and a dropout layer
// //features functions to train the Neural Network
// //and a function to make a prediction when a sample is inputted into the NN

// window.model ={
// 	current_model: null,
// 	isTraining: false,

// 	//inspired by
// 	//https://rubikscode.net/2019/03/25/image-classification-with-tensorflow-js/
// 	//https://github.com/cpury/lookie-lookie
// 	//COnvolutional Neural Network with 2 hidden layers and 2 max pooling layers


// 	createCNNModel: function() {
		
// 		//define the input format
// 		const input_img_tensor = tf.input({
// 			name: 'image',
// 			shape: [data.sampleHeight, data.sampleWidth, 3],
// 		});


// 		//first hidden layer
// 		const convolutional_layer_1 = tf.layers
// 		.conv2d({
// 			kernelSize: 5,
// 			filters: 20,
// 			strides: 1,
// 			activation: 'relu',
// 			kernelInitializer: 'varianceScaling',
// 		})
// 		.apply(input_img_tensor);

// 		//first max pooling layer
// 		const max_pool_layer_1 = tf.layers
// 		.maxPooling2d({
// 			poolSize: [2, 2],
// 			strides: [2, 2],
// 		})
// 		.apply(convolutional_layer_1);

// 		//second convolutional layer
// 		const convolutional_layer_2 = tf.layers
// 		.conv2d({
// 			kernelSize: 5,
// 			filters: 40,
// 			strides: 1,
// 			activation: 'relu',
// 			kernelInitializer: 'varianceScaling',
// 		})
// 		.apply(max_pool_layer_1);

// 		//second max pooling layer
// 		const max_pool_layer_2 = tf.layers
// 		.maxPooling2d({
// 			poolSize: [2, 2],
// 			strides: [2, 2],
// 		})
// 		.apply(convolutional_layer_2);

// 		//flatten the data for efficient processing
// 		const flat = tf.layers.flatten().apply(max_pool_layer_2);

// 		//dropout layer
// 		const dropout = tf.layers.dropout(0.2).apply(flat);


// 		//Use this line when incorporating metainfo for better accuracy
// 		//const concat = tf.layers.concatenate().apply(dropout);


// 		//output of the neural network appplies all the previous layers in order, using the .apply() function
// 		const output = tf.layers
// 		.dense({
// 			//output units = 2, because it represents an XY coordinate of a cursor's position 
// 			//maps the user's gaze to an XY position in the webpage.
// 			units: 2,
// 			//use the tanh activation function
// 			activation: 'tanh',
// 			kernelInitializer: 'varianceScaling',
// 		})
// 		.apply(dropout);

// 		//the Convolutional Neural Network model is defined by the inputs and output
// 		const model = tf.model({
// 			inputs: input_img_tensor,
// 			outputs: output,
// 		});

// 		return model;
// 	},

// 	//trains the neural network with the dataset stored in the global "data" object
// 	trainModel: async function() {
		
// 		model.isTraining = true;
		
// 		//if the model hasn't been created yet, generate a new one.
// 		if (model.current_model == null){
// 			model.current_model = model.createCNNModel();
// 		}

// 		//compile the model 
// 		model.current_model.compile({
// 			//use the "Adam" learning rate optimisation algorithm
// 			optimizer: tf.train.adam(0.0005),
// 			//set loss function to meanSquaredError
// 			loss: 'meanSquaredError',
// 		});
		

// 		//the following code is adapted from cpury @ https://github.com/cpury/lookie-lookie
// 		//after all training epochs save the best model based on training and validation loss


// 		//set the batch size to be 1/10th of the training data as long as the size of the batch is 
// 		//greater than 4 and no greater than 64
// 		let batchSize = Math.max(4, Math.min(Math.floor(data.training_data.n * 0.1), 64));
		
// 		let bestEpoch = -1;
// 		let bestTrainLoss = Number.MAX_SAFE_INTEGER;
// 		let bestValLoss = Number.MAX_SAFE_INTEGER;
// 		const bestModelPath = 'localstorage://best-model';
		
// 		//Train the Convolutional Neural network with the training data.
// 		//repeat for 10 epochs
// 		//and choose the model from the epoch with the smallest loss on the validation data
// 		await model.current_model.fit(data.training_data.a, data.training_data.b, {
// 			batchSize: batchSize,
// 			epochs: 10,
// 			shuffle: true,
// 			validationData: [data.validation_data.a, data.validation_data.b],
// 			callbacks: {
// 				//At the end of each epoch
// 				onEpochEnd: async function(epoch, logs) {

// 					//model.epochsTrained += 1;

// 					// Store the best model with the smallest loss on the validation data:
// 					if (logs.val_loss < bestValLoss) {
// 					// Save model
// 						bestEpoch = epoch;
// 						bestTrainLoss = logs.loss;
// 						bestValLoss = logs.val_loss;
			
// 						//save the model in local storage
// 						await model.current_model.save(bestModelPath);
// 					}
		
// 					return await tf.nextFrame();
// 				},
// 				//When the model is finished training
// 				onTrainEnd: async function() {
// 					model.isTraining = false;

// 					//update the UI
// 					var tbtn = document.getElementById("train_btn")
// 					tbtn.innerHTML = "Start Training"
// 					tbtn.className = "button";
// 					tbtn.disabled = false;

// 					//Load the model with the smallest loss on the validation data
// 					model.current_model = await tf.loadLayersModel(bestModelPath);

// 					//set a variable in the Chrome storage space to indicate that a model has been trained
// 					chrome.storage.sync.set({trained: 'true'}, function(){
// 						chrome.extension.getBackgroundPage().console.log('Model trained!!!!');
// 					});

					
// 				},
// 			},
// 		});
// 	},


// 	//Function, which takes an image of the user's eyes, inputs it into a Convolutional Neural network,
// 	//and returns a prediction as to the coordinates on the webpage, the user is focusing on
// 	//based on the training data supplied and used to train the neural network
// 	predict: function(){
// 		if (model.current_model == null){
// 			console.log("Prediction was called, but model does not exist.")
// 			return;
// 		}
// 		return tf.tidy(function() {
// 			//extract the eye region image from a webcam stream and convert it to a tensor
// 			let img_tensor = data.getTensor();
// 			//make a precition using the current conv. NN model
// 			const prediction = model.current_model.predict(img_tensor);
// 			//return the results of the prediction -> XY mouse coordinates
// 			return [prediction.dataSync()[0] + 0.5, prediction.dataSync()[1] + 0.5];
// 		  });
// 	}
	
// }


// const video = document.getElementById('video');
// const overlay = document.getElementById('overlay');

// //Video capture functions adapted from cpury @ https://github.com/cpury/lookie-lookie
// window.tracker = {
//     video: video,
//     //video dimensions
//     vid_width: video.width,
//     vid_height: video.height,
//     vid_vidWidth: video.videoWidth,
//     vid_vidHeight: video.videoHeight,
    
//     //HTML overlay element for displaying graphics
//     overlay: overlay,
//     overlay_ctx: overlay.getContext('2d'),
    
//     trackingStarted: false,
    
//     //stores 64 facial features as coordinates, having been extracted by clmtrackr.js
//     face_positions: null,
//     //the current image of the user's eyes for a particular frame
//     //to be used as an input into the Convolutional Neural network
//     eye_canvas: null,


//     //set up the video stream
//     setUpStream: function(stream) {
//     if ('srcObject' in tracker.video) {
//         tracker.video.srcObject = stream;
//     } else {
//         tracker.video.src =
//         window.URL && window.URL.createObjectURL(stream);
//     }
//     tracker.video.onloadedmetadata = function() {
//         tracker.video.play();
//     };
//     tracker.video.onresize = function() {
//         if (tracker.trackingStarted) {
//         tracker.clm_facetracker.stop();
//         tracker.clm_facetracker.reset();
//         tracker.clm_facetracker.start(tracker.video);
//         }
//     };
//     },

//     //start the webcam stream and display it on the webpage
//     startVideo: function() {
//     // start webcam stream to page
//     tracker.video.play();
//     // use clm to track face in video element
//     tracker.clm_facetracker.start(tracker.video);
//     tracker.trackingStarted = true;
//     // use clmtrackr to extract the user's facial features
//     tracker.getFacialFeatures();
//     },

//     getFacialFeatures: function() {
//     // Check if a face is detected, and if so, track it.
//     requestAnimationFrame(tracker.getFacialFeatures);

//     //get the facial feature positions.
//     tracker.face_positions = tracker.clm_facetracker.getCurrentPosition();
    
//     //clear the overlay canvas so that new graphics can be drawn on the page.
//     tracker.overlay_ctx.clearRect(
//         0,
//         0,
//         tracker.vid_width,
//         tracker.vid_height,
//     );

//     //if the clm_facetracker has returned a list of facial feature positions...
//     if (tracker.face_positions) {

        
//         //extract the eye region of the user from the webcam stream frame
//         tracker.trackFace(tracker.face_positions);
        
//         ////draw over the relevant facial features in the webpage, so that the user can see if their 
//         //face is being accurately detected
//         tracker.clm_facetracker.draw(tracker.overlay);
//     }
//     },

    
//     //adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
//     // get a rectangle surrounding the eyes from clmtrackr vertices
//     getEyes: function(position) {
//     // Given a tracked face, returns a rectangle surrounding the eyes.
//     const minX = position[19][0] + 3;
//     const maxX = position[15][0] - 3;
//     const minY =
//         Math.min(
//         position[20][1],
//         position[21][1],
//         position[17][1],
//         position[16][1],
//         ) + 6;
//     const maxY =
//         Math.max(
//         position[23][1],
//         position[26][1],
//         position[31][1],
//         position[28][1],
//         ) + 3;

//     const width = maxX - minX;
//     const height = maxY - minY - 5;

//     return [minX, minY, width, height * 1.25];
//     },

//     //adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
//     // draw a rectangle surrounding the user's eyes in an HTML canvas.
//     //this will be turned into a tensor and used as inputs into a neural network
//     trackFace: function(positions) {
//     // Given a tracked face, crops out the eyes and draws them in the eyes canvas.
//     const rect = tracker.getEyes(positions);
//     tracker.eye_canvas = rect;

//     const eyesCanvas = document.getElementById('eyes');
//     const eyesCtx = eyesCanvas.getContext('2d');

//     // resize the eye canvas to the correct size for input into the neural network
//     const resizeFactorX = video.videoWidth / video.width;
//     const resizeFactorY =video.videoHeight / video.height; 
    
//     //draw the eyes onto the webpage, so that the user can tell that their eyes are being accurately tracked
//     eyesCtx.drawImage(
//         tracker.video,
//         rect[0] * resizeFactorX,
//         rect[1] * resizeFactorY,
//         rect[2] * resizeFactorX,
//         rect[3] * resizeFactorY,
//         0,
//         0,
//         eyesCanvas.width,
//         eyesCanvas.height,
//     );
//     },
// };

// //Alert that the video is ready to start playing
// //callback -> start the video
// video.addEventListener('canplay', tracker.startVideo, false);

// // adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
// // set up video
// if (navigator.mediaDevices) {
//     navigator.mediaDevices
//     .getUserMedia({
//         video: true,
//     })
//     .then(tracker.setUpStream);
// } else if (navigator.getUserMedia) {
//     navigator.getUserMedia(
//     {
//         video: true,
//     },
//     tracker.setUpStream,
//     );
// } 

// //set up a clmtrackr face tracker for tracking the user's face and extracting 
// //the coordinates of 64 major facial features
// tracker.clm_facetracker = new clm.tracker();
// tracker.clm_facetracker.init();



// ////////////////////////////////////////////////////////
// // Process a prediction every 50ms                    //
// ////////////////////////////////////////////////////////

// setInterval(pointer.movePointer, 50);

// ////////////////////////////////////////////////////////
// // Process a prediction every 50ms                    //
// ////////////////////////////////////////////////////////


// ////////////////////////////////////////////////////////
// // Original data collection (with space bar)          //
// ////////////////////////////////////////////////////////

// //when spacebar is pressed, collect a new sample image of the user's eyes
// $('body').keyup(function(e) {
//     if (e.keyCode === 32) {
    
//     //get a sample image of the user's eyes, and add it to the dataset as a tensor
//         data.getSample();
//         e.preventDefault();
//         return false;
//     }
// });


// //toggle the training button and  train the convolutuional neural network
// function onTrainStart(){
//     var tbtn = document.getElementById("train_btn");
// 	if (tbtn != null){
// 		tbtn.innerHTML = "In Training...";
// 		tbtn.className = "button disabled";
//     	tbtn.disabled = true;
// 	}
	
//     //train the convolutional neural network
//     model.trainModel();

// }

// //when the training button is clicked, start training.
// $('#train_btn').click(function(e) {
//     onTrainStart();
// });


