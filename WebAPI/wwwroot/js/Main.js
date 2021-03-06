const APIurl = 'https://localhost:5001/api/'


//@author: Rasmus
//our Enum in javascript, its not as well made as in
//c# or java, but its kind of works, though Stackoverflow
//recommends that you also use something called freeze, but
//we just needed a very simple enum, so we dident.
//it just makes 2 objects with their number and has a 
//constructor that gives it a type. 
class ItemType {
    static BreakFast = new ItemType(1)
    static Other = new ItemType(2)

    constructor(type) {
        this.type = type
    }
}

//@author: Rasmus
function loadEmployeeName() {
    var em = getEmployee()
    document.getElementById('Employee').innerText = em.fldName
}

//@author: Rasmus
function getEmployee() {
    return JSON.parse(sessionStorage.getItem('EmployeeKey'))
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
        timer = setTimeout(resetToIndexFunction, 200000);  // time is in milliseconds
    }
}

/*@auther: Niels and Rasmus
 * Logs out the account and clears sessionstorage
 */ 
function Logout() {
    location.href = 'index.html';
    sessionStorage.clear()
}

/*@auther: Niels and Rasmus
 * Here we get all food item values using ajax
 */ 
async function getTable(tableName) {
    var host = APIurl
    host = host + tableName;
    const data = await $.ajax({
        type: "GET",
        dataType: "json",
        url: host,
        headers: { 'ussr': 'user' }
    }).then(function (data) {
        return data
    })

    return data
}

//@auther: Niels and Rasmus
//This function is used to get fooditems from the database so breakfast and
//other, we ask for tablename so we can get the url, and the type which is
//an enum we use to see if it is an breakfast or other. after that we call
//getTable to get a json object with all the items. then we get the div element
//from the website where we want the add the items, we check what type it is.
//then return a Full div element with a loop, but instead of a normal loop we use
//a function called map. that does that for us. in the div we make we call on the
//addjsonBreakfast method which is also a mehtod for creating a div.
async function GetFoodItems(tableName, type) {

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



/*@auther: Niels and Rasmus
 * The basket is an 2d array, containing item[0] and amount[1]. Before an item is pushed onto the array it is first checked if it is
 * there, if it is there the amount increases instead of a new item being added there. If it isnt there a new item with an amount of
 * 1 is added.
 */
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
            array[1][i]++
        }
        i++
    })
    if (isItem) {
        array[0].push(Item)
        array[1].push(1)
    }
    // Store
    sessionStorage.setItem("items", JSON.stringify(array));
}

//@auther: Niels and Rasmus
//Our function for making the div that holds the breakfast/other item. it
//just gets the picture name, name of item, description of item and the price. 
//and puts that in a div, and returns it.
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

/*@auther: Niels and Rasmus
 * After the JSON file has ben obtained we split up the data and place it in individual HTML objects.
 */ 
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

/*@auther: Niels and Rasmus
 * Changes the quatity based on and event value that is changed by pressing up or down buttons. If the value goes to below 0 it will 
 * be set to 1 as you can not have 0 or under quantity
 */ 
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

/*@auther: Niels and Rasmus
 * By selecting an item it goes through a loop of stored items to remove it from the list and from the html
 */ 
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

/*@auther: Niels and Rasmus
 * This calcultes the total price base on the price elements in our HTML
 */
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
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-TOTAL')[0].innerText = 'Total: ' + total + ' kr'
}

//@author: Rasmus
/* This is our function for purchasing the items in your cart
    We first get the element that holds all the items in the cart
    then we check if it is empty, wich alerts the user that he cant 
    purhcase anything since there is nothing in the cart, and returns out
    the vi get the employee, alerts the user that he has purchased the items.
    make a new date object so we can get the date he purchased. 
    then we make a json order and post it to the database
    after that we get the all the items in a array with the sessionstorage
    we loop through them and make a post on each item, and their count.
    after that we go trough the ui and remove the ui for the items, we update the 
    total, and make the user logout.*/
