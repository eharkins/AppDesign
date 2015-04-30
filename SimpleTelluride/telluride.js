var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function listPerformers( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	   "<html>"  +
	   "<body>"  +
     "<table>" +
     "<tbody>" +
     "<tr><td>Performer</td><td>Stage</td><td>Time</td></tr>";
    /*db.each( "SELECT NAME FROM PERFORMERS", function( err, row ) {
        console.log( "perf "+row.NAME );
	  resp_text += "<tr><td>" + row.NAME + "</td><td>" + row.STAGE + "</td><td>" +
               row.TIME + "</td></tr>";
    },
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</tbody>" + "</table>" +"</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );*/
     var row_count = 0, row2_count = 0, outer = false;

     db.each( "SELECT ID, PERFORMER, STAGE, TIME FROM PERFORMANCE", function( err, row ) {
         //resp_text += "<tr><td>" + row.NAME; + "</td>";
         row_count ++;
         db.each( "SELECT NAME FROM PERFORMERS WHERE ID = " +
                  row.PERFORMER, function( err2, row2 ) {
                      row2_count ++;
                      resp_text += "<tr><td>" + row2.NAME + "</td>" +
                               "<td>" + row.STAGE + "</td>" +
                               "<td>" + row.TIME + "</td></tr>";
                      console.log( "Performer: "+ row.PERFORMER + " " +
                                   row2.NAME );
                  },
                  function()
                  {
                    if( outer && row_count == row2_count )
                    {
                      resp_text += "</tbody>" + "</table>" +"</body>" + "</html>";
                      res.writeHead( 200 );
                      res.end( resp_text );
                    }

                  });
         console.log( row );
     },
     function()
     {
       outer = true;

     });
}

function serveFile( filename, req, res )
{
    if( filename == "favicon.ico")
    {
      filename = "./index.html";
    }
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
    	process.exit( 1 );
    	/* Return a 404 page */
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename == "list_performers" )
    {
        listPerformers( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
