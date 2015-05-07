var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function getAllLinks()
{
  var db = new sqlite.Database( "linkdb.sqlite" );
  db.all( "SELECT * FROM LINKS",
      function( err, rows ) {
          res.writeHead( 200 );
          res.end( JSON.stringify( rows ));
      });
}


function addLink( req, res )
{
  console.log( "ADDLINK" );
  var db = new sqlite.Database( "linkdb.sqlite" );
  var parse_junk = req.url.split("?");
  var parse_slash = parse_junk[1].split( "/" );
  var link = parse_slash[0];
  var nickname = parse_slash[1];
  var sql_cmd = "INSERT INTO LINKS " +
      "('LINK ADDRESS', 'NICKNAME') VALUES ('" + link + "', '" + nickname + "') ";
  db.run( sql_cmd );
  db.close();
  res.writeHead( 200 );
  res.end( "link:" + link + ":nickname:" + nickname);
}

function delLink( res )
{
  var db = new sqlite.Database( "linkdb.sqlite" );
  var sql_cmd = "DELETE FROM LINKS WHERE NICKNAME = " + this;
  db.run( sql_cmd );
  db.close();
  res.writeHead( 200 );
  res.end("");
}

function giveBackFile( name, res )
{
    var contents = "";
    try {
    	contents = fs.readFileSync( name ).toString();
    }
    catch( e ) {
    	console.log(
    	    "Error: Something bad happened trying to open "+name );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}


function doTheServer( req, res )
{
    console.log( req.url );
    // console.log( "doTheServer " + req.url );
    if( req.url == "/del_link" )
    {
        delLink( res );
    }
    else if( req.url.substring( 0, 9 ) == "/add_link" )
    {
        addLink( req, res );
    }
    else if( req.url.substring( 0, 9 ) == "/del_link" )
    {
        delLink( req, res );
    }
    else if( req.url.substring( 0, 9 ) == "/get_rows" )
    {
        getAllRows( req, res );
    }
    else if( req.url == "/linkdb_front.js" )
    {
        giveBackFile( "linkdb_front.js", res );
    }
    else
    {
        giveBackFile( "index.html", res );
    }
}

var server = http.createServer( doTheServer );
server.listen( 8080 );
