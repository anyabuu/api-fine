import './scss/style.scss';
import {
  changeEmail,
  changePassword,
  getBalance, getFines,
  getUsers,
  loginUser, makeFine, payFine,
  registerUser,
  topUpBalance
} from './js/api/requests';
import { apiClient } from './js/api/client';
import { finesRender } from './js/renders/fineRender';

document.addEventListener('DOMContentLoaded', async () => {
  const HOST = 'http://localhost:3000/api';
  const storage = sessionStorage.userinfo
    ? JSON.parse(sessionStorage.userinfo)
    : {};

  const login = document.querySelector('.login-form-wrapper');
  const loginForm = document.querySelector('.authorization__login-form');
  const loginButton = document.querySelector('.registration__login-button');
  const loginErrorMessage = document.querySelector('.authorization__general-error-message');

  const registration = document.querySelector('.registration-form-wrapper');
  const registrationForm = document.querySelector('.registration__form');
  const registrationButton = document.querySelector(
    '.authorization__registration-button'
  )
  const registerErrorMessage = document.querySelector('.registration__general-error-message');

  const userPage = document.querySelector('.user');
  const adminPage = document.querySelector('.admin');
  const fineForm = document.querySelector('.admin__fine-form');

  const changeEmailForm = document.querySelector('.user__change-email-form');
  const changePasswordForm = document.querySelector('.user__change-password-form');

  const logoutButton = document.querySelector('.header__nav-link-logout');


  function lengthValidate(element, minLength, maxLength) {
    if (element.value.length < minLength || element.value.length > maxLength) {
      return element.nextElementSibling.innerText = `*It should be more then ${minLength} and less then ${maxLength}`;
    } else {
      return element.nextElementSibling.innerText = '';
    }
  }

  if (registrationButton) {
    registrationButton.onclick = () => {
      login.classList.add('disable');
      registration.classList.remove('disable');
      loginForm.reset();
      loginErrorMessage.innerText = ''
    };
  }

  if (loginButton) {
    loginButton.onclick = () => {
      registration.classList.add('disable');
      login.classList.remove('disable');
      registrationForm.reset();
      registerErrorMessage.innerText = ''
    };
  }

  if (logoutButton) {
    logoutButton.onclick = () => {
      delete sessionStorage.userinfo;
      location.href = 'http://localhost:4002/index.html';
    };
  }

  if (registration) {

    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (lengthValidate(registrationForm.elements.name, 4,40) === ''
      &&
      lengthValidate(registrationForm.elements.email, 6, 50) === ''
      &&
      lengthValidate(registrationForm.elements.password, 8, 50) === ''){

        const body = new FormData(registrationForm);

        try {
          await registerUser(body);
          await globalLogin(body, false);
        } catch (error) {
          registerErrorMessage.innerText = error.data.message
        }

      }
    })
  }


  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (lengthValidate(loginForm.elements.email, 6, 50) === ''
        &&
        lengthValidate(loginForm.elements.password, 8, 50) === ''){

        const body = new FormData(loginForm);

        try {
          await globalLogin(body)
        } catch (error) {
          loginErrorMessage.innerText = error.data.message
        }
      }
    });
  }


  async function globalLogin(body, isLogin = true) {
    const { email, token } = await loginUser(body);

    apiClient.headers.token = token;
    apiClient.headers.email = email;

    storage.token = token
    storage.email = email

    sessionStorage.userinfo = JSON.stringify(storage);

    if (isLogin) {
      loginForm.reset();
      if (email === 'admin@rammfall.com'){
        location.href = 'http://localhost:4002/admin.html';
        return
      }
    } else {
      registrationForm.reset();
    }

    location.href = 'http://localhost:4002/user.html';
  }




  const userInfoObj = JSON.parse(sessionStorage.getItem('userinfo'))

  if (userPage) {

    const profilePage = document.querySelector('.user__profile');
    const finePage = document.querySelector('.user__fine-board');
    const profileLink = document.querySelector('.header__nav-link-profile');
    const fineLink = document.querySelector('.header__nav-link-fine');

    profileLink.onclick = () => {
      finePage.classList.add('disable');
      profilePage.classList.remove('disable')
    }

    fineLink.onclick = () => {
      profilePage.classList.add('disable');
      finePage.classList.remove('disable')
    }

    const balanceView = document.querySelector('.header__balance');
    const userTitle = document.querySelector('.user__title-name');
    userTitle.innerText = `${storage.email}`;
    const balanceForm = document.querySelector('.user__balance-form');
    const balance = await getBalance({token: userInfoObj.token})

    balanceView.innerText = `Balance: ${balance.balance}$`

    balanceForm.addEventListener('submit', async(event) => {
      event.preventDefault();
      const body = new FormData(balanceForm);

      if (lengthValidate(balanceForm.elements.amount, 1, 1000000) !== ''){
        return
      }

      await topUpBalance(body, {token: userInfoObj.token})
      const balance = await getBalance({token: userInfoObj.token})

      balanceView.innerText = `Balance: ${balance.balance}$`
      balanceForm.reset();
    })

    changeEmailForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailChangeErrMessage = document.querySelector('.user__change-email-error');
      const body = new FormData(changeEmailForm);

      if (lengthValidate(changeEmailForm.elements.email, 6,40) !== ''){
        return
      }

      try {
        emailChangeErrMessage.innerText = '';
        changeEmailForm.reset();

        const { email } =  await changeEmail(body, {token: userInfoObj.token});;

        apiClient.headers.email = email;
        storage.email = email
        userTitle.innerText = `${storage.email}`

        alert('Email successful updated')

      } catch (error) {
        emailChangeErrMessage.innerText = error.data.message
      }
    });

    changePasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailChangePassMessage = document.querySelector('.user__change-password-error');
      const body = new FormData(changePasswordForm);

      if (lengthValidate(changePasswordForm.elements.oldPassword, 8,50) !== '' ||
        lengthValidate(changePasswordForm.elements.password, 8,50) !== '') {
        return
      }

      try {
        await changePassword(body, {token: userInfoObj.token})

        emailChangePassMessage.innerText = '';
        changePasswordForm.reset()
        alert('Password successful updated')

      } catch (error) {
        emailChangePassMessage.innerText = error.data.message
      }
    });

