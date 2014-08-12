(function(window){

  var qi = 0;

  window.quad = function (x1, y1, x2, y2) {
    qi+=1; console.log(qi);

    // Store references to items on this leaf (quads or points)
    var items = [],
      
    // Store points in the quad (more than four and the quad will split)
    leaves,

    // Store the dimension properties for later use
    width = x2-x1,
    height = x2-x1,
    halfWidth = width/2,
    halfHeight = height/2;

    // Draw a border around this quad
    context.beginPath();
    context.rect(x1, y1, width, height);
    context.closePath();
    context.stroke();

    // Splits this quad into four smaller quads
    function splitLeaf (newItem) {
      
      // Make four new leaf nodes (quads), that become "leaves" of the current quad in the quad tree
      leaves = [
        quad(x1, y1, halfWidth, halfHeight),
        quad(halfWidth, y1, x2, halfHeight),
        quad(x1, halfHeight, halfWidth, y2),
        quad(halfWidth, halfHeight, x2, y2)
      ];

      console.log('new leaves:', leaves, items);

      // Place each existing item in the best leaf
      // =========================================

      // Step through each of the four items in the current leaf...
      items.forEach(function(existingItem){

        // Step through each of the sub-leaves/sub-quads of this leaf/quad
        leaves.forEach(function(leaf, i){

          // If bounds of new leaf/quad: cover new item... add item to new leaf/quad
          if (leaf.covers(existingItem)){
            leaf.add(existingItem);
            // items.length=i;
          }

          // leaf.covers(newItem) && leaf.add(newItem);
        
        });

      });

      items=[];

      leaves.forEach(function(leaf, i){

        leaf.covers(newItem) && leaf.add(newItem);
        
      });

    }


    // Adds a new item to the current quad/leaf
    function addItem (newItem) {

      items.push(newItem);

      context.beginPath();
      context.rect(newItem[0], newItem[1], 1, 1);
      context.closePath();
      context.strokeStyle = "#FFF";
      context.lineWidth = 1.5;
      context.stroke();
      
      console.log('addItem:', items);

    }


    // Returns: Interface for quadtree
    return {
      
      // Adds item[x, y] to this quad, or splits the quad if it's already full
      add: function (newItem) {

        if (leaves) {

          leaves.forEach(function (leaf) {
            leaf.covers(newItem) && leaf.add(newItem);
          });

        } else {

          items < 4 ? addItem(newItem) : splitLeaf(newItem);

        }

      }, 


      // Checks if this quad covers an item[x, y]
      covers: function (item) {
        
        // Cache vars for performance
        var x3 = item[0], y3=item[1];

        // Basic bounds check. Returns: true/false
        return x3 >= x1 && x3 <= x2 && y3 >= y1 && y3 <= y2;

      }

    };

  };

})(this);


  // Get the context for the canvas, we will draw the quadtree on this canvas
  var context = canvas.getContext('2d'),

  // Lets populate the quadtree with some points
  points = [
    [50,  50 ],
    [150, 50 ],
    [50 , 150],
    [125, 125],
    [175, 125],
    // [125, 175],
    // [175, 175],
    // [155, 155],
    // [158, 155], 
    // [162, 155] 
  ], 

  // Initialize a root-quad, or first-leaf
  theQuadTree = quad(0, 0, canvas.width, canvas.height);

  context.translate(0.5, 0.5);
  context.strokeStyle = "#FFF";
  context.lineWidth = 1.5;

  // Loop through the points and populate the quadtree
  points.forEach(function(newPoint){
    theQuadTree.add(newPoint);
  });






/*
  Basic JavaScript Quad Tree
  MIT Liscence - Copyright Concord Consortium (c) 2009

  Developed By: Alistair MacDonald
  Licensed to: Concord Consortium - Concord.org
    
  Notes:  There is a high percentage of, shall we say... unneccesary calculation
          within this script; but... it makes things easier to read, so I am 
          going to leave this as-is so people can pick apart the peices. One 
          thing worth warning about is the lack of overlap check. If you wanted
          to store rectangles in this quad tree, it would need updating so it
          could check if a big object overlapped several small quad leaves. ;)
*/





// var canvas  = undefined,
//     ctx     = undefined,
//     quad    = undefined,
//     mouseX, mouseY;

//   function init(){
//     canvas = document.getElementById( 'canvasID' );
//     ctx        = canvas.getContext( '2d' );    
    
//     var items = {
//       1: { x: 50  , y: 50   },
//       2: { x: 150 , y: 50   },
//       3: { x: 50  , y: 150  },
//       4: { x: 125 , y: 125  },
//       5: { x: 175 , y: 125  },
//       6: { x: 125 , y: 175  },
//       7: { x: 175 , y: 175  },
//       8: { x: 155 , y: 155  } 
//     }
    
//     quad = new Quad({/*null props*/});
//     for( var i in items ){
//       quad.add( items[ i ] );
//     }
    
//     canvas.addEventListener( 'mousemove', function( e ){
//       var scrollX = window.scrollX != null ? window.scrollX : window.pageXOffset;
//       var scrollY = window.scrollY != null ? window.scrollY : window.pageYOffset;
//       mouseX = e.clientX - canvas.offsetLeft + scrollX;
//       mouseY = e.clientY - canvas.offsetTop + scrollY;
//     }, false );

//     canvas.addEventListener( 'click', function( e ){
//       quad.add({ x: mouseX, y: mouseY });
//     }, false );
  
