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


async function getTable(tableName) {
   var host = 'https://localhost:5001/api/'
    host = host + tableName;
    const data =  await $.ajax({
        type: "GET",
        dataType: "json",
        url: host
    }).then(function (data) {
        return data
    })

    return data
}

async function test(tableName) {

    const data = await getTable(tableName)

    document.getElementById('ITEMS').innerHTML = `
        <h1 class="B-Title">BreakFast Items</h1>
        <p>${data.map(function (food) {
            return `
                <p>${food.fldItemname}</p>
                <img src="${getImageUrl(food.fldImage)}" alt="FOOD PIC">
                <p>${food.fldItemDescription}</p><br>
                <p>${food.fldPrice} kr</p>
                <button>add to cart</button>
            `

        }).join('')}</p>
    `
    console.log(data)
}

function getImageUrl(picName) {
    //alert(picName)
    return ""
}




