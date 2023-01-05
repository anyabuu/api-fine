const list = document.querySelector('.user__fines-list');

export const finesRender = (fines) => {
  list.innerHTML = '';

  fines.forEach(({ id, description, deadline, amount, paid }) => {
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
})}

