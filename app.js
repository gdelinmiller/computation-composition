const express = require('express'); //includes express as a package
const app = express(); //boots up express
const server = require('http').Server(app)
const io = require('socket.io')(server) //set up our socket.io for use.

//handles a request and sends back a specific response
// app.get('/', function(req, res){
//   res.send('<h1>hello world!</h1>')
// })

//serve out static files in the public html folder
app.use(express.static('public'))

var allConnections; //temp storage of all of our connections

//do something when someone connects to our page
io.on('connection', function(socket){ //socket = way of sending message
  console.log(socket.id)

  //get a list of the connected clients unique user ID's
  io.of('/').clients((error,clients) => {
    if(error) throw error;
    console.log(clients);
    allConnections = clients; //put the clinets in a globally accesible place!
  })


})

io.on('disconnect', function(socket){ //socket = way of sending message
  //get a list of the connected clients unique user ID's
  io.of('/').clients((error,clients) => {
    if(error) throw error;
    console.log(clients);
    allConnections = clients; //put the clinets in a globally accesible place!
  })
})


//makes app listen for requests on port 3000
server.listen(3000, function(){
  // console.log(server);
  console.log("app listening on port 3000!")
})

//MAIN CLOCK
var clock = setInterval(function(){
  var noteArray = [/*cmaj*/['c2', 'c3', 'c4', 'e2', 'e3', 'e4', 'g2', 'g3', 'g4'], /*gmaj*/['g2', 'g3', 'g4', 'b2,', 'b3', 'b4', 'd2', 'd3', 'd4'], /*fmaj*/['f2', 'f3', 'f4', 'a2', 'a3', 'a4', 'c2', 'c3', 'c4'], /*amin*/['a2', 'a3', 'a4', 'c2', 'c3', 'c4', 'e2', 'e3', 'e4', 'e5'], /*emin*/['e2', 'e3', 'e4', 'g2', 'g3', 'g4', 'b2', 'b3', 'b4']]
  // ];
  var chord = noteArray[Math.floor(Math.random()*noteArray.length)]
  // var note = noteArray[Math.floor(Math.random()*noteArray.length)]
  // console.log(note)
  // var note = Math.floor(Math.random()*200+100)
  // io.emit('sendOutNotes',note);
  // console.log( randUser( allConnections ));
  //send a message to a specific user, but get a random connection first and then send out a random note to them.
  // io.to( randUser( allConnections ) ).emit('sendOutNotes',note)
  // console.log('send: ', note);
  // console.log(allConnections.length);

  io.emit('sendOutNotes',chord)
}, 3000)



// *** SECOND SET OF NOTES ***

var clock2 = setInterval(function(){
  var noteShortArray = ['c4', 'd4', 'e4', 'g4', 'a4', 'b4']
  var noteShort = noteShortArray[Math.floor(Math.random()*noteShortArray.length)]
  io.to(randUser(allConnections)).emit('sendOutShortNotes',noteShort);
}, 998)

// *** END SECOND SET OF NOTES ***


//get a random user
function randUser(clientList){
  var r = Math.floor(Math.random()*clientList.length) //get a random number based on the number of clients cnnected
  return clientList[r]; //choose one ofm the arrray nd return it.

}
