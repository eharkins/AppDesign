var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function addStudent( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    console.log( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var stud_input = form_inputs[0].split( "=" );
    var year_input = form_inputs[1].split( "=" );
    // stud_input[0] == "student"
    // year_input[0] == "year"
    var student = decodeURIComponent( ( stud_input[1] + '' ).replace( /\+/g, '%20' ) );
    var year = year_input[1];
    var sql_cmd = "INSERT INTO STUDENTS ('NAME', 'YEAR') VALUES ('" + student + "', '" + year + "') ";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added!!!</body></html>" );
}

function formInputParser( url )
{
    inputs = {}
    var form_text = url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        inputs[ inp[0] ] = inp[1];
    }
    console.log( inputs );
    return inputs;
}

function addEnrollment( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    console.log( req.url );
    formInputParser( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var stud = null, clas = null;
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        if( inp[0] == 'student' ) {
            stud = inp[1];
        }
        else if( inp[0] == 'class' ) {
            clas = inp[1];
        }
    }
    if( stud == null || clas == null )
    {
        res.writeHead( 200 );
        res.end( "GO BACK AND ENTER VALID A CLASS ID AND STUDENT ID" );
        return;
    }
    else if( isNaN(stud) || isNaN(clas) )
    {
      res.writeHead( 200 );
      res.end( "GO BACK AND ENTER A VALID CLASS ID AND STUDENT ID" );
      return;
    }
    var stud_exists = false;
    db.all( "SELECT COUNT(NAME) FROM STUDENTS WHERE ID = " + stud,
        function( err, rows ) {
            console.log(rows[0]['COUNT(NAME)']);
            stud_exists = rows[0]['COUNT(NAME)'] == 1;
        });
    console.log(stud_exists);

    //I couldn't get this to work because of a timing issue
    //I made that guess based on the sequence of logs that I added
    /*if( !stud_exists )
    {
      console.log("doesn't exist");
      res.writeHead( 200 );
      res.end( "GO BACK AND ENTER A VALID CLASS ID AND STUDENT ID" );
      return;
    }*/
    var sql_cmd = "INSERT INTO ENROLLMENTS ('CLASSID', 'STUDENTID') VALUES ('"+
                  stud + "', '" + clas + "')";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added!!!</body></html>" );
}


function listStudents( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>"  +
	"<body>"  +
  "<table>" +
  "<tbody>"  +
  "<tr><td>Student</td><td>Year</td></tr>";
    db.each( "SELECT * FROM STUDENTS", function( err, row ) {
        console.log( "student "+ row.Name + row.Year  );
        console.log( row );
	resp_text +=   "<tr><td>" + row.Name + "</td><td>" + row.Year + "</td></tr>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listTeachers( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>"  +
	"<body>"  +
  "<table>" +
  "<tbody>"  +
  "<tr><td>Teacher</td><td>Office</td></tr>";
    db.each( "SELECT * FROM TEACHERS", function( err, row ) {
        console.log( "student "+ row.Name + row.Office  );
        console.log( row );
	resp_text +=   "<tr><td>" + row.Name + "</td><td>" + row.Office + "</td></tr>";
    });
    db.close(
	   function() {
	       console.log( "Complete! " + resp_text );
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listClasses( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>"  +
	"<body>"  +
  "<table>" +
  "<tbody>"  +
  "<tr><td>Class</td><td>Department</td></tr>";
    db.each( "SELECT * FROM CLASSES", function( err, row ) {
        console.log( "student "+ row.Name + row.Department  );
        console.log( row );
	resp_text +=   "<tr><td>" + row.Name + "</td><td>" + row.Department + "</td></tr>";
    });
    db.close(
	   function() {
	       console.log( "Complete! " + resp_text );
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listEnrollments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>"  +
	"<body>"  +
  "<table>" +
  "<tbody>"  +
  "<tr><td>Class</td><td>Student</td></tr>";
    db.each( "SELECT STUDENTS.NAME as sname, * FROM ENROLLMENTS "+
             "JOIN STUDENTS ON STUDENTS.ID = ENROLLMENTS.STUDENTID "+
             "JOIN CLASSES ON CLASSES.ID = ENROLLMENTS.CLASSID",
             function( err, row ) {
        console.log( err );
        console.log( "student "+ row.Name + row.sname  );
	resp_text +=   "<tr><td>" + row.Name + "</td><td>" + row.sname + "</td></tr>";
    });
    db.close(
	   function() {
	       console.log( "Complete! " + resp_text );
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listTeachingAssignments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>"  +
	"<body>"  +
  "<table>" +
  "<tbody>"  +
  "<tr><td>Class</td><td>Teacher</td></tr>";
    db.each( "SELECT TEACHERS.NAME as tname, * FROM TEACHINGASSIGNMENTS "+
             "JOIN TEACHERS ON TEACHERS.ID = TEACHINGASSIGNMENTS.TEACHERID "+
             "JOIN CLASSES ON CLASSES.ID = TEACHINGASSIGNMENTS.CLASSID",
             function( err, row ) {
        console.log( "teacher "+ row.Name + row.tname  );
        console.log( row );
	resp_text +=   "<tr><td>" + row.Name + "</td><td>" + row.tname + "</td></tr>";
    });
    db.close(
	   function() {
	       console.log( "Complete! " + resp_text );
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}


function serveFile( filename, req, res )
{
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    console.log( filename + ' ' + filename.length );
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename == "favicon.ico" )
    {
        filename = "./index.html";
    }
    if( filename.substring( 0, 13 ) == "list_students" )
    {
        listStudents( req, res );
    }
    else if( filename.substring( 0, 15 ) == "list_teachers" )
    {
        listTeachers( req, res );
    }
    else if( filename.substring( 0, 12 ) == "list_classes" )
    {
        listClasses( req, res );
    }
    else if( filename.substring( 0, 16 ) == "list_enrollments" )
    {
        listEnrollments( req, res );
    }
    else if( filename.substring( 0, 24 ) == "list_teachingassignments" )
    {
        listTeachingAssignments( req, res );
    }
    else if( filename.substring( 0, 11 ) == "add_student" )
    {
        addStudent( req, res );
    }
    else if( filename.substring( 0, 14 ) == "add_enrollment" )
    {
        addEnrollment( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
