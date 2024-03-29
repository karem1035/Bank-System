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

const accounts = [account1, account2];

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

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>

      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
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
  labelBalance.innerHTML = `${acc.balance.toFixed(2)} €`;
};

/**
 * calcDisplaySummary - calculate and displays all the desposits
 */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `-${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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
let currentAccount;

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
    updateUi(currentAccount);
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
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
    inputLoanAmount.value = '';
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

const future1 = new Date(2037, 5, 10, 10, 10, 10);
const future2 = new Date(2037, 5, 20, 10, 10, 10);
