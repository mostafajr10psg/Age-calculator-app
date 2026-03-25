const dayInput = document.querySelector(".calc-user-age .day input");
const monthInput = document.querySelector(".calc-user-age .month input");
const yearInput = document.querySelector(".calc-user-age .year input");
const allInputs = document.querySelectorAll(".calc-user-age input");

const userAgeInYears = document.querySelector(".user-age .years span");
const userAgeInMonths = document.querySelector(".user-age .months span");
const userAgeInDays = document.querySelector(".user-age .days span");

const userAge = document.querySelectorAll(".user-age div span");

const monthsWithTheirDays = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

function inValidInput(input, errMsg) {
  const errorEle = input.nextElementSibling;
  input.previousElementSibling.classList.add("color-red");
  input.classList.add("border-red");
  errorEle.classList.remove("hidden");
  errMsg ? (errorEle.textContent = errMsg) : "";
}

function validInput(input) {
  input.previousElementSibling.classList.remove("color-red");
  input.classList.remove("border-red");
  input.nextElementSibling.classList.add("hidden");
}

function inValidVal(input, inputName) {
  input.value ? inValidInput(input, `Must be a valid ${inputName}`) : "";
}

function unSetUserAge() {
  for (let age of userAge) age.textContent = "--";
}

function checkInputsValidation() {
  let validDay = false;
  let validMonth = false;
  let validYear = false;
  const monthDays = monthsWithTheirDays[+monthInput.value];

  function isValidDay() {
    +dayInput.value > 0 && +dayInput.value <= 31
      ? (validDay = true)
      : inValidVal(dayInput, "day");
  }

  function isValidMonth() {
    if (monthDays) {
      validMonth = true;
      if (+dayInput.value <= 0 || +dayInput.value > monthDays) {
        validDay = false;
        inValidInput(dayInput, "Must be a valid day");
      }
    } else inValidVal(monthInput, "month");
  }

  function isValidYear() {
    +yearInput.value >= 1700 && +yearInput.value <= now.getFullYear()
      ? (validYear = true)
      : inValidVal(yearInput, "year");
  }

  isValidDay();
  isValidMonth();
  isValidYear();

  return !validDay || !validMonth || !validYear ? false : true;
}

function handleSimilarDate(calcDays, calcMonths, calcYears) {
  if (calcYears === 0) {
    if (calcMonths < 0) {
      inValidInput(monthInput, "Must be in the past");
      return false;
    } else if (calcMonths === 0 && calcDays <= 0) {
      inValidInput(dayInput, "Must be in the past");
      return false;
    }
  }
}

const now = new Date();

function getAndCalcUserBirthdate() {
  const userBirthdate = new Date(+yearInput.value, +monthInput.value - 1, +dayInput.value);
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let calcDays = currentDate.getDate() - userBirthdate.getDate();
  let calcMonths = currentDate.getMonth() - userBirthdate.getMonth();
  let calcYears = currentDate.getFullYear() - userBirthdate.getFullYear();

  if (handleSimilarDate(calcDays, calcMonths, calcYears) === false) {
    unSetUserAge();
    return;
  }

  function calcUserAge() {
    const getUserMonthAndDay = new Date(
      currentDate.getFullYear(),
      userBirthdate.getMonth(),
      userBirthdate.getDate(),
    );

    const hasHadBirthday = currentDate >= getUserMonthAndDay;

    if (!hasHadBirthday) calcYears--;

    if (calcMonths < 0) calcMonths = 12 - -calcMonths;

    if (calcMonths === 0) {
      calcDays >= 0 ? (calcMonths = 0) : (calcMonths = 12 - -calcMonths);
    }

    if (calcDays < 0) {
      calcMonths--;
      calcDays = monthsWithTheirDays[+monthInput.value] - -calcDays;
    }
  }

  function setUserAge() {
    let calcs = [calcYears, calcMonths, calcDays];
    for (let i = 0; i < calcs.length; i++) userAge[i].textContent = calcs[i];
  }

  calcUserAge();
  setUserAge();
}

const calcBtn = document.querySelector(".calc-user-age > button");

calcBtn.addEventListener("pointerup", () => {
  for (let input of allInputs) !input.value ? inValidInput(input) : validInput(input);
  if (!checkInputsValidation()) {
    unSetUserAge();
    return;
  }
  getAndCalcUserBirthdate();
});
