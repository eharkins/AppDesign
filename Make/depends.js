/* Run jshint clean!!! */

var fs = require( "fs" );

/* What if the user doesn't type the right number of arguments? */

var args = process.argv;

if( args.length > 3 )
{
  console.log("Type a target after the filename");
}

/* What if the file doesn't exist? */
var lines = fs.readFileSync( args[2] ).toString().split( "\n" );

var targets = {};

for( var i = 0; i < lines.length; i++ )
{
    var target = {};
    var line = lines[ i ];
    console.log( line );
    /* What about format errors in the input file? */
    /* Consider using regexes instead of split */
    /* line.match( ??? ) */
    var regex = /^\s*(\w+)\s*\:((?:\w+)?(?:\s+\w+)*)\s*$/;
    var colon = line.match( regex );
    var regex_blank = /^\s*$/;
    console.log( colon );
    if( colon == null )
    {
      var blank = line.match( regex_blank );
      if( blank == null )
      {
        console.log("cannot read line");
        //process.exit(1);
        continue;
      }
      else
      {
        continue;
      }
    }
    //var colon = line.split( ":" );
    target.name = colon[ 1 ];
    var regex_dep = /\s*(\w+)\s*/g;
    var matches;
    console.log( colon[2] );
    target.depend_names = [];
    while( (matches = regex_dep.exec( colon[ 2 ])) != null )
    {
      console.log( matches );
      target.depend_names.push( matches[1] );
    }
    /* What if there's no target for a dependency? */
    target.visited = false;
    targets[ target.name ] = target;
}

console.log( targets );

function trace_dependencies( prev, target )
{
  console.log( prev );
  console.log( target );

    /* what if prev and target are not the right kind of thing? */
    if( ( typeof prev ) != "string" )
    {
        /* ... */
    }
    if( "visited" in target )
    {
        /* ... */
    }
    /* ... */

    if( target.visited )
    {
        // console.log( "Already visited "+target.name );
        return;
    }
    /* "else" */

    target.visited = true;
    console.log( "> " + prev + " depends on " + target.name );
    for( var i = 0; i < target.depend_names.length; i++ )
    {
        var dep_name = target.depend_names[ i ];
        if( !( dep_name in targets ) )
            continue;
        var dep = targets[ dep_name ];
        // if( date( dep ) older than date( target ) )
        //    continue;
        trace_dependencies( target.name, dep );
        // trace_dependencies( {l:12, m:34}, "hello" );
    }
}

/* What if the target given at the command line doesn't exist? */
trace_dependencies( "[ Start ]", targets[ args[3] ] );
