## Gravity Simulator
View live website at:  https://burkegg.github.io/gravity/

A simple React website to simulate 1 - 4 masses interacting gravitationally on a 2-D Html5 canvas.  This is HEAVILY inspired by the
phet physics education website:  https://phet.colorado.edu/.  Years ago there was a sim much like this one,
but the last time I went back there I didn't see it.

This project uses a javascript webworker to handle computations.  HTML canvas does the animations.  

### Learning Goals:
1.  Webworkers.  We were about to start using them at work, so I wanted some experience with them.
1.  Html5 canvas.  For fun.
1.  SVGs.  I've seen them used the wrong way several times and it's frustratingly slow.  I knew SVGs were supposed to be fast, so I wanted to test their performance the right way.
1.  Javascript's internal performance monitoring tool: `performance.now()` 
1.  Javascript's actual performance with calculations in the browser.  Since there is effectively a "math" thread and an animation thread, I got to isolate it and get a feel for the limits doing calculations in JS for smooth animations.
1.  Compare Javascript's performance to Go's performance.

### Lessons Learned:

1.  Webworkers:  They won't solve all your problems.  The inability to share data between them efficiently leads me to believe that you'd basically have one thread handling all of the non-visible calculations.
Trying to share work between workers actually decreased performance because you can only share through the messaging system.  Moving all the math off of the main thread did make the animations smoother and allow me to increase the calculations per animation frame by a couple thousand.

1.  Html Canvas: Really fun and versatile.  The toughest lesson I learned involved rotation between frames -- things drawn on the canvas don't track the overall drawing context of the canvas.  The drawing context
stores translation and rotation.  So when you re-draw an object that has been rotated, you'll need to re-load
the rotated context, draw the object, and then reset the context.

1.  SVGs and performance: I actually re-did a version of this project with a go server doing the math, which is WAY faster than js. The go server could spit out data way faster than the browser could use it.  But I found that you can fill up the screen with hundreds of smoothly animating SVGs and not see a visual performance drop.

1.  `Performance.now()` was very helpful in determining which calculations were taking too long.  I knew I needed to get a new frame of data in ~ 20 ms for an animation, so I was able to locate the places in my code that would prevent that.
For example, you have to iterate several thousand times before each animation in order to get a good physical approximation.  How many is too many?  Performance tools tell you.

1.  Javascript's performance:  I was surprised that the browser could handle the calculations for a dozen objects interacting, doing a couple thousand iterations per animation frame.  I've had to solve memory leaks in the browser - but never had an intuition for "how much can the browser take" until now.

1.  Comparing JS / Go:  The real performance gains came from doing the calculations in Go and then getting data to the browser at the right rate.  It was easy to have Go spit out data for a couple thousand particles - or spit out data for 6 particles way faster than an animation would use it.  It was so fast, in fact, that it filled up the browser's memory pretty quickly.  The easiest thing to do, and therefore what I did, was slow down the server a bit until it matched a useful rate for the browser.


### Bonus Lessons!

1.  You can layer canvases with z-index and then animate some or all.

I wanted to make the traces look a little better than simply blobs the size of the objects.  To do that I'd need to show
the history of where the ball was in the past.  I thought about doing this by keeping the ball's location history into
perpetuity, and then re-drawing all of the points with each frame.  That was a disaster.  It worked for a bit, but soon 
the browser was trying to draw thousands of dots with each frame.  I came up with some elaborate plans for ways it might work
but finally read more about the canvas on mdn and google developers site.  You can layer canvases on top of each other, and
since it's transparent by default, you get a lot of flexibility.  My initial confusion came from needing to clear the canvas for
motion.  The circles themselves need to be erased after each frame or you end up with traces of where they have been.  So that
layer needs to be cleared before each frame refresh.  The other layer, however, does not need to be refreshed.  You just 
draw the points one at a time and never clear that layer.


2.  Absolute positioning has some quirky limitations.

I needed to layer canvases on top of each other, and absolute positioning seemed like a good way to go.  Unfortunately I
was sizing the canvas after the initial page render, and apparently that doesn't work with absolute positioning.

3.  The canvas has a resolution size, and also a style size.

Make these the same or you're going to get some weird scaling behavior.  I spent an hour trying to figure out why the mouse
click wasn't registering inside of the circles.  My confusion was
compounded because it looked like the offset was similar to some of my margins.  Finally I noticed a spot where I had forgotten
to update the style size to match the resolution size - and the scale factor just happened to match a margin somewhere unrelated.


