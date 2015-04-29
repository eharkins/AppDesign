var http = require( "http" );
var fs = require( 'fs' );
var data = [];

function serverFn( req, res )
{
    for( field in req )
    {
        console.log( "R."+field+" = ..."/*+req[ field ]*/ );
    }
    for( field in req.headers )
    {
        console.log( "R.header."+field+" = ..."/*+req[ field ]*/ );
    }
    console.log("url: "+req.url.toString() );

    if( req.url.substring( 0, 16 ) == "/submit_the_form" )
    {
        var found_checked = false;

        var parse_junk = req.url.split( "?" );
        //console.log(parse_junk.toString());
        var parse_and = parse_junk[1].split( "&" );
        for( var i = 0; i < parse_and.length; i++)
        {
          var parse_eq = parse_and[i].split( "=" );
          if( parse_and[i].substring( 0, 7 ) == "textbox" )
          {
            var parse_plus = parse_eq[1].split( "+" );
            console.log( parse_eq[0] + ": " );
            data.push( parse_eq[0] + ": " );
            for( var j = 0; j < parse_plus.length; j++)
            {
              console.log( parse_plus[j] );
              data.push( parse_plus[j] + " ");
            }
            data.push( "\n" );
          }
          else if( parse_and[i].substring( 0, 11) == "checkbox=on" )
          {
            found_checked = true;
          }
          else
          {
            console.log( parse_eq[0] + ": " + parse_eq[1]);
            data.push( parse_eq[0] + ": " + parse_eq[1] + "\n" );

          }

        }
        if( found_checked )
        {
          console.log("Checkbox: checked");
          data.push( "Checkbox: checked" + "\n" );
        }
        else
        {
          console.log("Checkbox: unchecked");
          data.push( "Checkbox: unchecked" + "\n" );
        }
        //console.log(parse_and.toString());
        //console.log(parse_plus.toString());

    }

    res.writeHead( 200 );
    var h = "<!DOCTYPE html>"+
        "<html>"+
        "<body>"+
        "<form action='submit_the_form' method='get'>"+
        "<input name='textbox' type='text' value='write something'>"+
        "<input type='submit'>"+
        "<input id='checked' name='checkbox' type='checkbox' checked='Yes'>"+
        "<input name='reset' type='reset' value='reset'>"+
        "</form>"+
        "</body>"+
        "</html>";
    res.end( h );

    for( var i = 0; i < data.length; i++)
    {
      fs.appendFile('data.txt', data[i], function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }
}





var server = http.createServer( serverFn );

server.listen( 8080 );
