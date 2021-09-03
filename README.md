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
