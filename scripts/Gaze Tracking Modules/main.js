

$(document).ready(function() {
  
  //set the interval at which to refresh the predictions and draw the pointer
  setInterval(pointer.movePointer, 50);
  
  //when spacebar is pressed, collect a new sample image of the user's eyes
  $('body').keyup(function(e) {
    if (e.keyCode === 32) {
      
      //get a sample image of the user's eyes, and add it to the dataset as a tensor
      data.getSample();
      e.preventDefault();
      return false;
    }
  });

  //toggle the training button and  train the convolutuional neural network
  function onTrainStart(){
    var tbtn = document.getElementById("train_btn");
		tbtn.innerHTML = "In Training...";
		tbtn.className = "button disabled";
    tbtn.disabled = true;

    //train the convolutional neural network
    model.trainModel();

  }
  
  //when the training button is clicked, start training.
  $('#train_btn').click(function(e) {
    onTrainStart();
  });

});
