const display = document.getElementById("display");
const expression = document.getElementById("expression");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");

let current = "0";
let stored = null;
let operator = null;
let waitingForOperand = false;
let history = [];

function render() {
  display.textContent = current;
  expression.textContent = stored !== null && operator ? `${stored} ${symbol(operator)}` : "\u00a0";
}
function symbol(op) { return ({ "+": "+", "-": "−", "*": "×", "/": "÷" })[op] || op; }
function tidy(n) {
  if (!Number.isFinite(n)) return "Hata";
  const rounded = Number.parseFloat(n.toPrecision(12));
  return String(rounded);
}
function inputDigit(d) {
  if (current === "Hata" || waitingForOperand) {
    current = d; waitingForOperand = false;
  } else if (current === "0") current = d;
  else if (current.length < 14) current += d;
  render();
}
function inputDecimal() {
  if (current === "Hata" || waitingForOperand) { current = "0."; waitingForOperand = false; }
  else if (!current.includes(".")) current += ".";
  render();
}
function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    default: return b;
  }
}
function chooseOperator(next) {
  const input = Number(current);
  if (current === "Hata") return;
  if (stored !== null && operator && !waitingForOperand) {
    current = tidy(calculate(stored, input, operator));
    stored = Number(current);
  } else stored = input;
  operator = next;
  waitingForOperand = true;
  render();
}
function equals() {
  if (stored === null || !operator || current === "Hata") return;
  const a = stored, b = Number(current), op = operator;
  const result = calculate(a, b, op);
  const resultText = tidy(result);
  expression.textContent = `${tidy(a)} ${symbol(op)} ${tidy(b)} =`;
  current = resultText;
  history.unshift({ expression: `${tidy(a)} ${symbol(op)} ${tidy(b)}`, result: resultText });
  history = history.slice(0, 30);
  stored = null; operator = null; waitingForOperand = true;
  renderHistory();
  display.textContent = current;
}
function clearAll() { current = "0"; stored = null; operator = null; waitingForOperand = false; render(); }
function backspace() {
  if (waitingForOperand || current === "Hata") return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
  render();
}
function toggleSign() { if (current !== "0" && current !== "Hata") current = current.startsWith("-") ? current.slice(1) : "-" + current; render(); }
function percent() { if (current !== "Hata") current = tidy(Number(current) / 100); render(); }

document.querySelectorAll("[data-digit]").forEach(btn => btn.addEventListener("click", () => inputDigit(btn.dataset.digit)));
document.querySelectorAll("[data-op]").forEach(btn => btn.addEventListener("click", () => chooseOperator(btn.dataset.op)));
document.querySelectorAll("[data-action]").forEach(btn => btn.addEventListener("click", () => {
  switch (btn.dataset.action) {
    case "clear": clearAll(); break;
    case "backspace": backspace(); break;
    case "decimal": inputDecimal(); break;
    case "sign": toggleSign(); break;
    case "percent": percent(); break;
    case "equals": equals(); break;
  }
}));
document.getElementById("history-toggle").addEventListener("click", () => historyPanel.classList.toggle("hidden"));
document.getElementById("history-clear").addEventListener("click", () => { history = []; renderHistory(); });
function renderHistory() {
  historyList.innerHTML = "";
  if (!history.length) {
    historyList.innerHTML = '<div class="empty-history">Henüz işlem yok</div>';
    return;
  }
  history.forEach(item => {
    const el = document.createElement("div");
    el.className = "history-item";
    const exp = document.createElement("div"); exp.className = "history-expression"; exp.textContent = item.expression;
    const result = document.createElement("div"); result.className = "history-result"; result.textContent = item.result;
    el.append(exp, result);
    el.addEventListener("click", () => { current = item.result; stored = null; operator = null; waitingForOperand = true; render(); historyPanel.classList.add("hidden"); });
    historyList.appendChild(el);
  });
}
document.addEventListener("keydown", e => {
  if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
  else if (e.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
});
render();
