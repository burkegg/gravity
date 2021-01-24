## Gravity Simulator

Simulate 1 - 4 masses interacting in 2-D on canvas.

Uses a javascript webworker to handle computations.  HTML canvas does the animations.  

### Lessons Learned:
* things drawn on the canvas don't track the overall drawing context of the canvas.  The drawing context
stores translation and rotation.  So when you re-draw an object that has been rotated, you'll need to re-load
the rotated context, draw the object, and then reset the context.

* Webworkers in javascript won't parallelize well for this project.  You only get one thread in the webworker, and you
have to pass in a copy of the data that you want to work on.  So if you want to do a bunch of iterative calculation for each
particle in a separate thread, you have to pass the data back and forth between each calculation.  Even with four
objects, passing data back and forth made animations choppy and decreased browser responsiveness.

