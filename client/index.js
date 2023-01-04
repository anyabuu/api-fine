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
            if (data.token) {
              storage.token = data.token;
              storage.email = data.email;
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

    const balance = document.querySelector('.header__balance');
    const userTitle = document.querySelector('.user__title-name');
    userTitle.innerText = `${storage.email}`;
    const balanceForm = document.querySelector('.user__balance-form');

     fetch(`${HOST}/balance`, {
      method: "GET",
      headers: { token: userInfoObj.token }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        balance.innerText = `Balance: ${data.balance}$`
      })
      .catch((err) => {
        console.log(err)
      })

    balanceForm.addEventListener('submit', async(event) => {
      event.preventDefault();
      const body = new FormData(balanceForm);

      if (lengthValidate(balanceForm.elements.amount, 1, 1000000) !== ''){
        console.log('not')
        return
      }

      fetch(`${HOST}/balance/top-up`, {
        body,
        method: "POST",
        headers: { token: userInfoObj.token }

      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {

          fetch(`${HOST}/balance`, {
            method: "GET",
            headers: { token: userInfoObj.token }
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              balance.innerText = `Balance: ${Number(data.balance)} $`
            })
            .catch((err) => {
              console.log(err)
            })

          balanceForm.reset();
          alert(data.message)

        })
        .catch((err) => {
          console.log(err)
        })
    })


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


    fetch(`${HOST}/fines`, {
      method: "GET",
      headers: { token: userInfoObj.token }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {

        console.log(data)
        const list = document.querySelector('.user__fines-list');

        list.innerHTML = ''

        data.forEach(function({ id, description, deadline, amount, paid }){
          const listItem = document.createElement('li');
          listItem.classList.add('user__fines-item');
          listItem.setAttribute('value', `${id}`);

          const date = new Date(Date.parse(deadline));
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDay();
          const yearDate = [
            day.toString().padStart(2, '0'),
            month.toString().padStart(2, '0'),
            year,
          ].join('-')

          let paidStatus = 'unpaid'

          if (paid === true) {
            paidStatus = 'paid'
            listItem.classList.add('user__fines-item-paid')
          }

          listItem.innerHTML =
            `
            <div class='user__fines-description user__fines-cell'>
              ${description}
            </div>
             <div class='user__fines-amount user__fines-cell' data-value='${amount}'>
              ${amount}$
            </div>
            <div class='user__fines-deadline user__fines-cell'>
              ${yearDate}
            </div>
            <div class='user__fines-status user__fines-cell' data-value='${paid}'>
              ${paidStatus}
            </div>
            <button class='user__fines-pay-button button'>
              Pay
            </button>
            `

          if (paid === true) {
            const button = document.querySelector('.user__fines-pay-button');
            button.classList.add('disable')
          }


          list.append(listItem);
        })


        //PAY FINE

        list.addEventListener('click', function(event) {
          const target = event.target;

          if (event.target.matches('button')) {

            const targetItem = target.closest('li');
            const amount = targetItem.querySelector('.user__fines-amount');
            const amountValue = amount.dataset.value;
            const paidStatus = targetItem.querySelector('.user__fines-status');
            let paidStatusValue = paidStatus.dataset.value;


            fetch(`${HOST}/pay/fine/${targetItem.value}`, {
              method: 'PATCH',
              headers: { token: userInfoObj.token },

            })
              .then((response) => {
                console.log(response);
                return response.json();
              })
              .then((dat) => {
                console.log(dat);


                fetch(`${HOST}/balance`, {
                  method: "GET",
                  headers: { token: userInfoObj.token }
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data)

                    if (data.balance < amountValue) {
                      return
                    }

                    console.log('errrrrrrrr')

                    balance.innerText = `Balance: ${data.balance - amountValue}$`
                    targetItem.classList.add('user__fines-item-paid');
                    event.target.classList.add('disable')

                    paidStatus.dataset.value = 'true';
                    paidStatus.innerText = 'paid';

                  })
                  .catch((err) => {
                    console.log(err)
                  })

                alert(dat.message);


              })
              .catch((err) => {
                console.log(err);
              });


          }

        });


      })
      .catch((err) => {
        console.log(err)
      })


  }



  if (adminPage){

    fetch(`${HOST}/users`, {
          method: "GET",
          headers: { token: userInfoObj.token }
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const select = document.querySelector('.admin__form-select');
            select.innerHTML=''
            data.forEach(function({ id, email, name }){
              const text = `${id} - ${name} - ${email}`
              const newOption = new Option(text, id);
              select.add(newOption);
            })
          })
          .catch((err) => {
            console.log(err)
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


      fetch(`${HOST}/fine`, {
        body,
        method: "POST",
        headers: { token: userInfoObj.token }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data)
          fineForm.reset()
          alert(data.message)

        })
        .catch((err) => {
          console.log(err)
        })
    })
  }


  console.log(sessionStorage.userinfo)

});
