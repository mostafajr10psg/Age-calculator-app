const form = document.forms[0];
const dayInput = form.querySelector(".day input");
const monthInput = form.querySelector(".month input");
const yearInput = form.querySelector(".year input");
const allInputs = form.querySelectorAll("input");

const userAge = document.querySelectorAll(".user-age > p output");

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function inValidInput(input, errMsg) {
  input.previousElementSibling.classList.add("color-red");
  input.classList.add("border-red");
  function handleErrorEle() {
    const errorEle = input.nextElementSibling;
    errorEle.classList.remove("hidden");
    errMsg ? (errorEle.textContent = errMsg) : "";
  }
  handleErrorEle();
  return false;
}

function validInput(input) {
  input.previousElementSibling.classList.remove("color-red");
  input.classList.remove("border-red");
  input.nextElementSibling.classList.add("hidden");
}

function removeAriaInvalidAttr() {
  for (const input of allInputs) input.removeAttribute("aria-invalid");
}

function addAriaInvalidAttr() {
  for (const input of allInputs) input.setAttribute("aria-invalid", "true");
}

function handleEmptyInput() {
  for (const input of allInputs) !input.value ? inValidInput(input) : validInput(input);
}

function unSetUserAge() {
  for (const age of userAge) age.value = "--";
}

function isEmptyInput(input) {
  return input.value === "" ? true : false;
}

function checkInputsValidation() {
  let validDay = false;
  let validYear = false;
  const monthDays = getDaysInMonth(yearInput.value, monthInput.value);

  function isValidDay() {
    if (isEmptyInput(dayInput)) return;
    +dayInput.value <= monthDays
      ? (validDay = true)
      : inValidInput(dayInput, "Must be a valid day");
  }

  function isValidYear() {
    if (isEmptyInput(yearInput)) return;
    +yearInput.value >= 1700 && +yearInput.value <= now.getFullYear()
      ? (validYear = true)
      : inValidInput(yearInput, "Must be a valid year");
    +yearInput.value > now.getFullYear() ? inValidInput(yearInput, "Must be in the past") : "";
  }

  isValidDay();
  isValidYear();

  return !validDay || !validYear ? false : true;
}

function handleSimilarDate(calcDays, calcMonths, calcYears) {
  if (calcYears === 0) {
    if (calcMonths < 0) return inValidInput(monthInput, "Must be in the past");
    else if (calcMonths === 0 && calcDays <= 0) {
      return inValidInput(dayInput, "Must be in the past");
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

  if (handleSimilarDate(calcDays, calcMonths, calcYears) === false) return unSetUserAge();

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
      calcDays = getDaysInMonth(yearInput.value, monthInput.value) - -calcDays;
    }
  }

  function setUserAge() {
    let calcs = [calcYears, calcMonths, calcDays];
    for (let i = 0; i < calcs.length; i++) userAge[i].value = calcs[i];
  }

  calcUserAge();
  setUserAge();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleEmptyInput();
  if (!checkInputsValidation()) {
    addAriaInvalidAttr();
    unSetUserAge();
  } else getAndCalcUserBirthdate();
});

//when input's valid
// dayInput.removeAttribute("aria-invalid");
// monthInput.removeAttribute("aria-invalid");
// yearInput.removeAttribute("aria-invalid");
