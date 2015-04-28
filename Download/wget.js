var http = require('http');
var fs   = require('fs');

if( process.argv.length < 3 )
{
    console.log( "Error: Type nodejs wget.js and then your input file name" );
    process.exit( 1 );
}

var fn = process.argv[ 2 ];

try
{
    var lines = fs.readFileSync( fn ).toString().split( "\n" );
}
catch( e )
{
    console.log(
        "Error: Something bad happened trying to open "+ fn );
    process.exit( 1 );
}

var download = function( url, dest, cb ) {
    console.log( "Download " + dest );
    var file = fs.createWriteStream( dest );
    // No synchronous style!!!
    // var data = http.getSync( url );

    var request = http.get( url, function( response ) {
        console.log( "get callback!" );
        try
        {
          response.pipe( file );
        }
        catch( e )
        {
          console.log("Error: Can't write to that file");
        }
        file.on( 'finish', function() {
            console.log( "finish callback!" );
            // close() is async, call cb after close completes.
            file.close( cb );
        }).on("error", function(){console.log("TEST")});
    });
    console.log( "called http.get" );
    request.on( 'error', function( err ) { // Handle errors
        console.log( "error callback!" );
        // Delete the file async. (But we don't check the result)
        try
        {
          fs.unlink(dest);
        }
        catch( e )
        {
          console.log("TEST");
        }
        if( cb )
            cb( err.message );
    });
    console.log( "called request.on" );
};

for( var i = 0; i < lines.length - 1; i += 2)
{
  //if( lines[i+1] )
  try
  {
    download( lines[i], lines[i+1] , function() { console.log( "file " +
              i + " has finished downloading." ) } );
  }
  catch( e )
  {
    console.log( "Error: not a readable URL")
  }

}


console.log( "Done?" );