//FINES

    const fines = await getFines({token: userInfoObj.token});
    finesRender(fines);

    const list = document.querySelector('.user__fines-list');

    list.addEventListener('click', async(event) => {
      const target = event.target;

      if (event.target.matches('button')) {

        const targetItem = target.closest('li');
        const amount = targetItem.querySelector('.user__fines-amount');
        const amountValue = amount.dataset.value;
        const paidStatus = targetItem.querySelector('.user__fines-status');

        const balance = await getBalance({token: userInfoObj.token})


        if (balance.balance < amountValue) {
          alert('You don`t have enough money!');
          return
        }

        try {
          await payFine(targetItem.value, { token: userInfoObj.token })

          balanceView.innerText = `Balance: ${balance.balance - amountValue}$`
          targetItem.classList.add('user__fines-item-paid');
          event.target.classList.add('disable')
          paidStatus.dataset.value = 'true';
          paidStatus.innerText = 'paid';
        } catch(error){
          alert(error.data.message)
        }
      }

    });
  }

  if (adminPage){

    const select = document.querySelector('.admin__form-select');
    select.innerHTML = '';

    const users = await getUsers({token: userInfoObj.token});

    users.forEach(function({ id, email, name }) {
      const text = `${id} - ${name} - ${email}`
      const newOption = new Option(text, id);
      select.add(newOption);
    })

    fineForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const body = new FormData(fineForm);

      if (!fineForm.elements.userId.value || !fineForm.elements.description.value || !fineForm.elements.amount.value || !fineForm.elements.deadline.value){
        const formEl = [fineForm.elements.userId, fineForm.elements.description, fineForm.elements.amount, fineForm.elements.deadline]
        formEl.forEach(function(item){
            if (item.value === ''){
              return item.nextElementSibling.innerText = 'This field is required'
            } else {
              item.nextElementSibling.innerText = ''
            }
          })
        return
      }
        await makeFine(body,{token: userInfoObj.token});
        fineForm.reset()
    })
  }

  console.log(sessionStorage.userinfo)
});
