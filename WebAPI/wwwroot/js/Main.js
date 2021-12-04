const APIurl = 'https://localhost:5001/api/'


//@author: Rasmus
class ItemType {
    static BreakFast = new ItemType(1)
    static Other = new ItemType(2)

    constructor(type) {
        this.type = type
    }
}

//@author: Rasmus
function loadPurchaseBTN() {
    document.getElementById('cart-purchase').addEventListener('click',
        purchaseClicked)
}

//@auther: Nicolaj
function idleLogout() {
    var timer;
    window.onload = resetTimer; //When window is loaded
    window.onmousemove = resetTimer; //When mouse is moved
    window.onmousedown = resetTimer;  //When mouse is pressed
    window.ontouchstart = resetTimer; //Touch for touchscreens
    window.onclick = resetTimer;      // catches touchpad clicks as well

    //@auther: Nicolaj
    function resetToIndexFunction() {
        window.location.href = 'index.html';
        sessionStorage.clear()
    }
    //@auther: Nicolaj
    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(resetToIndexFunction, 20000);  // time is in milliseconds
    }
}

//@auther: Niels and Rasmus
function Logout() {
    location.href = 'index.html';
    sessionStorage.clear()
}

//@auther: Niels and Rasmus
async function getTable(tableName) {
    var host = APIurl
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

//@auther: Niels and Rasmus
async function GetFoodItems(tableName,type) {

    const data = await getTable(tableName)

    document.getElementById('ITEMS').innerHTML = `
        ${data.map(function (food) {
            if (food.fldCategoryTypeId !== type.type) return
            var item = JSON.stringify(food)
            return `
                <div class = 'itemDesign'>
                ${addJsonBreakfast(food)}
                <button onclick='addToBasket(${item})'>Add to basket</button>
                </div>
            `
        }).join('')}
    `
}



//@auther: Niels and Rasmus
function addToBasket(Item) {

    var isItem = true
    var i = 0

    var array = sessionStorage.getItem('items');
    if (!array) { // check if an item is already registered
        array = [[], []]; // if not, we initiate an empty array
    } else {
        array = JSON.parse(array); // else parse whatever is in
    }

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
    //console.log(JSON.stringify(array[0]) + " " + array[1])

    // Store
    sessionStorage.setItem("items", JSON.stringify(array));
}

//@auther: Niels and Rasmus
function addJsonBreakfast(food) {
    return `
        <p class="foodTitle">${food.fldItemname}</p>
        <img class='imagesizing' src="IMG/${food.fldImage}" alt="FOOD PIC">
        <p>${food.fldItemDescription}</p><br>
        <p class="item-price">${food.fldPrice} kr</p> `
}

//@auther: Rasmus
function addOrder(food) {
    return `
        <img class='cart-imagesizing' width="100" src="IMG/${food.fldImage}" alt="FOOD PIC">
        <p class="cart-foodTitle">${food.fldItemname}</p>
        <p class="cart-desc">${food.fldItemDescription}</p><br>
        <p class="cart-price">${food.fldPrice} kr</p> `
}

let total = 0

//@auther: Niels and Rasmus
async function makeShoppingCart(data) {
    var i = 0
    if (data === null) return
    document.getElementById('shopCartItems').innerHTML = await `
        ${data[0].map(function (food) {
            i++
            //total = total + food.fldPrice * data[1][i - 1]
            return `
                    <div class="cart-item-design">
                        ${addOrder(food)}
                        <input class="Cart-Input" type="number" value="${data[1][i - 1]}"></input>
                        <button class="btnRemove" >Delete item</button>
                    </div>
            `
        }).join('')}
    `
    var inputs = document.getElementsByClassName('Cart-Input')
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var deleteBtn = document.getElementsByClassName('btnRemove')
    for (var i = 0; i < deleteBtn.length; i++) {
        var btn = deleteBtn[i]
        btn.addEventListener('click', itemDeleted)
    }
    updateTotal()
}

//@auther: Niels and Rasmus
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    //update session
    var tempStorage = JSON.parse(sessionStorage.getItem("items"))
    for (var i = 0; i < tempStorage[0].length; i++) {
        if (tempStorage[0][i].fldItemname === input.parentElement.getElementsByClassName('cart-foodTitle')[0].innerText) {
            tempStorage[1][i] = input.value
        }
    }
    sessionStorage.setItem("items", JSON.stringify(tempStorage));
    updateTotal()
}

//@auther: Niels and Rasmus
function itemDeleted(event) {
    var input = event.target
    //session
    var tempStorage = JSON.parse(sessionStorage.getItem("items"))
    for (var i = 0; i < tempStorage[0].length; i++) {
        if (tempStorage[0][i].fldItemname === input.parentElement.getElementsByClassName('cart-foodTitle')[0].innerText) {
            tempStorage[0].splice(i, 1)
            tempStorage[1].splice(i, 1)
        }
    }
    sessionStorage.setItem("items", JSON.stringify(tempStorage));
    //delete from html
    input.parentElement.remove()
    updateTotal()
}

//@auther: Niels and Rasmus
async function updateTotal() {
    var mainDiv = await document.getElementById('shopCartItems')
    var secondDivs = mainDiv.getElementsByClassName('cart-item-design')
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
    document.getElementsByClassName('cart-TOTAL')[0].innerText ='Total: ' + total + ' kr'
}

//@author: Rasmus
function purchaseClicked() {
    var cartItems = document.getElementById('shopCartItems')
    if (!cartItems.hasChildNodes()) {
        alert('No items in cart')
        return
    }
    alert('Thank you for your purchase')

    //get array of orders
    var array = JSON.parse(sessionStorage.getItem("items"))
    //loop post them
    for (var i = 0; i < array[0].length; i++) {
        for (var j = 0; j < array[1][i]; j++) {
            console.log(array[0][i])
            //post command to API WIP:NEED TO ADD JSONDATA
            //postCartOrder("TblOrderLines", array[0][i])
        }
    }

    //delete items in cart
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateTotal()
    //clear sessionStorage
    sessionStorage.clear()
    //Logout()
}


async function postCartOrder(tableName, JsonData) {
    var host = APIurl
    host = host + tableName;

    var response = await fetch(host, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(JsonData)
    })
    console.log(response.json())
}