async function purchaseClicked() {
    var cartItems = document.getElementById('shopCartItems')
    if (!cartItems.hasChildNodes()) {
        alert('No items in cart')
        return
    }
    var em = getEmployee()
    alert('Thank you for your purchase ' + em.fldName)

    //order
    var date = new Date()
    //console.log(d.toLocaleDateString() + "T" + d.toLocaleTimeString())

    var makeorder = {
        fldEmployeeId: em.fldEmployeeId,
        fldTimeStamp: formatDate(date)
    }

    await PostFunction('TblOrders', makeorder)

    //get array of orders
    var CartItemArray = JSON.parse(sessionStorage.getItem("items"))
    //loop post them
    for (var i = 0; i < CartItemArray[0].length; i++) {
        for (var j = 0; j < CartItemArray[1][i]; j++) {
            //console.log(array[0][i])
            //post command to API WIP:NEED TO ADD JSONDATA

            //make orderline
            var order = await getTable('TblOrders')

            var makeOrderLine = {
                fldOrderId: order[order.length - 1].fldOrderId,
                fldItemInfoId: CartItemArray[0][i].fldItemInfoId,
                fldPrice: CartItemArray[0][i].fldPrice
            }
            await PostFunction('TblOrderLines', makeOrderLine)
        }
    }
    //delete items in cart
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateTotal()
    //logout
    Logout()
}

//@author: Rasmus
//This is the function we use to post so we can add data to the Database
// we have 2 parameters a string(tableName) for wich table we want to post to so it would look like localhost:41421/api/tablename.
//the other paremeter is for the json data we want to post. in the funcition we make the url, then call fetch with post.
// we add the headers so the guard knows we are allowed to post, and it knows what content we are posting. then we console log 
//the response so if we get an error in the post we can see what went wrong.
async function PostFunction(tableName, JsonData) {
    var host = APIurl
    host = host + tableName;

    var response = await fetch(host, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'ussr': 'user'
        },
        body: JSON.stringify(JsonData)
    })
    console.log(response.json())
}

//@author: Nicolaj & Niels
//Our delete function
async function deleteLunchBooking(tableName, id) {
    var host = APIurl
    host = host + tableName;

    try {
        let response = await fetch(host + "/" + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'ussr': 'user'
            },
        });
    } catch (err) {
    }
}


let employees

//@author: Rasmus
//load input element in index. only activated in index.html with a onload
async function LoginScreenLoadElements() {
    var input = document.getElementById('Employee-password')
    input.focus()
    employees = await getTable('TblEmployees')
    input.addEventListener('keypress', login)
}

//@author: Rasmus
//gets input. then says in keypress enter
//get a jsonfile of all employees, then check if the
//input value is in the list of employees
//if it is go through a loop check which employee it is
//after it finds the person change page to frontpage and
//save the employeeID in sessionstorage.
async function login(event) {
    var input = event.target
    if (event.key === 'Enter') {
        //logic for checking if it is an employee
        if (employees.find(f => f.fldCardNumber === input.value)) {
            for (var i = 0; i < employees.length; i++) {
                if (input.value === employees[i].fldCardNumber) {
                    console.log(employees[i].fldName + " Logged In")
                    //go to frontpage
                    location.href = 'frontpage.html'
                    //save employee ID for use 
                    sessionStorage.setItem('EmployeeKey', JSON.stringify(employees[i]))
                }
            }
        } else {
            alert("Invalid Card")
        }
    }
}


//@Author: Guilherme Pressutto GithubLink:https://github.com/gpressutto5
function getSwipeButton() {
    var initialMouse = 0;
    var slideMovementTotal = 0;
    var mouseIsDown = false;
    var slider = $('#slider');

    slider.on('mousedown touchstart', function (event) {
        mouseIsDown = true;
        slideMovementTotal = $('#button-background').width() - $(this).width() + 10;
        initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    });

    $(document.body, '#slider').on('mouseup touchend', function (event) {
        if (!mouseIsDown)
            return;
        mouseIsDown = false;
        var currentMouse = event.clientX || event.changedTouches[0].pageX;
        var relativeMouse = currentMouse - initialMouse;

        if (relativeMouse < slideMovementTotal) {
            $('.slide-text').fadeTo(300, 1);
            slider.animate({
                left: "-10px"
            }, 300);
            return;
        }
        slider.addClass('unlocked');
        $('#locker').text('Purchased');
        purchaseClicked() // added by us.
        setTimeout(function () {
            slider.on('click tap', function (event) {
                if (!slider.hasClass('unlocked'))
                    return;
                slider.removeClass('unlocked');
                $('#locker').text('');
                slider.off('click tap');
            });
        }, 0);
    });

    $(document.body).on('mousemove touchmove', function (event) {
        if (!mouseIsDown)
            return;

        var currentMouse = event.clientX || event.originalEvent.touches[0].pageX;
        var relativeMouse = currentMouse - initialMouse;
        var slidePercent = 1 - (relativeMouse / slideMovementTotal);

        $('.slide-text').fadeTo(0, slidePercent);

        if (relativeMouse <= 0) {
            slider.css({ 'left': '-10px' });
            return;
        }
        if (relativeMouse >= slideMovementTotal + 10) {
            slider.css({ 'left': slideMovementTotal + 'px' });
            return;
        }
        slider.css({ 'left': relativeMouse - 10 });
    });
}


