const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("motion") === "reduce";
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const routeD = "M104 666 C125 627 153 601 187 573 C241 528 301 482 361 449 C405 425 445 414 481 403 C526 389 564 396 600 382 C638 366 661 337 685 301 C710 265 730 226 742 187 C752 151 758 112 778 82 C797 55 827 55 839 77 C853 104 831 130 807 147 C777 168 764 201 759 238 C754 280 755 326 739 367 C725 405 700 426 677 447 C650 472 632 502 632 537 C632 574 649 603 645 644";
const routeRoad = document.querySelector("#route-road");
const routeProgress = document.querySelector("#route-progress");
const routeCentre = document.querySelector("#route-centre");
const history = document.querySelector(".history");
const historyTexts = [...document.querySelectorAll(".history-text")];
const runner = document.querySelector("#runner");
const runnerHalo = document.querySelector("#runner-halo");
const kmReadout = document.querySelector("#route-km");
const historyBar = document.querySelector("#history-bar");
const milestonesGroup = document.querySelector("#milestones");
const milestoneFractions = [0.04, 0.23, 0.42, 0.61, 0.8, 0.98];
const svgNS = "http://www.w3.org/2000/svg";

[routeRoad, routeProgress, routeCentre].forEach(path => path.setAttribute("d", routeD));
const routeLength = routeProgress.getTotalLength();
routeProgress.style.strokeDasharray = routeLength;
routeProgress.style.strokeDashoffset = routeLength;

const milestoneNodes = milestoneFractions.map((fraction, index) => {
  const point = routeProgress.getPointAtLength(routeLength * fraction);
  const group = document.createElementNS(svgNS, "g");
  const circle = document.createElementNS(svgNS, "circle");
  const label = document.createElementNS(svgNS, "text");
  group.classList.add("milestone");
  group.setAttribute("transform", `translate(${point.x} ${point.y})`);
  circle.setAttribute("r", "16");
  label.textContent = String(index + 1);
  group.append(circle, label);
  milestonesGroup.append(group);
  return group;
});

let activeHistory = -1;
let scrollFrame = 0;

function setHistoryStep(index) {
  if (index === activeHistory) return;
  activeHistory = index;
  historyTexts.forEach((text, textIndex) => {
    const isVisible = textIndex === index;
    text.classList.toggle("is-visible", isVisible);
    text.setAttribute("aria-hidden", String(!isVisible));
  });
  milestoneNodes.forEach((node, nodeIndex) => {
    node.classList.toggle("is-active", nodeIndex === index);
    node.classList.toggle("is-passed", nodeIndex < index);
  });
}

function updateHistory() {
  scrollFrame = 0;
  const rect = history.getBoundingClientRect();
  const travel = Math.max(1, rect.height - innerHeight);
  const progress = clamp(-rect.top / travel);
  const routeFraction = clamp((progress - 0.025) / 0.95);
  const point = routeProgress.getPointAtLength(routeLength * routeFraction);
  const stepIndex = milestoneFractions.reduce((active, fraction, index) => routeFraction >= fraction - .015 ? index : active, 0);

  routeProgress.style.strokeDashoffset = routeLength * (1 - routeFraction);
  runner.setAttribute("cx", point.x);
  runner.setAttribute("cy", point.y);
  runnerHalo.setAttribute("cx", point.x);
  runnerHalo.setAttribute("cy", point.y);
  kmReadout.textContent = (routeFraction * 42.195).toFixed(1).replace(".", ",");
  historyBar.style.width = `${progress * 100}%`;
  setHistoryStep(stepIndex);
}

function requestHistoryUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHistory);
}

addEventListener("scroll", requestHistoryUpdate, { passive: true });
addEventListener("resize", requestHistoryUpdate);
updateHistory();

function createStepObserver(selector, onChange) {
  const steps = [...document.querySelectorAll(selector)];
  let activeStep = steps[0];
  let frame = 0;

  const update = () => {
    frame = 0;
    const activationLine = innerWidth <= 960 ? innerHeight * 0.72 : innerHeight * 0.52;
    const visible = steps.filter(step => {
      const rect = step.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight;
    });
    if (!visible.length) return;
    const next = visible.reduce((closest, step) => {
      const rect = step.getBoundingClientRect();
      const closestRect = closest.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - activationLine);
      const closestDistance = Math.abs(closestRect.top + closestRect.height / 2 - activationLine);
      return distance < closestDistance ? step : closest;
    }, visible[0]);
    if (next === activeStep) return;
    activeStep = next;
    steps.forEach(step => step.classList.toggle("is-active", step === next));
    onChange(next);
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  update();
  return { update };
}

