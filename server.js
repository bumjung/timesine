// -------------------------------------------------- //
// -------------------FIXED QUEUE-------------------- //
// -------------------------------------------------- //
// -------------------------------------------------- //

function FixedQueue( size ){

initialValues = [];
 
// Create the fixed queue array value.
var queue = Array.apply( null );
 
// Store the fixed size in the queue.
queue.fixedSize = size;
 
// Add the class methods to the queue. Some of these have
// to override the native Array methods in order to make
// sure the queue lenght is maintained.
queue.push = FixedQueue.push;
 
// Return the new queue.
return( queue );
 
}
 
// When the array is full, trim the head to maintain fixed length
FixedQueue.trimHead = function(){
 
// Check to see if any trimming needs to be performed.
if (this.length <= this.fixedSize){
 
// No trimming, return out.
return;
 
}
 
// Trim whatever is beyond the fixed size.
Array.prototype.splice.call(
this,
0,
(this.length - this.fixedSize)
);
 
};
 
// I synthesize wrapper methods that call the native Array
// methods followed by a trimming method.
FixedQueue.wrapMethod = function( methodName, trimMethod ){
 
// Create a wrapper that calls the given method.
var wrapper = function(){
 
// Get the native Array method.
var method = Array.prototype[ methodName ];
 
// Call the native method first.
var result = method.apply( this, arguments );
 
// Trim the queue now that it's been augmented.
trimMethod.call( this );
 
// Return the original value.
return( result );
 
};
 
// Return the wrapper method.
return( wrapper );
 
};
 
// Wrap the native methods.
FixedQueue.push = FixedQueue.wrapMethod(
"push",
FixedQueue.trimHead
);

// -------------------------------------------------- //
// ------------------ START APP --------------------- //
// -------------------------------------------------- //
// -------------------------------------------------- //

var express = require('express');
var app = express()
var io = require('socket.io').listen(app.listen(8080),{log: false});
 
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.render('index.jade');
});

io.sockets.on('connection', function (socket) {
	var data = FixedQueue(200);
	var cnt = 0;
	var off=false;
	var d = new Date();
	var t = d.getTime()/1000;
	var sineValue = Math.sin(t);
	data.push({
		x:t,
		y:sineValue
	});
	var stopinterval=setInterval(function(){
		//console.log(cnt);
		var d = new Date();
		var t = d.getTime()/1000;
		var sineValue = Math.sin(t);
		data.push({
			x:t,
			y:sineValue
		});
		socket.emit('generate_sine',{time : t, sin : data});
		cnt++;
	},150);
});
console.log('Listening on port http://localhost:8080');




