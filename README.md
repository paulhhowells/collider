collider
========
version 0.1

Discover which particles are in collision with a pair of cartesian coordinates.



## how to use
1. create a new collider object:

		var my_collider = collider();
		
2. add particles to the collider object:

		var 
		  x = 30,
		  y = 20,
		  width = 20,
		  height = 20,
		  id = 'particle_1';
		  
		my_collider.register(x, y, width, height, id);
		
		// arguments can also be passed as a single json object
		my_collider.register({
			x : 40,
			y : 25,
			width : 60,
			height : 40
		});
		
3. test a pair or X Y cartesian coordinates to see if they collide with any particles

		var result_1 = my_collider.collision(35, 25);
		// result_1 === an object containing the particle objects that were collided with
		
		var result_2 = my_collider.collision({
			x : 90, 
			y : 90
		});
		// result_2 === FALSE
		
## use notes
* particles may be just coordinates, or may optionally have width and height
* particles are currently rectangular, but are planned to also be circular and hexagonal

## design notes
* the look up table could be removed if only a few particles were known to need to be iterated through, but for larger numbers (and assuming that most of the particles are not clustered into one tight space) the LUT creates a shortlist for testing.
