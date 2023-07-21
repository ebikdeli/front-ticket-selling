// * When import a module, we should import the script with '.js' extension. JS module rules are weird!
import getCookie from './csrftoken.js';
import { validateEmail } from './functions.js';
import {sendPostData} from './ajax.js';


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
        console.log(orderFillInput);
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
    console.log(calculateTotalQuantity());
    console.log(calculateTotalPrice());
    if(calculateTotalQuantity() == 0 && calculateTotalPrice() == 0){
        orderEmpty.classList.remove('d-none');
        orderFill.classList.add('d-none')
        console.log('show no order');
    }
    else{
        orderEmpty.classList.add('d-none');
        orderFill.classList.remove('d-none')
        console.log('show orders');
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



// *** Buy ticket with 'buy ticket button'
const belitCards = document.getElementsByClassName('belit-card');
Array.from(belitCards).forEach(belitCard => {
    belitCard.addEventListener('click', e =>{
        e.preventDefault();
        if(e.target.classList.contains('belit-card-add-cart-button')){
            let belit_id = e.target.getAttribute('data-belit-id');
            let belit_quantity = '1';
            console.log(belit_id, belit_quantity);
            // Send data to server
            // let url = 'http://127.0.0.1:8000/cart/add-ticket-cart'
            // let errormsg = 'ارتباط با سرور برقرار نشد';
            // let data = {'ticket-id': belit_id, 'quantity': belit_quantity}
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
              <button class="order-fill-button belit-card-dec btn"><i class="fas fa-minus"></i></button>
              <input type="number" data-belit-id="${belit_id}" data-ticketsold-id="" value="1" min="1" max="150" maxlength="3" class="order-fill-input belit-quantity-input">
              <button class="order-fill-button belit-card-inc btn"><i class="fas fa-plus"></i></button>
            </div>`
            newOrderElement.innerHTML = newOrderText;
            belitOrdersBox.appendChild(newOrderElement);
            calculateTotalPrice();
            calculateTotalQuantity();
            checkHasOrder()
        }
    })
})



// *** 'Increase' ticket quantity with 'inc button' in Belit section




// ** 'Decrease' ticket quantity with 'inc button' in Belit section





// *** Add to cart button
// const addCartButtons = document.querySelectorAll('.add-to-cart');
// Array.from(addCartButtons).forEach(cartButton => {
//     cartButton.addEventListener('click', e => {
//         e.preventDefault();
//         let url = 'http://127.0.0.1:8000/add-product-cart';
//         let data = {product_id: cartButton.getAttribute('data-product-id'), product_number: 1};
//         let err = 'ارتباط با سرور مشکل دارد';
//         sendPostData(url, data, err)
//         .then(data => {
//             console.log(data);
//             if(data.status == 200){
//                 Array.from(cartButton.parentElement.children).forEach(elem => {
//                     if(elem.hasAttribute('success')){
//                         elem.classList.remove('d-none');
//                         setTimeout(() => {
//                             elem.classList.add('d-none');
//                         }, 3000);
//                     }
//                 })
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     })
// })



// *** Send 'pr-form' data to server using Ajax ***
// * NOTE: When validating forms using javascript, it is better to to let JS do all the validation like check if the input is email, required and etc
// let prForm = document.forms['pr-form'];
// let prForm = document.querySelector('[name="pr-form"]')



// ** Send data to server **
// * Helper function using 'async'
// let sendPrData = async (url=new String, form=new FormData ,errorMsg=new String) => {
//     const csrftoken = getCookie('csrftoken');
//     try{
//         let response = await fetch(url, {
//             method: 'POST',
//             body: form,
//             credentials: 'include',
//             mode: 'cors', // Can send CSRF token to another domain.
//             headers: {
//                 'X-CSRFToken': csrftoken,
//             },
//         })
//         console.log(response);
//         if (response.status !== 200){
//             return Promise.reject(errorMsg);
//         }
//         return await response.json();
//     }
//     catch(err){
//         if(err instanceof TypeError){
//             return Promise.reject('اتصال با سرور برقرار نشد');
//         }
//     }
// }



// * This Eventlistener used for submitting the PrForm and validate user data in front-end
// prForm.addEventListener('submit', e =>{
//     e.preventDefault();
//     let form = new FormData(prForm);
//     let email = form.get('email');
//     let content = form.get('content');
//     if(!email || !validateEmail(email) || !content){
//         // * Below block is more soffesticated way to show errors to users but we don't want this for now!
//         // let formEmailSection = document.querySelector('#form-email-section');
//         // let errorMessageDiv = document.createElement('div');
//         // errorMessageDiv.classList.add(['pr-error']);
//         // let errorMessage = document.createElement('p');
//         // errorMessageDiv.appendChild(errorMessage);
//         // formEmailSection.prepend(errorMessageDiv);
//         // * Following line is way more brief than above block of code
//         let errorMessage = document.querySelector('#form-email-section > div > p')

//         if(!content){
//             let errorMessage = document.querySelector('#form-content-section > div > p');
//             errorMessage.textContent = 'پیام خود را وارد کنید';
//             let contentInput = document.querySelector('#content-input');
//             contentInput.style.borderColor = 'red';
//         }

//         if(!email){
//             errorMessage.textContent = 'ایمیل خود را وارد کنید';
//         }
//         else{
//             errorMessage.textContent = 'ایمیل خود را به درستی وارد کنید';
//         }
//         let emailInput = document.getElementById('email-input');
//         emailInput.style.borderColor = 'red';
//     }
    
//     // * After sending email and content, clear error messages and redo red borders
//     else{
//         document.querySelectorAll('.pr-error > p').forEach(errorP => {
//             errorP.textContent = '';
//         })
//         document.getElementById('email-input').style.borderColor = '#dee2e6';
//         document.getElementById('content-input').style.borderColor = '#dee2e6';

//         // Send data to server using ajax
//         sendPrData('http://127.0.0.1:8000/pr', form, 'اطلاعات ارسال نشد')
//         // sendPrData(url='http://ip.jsontest.com/', form=form, errorMsg='اطلاعات ارسال نشد')
//         .then(jsonData => {
//             console.log(jsonData);
//             document.querySelector('#pr-success').textContent = 'از همکاری شما سپاسگذاریم';
//         })
//         .catch(err => {
//             document.querySelector('#pr-failed').textContent = err;
//         })

//         // Disable 'pr-box' inputs and buttoms and hide the messages 
//         setTimeout(()=>{
//             document.querySelector('#pr-failed').textContent = '';
//             document.querySelector('#pr-success').textContent = '';
//             document.getElementById('email-input').disabled = true;
//             document.getElementById('content-input').disabled = true;
//             document.querySelector('#send-button').disabled = true;
//         }, 2000)
//     }
// })
