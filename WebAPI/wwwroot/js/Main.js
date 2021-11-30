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
        <h1 class="B-Title">BreakFast Items</h1><br></br>
        <p>${data.map(function (food) {
            var item = JSON.stringify(food)
            return `
                <div class = 'itemDesign'>
                <p>${food.fldItemname}</p>
                <img class='imagesizing' src="IMG/${food.fldImage}" alt="FOOD PIC">
                <p>${food.fldItemDescription}</p><br>
                <p>${food.fldPrice} kr</p>
                <button onclick='addToBasket(${item})'>Add to basket</button>
                </div>
            `
        }).join('')}</p><br></br>
    `
    //console.log(data[0])
}
let array = []

function addToBasket(Item) {
    array.push(Item)
    console.log(array)
    sessionStorage.myobject = JSON.stringify(array)
}

function test2() {
    localStorage.setItem('key', array)
}


