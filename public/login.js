const title = document.getElementById('title');
const form = document.getElementById('form');
const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const emailValue = document.getElementById('emailValue');
const passwordValue = document.getElementById('passwordValue');
const confirmPassword = document.getElementById('confirmPassword');
const confirmPasswordValue = document.getElementById('confirmPasswordValue');
const userName = document.getElementById('userName');
const userNameValue = document.getElementById('userNameValue');
const registrationBox = document.getElementById('registrationBox');
const eye1 = document.getElementById('eye1');
const eye2 = document.getElementById('eye2');
const src1 = 'icons/hide.png';
const src2 = 'icons/view.png';

// Ambigous Behaviour with return statements
classChecker = function(element, clas){
    let flag = false;
    const arr = Array.from(element.classList);
    arr.forEach(function(e){
        if(e == clas)
        {
            console.log('YES it is Present');
            flag = true;
        }
    });
    return flag;
}

signUp.addEventListener('click',(event)=>{
    console.log('SignUp CLick: '+classChecker(userName, 'none'));
    console.log('UserName Class: '+userName.classList);
    if(! classChecker(userName, 'none') )
    {
        if(userNameValue.value === '')
        {
            event.preventDefault();
            window.alert('Enter your name to Sign Up');
        }
        else if(emailValue.value === '')
        {
            event.preventDefault();
            window.alert('Enter Email to Sign Up');
        }
        else if(passwordValue.value === '')
        {
            event.preventDefault();
            window.alert('Enter Password to Sign Up');
        }
        else if(passwordValue.value.length < 6)
        {
            event.preventDefault();
            window.alert('Enter A bigger Password Babes, It should be of 6 digits');
        }
        else if(passwordValue.value !== confirmPasswordValue.value)
        {
            event.preventDefault();
            window.alert('Confrim Password should be same as password');
        }
    }
    else
    {
        event.preventDefault();
        title.innerText = 'SignUp';
        emailValue.value='';
        passwordValue.value='';
        registrationBox.style.height = '380px';
        confirmPassword.classList.remove('none');
        userName.classList.remove('none');
    }
});

signIn.addEventListener('click',(event)=>{
    console.log('SignIn CLick: '+classChecker(userName, 'none'));
    if(classChecker(userName, 'none'))
    {
        if(emailValue.value === '')
        {
            event.preventDefault();
            window.alert('Enter email to SignIn');
        }
        else if(passwordValue.value === '' )
        {
            event.preventDefault();
            window.alert('Enter password to SignIn');
        }
        else if(passwordValue.value.length < 6)
        {
            event.preventDefault();
            window.alert('Password must be greater than 6 digits');
        }
        else{
            form.setAttribute('action','/signin');
            userNameValue.removeAttribute('name');
            console.log('Send POST request to sign In the user');
        }
    }
    else
    {
        event.preventDefault();
        title.innerText = 'SignIn';
        userNameValue.value='';
        emailValue.value='';
        passwordValue.value='';
        confirmPasswordValue.value='';
        confirmPassword.classList.add('none');
        userName.classList.add('none');
        registrationBox.style.height = '288px';
    }
});

eye1.addEventListener('click',(event)=>{
    event.preventDefault();
    if(eye1.getAttribute('src')===src1){
        eye1.setAttribute('src',src2);
        passwordValue.setAttribute('type','text');
    }
    else{
        eye1.setAttribute('src',src1);
        passwordValue.setAttribute('type','password');
    }
});

eye2.addEventListener('click',(event)=>{
    event.preventDefault();
    if(eye2.getAttribute('src')===src1){
        eye2.setAttribute('src',src2);
        confirmPasswordValue.setAttribute('type','text');
    }
    else{
        eye2.setAttribute('src',src1);
        confirmPasswordValue.setAttribute('type','password');
    }
});