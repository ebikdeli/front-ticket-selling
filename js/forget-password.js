import getCookie from './csrftoken.js';
import { sendPostData } from './ajax.js';



// *** Validate forgetPasswordForm
const forgetPasswordForm = document.getElementById('fp-c');
forgetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    let passwordElem = document.getElementById('password');
    let confirmPasswordElem = document.getElementById('password-confirm');
    let errors = 0;

    if(passwordElem.value.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'خطا در رمز عبور',
            text: 'رمز عبور را وارد کنید',
        })
        errors += 1;
    }
    else if(passwordElem.value.length < 6){
        Swal.fire({
            icon: 'error',
            title: 'خطا در رمز عبور',
            text: 'رمز عبور باید بیش از 6 کاراکتر باشد',
        })
        errors += 1;
    }
    else if(passwordElem.value.length > 20){
        Swal.fire({
            icon: 'error',
            title: 'خطا در رمز عبور',
            text: 'رمز عبور باید کمتر از 20 کاراکتر باشد',
        })
        errors += 1;
    }
    else if(confirmPasswordElem.value.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'خطا در رمز عبور',
            text: 'تکرار رمز عبور را وارد کنید',
        })
        errors += 1;
    }
    else if (passwordElem.value != confirmPasswordElem.value){
        Swal.fire({
            icon: 'error',
            title: 'خطا در رمز عبور',
            text: 'تکرار رمز عبور با مرز عبور یکسان نیست',
        })
        errors += 1;
    }
    // If no error proceeds to the next page
    if(errors === 0){
        location.replace(`${location.protocol}/forget-password-complete.html`);
    }
})