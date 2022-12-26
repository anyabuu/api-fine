import './scss/style.scss';

document.addEventListener('DOMContentLoaded', async () => {
  const HOST = 'http://localhost:3000/api';
  const storage = sessionStorage.userinfo
    ? JSON.parse(sessionStorage.userinfo)
    : {};

  const login = document.querySelector('.login-form-wrapper');
  const loginForm = document.querySelector('.authorization__login-form');
  const loginButton = document.querySelector('.registration__login-button');

  const registration = document.querySelector('.registration-form-wrapper');
  const registrationForm = document.querySelector('.registration__form');
  const registrationButton = document.querySelector(
    '.authorization__registration-button'
  )

  const userPage = document.querySelector('.user');
  const adminPage = document.querySelector('.admin');
  const fineForm = document.querySelector('.admin__fine-form');

  const profilePage = document.querySelector('.user__profile');
  const changeEmailForm = document.querySelector('.user__change-email-form');
  const changePasswordForm = document.querySelector('.user__change-password-form');

  const logoutButton = document.querySelector('.header__nav-link-logout');

  function lengthValidate(element, minLength, maxLength) {
    if (element.value.length < minLength || element.value.length > maxLength) {
      return element.nextElementSibling.innerText = `*It should be more then ${minLength} and less then ${maxLength} symbols!`;
    } else {
      return element.nextElementSibling.innerText = '';
    }
  }

  if (registrationButton) {
    registrationButton.onclick = () => {
      login.classList.add('disable');
      registration.classList.remove('disable');
      loginForm.reset();
    };
  }

  if (loginButton) {
    loginButton.onclick = () => {
      registration.classList.add('disable');
      login.classList.remove('disable');
      registrationForm.reset();
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

      const registerErrorMessage = document.querySelector('.registration__general-error-message');

      if (lengthValidate(registrationForm.elements.name, 4,40) === ''
      &&
      lengthValidate(registrationForm.elements.email, 6, 50) === ''
      &&
      lengthValidate(registrationForm.elements.password, 8, 50) === ''){

        const body = new FormData(registrationForm);

        fetch(`${HOST}/register`, {
          body,
          method: "POST",
        })
          .then((response) => {

            return Promise.all([response.json(), response.ok]);

          })
          .then(([data, isOk]) => {

            if (!isOk) {
              registerErrorMessage.innerText = data.message;
              throw new Error(data.message);
            }

            registerErrorMessage.innerText = ''

            fetch(`${HOST}/login`, {
              method: "POST",
              body,
            })
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                storage.token = data.token;
                storage.email = data.email;
                sessionStorage.userinfo = JSON.stringify(storage);
                location.href = 'http://localhost:4002/user.html';
              })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
  }



  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const loginErrorMessage = document.querySelector('.authorization__general-error-message');

      if (lengthValidate(loginForm.elements.email, 6, 50) === ''
        &&
        lengthValidate(loginForm.elements.password, 8, 50) === ''){

        const body = new FormData(loginForm);

        fetch(`${HOST}/login`, {
          body,
          method: "POST",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {

            console.log(data)
            console.log(data.name)

            if (data.token) {
              storage.token = data.token;
              storage.email = data.email;
              console.log(storage.token)
              sessionStorage.userinfo = JSON.stringify(storage);


              if (data.email === 'admin@rammfall.com'){
                location.href = 'http://localhost:4002/admin.html';
                return
              }

              location.href = 'http://localhost:4002/user.html';

              return
            }
            loginErrorMessage.innerText = data.message;
            throw new Error(data.message);
          })
          .catch((err) => {
            console.log(err)
          })
      }
    });
  }

  const userInfoObj = JSON.parse(sessionStorage.getItem('userinfo'))


  if (userPage){
    const userTitle = document.querySelector('.user__title-name');
    userTitle.innerText = `${storage.email}`


    changeEmailForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailChangeErrMessage = document.querySelector('.user__change-email-error');
      const body = new FormData(changeEmailForm);

      if (lengthValidate(changeEmailForm.elements.email, 6,40) !== ''){
        return
      }

      fetch(`${HOST}/account/email`, {
        body,
        method: "PATCH",
        headers: { token: userInfoObj.token }

      })
        .then((response) => {
          return Promise.all([response.json(), response.ok]);
        })
        .then(([data, isOk]) => {

          if (!isOk) {
            emailChangeErrMessage.innerText = data.message;
            throw new Error(data.message);
          }

          emailChangeErrMessage.innerText = '';
          changeEmailForm.reset()
          storage.email = data.email
          userTitle.innerText = `${storage.email}`

          alert('Email successful updated')

        })
        .catch((err) => {
          console.log(err)
        })
    })

    changePasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailChangePassMessage = document.querySelector('.user__change-password-error');
      const body = new FormData(changePasswordForm);

      if (lengthValidate(changePasswordForm.elements.oldPassword, 8,50) !== '' ||
        lengthValidate(changePasswordForm.elements.password, 8,50) !== '') {
        return
      }

      fetch(`${HOST}/account/password`, {
        body,
        method: "PATCH",
        headers: { token: userInfoObj.token }

      })
        .then((response) => {
          return Promise.all([response.json(), response.ok]);
        })
        .then(([data, isOk]) => {

          if (!isOk) {
            emailChangePassMessage.innerText = data.message;
            throw new Error(data.message);
          }

          emailChangePassMessage.innerText = '';
          changePasswordForm.reset()

          alert(data.message)

        })
        .catch((err) => {
          console.log(err)
        })
    })
  }



  if (adminPage){
    fineForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const body = new FormData(fineForm);

      fetch(`${HOST}/fine`, {
        body,
        method: "POST",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }


  console.log(sessionStorage.userinfo)

});
