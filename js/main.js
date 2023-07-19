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



// *** Buy ticket with 'buy ticket button'
const belitCards = document.getElementsByClassName('belit-card');
Array.from(belitCards).forEach(belitCard => {
    belitCard.addEventListener('click', e =>{
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
            var belitIncDec = e.target.nextElementSibling
            belitIncDec.classList.remove('d-none');
        }
    })
})








// *** Add to cart button
const addCartButtons = document.querySelectorAll('.add-to-cart');
Array.from(addCartButtons).forEach(cartButton => {
    cartButton.addEventListener('click', e => {
        e.preventDefault();
        let url = 'http://127.0.0.1:8000/add-product-cart';
        let data = {product_id: cartButton.getAttribute('data-product-id'), product_number: 1};
        let err = 'ارتباط با سرور مشکل دارد';
        sendPostData(url, data, err)
        .then(data => {
            console.log(data);
            if(data.status == 200){
                Array.from(cartButton.parentElement.children).forEach(elem => {
                    if(elem.hasAttribute('success')){
                        elem.classList.remove('d-none');
                        setTimeout(() => {
                            elem.classList.add('d-none');
                        }, 3000);
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})



// *** Send 'pr-form' data to server using Ajax ***
// * NOTE: When validating forms using javascript, it is better to to let JS do all the validation like check if the input is email, required and etc
let prForm = document.forms['pr-form'];
// let prForm = document.querySelector('[name="pr-form"]')



// ** Send data to server **
// * Helper function using 'async'
let sendPrData = async (url=new String, form=new FormData ,errorMsg=new String) => {
    const csrftoken = getCookie('csrftoken');
    try{
        let response = await fetch(url, {
            method: 'POST',
            body: form,
            credentials: 'include',
            mode: 'cors', // Can send CSRF token to another domain.
            headers: {
                'X-CSRFToken': csrftoken,
            },
        })
        console.log(response);
        if (response.status !== 200){
            return Promise.reject(errorMsg);
        }
        return await response.json();
    }
    catch(err){
        if(err instanceof TypeError){
            return Promise.reject('اتصال با سرور برقرار نشد');
        }
    }
}



// * This Eventlistener used for submitting the PrForm and validate user data in front-end
prForm.addEventListener('submit', e =>{
    e.preventDefault();
    let form = new FormData(prForm);
    let email = form.get('email');
    let content = form.get('content');
    if(!email || !validateEmail(email) || !content){
        // * Below block is more soffesticated way to show errors to users but we don't want this for now!
        // let formEmailSection = document.querySelector('#form-email-section');
        // let errorMessageDiv = document.createElement('div');
        // errorMessageDiv.classList.add(['pr-error']);
        // let errorMessage = document.createElement('p');
        // errorMessageDiv.appendChild(errorMessage);
        // formEmailSection.prepend(errorMessageDiv);
        // * Following line is way more brief than above block of code
        let errorMessage = document.querySelector('#form-email-section > div > p')

        if(!content){
            let errorMessage = document.querySelector('#form-content-section > div > p');
            errorMessage.textContent = 'پیام خود را وارد کنید';
            let contentInput = document.querySelector('#content-input');
            contentInput.style.borderColor = 'red';
        }

        if(!email){
            errorMessage.textContent = 'ایمیل خود را وارد کنید';
        }
        else{
            errorMessage.textContent = 'ایمیل خود را به درستی وارد کنید';
        }
        let emailInput = document.getElementById('email-input');
        emailInput.style.borderColor = 'red';
    }
    
    // * After sending email and content, clear error messages and redo red borders
    else{
        document.querySelectorAll('.pr-error > p').forEach(errorP => {
            errorP.textContent = '';
        })
        document.getElementById('email-input').style.borderColor = '#dee2e6';
        document.getElementById('content-input').style.borderColor = '#dee2e6';

        // Send data to server using ajax
        sendPrData('http://127.0.0.1:8000/pr', form, 'اطلاعات ارسال نشد')
        // sendPrData(url='http://ip.jsontest.com/', form=form, errorMsg='اطلاعات ارسال نشد')
        .then(jsonData => {
            console.log(jsonData);
            document.querySelector('#pr-success').textContent = 'از همکاری شما سپاسگذاریم';
        })
        .catch(err => {
            document.querySelector('#pr-failed').textContent = err;
        })

        // Disable 'pr-box' inputs and buttoms and hide the messages 
        setTimeout(()=>{
            document.querySelector('#pr-failed').textContent = '';
            document.querySelector('#pr-success').textContent = '';
            document.getElementById('email-input').disabled = true;
            document.getElementById('content-input').disabled = true;
            document.querySelector('#send-button').disabled = true;
        }, 2000)
    }
})