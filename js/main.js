// * When import a module, we should import the script with '.js' extension. JS module rules are weird!
import getCookie from './csrftoken.js';
import { validateEmail } from './functions.js';
import {sendPostData} from './ajax.js';


const cartId = document.querySelector('.cart-id').value


// *** Convert number to a Comma separator string
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


// *** Convert back a comma separator string to Number
function parseToNumber(str) {
    return parseFloat(str.replaceAll(',', ''));
}


// *** Calculate 'total-price'
const calculateTotalPrice = () => {
    // * This function calculate total price of the order and return it. If no product found, return 'null'
    var belitOrderPrices = document.querySelectorAll('.belit-orders-price span:first-of-type');
    var totalPrice = document.querySelector('#total-price');
    var price = 0;
    if (belitOrderPrices == undefined){
        return null
    }
    Array.from(belitOrderPrices).forEach(belitOrderPrice => {
        price += parseToNumber(belitOrderPrice.innerHTML);
    })
    totalPrice.innerHTML = numberWithCommas(price);
    return price;
}
calculateTotalPrice()



// *** Calculate 'total-quantity'
const calculateTotalQuantity = () => {
    // * This function calculate total quantity of the order and return it
    var orderFillInputs = document.querySelectorAll('.order-fill-input')
    var totalquantity = document.querySelector('#total-belit');
    var quantity = 0;
    Array.from(orderFillInputs).forEach(orderFillInput => {
        quantity += Number(orderFillInput.value)
    })
    totalquantity.innerHTML = quantity;
    return quantity;
}
calculateTotalQuantity()



function checkHasOrder() {
    // * If no order registered, show empty order message to user
    let orderEmpty = document.querySelector('.order-empty');
    let orderFill = document.querySelector('.order-fill');
    if(calculateTotalQuantity() == 0 && calculateTotalPrice() == 0){
        orderEmpty.classList.remove('d-none');
        orderFill.classList.add('d-none')
    }
    else{
        orderEmpty.classList.add('d-none');
        orderFill.classList.remove('d-none')
    }
}
checkHasOrder();



// *!*! SHOW EVERY PRICE AS COMMA SEPARATED VALUE
// ? For prize-money
Array.from(document.querySelectorAll('.prize_money-number')).forEach(elem => {
    elem.innerHTML = numberWithCommas(elem.innerHTML);
})
// ? For belit-price
Array.from(document.querySelectorAll('.belit-price')).forEach(elem => {
    elem.innerHTML = numberWithCommas(elem.innerHTML);
})
// ? For belit-order-price
Array.from(document.querySelectorAll('.belit-orders-price')).forEach(elem => {
    elem.innerHTML = numberWithCommas(elem.innerHTML);
})
// ? For total-price
document.querySelector('#total-price').innerHTML = numberWithCommas(document.querySelector('#total-price').innerHTML);


// *****************************************************************************


