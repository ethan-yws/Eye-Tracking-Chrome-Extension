$(document).ready(function() {
  
  //global cursor object for updating and getting the cursor's xy coordinates
  window.cursor = {
      X: 0.5,
      Y: 0.5,
      
      //gets the cursor's xy coordinates
      getCursorPos: function() {
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
  });
  