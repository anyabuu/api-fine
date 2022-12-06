import './scss/style.scss';


document.addEventListener('DOMContentLoaded', async () => {

  const login = document.querySelector('.login-form-wrapper');
  const loginForm = document.querySelector('.authorization__login-form');
  const loginButton = document.querySelector('.registration__login-button');

  const registration = document.querySelector('.registration-form-wrapper');
  const registrationForm = document.querySelector('.registration__form');
  const registrationButton = document.querySelector('.authorization__registration-button');


  function lengthValidate (element, minLength, maxLength) {
    if (element.value.length < minLength || element.value.length > maxLength){
      element.nextElementSibling.innerText = `*It should be more then ${minLength} and less then ${maxLength} letters!`;
      return;
    }
    else {
      element.nextElementSibling.innerText = '';
      return;
    }
  }

  registrationButton.onclick = function(){
    login.classList.add('disable');
    registration.classList.remove('disable');
    loginForm.reset();
  }

  loginButton.onclick = () => {
    registration.classList.add('disable');
    login.classList.remove('disable');
    registrationForm.reset();
  }


  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const loginFormElements = document.querySelectorAll('.authorization__input');

    loginFormElements.forEach(function(item){
      if (item === loginForm.elements.email) {
       return lengthValidate(item, 6, 50)
      } else if (item === loginForm.elements.password) {
        return lengthValidate(item, 8, 50)
      }
    })




  })

})