//DATE TEST
//NOT MADE BY US
function dateComponentPad(value) {
    var format = String(value);

    return format.length < 2 ? '0' + format : format;
}
//NOT MADE BY US
function formatDate(date) {
    var datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(dateComponentPad);
    var timePart = [date.getHours(), date.getMinutes(), date.getSeconds()].map(dateComponentPad);

    return datePart.join('-') + ' ' + timePart.join(':');
}



/*
 * @author Nicolaj & Niels
 * This get the lunches from the database
 */

async function getLunchItems(tableName) {

    const dates = calculateWeekDays();
    const data = await getTable(tableName)

    document.getElementById("monday").innerHTML =
        `
        ${data.map(function (lunch) {
            if (!lunch.fldDate.includes(dates[0])) return
            var lunchItem = JSON.stringify(lunch)
            return `
                ${addJsonLunch(lunch)}
                <div class="checkBox">
                <label class="switch">
                    <input type="checkbox" id="mondayCb">
                    <span class="slider round"></span>
                </label>
                </div>
            `
        }).join('')}
    `

    document.getElementById("tuesday").innerHTML =

        `
        ${data.map(function (lunch) {
            if (!lunch.fldDate.includes(dates[1])) return
            var lunchItem = JSON.stringify(lunch)
            return `
                ${addJsonLunch(lunch)}
           
                <div class="checkBox">
                <label class="switch">
                    <input type="checkbox" id="tuesdayCb">
                    <span class="slider round"></span>
                </label>
                </div>
            `
        }).join('')}
    `
    document.getElementById("wednesday").innerHTML =

        `
        ${data.map(function (lunch) {
            if (!lunch.fldDate.includes(dates[2])) return
            var lunchItem = JSON.stringify(lunch)
            return `
                ${addJsonLunch(lunch)}
                <div class="checkBox">
                <label class="switch">
                    <input type="checkbox" id="wednesdayCb">
                    <span class="slider round"></span>
                </label>
                </div>
            `
        }).join('')}
    `
    document.getElementById("thursday").innerHTML =

        `
        ${data.map(function (lunch) {
            if (!lunch.fldDate.includes(dates[3])) return
            var lunchItem = JSON.stringify(lunch)
            return `
                ${addJsonLunch(lunch)}
                <div class="checkBox">
                <label class="switch">
                    <input type="checkbox" id="thursdayCb">
                    <span class="slider round"></span>
                </label>
                </div>
            `
        }).join('')}
    `
    document.getElementById("friday").innerHTML =

        `
        ${data.map(function (lunch) {
            if (!lunch.fldDate.includes(dates[4])) return
            var lunchItem = JSON.stringify(lunch)
            return `
                ${addJsonLunch(lunch)}
                <div class="checkBox">
                <label class="switch">
                    <input type="checkbox" id="fridayCb">
                    <span class="slider round"></span>
                </label>
                </div>
            `
        }).join('')}
    `

    updateSwitches()
}

/*
 * @author Nicolaj & Niels
 * Updates the switches for when you enter lunch order page
 */
async function updateSwitches() {
    var dupeDays = await isLunchBooked();
    document.getElementById("mondayCb").checked = dupeDays[0];
    document.getElementById("tuesdayCb").checked = dupeDays[1];
    document.getElementById("wednesdayCb").checked = dupeDays[2];
    document.getElementById("thursdayCb").checked = dupeDays[3];
    document.getElementById("fridayCb").checked = dupeDays[4];
}


/*
 * @author Nicolaj & Niels
 * Creates the box with lunches from DB
 */
function addJsonLunch(lunch) {


    return `
        <p class="dateName">Date:</p>
        <p class="theDate">${lunch.fldDate.replace("T00:00:00", "")}</p>
        <p class="menu">Menu:</p>
        <p class="menuName">${lunch.fldMenu}</p>
        <div class="description-div">
        <p class="description">Description:</p>
        <p class="menuDescription">${lunch.fldMenuDescription}</p>
        </div>
        `
}


