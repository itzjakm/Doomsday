const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
function randomNum(MIN_NUMBER, MAX_NUMBER) {
  return Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
}
const maxYear = 3000;
function getRandomDate() {
  const date = new Date(
    randomNum(0, maxYear),
    randomNum(0, 11),
    randomNum(0, 31)
  );
  return date;
}
function eraseClasses() {
  [...document.querySelectorAll('button')].forEach(button => {
    button.classList.remove('button-correct');
    button.classList.remove('button-incorrect');
    button.classList.remove('button-highlight');
  });
}

function displayDate() {
  eraseClasses();
  date = getRandomDate();
  const string = `${date.getDate()}/${
    monthNames[date.getMonth()]
  }/${date.getFullYear()}`;
  document.querySelector('h1').textContent = string;
  console.log(date.getDay());
}
displayDate();
document.querySelector('.buttons').addEventListener('click', e => {
  const button = e.target.closest('button');
  if (!button) return;
  const correctDay = new Date(
    document.querySelector('h1').textContent
  ).getDay();
  const result = correctDay === dayNames.indexOf(button.innerText);
  if (result) button.classList.add('button-correct');
  else {
    button.classList.add('button-incorrect');
    [...document.querySelectorAll('button')]
      .find(e => e.innerText === dayNames[correctDay])
      .classList.add('button-highlight');
  }
  button.blur();
});
function reset(keyboard) {
  return e => {
    if (keyboard) if (e.key !== ' ') return;
    displayDate();
  };
}
document.addEventListener('keydown', reset(true));
document.querySelector('.container').addEventListener('dblclick', reset(false));
