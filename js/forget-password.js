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
        alert('رمز عبور را وارد کنید');
        errors += 1;
    }
    else if(passwordElem.value.length < 4){
        alert('رمز عبور باید بیش از 4 کاراکتر باشد');
        errors += 1;
    }
    else if(confirmPasswordElem.value.length == 0){
        alert('تکرار رمز عبور را وارد کنید');
        errors += 1;
    }
    else if (passwordElem.value != confirmPasswordElem.value){
        alert('رمز و تکرار رمز عبور یکسان نیست');
        errors += 1;
    }
    if(errors === 0){
        // Send AJAX data
        // // let url = `${location.protocol}://${location.hostname}/login/forget-password/`;
        // let url = `${location.protocol}/login/forget-password/`;
        // let data = {'password': passwordElem.value};
        let data = {'password': passwordElem.value};
        // sendPostData(url, data)
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(error => {
        //     console.log(error);
        // })
        // Simulate Successful ajax request
        console.log(data);
        location.replace(`${location.protocol}/forget-password-complete.html`);
    }
})