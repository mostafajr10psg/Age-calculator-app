const form = document.forms[0];
const dayInput = form.querySelector(".day input");
const monthInput = form.querySelector(".month input");
const yearInput = form.querySelector(".year input");
const ageInputs = form.querySelectorAll("input");
let formSubmitted = false;

yearInput.max = new Date().getFullYear();

const userAge = document.querySelectorAll(".age-result output p span");

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function handleInValidInput(input, errMsg) {
  input.parentElement.classList.add("invalid");
  const errEle = input.nextElementSibling;
  errEle.classList.remove("hidden");
  if (errMsg) errEle.textContent = errMsg;
  input.setAttribute("aria-invalid", "true");
}

function handleValidInput(input) {
  input.parentElement.classList.remove("invalid");
  input.nextElementSibling.classList.add("hidden");
  input.removeAttribute("aria-invalid");
}

function handleInvalidRangeInput(input) {
  handleInValidInput(input, input.dataset.invalidRange);
}

function handleEmptyInput(input) {
  handleInValidInput(input, "this filed is required");
}

function unSetUserAge() {
  for (const age of userAge) age.textContent = "--";
}

function isValidDay() {
  const monthDays = getDaysInMonth(yearInput.value, monthInput.value);
  if (dayInput.value > 0 && dayInput.value <= monthDays) {
    handleValidInput(dayInput);
    return true;
  } else {
    handleInvalidRangeInput(dayInput);
    return false;
  }
}

function handleBlurEvent() {
  ageInputs.forEach((input) => {
    input.addEventListener("blur", (e) => {
      e.target.value === "" ? handleEmptyInput(input) : "";
    });
  });
}

function chckInputValidity(input) {
  if (input.value !== "" && !input.validity.valid) handleInvalidRangeInput(input);
  else handleValidInput(input);
}

function handleInValidEvent(input) {
  input.addEventListener("invalid", (e) => {
    unSetUserAge();
    e.preventDefault();
    chckInputValidity(input);
    if (input.value === "") handleEmptyInput(input);
    formSubmitted = true;
    handleBlurEvent();
  });
}

function handleChangeEvent(input) {
  input.addEventListener("input", () => {
    if (formSubmitted) {
      isValidDay();
      chckInputValidity(input);
      if (input === yearInput && formSubmitted) {
        if (input.validity.rangeUnderflow) {
          handleInValidInput(input, `value must be >= 1700`);
        }
        if (input.validity.rangeOverflow) {
          handleInValidInput(input, `value must be <= ${new Date().getFullYear()}`);
        }
      }
    }
  });
}

ageInputs.forEach((input) => {
  handleInValidEvent(input);
  handleChangeEvent(input);
});

function getAndCalcUserBirthdate() {
  const dateNow = new Date();
  const userBirthdate = new Date(+yearInput.value, +monthInput.value - 1, +dayInput.value);
  const currentDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());

  let calcDays = currentDate.getDate() - userBirthdate.getDate();
  let calcMonths = currentDate.getMonth() - userBirthdate.getMonth();
  let calcYears = currentDate.getFullYear() - userBirthdate.getFullYear();

  function handleSimilarDate() {
    if (calcYears === 0) {
      if (calcMonths < 0) {
        unSetUserAge();
        return handleInValidInput(monthInput, "Must be in the past");
      } else if (calcMonths === 0 && calcDays <= 0) {
        unSetUserAge();
        return handleInValidInput(dayInput, "Must be in the past");
      }
    }
  }

  handleSimilarDate();

  function calcUserAge() {
    const getUserMonthAndDay = new Date(
      currentDate.getFullYear(),
      userBirthdate.getMonth(),
      userBirthdate.getDate(),
    );

    const hasHadBirthday = currentDate >= getUserMonthAndDay;

    if (!hasHadBirthday) calcYears--;

    if (calcMonths < 0) {
      calcMonths = 12 - Math.abs(calcMonths);
    }

    if (calcDays < 0) {
      calcMonths === 0 ? (calcMonths = 11) : calcMonths--;
      calcDays = getDaysInMonth(yearInput.value, monthInput.value) - Math.abs(calcDays);
    }
  }

  function setUserAge() {
    const calcs = [calcYears, calcMonths, calcDays];
    for (let i = 0; i < calcs.length; i++) userAge[i].textContent = calcs[i];
  }

  calcUserAge();
  setUserAge();
}

form.addEventListener("submit", (e) => {
  console.log("data submited");
  e.preventDefault();
  handleBlurEvent();
  formSubmitted = true;
  if (!isValidDay()) return;
  getAndCalcUserBirthdate();
});