//   }
      

//   // Quad object constructor
//   function Quad( props ){
//     this.objects   = [];
//     this.subquads  = []; // This quad has never been sub-divided
//     this.divided   = false;
//     this.level  = props.level     || 1;
//     this.bounds = props.bounds    || [ 0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height ];    
//     for( var i in props ){ this[ i ] = props[ i ]; }
//     this.width  = this.bounds[ 2 ] - this.bounds[ 0 ];
//     this.height = this.bounds[ 5 ] - this.bounds[ 1 ];
//     this.draw();
//   }

//   // Adds an object to this Quad
//   Quad.prototype.add = function add( obj ){
//     var len = this.objects.length;

//     // If this quad is not sub-divided...
//     if( !this.divided ){
      
//       // If less than four objects exist here...
//       if( len < 4 ){
//         this.objects[ len ] = obj;
//         ctx.fillStyle = '#0f0';
//         ctx.fillRect( obj.x-1, obj.y-1, 2, 2 );
//       }else{
//         this.divide( obj );
//       }
    
//     // If the quad you are adding to is already sub-divided...
//     }else{
//       quadrant = this.filter( obj );
      
//       // Build a new quad if it does not already exist
//       if( !this.subquads[ quadrant.index ] ){
//         this.subquads[ quadrant.index ] = new Quad({ level: this.level + 1, bounds: quadrant.bounds });
//       }
      
//       this.subquads[ this.filter( obj ).index ].add( obj );
//     }
    
//   }

//   // Returns the quadrant index and bounds for an XY value
//   Quad.prototype.filter = function filter( obj ){
       
//     // Supply quadrant offset
//     var ox = this.bounds[ 0 ];
//     var oy = this.bounds[ 1 ];
    
//     // Get the divided width/height dimensions of this Quad
//     var w2 = this.width / 2;
//     var h2 = this.height / 2;
        
//     // Make a bounds object to store sub-quads
//     var bounds = new Array( 0, 0, 0, 0 );        
    
//     // Step through quad-space and build temporary sub-quad regions
//     for( var i = 0; i < 4; i++ ){
//       var x = i % 2;
//       var y = ( ( i - x ) / 2 ) % 2;
//       var hxt = x * w2;
//       var vxt = y * h2;
//       bounds[ i ] = [ ox + hxt      , oy + vxt      ,
//                       ox + hxt + w2 , oy + vxt      ,
//                       ox + hxt + w2 , oy + vxt + h2 ,
//                       ox + hxt      , oy + vxt + h2   ];
      
//       // Return quadrant index and bounds if found
//       if( pip( obj.x, obj.y, bounds[ i ] ) ){
//         return { index: i, bounds: bounds[ i ] };
//       }
//     }
    
//     // Return false if something went wrong
//     return false;
//   }
  
//   // Splits this quad and pushes own objects to new quds
//   Quad.prototype.divide = function divide( obj ){
            
//     // Add new object to stack
//     this.objects.push( obj );
        
//     for( var i = 0; i < 5; i++ ){

//       var quadrant = this.filter( this.objects[ i ] );     

//       // Build a new quad if it does not already exist
//       if( !this.subquads[ quadrant.index ] ){
//         this.subquads[ quadrant.index ] = new Quad({ level: this.level + 1, bounds: quadrant.bounds });
//       }
         
//       this.subquads[ quadrant.index ].add( this.objects[ i ] );
//      };
    
//     // Remove the objects from the parent quad
//     this.objects.remove( 0, 4 );
    
//     this.divided = true;
    
//   }

//   // Draw Quad bounds
//   Quad.prototype.draw = function draw( obj ){
//     ctx.save();
//       ctx.beginPath(); 
//         ctx.moveTo( this.bounds[ 0 ] +.5, this.bounds[ 1 ] +.5 );
//         ctx.lineTo( this.bounds[ 2 ] -.5, this.bounds[ 3 ] +.5 );
//         ctx.lineTo( this.bounds[ 4 ] -.5, this.bounds[ 5 ] -.5 );
//         ctx.lineTo( this.bounds[ 6 ] +.5, this.bounds[ 7 ] -.5 );
//         ctx.closePath();
//       ctx.strokeStyle = '#f0f';
//       ctx.lineWidth = 1;
//       ctx.stroke();
//     ctx.restore();
//   }
  
//   // Check if a point lies within a polygon
//   function pip( x, y, polygon ){
//     var pip = false,
//         j   = polygon.length - 1;
 
//     for( var i = 0; i < polygon.length; i += 2 ){
//       var v1 = [ polygon[ i ], polygon[ i + 1 ] ];
//       var v2 = [ polygon[ j ], polygon[ j + 1 ] ];    
//       if( v1[ 0 ] < x && v2[ 0 ] >= x || v2[ 0 ] < x && v1[ 0 ] >= x ){
//         if( v1[ 1 ] + ( x - v1[ 0 ] ) / ( v2[ 0 ] - v1[ 0 ] ) * ( v2[ 1 ] - v1[ 1 ] ) < y ){
//           pip = !pip;
//         }
//       }
//       j = i;
//     }
   
//     return pip;
//   }

//   function cls(){
//     console.clear();
//   }

//   addEventListener( 'DOMContentLoaded', init, false );

//   // Array Remove - By John Resig (MIT Licensed)
//   Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
//   };

