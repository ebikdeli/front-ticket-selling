import { validateEmail } from './functions.js';
import { sendPostData } from './ajax.js';



// * 'um-form' validation
const umForm = document.getElementById('um-form');
umForm.addEventListener('submit', e => {
    e.preventDefault();
    // Input Errors
    let emailErrorElem = umForm.querySelector('.email-error');
    emailErrorElem.innerHTML = '';
    let messageErrorElem = umForm.querySelector('.message-error');
    messageErrorElem.innerHTML = null;
    // Input elements and their values
    let emailElem = umForm.querySelector('#email');
    let email = emailElem.value;
    let messageElem = umForm.querySelector('#message');
    let message = messageElem.value;
    // Counter for error
    let errors = 0;
    // Validate form inputs
    if(email.length == 0){
        emailErrorElem.style.color = 'red';
        emailErrorElem.innerHTML = 'ایمیل خود را وارد کنید';
        errors += 1;
    }
    else if(!validateEmail(email)){
        emailErrorElem.style.color = 'red';
        emailErrorElem.innerHTML = 'ایمیل خود را به درستی وارد کنید';
        errors += 1;
    }
    if(message.length == 0){
        messageErrorElem.style.color = 'red';
        messageErrorElem.innerHTML = 'پیام خود را وارد کنید';
        errors += 1;
    }
    // If no errors submit form
    if(errors === 0){
        let url = `${location.protocol}//${location.host}/faq/um-form`;
        let data = {'email': email, 'message': message}
        // sendPostData(url, data)
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(err => {
        //     console.log(err);
        // })
        // !!!!!!!!! Simulate successful ajax request
        Swal.fire(
            'ارسال موفق',
            'از پیام شما متشکریم',
            'success'
        )
        console.log(url);
        console.log(data);
        emailElem.disabled = true;
        messageElem.disabled = true;
    }
})