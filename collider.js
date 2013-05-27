/*jslint bitwise: true, eqeq: false, sloppy: true, white: true, browser: true, devel: true, indent: 2 */

/* style:

  SYMBOLIC_CONSTANTS
  variable_names
  $jquery_objects
  functionNames
  methodNames
  ConstructorClassNames
  css-class-names

  q or o private object
  r return object
  p public object

  shorthand:
    str - string
    obj - object
    arr - array
    int - integer
    num - number
*/

/* to do:
 *
 * remove unneeded properties & methods, ie setting size of map
 * move a particle
 * circular and hexagonal particle types
 * better documentation / comments
*/

collider = function () {
  // v.0.1
  //
  // public methods:
  //  register()
  //  collision()
  // public properties:
  //  particles

  "use strict";
  var
    q, // private
    r; // public

  // private
  q = {
    /*
    w : 0,
    h : 0,
    */
    id_int : 0,
    id_prefix : 'id',
    newId : function () {
      // if an id is not requested for the particle key, then create one
      this.id_int += 1;
      return (!r.particles[this.id_prefix + this.id_int]) ? this.id_prefix + this.id_int : this.newId();
    },
    newParticle : function (x, y, width, height, type, id) {
      var
        x_limit,
        y_limit,
        y_arr,
        r = {
        id : id,         // string
        x : x,           // int
        y : y,           // int
        width : width,   // int
        height : height, // int
        type : type,     // string
        collision : function (x, y) {
          // arguments:
          //   x and y coordinates, or a single object containing them {x : x, y : y}
          // returns:
          //   true if a collision has occurred, else false

          if (!y && typeof x === "object") {
            y = arguments[0].y;
            x = arguments[0].x;
          }

          // assumes type of rect
          if ((x >= this.x) && (x <= (this.x + this.width))) {
            if ((y >= this.y) && (y <= (this.y + this.height))) {
              return true;
            }
          }
          return false;
        }
      };

      // add particle to the collider's look up table
      // assuming a rectangle is good enough
      for (x = r.x, x_limit = r.x + r.width; x <= x_limit; x += 1) {

        // use existing array, or create new array if it doesn't exist yet
        y_arr = this.lut[x] || [];

        for (y = r.y, y_limit = r.y + r.height; y <= x_limit; y += 1) {
          y_arr[y] = y_arr[y] || {};
          y_arr[y][r.id] = true;
        }
        this.lut[x] = y_arr;
      }

      return r;
    },
    lut : [] // look up table, a 2D array
  };

  // public
  r = {
    /*
    width : 0,
    height : 0,
    make : function (width, height) {
      this.width = width;
      this.height = height;

      q.w = width;
      q.h = height;
    },
    getWidth : function () {
      return q.w;
    },
    */
    register : function (x, y, id_str, options) {
      // arguments:
      //  id string and options are both optional
      //  options is an object that may define:
      //    width, height, type, id string, x and y (cannot defined only x or only y within options)

      var
        width,
        height,
        particle_type;

      if (!options) {
        // id_str might be string or options object, or be undefined

        if (!id_str) {
          id_str = q.newId();
          if (!y & (typeof x === 'object')) {
            options = x;
            x = options.x || 0;
            y = options.y || 0;
          }
        } else if (!(typeof id_str === 'string')) {
          // then id_str (as the 3rd argument) is probably options
          options = id_str;
          id_str = (options && options.id) ? options.id : q.newId();
        }

      }

      width = (options && options.width) ? options.width : 0;
      height = (options && options.height) ? options.height : 0;
      particle_type = (options && options.type) ? options.type : 'rect';

      // add new id object to particles
      this.particles[id_str] = q.newParticle(x, y, width, height, particle_type, id_str);

      return this.particles[id_str]; // return id string, or reference to object?
    },
    collision : function (x, y) {
      // arguments:
      //   x and y coordinates, or a single object containing them {x : x, y : y}
      // returns:
      //   a hash object of collided particle objects, or false if none have occurred

      var
        collided = false,
        collisions = {},
        id_key,
        lut_collisions_obj;

      if (!y && typeof x === "object") {
        y = arguments[0].y;
        x = arguments[0].x;
      }

      // return an array
      // loop through each particle and test for collision
      // make a list of all collisions
      // collisions = [];
      // for (id in this.particles) {
      //  if (this.particles[id].collision(x, y)) {
      //    collisions.push(this.particles[id]);
      //  }
      // }
      //
      // // returns an array of particle objects
      // return (collisions.length === 0) ? false : collisions;

      // return an object (or false)
      lut_collisions_obj = q.lut[x][y];
      for (id_key in lut_collisions_obj) {
        if(lut_collisions_obj.hasOwnProperty(id_key)) {
          if (this.particles[id_key].collision(x, y)) {
            collisions[id_key] = this.particles[id_key];
            collided = true;
          }
        }
      }
      return collided ? collisions : false;

    },
    particles : {}
  };
  return r;
};