/*
 * @author Nicolaj & Niels
 * This checks if the day has been booked, and is used to set the days as books before you enter the lunch page. It also helps 
 * when adding or removing orders, to see if it is already there.
 */
async function isLunchBooked() {
    var employeeID = (getEmployee().fldEmployeeId);
    var daysList = calculateWeekDays();
    var dupeDays = [false, false, false, false, false]

    const data = await getTable('TblLunchBookings');
    for (var i = 0; i < data.length; i++) {

        for (var j = 0; j < daysList.length; j++) {
            if (data[i].fldDate.includes(daysList[j]) && data[i].fldEmployeeId === employeeID) {
                dupeDays[j] = true
            }
        }
    }
    return dupeDays
}


/*
 * @author Nicolaj & Niels
 * This function adds or removes lunch orders depending on switches being on or off, it also checks if the days are already there
 * so that when adding an order it will not do it twice
 */
async function addRemoveLunch() {

    var employeeID = (getEmployee().fldEmployeeId);
    var daysList = calculateWeekDays();
    var dupeDays = await isLunchBooked();
    var DeleteDayIDs = [0, 0, 0, 0, 0]
    var boolError = false;

    var date = new Date

    const data = await getTable('TblLunchBookings');


    for (var i = 0; i < data.length; i++) {

        for (var j = 0; j < DeleteDayIDs.length; j++) {
            if (data[i].fldDate.includes(daysList[j]) && data[i].fldEmployeeId === employeeID) {
                DeleteDayIDs[j] = data[i].fldLunchBookingId
            }
        }
    }

    //**MONDAY**
    if (document.querySelector('#mondayCb:checked') !== null && !dupeDays[0] && date.getDay() === 1) {

        //alert("Monday Create new entry")
        var makeLunchBooking = {
            fldEmployeeId: employeeID,
            fldDate: daysList[0]
        }

        await PostFunction('TblLunchBookings', makeLunchBooking)
    } else if (document.querySelector('#mondayCb:checked') === null && dupeDays[0] && date.getDay() === 1) {
        //alert("Monday Item deleted")
        deleteLunchBooking('TblLunchBookings', DeleteDayIDs[0])
    } else if (date.getDay() !== 1) {
        updateSwitches()
        boolError = true;
    }

    //**TUESDAY**
    if (document.querySelector('#tuesdayCb:checked') !== null && !dupeDays[1] && date.getDay() < 2 && date.getDay() > 0) {

        var makeLunchBooking = {
            fldEmployeeId: employeeID,
            fldDate: daysList[1]
        }

        await PostFunction('TblLunchBookings', makeLunchBooking)
    } else if (document.querySelector('#tuesdayCb:checked') === null && dupeDays[1] && date.getDay() < 2 && date.getDay() > 0) {
        deleteLunchBooking('TblLunchBookings', DeleteDayIDs[1])
    } else if (!(date.getDay() < 2 && date.getDay() > 0)) {
        updateSwitches()
        boolError = true;
    }


    //**WEDNESDAY**
    if (document.querySelector('#wednesdayCb:checked') !== null && !dupeDays[2] && date.getDay() < 3 && date.getDay() > 0) {

        var makeLunchBooking = {
            fldEmployeeId: employeeID,
            fldDate: daysList[2]
        }

        await PostFunction('TblLunchBookings', makeLunchBooking)
    } else if (document.querySelector('#wednesdayCb:checked') === null && dupeDays[2] && date.getDay() < 3 && date.getDay() > 0) {
        deleteLunchBooking('TblLunchBookings', DeleteDayIDs[2])
    } else if (!(date.getDay() < 3 && date.getDay() > 0)) {
        updateSwitches()
        boolError = true;
    }


    //**THURSDAY**
    if (document.querySelector('#thursdayCb:checked') !== null && !dupeDays[3] && date.getDay() < 4 && date.getDay() > 0) {

        var makeLunchBooking = {
            fldEmployeeId: employeeID,
            fldDate: daysList[3]
        }

        await PostFunction('TblLunchBookings', makeLunchBooking)
    } else if (document.querySelector('#thursdayCb:checked') === null && dupeDays[3] && date.getDay() < 4 && date.getDay() > 0) {
        deleteLunchBooking('TblLunchBookings', DeleteDayIDs[3])
    } else if (!(date.getDay() < 4 && date.getDay() > 0)) {
        updateSwitches()
        boolError = true;
    }


    //**FRIDAY**
    if (document.querySelector('#fridayCb:checked') !== null && !dupeDays[4] && date.getDay() < 5 && date.getDay() > 0) {

        var makeLunchBooking = {
            fldEmployeeId: employeeID,
            fldDate: daysList[4]
        }

        await PostFunction('TblLunchBookings', makeLunchBooking)
    } else if (document.querySelector('#fridayCb:checked') === null && dupeDays[4] && date.getDay() < 5 && date.getDay() > 0) {
        deleteLunchBooking('TblLunchBookings', DeleteDayIDs[4])
    } else if (!(date.getDay() < 5 && date.getDay() > 0)) {
        updateSwitches()
        boolError = true;
    }

    if (boolError) {
        alert("Cannot change orders from prior days!")
    }
    else {
        alert("Your changes to your lunchplan have been saved!");
    }
}

