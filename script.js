'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-03-12T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2013-11-01T13:15:33.035Z',
    '2013-11-30T09:48:16.867Z',
    '2013-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Emily Johnson',
  movements: [1200, -300, 600, -200, 800, -100, -400],
  interestRate: 0.8,
  pin: 3333,

  movementsDates: [
    '2024-04-12T11:31:17.178Z',
    '2024-04-15T09:22:02.383Z',
    '2024-04-17T13:15:04.904Z',
    '2024-04-19T08:47:24.185Z',
    '2024-04-20T16:21:59.604Z',
    '2024-04-22T18:42:17.194Z',
    '2024-04-25T22:19:17.929Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Michael Smith',
  movements: [2500, -800, 1000, -1500, 700, -200, 400],
  interestRate: 1.0,
  pin: 4444,

  movementsDates: [
    '2024-05-01T09:45:33.035Z',
    '2024-05-03T15:28:16.867Z',
    '2024-05-05T18:09:23.907Z',
    '2024-05-07T10:30:46.235Z',
    '2024-05-08T13:52:06.386Z',
    '2024-05-10T16:07:26.374Z',
    '2024-05-12T19:55:59.371Z',
  ],
  currency: 'CAD',
  locale: 'en-CA',
};
const account5 = {
  owner: 'Ahmed Ali',
  movements: [800, -100, 200, -50, 600, -200],
  interestRate: 1.1,
  pin: 5555,

  movementsDates: [
    '2024-05-05T09:45:33.035Z',
    '2024-05-06T15:28:16.867Z',
    '2024-05-07T18:09:23.907Z',
    '2024-05-08T10:30:46.235Z',
    '2024-05-09T13:52:06.386Z',
    '2024-05-10T16:07:26.374Z',
  ],
  currency: 'SAR',
  locale: 'ar-SA',
  region: 'Saudi Arabia',
};

const accounts = [account1, account2, account3, account4, account5];
/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementsDate = function (date) {
  const calcDayspassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayesPass = calcDayspassed(new Date(), date);

  if (dayesPass === 0) {
    return 'Today';
  } else if (dayesPass === 1) {
    return 'Yester Day';
  } else if (dayesPass <= 7) {
    return `${dayesPass} days ago`;
  } else {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

/**
 * return a formatted currency
 */
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * displayMovements - displays the movements of a user on the DOM
 * @movements - account.movements
 */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>

      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    console.log(min);

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  // Set the time
  let time = 600;

  // Call the timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/**
 * adds a username value to the accounts array objs
 */
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUserName(accounts);

/**
 * calcPrintBalane - Calculates and prints the account balance
 */
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => (acc += curr), 0);
  const formattedBal = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.innerHTML = `${formattedBal}`;
};

/**
 * calcDisplaySummary - calculate and displays all the desposits
 */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const incFormatted = formatCur(incomes, acc.locale, acc.currency);

  labelSumIn.textContent = `${incFormatted}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  const outFormatted = formatCur(out, acc.locale, acc.currency);
  labelSumOut.textContent = `${outFormatted}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int);

  const intFormatted = formatCur(interest, acc.locale, acc.currency);

  labelSumInterest.textContent = `${intFormatted}`;
};

const updateUi = function (acc) {
  // Display Movements
  displayMovements(acc);
  // Display balance
  calcPrintBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// Event Handler
let currentAccount, timer;

// Date

// Login Validation and Display
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';

    // Current Date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, '0');
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const year = now.getFullYear();
    labelDate.textContent = ` ${day}/${month}/${year}`;

    updateUi(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/**
 * Transferring money between accounts
 */
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const reciverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movements.push(amount);
    reciverAcc.movementsDates.push(new Date().toISOString());

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUi(currentAccount);

    // Resetting Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
  } else {
    console.log('Not Deleted');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/**
 *  Adds a loan to the bank account
 */
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUi(currentAccount);
      inputLoanAmount.value = '';

      // Resetting Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
});

/**
 * Make a sorted button to sort the transactions
 */
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// /////////////////////////////////
