$(document).ready(function() {
    const $pointer = $('#pointer');
    const pointerSize = $pointer.outerWidth();
    
    //global pointer object
    window.pointer = {
        pointer : $pointer,
        pointerSize : pointerSize,
        
        getMouseXY: function(){
            console.log(cursor.getCursorPos);
        },

        movePointer: function(){
            //if the Conv. Neural Network has not yet been created...
            //or if the conv. neural network is currently in training,
            //do not output anything and do not move the pointer.

            if (model.current_model == null){	
                return;
            } 
            if (model.isTraining == true){
                console.log("model in training");
                return;
            }
            //make a prediction using the Convolutional neural network
            //exteracts an image of the user's eyes from the current webcam frame
            //and uses the classifier to predict where the user is gazing
            const prediction = model.predict();

            //extract the x and y coordinates of the prediciton
            const x = prediction[0] * ($('body').width() - pointerSize);
            const y = prediction[1] * ($('body').height() - pointerSize);

            //render the pointer with the correct position in the webpage.
            $pointer.css('left', x + 'px');
            $pointer.css('top', y + 'px');
        },
    };
});
