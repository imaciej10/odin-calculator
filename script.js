function operate(arr, operator) {
  for (let digits in arr) {
    equations.num1 = arr[digits - 1];
    equations.num2 = arr[digits];
  }
  switch (operator) {
    case "+":
      equations.result = add(equations.num1, equations.num2);
      break;
    case "-":
      equations.result = substract(equations.num1, equations.num2);
      break;
    case "x":
      equations.result = multiply(equations.num1, equations.num2);
      break;
    case "/":
      if (equations.num2 === 0) {
        break;
      }
      equations.result = divide(equations.num1, equations.num2);
      break;
  }

  if (equations.result % 1 !== 0) {
    return format(equations.result);
  }

  return equations.result;
}

function add(num1, num2) {
  return num1 + num2;
}

function substract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function clearDisplay() {
  display.value = "";
}

function clearEquationScreen() {
  equationScreen.textContent = "";
}

function eraseChar() {
  display.value = display.value.slice(0, -1);
}

function isInput() {
  return display.value.length > 0 && typeof +display.value === "number";
}

function format(result) {
  result = result.toFixed(1);
  return parseFloat(result);
}

function isEquationScreen() {
  return equationScreen.textContent !== "";
}

function updateOperator(currOperator) {
  calculation.previousOperator = currOperator;
}

function resetTotalResult() {
  calculation.aggResult = 0;
}

function addToArray(arr, value) {
  return arr.push(value);
}

function updateEquationScreen(value, operator) {
  equationScreen.textContent = value + " " + operator;
}

function updateInputScreen(value) {
  display.value = value;
}

function arrayIsEmpty(arr) {
  return arr.length === 0;
}

function handleZeroDivision(arr) {
  clearDisplay();
  equationScreen.textContent = "lol";
  calculation.aggResult = 0;
  calculation.activeInput = false;
  calculation.zeroDivision = false;
  return (arr = []);
}

function handleFunctionClick(operator) {
  console.log("Previous" + calculation.previousOperator);
  console.log("Current" + operator);

  if (arrayIsEmpty(numArr) && calculation.activeInput === false) return;

  if (isEquationScreen() && equationScreen.textContent.includes("=")) {
    numArr.pop();
    addToArray(numArr, +display.value);
    updateEquationScreen(numArr[0], operator);
    calculation.activeInput = false;
    isScreenCleared = false;
    return;
  }

  if (
    calculation.activeInput === false &&
    operator !== calculation.previousOperator
  ) {
    updateEquationScreen(numArr[0], operator);
    updateOperator(operator);
    return;
  }
  if (isScreenCleared === false && operator === calculation.previousOperator)
    return;

  console.log(calculation.operator + " " + calculation.previousOperator);
  if (isEquationScreen() && !equationScreen.textContent.includes(operator)) {
    console.log("entered 1");
    console.log(display.value);
    if (
      equationScreen.textContent === "lol" &&
      calculation.previousOperator === "/"
    ) {
      updateEquationScreen(+display.value, operator);
      addToArray(numArr, +display.value);
      calculation.activeInput = false;
      clearDisplay();
      return;
    }
    addToArray(numArr, +display.value);
    calculation.aggResult = operate(numArr, calculation.previousOperator);
    updateOperator(operator);
    updateEquationScreen(calculation.aggResult, calculation.previousOperator);
    isScreenCleared = false;
    calculation.activeInput = false;
    numArr = [calculation.aggResult];
    return;
  }

  if (isInput() && !isEquationScreen() && calculation.zeroDivision === false) {
    console.log("entered 2");
    updateEquationScreen(+display.value, operator);
    addToArray(numArr, +display.value);
    updateOperator(operator);
    clearDisplay();
    return;
  }

  if (isInput() && isEquationScreen() && numArr.length === 1) {
    console.log("entered 3");
    equationScreen.textContent += display.value;
    addToArray(numArr, +display.value);
    updateOperator(operator);
    clearDisplay();
  }

  console.log(numArr);
  if (numArr.length === 1) return;
  if (numArr[1] === 0 && operator === "/") {
    calculation.zeroDivision === true;
    handleZeroDivision(numArr);
    return;
  }
  console.log("entered 4");
  calculation.aggResult = operate(numArr, operator);
  updateInputScreen(calculation.aggResult);
  updateEquationScreen(calculation.aggResult, operator);
  isScreenCleared = false;
  calculation.activeInput = false;
  numArr = [calculation.aggResult];
}

let isScreenCleared;
let numArr = [];

let calculation = {
  operator: "",
  previousOperator: "",
  aggResult: 0,
  prevOperand: "",
  activeInput: "",
  zeroDivion: "",
};
let equations = {
  num1: "",
  num2: "",
  result: "",
};

const display = document.querySelector("#screen");
const calculator = document.querySelector("#case");
const equationScreen = document.querySelector("#result");

calculator.addEventListener("click", (event) => {
  let num;
  let target = event.target;
  calculation.zeroDivision = false;

  if (target.classList.contains("number")) {
    if (!isScreenCleared) {
      clearDisplay();
    }
    isScreenCleared = true;
    num = +target.id;
    calculation.activeInput = true;
    display.value += num;
  }

  switch (target.id) {
    case "add":
      calculation.operator = "+";
      handleFunctionClick(calculation.operator);
      break;

    case "multiply":
      calculation.operator = "x";
      handleFunctionClick(calculation.operator);
      break;

    case "divide":
      calculation.operator = "/";
      handleFunctionClick(calculation.operator);
      break;

    case "substract":
      calculation.operator = "-";
      handleFunctionClick(calculation.operator);
      break;

    case "delete":
      eraseChar();
      break;

    case "float":
      if (display.value.includes(".")) {
        break;
      }
      display.value += ".";
      break;

    case "equals":
      if (arrayIsEmpty(numArr)) break;
      let value1;
      let value2;

      if (calculation.activeInput === false) {
        addToArray(numArr, calculation.prevOperand);
        value1 = numArr[0];
        value2 = numArr[1];
      } else {
        addToArray(numArr, +display.value);
        value1 = numArr[0];
        value2 = numArr[1];
      }

      if (value2 === 0 && calculation.operator === "/") {
        calculation.zeroDivision === true;
        handleZeroDivision(numArr);
        numArr = [];
        updateOperator(calculation.operator);
        console.log(calculation.previousOperator);
        break;
      }

      calculation.aggResult = operate(numArr, calculation.operator);
      console.log(calculation.aggResult);
      equationScreen.textContent = `${value1} ${calculation.operator} ${value2} =`;
      updateInputScreen(calculation.aggResult);
      isScreenCleared = false;
      calculation.activeInput = false;
      calculation.prevOperand = value2;
      numArr = [calculation.aggResult];
      break;
    case "clear":
      clearEquationScreen();
      clearDisplay();
      numArr = [];
      resetTotalResult();
      break;

    case "toggle":
      if (+display.value) {
        display.value = -+display.value;
      }
      break;

    default:
      break;
  }
});

calculator.addEventListener("keydown", (event) => {
  let num;
  let target = event.target;
  let key = event.key;

  if (target.classList.contains("number")) {
    if (!isScreenCleared) {
      clearDisplay();
    }
    isScreenCleared = true;
    num = +key;
    calculation.activeInput = true;
    display.value += num;
  }
});
