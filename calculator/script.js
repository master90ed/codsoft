var expression = "";
var justGotResult = false;

var exprBox = document.getElementById("expression");
var resultBox = document.getElementById("result");

function pressKey(key) {
  // if user just got a result and types a number, start fresh
  if (justGotResult && key !== "+" && key !== "-" && key !== "*" && key !== "/") {
    expression = "";
  }
  justGotResult = false;

  expression += key;
  updateScreen();
}

function pressDot() {
  // don't add dot if current number already has one
  var parts = expression.split(/[\+\-\*\/]/);
  var lastPart = parts[parts.length - 1];
  if (lastPart.includes(".")) return;

  expression += ".";
  updateScreen();
}

function clearAll() {
  expression = "";
  justGotResult = false;
  exprBox.textContent = "";
  resultBox.textContent = "0";
  resultBox.style.fontSize = "36px";
}

function deleteLast() {
  expression = expression.slice(0, -1);
  resultBox.textContent = expression || "0";
  updateScreen();
}

function doPercent() {
  if (!expression) return;
  try {
    var val = eval(expression);
    expression = (val / 100).toString();
    resultBox.textContent = expression;
    updateScreen();
  } catch (e) {}
}

function getResult() {
  if (!expression) return;
  try {
    var val = eval(expression);
    if (!isFinite(val)) {
      resultBox.textContent = "Error";
      expression = "";
      return;
    }
    // show the expression on top, answer on bottom
    exprBox.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷") + " =";
    var answer = parseFloat(val.toFixed(10)).toString();
    resultBox.textContent = answer;
    adjustFontSize(answer);
    expression = answer;
    justGotResult = true;
  } catch (e) {
    resultBox.textContent = "Error";
    expression = "";
  }
}

function updateScreen() {
  exprBox.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷");

  // show live result while typing
  try {
    var val = eval(expression);
    if (isFinite(val)) {
      var answer = parseFloat(val.toFixed(10)).toString();
      resultBox.textContent = answer;
      adjustFontSize(answer);
    }
  } catch (e) {}
}

function adjustFontSize(text) {
  if (text.length > 12) {
    resultBox.style.fontSize = "22px";
  } else {
    resultBox.style.fontSize = "36px";
  }
}

// keyboard support
document.addEventListener("keydown", function(e) {
  if (e.key >= "0" && e.key <= "9") pressKey(e.key);
  else if (e.key === "+") pressKey("+");
  else if (e.key === "-") pressKey("-");
  else if (e.key === "*") pressKey("*");
  else if (e.key === "/") pressKey("/");
  else if (e.key === "Enter" || e.key === "=") getResult();
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === ".") pressDot();
  else if (e.key === "%") doPercent();
});
