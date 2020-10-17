# Eye Tracking Chrome Extension
Chrome Extension that tracks your gaze via Machine Learning and visualises your gaze using a Heatmap. A group project for the University of Sydne by: Youki Iijima, Ethan Shi, Chris Pidd and Crystal Hu

## Installation
1. Open your chrome browser
2. Go Preference -> Extension (on the left sidebar)
3. Turn on the **developer mode**
4. Click 'Load unpacked' -> choose the project package folder (root)
5. If it is not visible, click on the jigsaw icon labelled 'extensions' in the top right corner of your browser window. Select the pin icon next to the Gaze Tracker extension icon that you just loaded.
6. Now you should notice a green chrome extension icon shows up at the top-right corner
7. Go to any website
8. When the webpage loaded up, click on the eye tracking extension icon to load the application. The application UI will be overlaid on your browser window.


# Instructions to Run Code
1. Open the index.html file in your browser
2. use the webcam in the top left corner to fit a green face tracking mesh over your face by moving your face.
3. move your cursor to various positions on the screen and follow it with your eyes
4. focus on the cursor and press the spacebar to register a new sample
5. after you have collected enough samples (at least 3 validation samples should be registered), click the "Start Training" button.
6. Wait a bit, it takes 5 seconds to train the convolutional neural network
7. Great! once the neural network has been trained, a red dot should start tracking your gaze.
