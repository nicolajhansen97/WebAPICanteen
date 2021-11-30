function idleLogout() {
    var timer;
    window.onload = resetTimer; //When window is loaded
    window.onmousemove = resetTimer; //When mouse is moved
    window.onmousedown = resetTimer;  //When mouse is pressed
    window.ontouchstart = resetTimer; //Touch for touchscreens
    window.onclick = resetTimer;      // catches touchpad clicks as well



    function resetToIndexFunction() {
      window.location.href = 'index.html';
    }

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(resetToIndexFunction, 20000);  // time is in milliseconds
    }
}


function getTable(tableName) {
   

    var host = 'https://localhost:5001/api/'
    host = host + tableName;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: host
    }).then(function (data) {
        alert(JSON.stringify(data))
    })
}


