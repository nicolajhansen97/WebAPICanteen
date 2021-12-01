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

async function GetBreakFastItems(tableName) {

    const data = await getTable(tableName)

    document.getElementById('ITEMS').innerHTML = `
        <h1 class="B-Title">BreakFast Items</h1><br></br>
        <p>${data.map(function (food) {
            if (food.fldCategoryTypeId === 2) return
            var item = JSON.stringify(food)
            return `
                <div class = 'itemDesign'>
                ${addJsonBreakfast(food)}
                <button onclick='addToBasket(${item})'>Add to basket</button>
                </div>
            `
        }).join('')}</p><br></br>
    `
    //console.log(data[0])
}
let array = [[], []]
//let array2 = []

function addToBasket(Item) {

    var isItem = true
    var i = 0

    array[0].forEach(ArrayItem => {
        if (Item.fldItemInfoId === ArrayItem.fldItemInfoId) {

            isItem = false
            //array2[i]++    
            array[1][i]++
        }
        i++
    })
    if (isItem) {
        array[0].push(Item)
        array[1].push(1)
        //array2.push(1)
    }
    console.log(JSON.stringify(array[0]) + " " + array[1])

    sessionStorage.myobject = JSON.stringify(array)
}

function addJsonBreakfast(food) {
    return `
        <p>${food.fldItemname}</p>
        <img class='imagesizing' src="IMG/${food.fldImage}" alt="FOOD PIC">
        <p>${food.fldItemDescription}</p><br>
        <p class="cart-price">${food.fldPrice} kr</p> `
}

let total = 0
let i


async function makeShoppingCart(data) {
    i = 0
    console.log(1)
    document.getElementById('shopCartItems').innerHTML = await `
        <h1 class="B-Title">Shopping Cart Items</h1><br></br>
        ${data[0].map(function (food) {
            i++
            total = total + food.fldPrice * data[1][i - 1]
            return `
                <div class="itemDesign">
                ${addJsonBreakfast(food)}
                <input class="Cart-Input" type="number" value="${data[1][i - 1]}"></input>
                </div>
            `
        }).join('')}<br></br>
        <h2 class="cart-TOTAL">Total: ${total} kr</h2>
    `
    console.log(2)
    var inputs = document.getElementsByClassName('Cart-Input')
    for (var i = 0; i < inputs.length; i++) {
        console.log("3")
        var input = inputs[i]
        input.addEventListener('change', quantityChanged)
    }
}

function quantityChanged(event) {
    console.log("4")
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateTotal()
}

async function updateTotal() {
    console.log("5")
    var mainDiv = await document.getElementById('shopCartItems')
    var secondDivs = mainDiv.getElementsByClassName('itemDesign')
    var total = 0
    for (var i = 0; i < secondDivs.length; i++) {
        var div = secondDivs[i]
        var priceElement = div.getElementsByClassName('cart-price')[0]
        var quantityElement = div.getElementsByClassName('Cart-Input')[0]
        var price = parseFloat(priceElement.innerText.replace(' kr', ''))
        var quantity = quantityElement.value
        total = total + (price*quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-TOTAL')[0].innerText = total + 'kr'
}