/*
 * @Stackoverflow
 * Fuction take a day and create a new day according to the day you add. 
 */
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

/* 
 * @author Nicolaj & Niels
 * A method which check what kind of day the current day is.
 */
function getWhichKindOfDay() {

    var whichDayIsIt = "";
    var dateToday = new Date();

    switch (dateToday.getDay()) {
        case 0: whichDayIsIt = "Sunday"; return whichDayIsIt;
        case 1: whichDayIsIt = "Monday"; return whichDayIsIt;
        case 2: whichDayIsIt = "Tuesday"; return whichDayIsIt;
        case 3: whichDayIsIt = "Wednesday"; return whichDayIsIt;
        case 4: whichDayIsIt = "Thursday"; return whichDayIsIt;
        case 5: whichDayIsIt = "Friday"; return whichDayIsIt;
        case 6: whichDayIsIt = "Saturday"; return whichDayIsIt;
        default: whichDayIsIt = "No day found!"; return whichDayIsIt;
    }
}

/*
 * @author Niels and Nicolaj
 * This method returns a week date based on the current day
 */
function calculateMonday() {

    var mondayDate;

    var weekDay = getWhichKindOfDay();
    var date = new Date();

    if (weekDay === "Monday") {
        mondayDate = date;
        return mondayDate;
    }
    else if (weekDay === "Tuesday") {
        mondayDate = (date.addDays(-1));
        return mondayDate;
    }
    else if (weekDay === "Wednesday") {

        mondayDate = (date.addDays(-2));
        return mondayDate;
    }
    else if (weekDay === "Thursday") {

        mondayDate = (date.addDays(-3));
        return mondayDate;
    }
    else if (weekDay === "Friday") {

        mondayDate = (date.addDays(-4));
        return mondayDate;
    }
    else if (weekDay === "Saturday") {

        mondayDate = (date.addDays(-5));
        return mondayDate;
    }
    else if (weekDay === "Sunday") {

        mondayDate = (date.addDays(1));
        return mondayDate;
    }
}


/*
 * @author Niels and Nicolaj
 * This method returns a list of days that are formatted to fit the dates of the database
 */
function calculateWeekDays() {

    var mondayDate = calculateMonday();

    const days = [];
    days[0] = mondayDate;
    days[1] = mondayDate.addDays(1);
    days[2] = mondayDate.addDays(2);
    days[3] = mondayDate.addDays(3);
    days[4] = mondayDate.addDays(4);
    days[5] = mondayDate.addDays(5);
    days[6] = mondayDate.addDays(6);

    for (var i = 0; i < days.length; i++) {

        //Set here because you because it cant be set inside, as JS cant figure this out.
        var dateForDate = days[i].getDate();
        var monthForDate = (days[i].getMonth() + 1);
        var yearForDate = days[i].getFullYear();

        days[i] = yearForDate + '-' + monthForDate + '-' + dateForDate;

        if (dateForDate <= 9) {

            days[i] = yearForDate + '-' + monthForDate + '-' + '0' + dateForDate;

            if (monthForDate <= 9) {

                days[i] = yearForDate + '-' + '0' + monthForDate + '-' + '0' + dateForDate;
            }

        }

        if (monthForDate <= 9 && dateForDate >= 10) {

            days[i] = yearForDate + '-' + '0' + monthForDate + '-' + dateForDate;
        }

    }
    return days;
}