// *** Buy ticket with 'buy ticket button'
const belitCards = document.getElementsByClassName('belit-card');
Array.from(belitCards).forEach(belitCard => {
    belitCard.addEventListener('click', e =>{
        e.preventDefault();
        if(e.target.classList.contains('belit-card-add-cart-button')){
            let belit_id = e.target.getAttribute('data-belit-id');
            let belit_quantity = '1';
            // Send data to server
            // let url = `${location.protocol}://${location.hostname}/cart/add-ticket-cart`;
            // let errormsg = 'ارتباط با سرور برقرار نشد';
            // let data = {'cart-id': cartId, 'ticket-id': belit_id, 'quantity': belit_quantity}
            // sendPostData(url, data, errormsg)
            // .then(data => {
            //     console.log(data);
            // })
            // .catch(err => {
            //     console.log(err);
            // })
            // !!! Simulate successful ajax call
            e.target.style.animation = 'fade-out ease-in-out .2s';
            setTimeout(()=>{e.target.classList.add('d-none')}, 200)
            var belitIncDec = e.target.nextElementSibling;
            setTimeout(()=> belitIncDec.classList.remove('d-none'), 200)
            // To be able repeat this process smooth, we need to remove animation from current style
            setTimeout(()=> {
                e.target.style.animation = null
            }, 50)

            // ! Add current belit to the orders. First check if 'order-fill' has 'd-none' class
            const orderEmpty = document.querySelector('.order-empty');
            const orderFill = document.querySelector('.order-fill');
            const belitOrdersBox = document.querySelector('.belit-orders-box');
            if(orderFill.classList.contains('d-none')){
                orderEmpty.classList.remove('d-none');
                orderFill.classList.add('d-none');
            }
            const belitName = belitCard.querySelector('.belit-name').innerHTML;
            const belitPrice = belitCard.querySelector('.belit-price > span').innerHTML;
            const newOrderElement = document.createElement('div');
            ['belit-orders', 'd-flex', 'justify-content-center', 'align-items-center'].forEach((cl => {
                newOrderElement.classList.add(cl)
            }))
            const newOrderText = `<p class="belit-orders-name">${belitName}</p>
            <p class="belit-orders-price">
              <span>${belitPrice}</span>&nbsp;<span style="font-size: 12px;">تومان</span>
            </p>
            <div class="d-flex justify-content-center align-items-center">
              <button class="order-fill-button belit-card-dec order-fill-button-dec btn"><i class="fas fa-minus order-fill-button-dec"></i></button>
              <input type="number" data-belit-id="${belit_id}" data-ticketsold-id="" value="1" min="1" max="150" maxlength="3" class="order-fill-input belit-quantity-input">
              <button class="order-fill-button belit-card-inc order-fill-button-inc btn"><i class="fas fa-plus order-fill-button-inc"></i></button>
            </div>`
            newOrderElement.innerHTML = newOrderText;
            belitOrdersBox.appendChild(newOrderElement);
            calculateTotalPrice();
            calculateTotalQuantity();
            checkHasOrder()
        }
    })
})


// ??????????????????????????????? INCREASE QUANTITY FUNCTIONS ???????????????

// *** 'Increase' ticket quantity with 'inc button' in Belit Card section
const IncBelitCard = (buttonElem) => {
    let inputElem = buttonElem.previousElementSibling;
    let belitQuantity = Number(inputElem.value)
    let belitId = inputElem.getAttribute('data-belit-id');
    let belit = buttonElem.parentElement.parentElement.parentElement;
    let belitPrice = parseToNumber(belit.querySelector('.belit-price span:first-of-type').innerHTML);
    // console.log(inputElem, belitQuantity, belitId, belit, belitPrice);
    // No we can process further things on the data
    if (belitQuantity == 150){
        console.log('Belit quantity exceeded from 150 unit');
        return null;
    }
    // Make ajax call to increase ticket by one
    // let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    // let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': belitQuantity+1}
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Simulate successfully changed belit quantity
    // After successfully increased belit quantity, update the front with 'belit-input' and 'orderfill'
    let belitOrders = document.querySelectorAll('.belit-orders');
    Array.from(belitOrders).forEach(belitOrder => {
        // console.log(belitOrder.querySelector('.belit-quantity-input').getAttribute('data-belit-id'), belitId);
        if(belitOrder.querySelector('.belit-quantity-input').getAttribute('data-belit-id') == belitId){
            inputElem.value = String(belitQuantity + 1);
            belitOrder.querySelector('.belit-quantity-input').value = String(belitQuantity + 1);
            belitOrder.querySelector('.belit-orders-price span:first-of-type').innerHTML = numberWithCommas(belitPrice * (belitQuantity + 1));
            calculateTotalQuantity();
            calculateTotalPrice();
        }
    })
}
// CALL THE 'IncBelitCard' or 'DecBelitCard' or 'ChangeBelitCardQuantity' functions
let belitIncDecs = document.querySelectorAll('.belit-card-add-cart-inc-dec');
Array.from(belitIncDecs).forEach(belitIncDec => {
    // increase or decrease belit quantity using buttons
    belitIncDec.addEventListener('click', e=>{
        // 
        // "Increase" belit quantity
        if(e.target.classList.contains('belit-card-inc-button')){
            // console.log("SUCCESS");
            IncBelitCard(belitIncDec.querySelector('.belit-card-inc'))
        }
        // "Decrease" belit quantity
        else if(e.target.classList.contains('belit-card-dec-button')){
            DecBelitCard(belitIncDec.querySelector('.belit-card-dec'));
        }
    })
    // change belit quantity directly using 'input'
    belitIncDec.querySelector('.belit-quantity-input').addEventListener('keyup', e => {
        ChangeBelitCardQuantity(belitIncDec.querySelector('.belit-quantity-input'));
    })
})