const performanceSticky = document.querySelector(".performance-sticky");

const speedSticky = document.querySelector(".speed-stage");
const speedInput = document.querySelector("#treadmill-speed");
const speedClockValue = document.querySelector("#speed-clock-value");
const speedClockBar = document.querySelector("#speed-clock-bar");
const speedLive = document.querySelector("#speed-live");
const halfMarathonKm = 21.0975;
const halfMarathonSeconds = 58 * 60 + 41;
const almgrenHalfSpeed = halfMarathonKm / (halfMarathonSeconds / 3600);

function decimalSv(value, digits = 1) {
  return value.toLocaleString("sv-SE", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function paceAt(speed) {
  let seconds = Math.round(3600 / speed);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  if (seconds === 60) { minutes += 1; seconds = 0; }
  return `${minutes}:${String(seconds).padStart(2,"0")}`;
}

function updateTreadmillComparison(announce = false) {
  const speed = Number(speedInput.value);
  const pace = paceAt(speed);
  const halfDistance = speed * halfMarathonSeconds / 3600;
  const halfGap = halfMarathonKm - halfDistance;
  const almgrenAtYourKm = almgrenHalfSpeed / speed;
  const difference = almgrenHalfSpeed - speed;

  document.querySelectorAll("[data-user-speed]").forEach(node => { node.textContent = decimalSv(speed); });
  document.querySelectorAll("[data-user-pace]").forEach(node => { node.textContent = `${pace} / km`; });
  document.querySelectorAll("[data-user-pace-short]").forEach(node => { node.textContent = pace; });
  document.querySelectorAll("[data-half-distance]").forEach(node => { node.textContent = decimalSv(halfDistance); });
  document.querySelectorAll("[data-half-gap]").forEach(node => { node.textContent = decimalSv(halfGap); });
  document.querySelectorAll("[data-almgren-at-your-km]").forEach(node => { node.textContent = decimalSv(almgrenAtYourKm,2); });
  document.querySelectorAll("[data-speed-difference]").forEach(node => { node.textContent = decimalSv(difference); });
  document.querySelectorAll("[data-two-hour-distance]").forEach(node => { node.textContent = decimalSv(speed * 2); });
  speedSticky.style.setProperty("--road-duration", `${1.35 * 16 / speed}s`);

  if (announce) speedLive.textContent = `${decimalSv(speed)} kilometer i timmen är ${pace} per kilometer och ${decimalSv(speed * 2)} kilometer på två timmar.`;
}

const speedModes = {
  you: ["00:00", "24%"],
  almgren: ["02:47", "36%"],
  gap: ["58:41", "62%"],
  record: ["2:00:35", "100%"]
};

let speedVisible = false;
function updateSpeedAnimationState() {
  speedSticky.classList.toggle("is-running", speedVisible && !document.hidden && !reduceMotion);
}
new IntersectionObserver(entries => {
  speedVisible = entries[0].isIntersecting;
  updateSpeedAnimationState();
}, { rootMargin: "20% 0px" }).observe(document.querySelector(".speed"));
document.addEventListener("visibilitychange", updateSpeedAnimationState);

createStepObserver(".speed-step", step => {
  const mode = step.dataset.speed;
  speedSticky.dataset.speedMode = mode;
  const [clock, width] = speedModes[mode];
  speedClockValue.textContent = clock;
  speedClockBar.style.width = width;
});

speedInput.addEventListener("input", () => updateTreadmillComparison(false));
speedInput.addEventListener("change", () => updateTreadmillComparison(true));
updateTreadmillComparison();

createStepObserver(".performance-step", step => {
  performanceSticky.dataset.activeFactor = step.dataset.factor;
});

const trainingSticky = document.querySelector(".training-sticky");
createStepObserver(".training-step", step => {
  trainingSticky.dataset.trainingMode = step.dataset.training;
});

if (reduceMotion) document.documentElement.classList.add("reduce-motion");
