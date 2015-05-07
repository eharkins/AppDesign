function onLoad()
{
  var rows_req = new XMLHttpRequest();
  rows_req.onload = valueReturned;
  rows_req.open( "get", "get_rows" );
  rows_req.send();
  pollValue();
}

function valueReturned()
{
    console.log( "return" + this.responseText );

    var table_elem = document.getElementById( "link_table" );
    var td_elem_link = document.createElement( "td" );
    var td_elem_nick = document.createElement( "td" );
    var td_elem_del = document.createElement( "td" );
    var del_button = document.createElement( "input" );
    del_button.type = "button";
    del_button.onclick = delLink();
    var parse_colon = this.responseText.split( ":")
    td_elem_link.innerHTML = parse_colon[1];
    td_elem_nick.innerHTML = parse_colon[3];
    var row_elem = document.createElement( "tr" );
    row_elem.appendChild( td_elem_link );
    row_elem.appendChild( td_elem_nick );
    //row_elem.appendChild( td_elem_del );
    table_elem.appendChild( row_elem );

}

function fillTable()
{
  var rows = JSON.parse( this.responseText );
  for( var i = 0; i < rows.length; i++)
  {
    var row_elem = document.createElement( "tr" );
    row_elem.innerHTML = rows[i];
  }
}

function pollValue()
{
    var value_req = new XMLHttpRequest();
    //value_req.onload = valueReturned;
    value_req.open( "get", "get_value" );
    value_req.send();
}

function addLink()
{
  var link = document.getElementById( "new_link" );
  var nickname = document.getElementById( "nickname" );
  var add_req = new XMLHttpRequest();
  add_req.onload = valueReturned;
  console.log(link.value + nickname.value);
  add_req.open( "get", "add_link?" + link.value + "/" +  nickname.value );
  add_req.send();
}

/*function delLink()
{
  var del_req = new XMLHttpRequest();
  del_req.onload = valueReturned;
  del_req.open( "get", "del_link?" );
  del_req.send();
}*/