// *** 'Increase' ticket quantity with 'belit-card-inc button' in Order section
const IncOrderBelit = (buttonElem) => {
    let inputElem = buttonElem.previousElementSibling;
    let belitQuantity = Number(inputElem.value)
    let belitId = inputElem.getAttribute('data-belit-id');
    let belit = buttonElem.parentElement.parentElement;
    let belitPriceElem = belit.querySelector('.belit-orders-price span:first-of-type');
    let belitUnitPrice = parseToNumber(belitPriceElem.innerHTML) / belitQuantity;
    // console.log(inputElem, belitQuantity, belitId, belit, belitUnitPrice);
    // No we can process further things on the data
    if (belitQuantity == 150){
        console.log('Belit quantity exceeded from 150 unit');
        return null;
    }
    // Make ajax call to increase ticket by one
    // let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    // let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': belitQuantity+1}
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Simulate successfully changed belit quantity
    // After successfully increased belit quantity, update the front with 'belit-input' and 'orderfill'
    let belitCards = document.querySelectorAll('.belit-card');
    Array.from(belitCards).forEach(belitCard => {
        // console.log(belitCard.querySelector('.belit-quantity-input').getAttribute('data-belit-id'), belitId);
        if(belitCard.querySelector('.belit-quantity-input').getAttribute('data-belit-id') == belitId){
            inputElem.value = String(belitQuantity + 1);
            belitPriceElem.innerHTML = numberWithCommas(belitUnitPrice * (belitQuantity + 1));
            belitCard.querySelector('.belit-quantity-input').value = String(belitQuantity + 1);
            calculateTotalQuantity();
            calculateTotalPrice();
        }
    })
}
// CALL THE 'IncOrderBelit' or 'DecOrderBelit' function
let belitOrderBox = document.querySelector('.belit-orders-box');
belitOrderBox.addEventListener('click', e => {
    // Call 'IncOrderBelit' to increase belit quantity
    if(e.target.classList.contains('order-fill-button-inc')){
        if(e.target.tagName == 'BUTTON'){
            var incButt = e.target
        }
        else if(e.target.tagName == 'I'){
            var incButt = e.target.parentElement
        }
        IncOrderBelit(incButt)
    }
    // call 'DecOrderBelit' to decrease belit quantity
    else if(e.target.classList.contains('order-fill-button-dec')){
        if(e.target.tagName == 'BUTTON'){
            var incButt = e.target
        }
        else if(e.target.tagName == 'I'){
            var incButt = e.target.parentElement
        }
        DecOrderBelit(incButt);
    }
})
// Call the 'ChangeOrderBelitQuantity' to change ticket quantity from OrderBelit input directly
belitOrderBox.addEventListener('keyup', e => {
    if (e.target.tagName == 'INPUT'){
        ChangeOrderBelitQuantity(e.target);
    }
})




// ??????????????????????????????? DECREASE QUANTITY FUNCTIONS ???????????????

// ** 'Decrease' ticket quantity with 'dec button' in Belit Card section
const DecBelitCard = (buttonElem) => {
    let inputElem = buttonElem.nextElementSibling;
    let belitQuantity = Number(inputElem.value)
    let belitId = inputElem.getAttribute('data-belit-id');
    let belit = buttonElem.parentElement.parentElement.parentElement;
    let belitPrice = parseToNumber(belit.querySelector('.belit-price span:first-of-type').innerHTML);
    // console.log(inputElem, belitQuantity, belitId, belit, belitPrice);
    // No we can process further things on the data
    // Make ajax call to decrease ticket by one. If quantity == 1, call 'delete-ticket-cart' in ajax call
    // if(belitQuantity-1 > 0){
    //     let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': belitQuantity-1}
    // }
    // else{
    //     let url = `${location.protocol}://${location.hostname}/cart/delete-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId}
    // }
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Simulate successfully changed belit quantity
    // After successfully decrease-delete belit quantity, update the front with 'belit-input' and 'orderfill'
    let belitOrders = document.querySelectorAll('.belit-orders');
    Array.from(belitOrders).forEach(belitOrder => {
        // console.log(belitOrder.querySelector('.belit-quantity-input').getAttribute('data-belit-id'), belitId);
        if(belitOrder.querySelector('.belit-quantity-input').getAttribute('data-belit-id') == belitId){
            // If new quantity is zero, delete the belit from the Order, and bring back 'buy-button' in Belit-Card section
            if(belitQuantity - 1 > 0){
                inputElem.value = String(belitQuantity - 1);
                belitOrder.querySelector('.belit-quantity-input').value = String(belitQuantity - 1);
                belitOrder.querySelector('.belit-orders-price span:first-of-type').innerHTML = numberWithCommas(belitPrice * (belitQuantity - 1));
            }
            else{
                let belitInputIncDec = buttonElem.parentElement;
                belitInputIncDec.animation = 'fade-out ease-in-out .2s';
                belitOrder.remove();
                setTimeout(()=>{belitInputIncDec.classList.add('d-none')}, 200)
                var belitAddButton = belitInputIncDec.previousElementSibling;
                setTimeout(()=> belitAddButton.classList.remove('d-none'), 200)
                // To be able repeat this process smooth, we need to remove animation from current style
                setTimeout(()=> {
                    belitInputIncDec.style.animation = null
                }, 50)
                // belit.querySelector('.belit-card-add-cart-button').classList.remove()
            }
            calculateTotalQuantity();
            calculateTotalPrice();
            checkHasOrder();
        }
    })
}


// *** 'Decrease' ticket quantity with 'belit-card-dec button' in Order section
const DecOrderBelit = (buttonElem) => {
    let inputElem = buttonElem.nextElementSibling;
    let belitQuantity = Number(inputElem.value)
    let belitId = inputElem.getAttribute('data-belit-id');
    let belitOrder = buttonElem.parentElement.parentElement;
    let belitPriceElem = belitOrder.querySelector('.belit-orders-price span:first-of-type');
    let belitUnitPrice = parseToNumber(belitPriceElem.innerHTML) / belitQuantity;
    // No we can process further things on the data
    if (belitQuantity == 150){
        console.log('Belit quantity exceeded from 150 unit');
        return null;
    }
    // Make ajax call to decrease ticket by one. If quantity == 1, call 'delete-ticket-cart' in ajax call
    // if(belitQuantity-1 > 0){
    //     let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': belitQuantity-1}
    // }
    // else{
    //     let url = `${location.protocol}://${location.hostname}/cart/delete-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId}
    // }
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Simulate successfully changed belit quantity
    // After successfully decrease-delete belit quantity, update the front with 'belit-input' and 'orderfill'
    let belitCards = document.querySelectorAll('.belit-card');
    Array.from(belitCards).forEach(belitCard => {
        if(belitCard.querySelector('.belit-quantity-input').getAttribute('data-belit-id') == belitId){
            // If new quantity is zero, delete the belit from the Order, and bring back 'buy-button' in Belit-Card section
            if(belitQuantity - 1 > 0){
                // Change values for Order section
                inputElem.value = String(belitQuantity - 1);
                belitPriceElem.innerHTML = numberWithCommas(belitUnitPrice * (belitQuantity - 1));
                belitCard.querySelector('.belit-quantity-input').value = belitQuantity - 1;
            }
            else{
                let belitCardIncDec = belitCard.querySelector('.belit-card-add-cart-inc-dec');
                belitCardIncDec.animation = 'fade-out ease-in-out .2s';
                belitOrder.remove();
                setTimeout(()=>{belitCardIncDec.classList.add('d-none')}, 200)
                var belitAddButton = belitCardIncDec.previousElementSibling;
                setTimeout(()=> belitAddButton.classList.remove('d-none'), 200)
                // To be able repeat this process smooth, we need to remove animation from current style
                setTimeout(()=> {
                    belitCardIncDec.style.animation = null
                }, 50)
            }
            calculateTotalQuantity();
            calculateTotalPrice();
            checkHasOrder();
        }
    })
}




// ******************************* Change belit quantity using input field directly **********

// *** Change ticket quantity using 'Belit Card input'
const ChangeBelitCardQuantity = (inputElem) => {
    const belitId = inputElem.getAttribute('data-belit-id');
    let newQuantity = Number(inputElem.value);
    const belitCardElem = inputElem.parentElement.parentElement.parentElement;
    const belitUnitPrice = parseToNumber(belitCardElem.querySelector('.belit-price span:first-of-type').innerHTML);
    if (newQuantity > 150){
        // console.log('quantity cannot be greater than 150');
        newQuantity = 150;
    }
    // Now we can process further things on the data
    // Make ajax call to change ticket quantity. If newQuantity == 0, call 'delete-ticket-cart' in ajax call
    // if(newQuantity > 0){
    //     let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': newQuantity}
    // }
    // else{
    //     let url = `${location.protocol}://${location.hostname}/cart/delete-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId}
    // }
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Now simulate successful ajax call
    // Update OrderBelit with new data
    let belitOrderBox = document.querySelector('.belit-orders-box');
    Array.from(belitOrderBox.children).forEach(belitOrder => {
        if (belitOrder.querySelector('.order-fill-input').getAttribute('data-belit-id') == belitId){
            if(newQuantity > 0){
                inputElem.value = newQuantity;
                belitOrder.querySelector('.order-fill-input').value = newQuantity;
                belitOrder.querySelector('.belit-orders-price span:first-of-type').innerHTML = numberWithCommas(belitUnitPrice*newQuantity)
            }
            else{
                inputElem.value = 1;
                let belitCardIncDec = belitCardElem.querySelector('.belit-card-add-cart-inc-dec');
                belitCardIncDec.animation = 'fade-out ease-in-out .2s';
                belitOrder.remove();
                setTimeout(()=>{belitCardIncDec.classList.add('d-none')}, 200)
                var belitAddButton = belitCardIncDec.previousElementSibling;
                setTimeout(()=> belitAddButton.classList.remove('d-none'), 200)
                // To be able repeat this process smooth, we need to remove animation from current style
                setTimeout(()=> {
                    belitCardIncDec.style.animation = null
                }, 50)
            }
        }
    })
    calculateTotalQuantity();
    calculateTotalPrice();
    checkHasOrder();
}


// *** Change ticket quantity using 'Order Belit input'
const ChangeOrderBelitQuantity = (inputElem) => {
    const belitId = inputElem.getAttribute('data-belit-id');
    let newQuantity = Number(inputElem.value);
    let belitOrder = inputElem.parentElement.parentElement;
    // const belitUnitPrice = parseToNumber(belitCardElem.querySelector('.belit-price span:first-of-type').innerHTML);
    if (newQuantity > 150){
        // console.log('quantity cannot be greater than 150');
        newQuantity = 150;
    }
    // Now we can process further things on the data
    // Make ajax call to change ticket quantity. If newQuantity == 0, call 'delete-ticket-cart' in ajax call
    // if(newQuantity > 0){
    //     let url = `${location.protocol}://${location.hostname}/cart/change-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId, 'quantity': newQuantity}
    // }
    // else{
    //     let url = `${location.protocol}://${location.hostname}/cart/delete-ticket-cart`;
    //     let data = {'cart-id': cartId, 'ticket-id': belitId}
    // }
    // sendPostData(url, data)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // ! Now simulate successful ajax call
    // After successfully change belit quantity, update the front with 'belit-input' and 'orderfill'
    let belitCards = document.querySelectorAll('.belit-card');
    Array.from(belitCards).forEach(belitCard => {
        if(belitCard.querySelector('.belit-quantity-input').getAttribute('data-belit-id') == belitId){
            // If new quantity is zero, delete the belit from the Order, and bring back 'buy-button' in Belit-Card section
            if(newQuantity > 0){
                // Change values for Order section and BelitCard
                inputElem.value = newQuantity;
                let belitUnitPrice = parseToNumber(belitCard.querySelector('.belit-price span:first-of-type').innerHTML)
                belitOrder.querySelector('.belit-orders-price span:first-of-type').innerHTML = numberWithCommas(belitUnitPrice * newQuantity);
                belitCard.querySelector('.belit-quantity-input').value = newQuantity;
            }
            else{
                let belitCardIncDec = belitCard.querySelector('.belit-card-add-cart-inc-dec');
                belitCardIncDec.animation = 'fade-out ease-in-out .2s';
                belitOrder.remove();
                setTimeout(()=>{belitCardIncDec.classList.add('d-none')}, 200)
                var belitAddButton = belitCardIncDec.previousElementSibling;
                setTimeout(()=> belitAddButton.classList.remove('d-none'), 200)
                // To be able repeat this process smooth, we need to remove animation from current style
                setTimeout(()=> {
                    belitCardIncDec.style.animation = null
                }, 50)
            }
        calculateTotalQuantity();
        calculateTotalPrice();
        checkHasOrder();
        }
    })
}