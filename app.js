const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const forceReducedMotion = new URLSearchParams(window.location.search).get("motion") === "reduce";
const reduceMotion = prefersReducedMotion || forceReducedMotion;
const svgNS = "http://www.w3.org/2000/svg";
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (start, end, amount) => start + (end - start) * amount;

if (reduceMotion) document.documentElement.classList.add("reduce-motion");

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(svgNS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text) element.textContent = text;
  return element;
}

function formatSwedishNumber(value, digits = 0) {
  return value.toLocaleString("sv-SE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatClock(totalSeconds) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function closestStep(steps, activationRatio = .54) {
  const activationY = window.innerHeight * activationRatio;
  let closest = steps[0];
  let smallestDistance = Infinity;

  steps.forEach(step => {
    const rect = step.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - activationY);
    if (distance < smallestDistance) {
      closest = step;
      smallestDistance = distance;
    }
  });
  return closest;
}

function createStepController(selector, onChange) {
  const steps = [...document.querySelectorAll(selector)];
  let active = null;

  function update() {
    if (!steps.length) return;
    const next = closestStep(steps, window.innerWidth <= 820 ? .72 : .54);
    if (next === active) return;
    active = next;
    steps.forEach(step => {
      const selected = step === next;
      step.classList.toggle("is-active", selected);
      step.setAttribute("aria-current", selected ? "step" : "false");
    });
    onChange(next, steps.indexOf(next));
  }

  return { update, steps, get active() { return active; } };
}

/* The New York route */
const routeMap = document.querySelector("#route-map");
const historySection = document.querySelector(".history");
const routeRoad = document.querySelector("#route-road");
const routeShadow = document.querySelector("#route-shadow");
const routeProgress = document.querySelector("#route-progress");
const routeCentre = document.querySelector("#route-centre");
const runnerPack = document.querySelector("#runner-pack");
const milestones = document.querySelector("#milestones");
const routeReadout = document.querySelector("#route-km");
const historyBar = document.querySelector("#history-bar");
const historySteps = [...document.querySelectorAll(".history-step")];
const routeD = "M117 700 C151 666 180 645 205 624 C230 602 251 563 270 520 C290 473 301 425 330 391 C360 356 393 339 430 316 C457 299 480 301 511 287 C542 273 569 250 597 239 C622 227 636 196 642 160 C649 119 671 94 702 86 C730 79 753 61 776 75 C799 90 790 124 765 138 C746 149 730 144 712 142 C691 140 679 164 672 198 C664 236 661 282 649 326 C639 369 627 410 615 447 C603 482 577 501 583 529 C589 558 626 565 647 540 C666 518 684 500 700 506";
const milestoneFractions = [.025, .22, .41, .59, .79, .985];
const desktopViewBoxes = [
  [28, 510, 400, 290],
  [142, 326, 520, 410],
  [330, 184, 470, 350],
  [515, 42, 390, 300],
  [585, 12, 330, 330],
  [512, 340, 330, 310]
];
const mobileViewBoxes = [
  [32, 468, 390, 490],
  [128, 292, 500, 628],
  [302, 132, 460, 578],
  [488, 12, 390, 490],
  [554, 0, 350, 440],
  [490, 287, 350, 440]
];

[routeRoad, routeShadow, routeProgress, routeCentre].forEach(path => path.setAttribute("d", routeD));
const routeLength = routeProgress.getTotalLength();
routeProgress.style.strokeDasharray = `${routeLength}`;
routeProgress.style.strokeDashoffset = `${routeLength}`;

const milestoneNodes = milestoneFractions.map((fraction, index) => {
  const point = routeProgress.getPointAtLength(routeLength * fraction);
  const group = svgElement("g", { class: "milestone", transform: `translate(${point.x} ${point.y})` });
  group.append(svgElement("circle", { r: 14 }), svgElement("text", {}, String(index + 1)));
  milestones.append(group);
  return group;
});

const packNodes = [0, .012, .025, .04].map((offset, index) => {
  const circle = svgElement("circle", {
    r: index === 0 ? 8 : 6,
    class: `pack-runner${index === 0 ? " pack-runner--lead" : ""}`
  });
  runnerPack.append(circle);
  return { node: circle, offset };
});

let activeHistoryIndex = -1;

function interpolateViewBox(progress) {
  const boxes = window.innerWidth <= 820 ? mobileViewBoxes : desktopViewBoxes;
  const scaled = clamp(progress) * (boxes.length - 1);
  const index = Math.min(boxes.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return boxes[index].map((value, propertyIndex) => lerp(value, boxes[index + 1][propertyIndex], local));
}

function updateHistory() {
  if (!historySection) return;
  const rect = historySection.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  const progress = clamp(-rect.top / travel);
  const routeFraction = progress;
  const activeIndex = Math.min(historySteps.length - 1, Math.max(0, Math.round(progress * (historySteps.length - 1))));

  routeProgress.style.strokeDashoffset = `${routeLength * (1 - routeFraction)}`;
  packNodes.forEach(({ node, offset }) => {
    const fraction = clamp(routeFraction - offset, 0, 1);
    const point = routeProgress.getPointAtLength(routeLength * fraction);
    node.setAttribute("cx", point.x);
    node.setAttribute("cy", point.y);
  });
  routeReadout.textContent = (routeFraction * 42.195).toFixed(1).replace(".", ",");
  historyBar.style.width = `${progress * 100}%`;
  routeMap.setAttribute("viewBox", interpolateViewBox(progress).map(value => value.toFixed(2)).join(" "));

  if (activeHistoryIndex !== activeIndex) {
    activeHistoryIndex = activeIndex;
    historySteps.forEach((step, index) => {
      const selected = index === activeIndex;
      step.classList.toggle("is-active", selected);
      step.setAttribute("aria-current", selected ? "step" : "false");
    });
    milestoneNodes.forEach((node, index) => {
      node.classList.toggle("is-active", index === activeIndex);
      node.classList.toggle("is-passed", index < activeIndex);
    });
  }
}

/* Distribution of finish times */
const finishChart = document.querySelector("#finish-chart");
const finishArea = document.querySelector("#finish-area");
const finishLine = document.querySelector("#finish-line");
const chartGrid = document.querySelector("#chart-grid");
const chartAxis = document.querySelector("#chart-axis");
const chartMarkers = document.querySelector("#chart-markers");
const distributionStage = document.querySelector(".distribution__stage");
const distributionStat = document.querySelector("#distribution-stat");
const distributionStatLabel = document.querySelector("#distribution-stat-label");
const distributionNote = document.querySelector("#distribution-note");
const finishCounts = [18, 84, 612, 1682, 2285, 3837, 4723, 6241, 5403, 5568, 4988, 4747, 3477, 3006, 2417, 1969, 1367, 1028, 824, 658, 427, 292, 229, 154];
const finishTotal = 56381;
const plot = { left: 86, right: 936, top: 82, bottom: 510 };
const maxShare = .115;
const xForHour = hour => plot.left + ((hour - 2) / 6) * (plot.right - plot.left);
const yForCount = count => plot.bottom - (count / finishTotal / maxShare) * (plot.bottom - plot.top);

function smoothLine(points) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const finishPoints = finishCounts.map((count, index) => [xForHour(2.125 + index * .25), yForCount(count)]);
const linePoints = [[xForHour(2), plot.bottom], ...finishPoints, [xForHour(8), plot.bottom]];
const finishLineD = smoothLine(linePoints);
finishLine.setAttribute("d", finishLineD);
finishArea.setAttribute("d", `${finishLineD} L${xForHour(8)} ${plot.bottom} L${xForHour(2)} ${plot.bottom}Z`);

[0, .05, .10].forEach(share => {
  const y = plot.bottom - (share / maxShare) * (plot.bottom - plot.top);
  chartGrid.append(svgElement("line", { x1: plot.left, x2: plot.right, y1: y, y2: y }));
  chartGrid.append(svgElement("text", { x: plot.left - 16, y: y + 4, "text-anchor": "end" }, `${Math.round(share * 100)} %`));
});

for (let hour = 2; hour <= 8; hour += 1) {
  const x = xForHour(hour);
  chartAxis.append(svgElement("line", { x1: x, x2: x, y1: plot.bottom, y2: plot.bottom + 8, stroke: "currentColor" }));
  chartAxis.append(svgElement("text", { x, y: plot.bottom + 30, "text-anchor": "middle" }, `${hour}:00`));
}
chartAxis.append(svgElement("text", { x: (plot.left + plot.right) / 2, y: 585, "text-anchor": "middle" }, "SLUTTID"));

const peakIndex = 7;
const peakX = xForHour(2 + peakIndex * .25);
chartGrid.append(svgElement("rect", {
  class: "chart-bin-highlight",
  x: peakX,
  y: yForCount(finishCounts[peakIndex]),
  width: xForHour(2.25) - xForHour(2),
  height: plot.bottom - yForCount(finishCounts[peakIndex])
}));

function addMarker(hour, label, className, labelY, anchor = "start") {
  const x = xForHour(hour);
  const group = svgElement("g", { class: `chart-marker ${className}` });
  group.append(svgElement("line", { x1: x, x2: x, y1: plot.top - 5, y2: plot.bottom }));
  if (className.includes("record")) {
    group.append(svgElement("circle", { cx: x, cy: plot.bottom, r: 7 }));
  }
  const labelX = anchor === "end" ? x - 10 : x + 10;
  group.append(svgElement("text", { x: labelX, y: labelY, "text-anchor": anchor }, label));
  chartMarkers.append(group);
}

addMarker(2 + 4 / 60 + 58 / 3600, "2:04:58  BANREKORD", "chart-marker--record", 474);
addMarker(3, "3:00", "chart-marker--three", 345);
addMarker(4, "4:00", "chart-marker--four", 158);
addMarker(4 + 32 / 60 + 25 / 3600, "4:32:25  MEDEL", "chart-marker--average", 118);

const distributionViews = {
  full: [0, 0, 1000, 620],
  peak: [240, 35, 610, 510],
  subthree: [38, 258, 405, 292],
  elite: [55, 398, 214, 143]
};
const distributionCopy = {
  full: ["löpare i urvalet", "56 381", "56 036 visas · 345 efter 8:00 ligger utanför bilden"],
  peak: ["i vanligaste intervallet", "11,1 %", "Toppen ligger mellan 3:45 och 4:00"],
  subthree: ["under tre timmar", "4,2 %", "2 396 av 56 381 löpartider"],
  elite: ["banrekord", "2:04:58", "Tamirat Tola, New York 2023"]
};
let chartAnimationFrame = 0;
let currentChartView = [...distributionViews.full];

function animateChartView(target) {
  cancelAnimationFrame(chartAnimationFrame);
  const start = [...currentChartView];
  if (reduceMotion) {
    currentChartView = [...target];
    finishChart.setAttribute("viewBox", target.join(" "));
    return;
  }
  const started = performance.now();
  const duration = 760;

  function tick(now) {
    const raw = clamp((now - started) / duration);
    const eased = 1 - Math.pow(1 - raw, 3);
    currentChartView = start.map((value, index) => lerp(value, target[index], eased));
    finishChart.setAttribute("viewBox", currentChartView.join(" "));
    if (raw < 1) chartAnimationFrame = requestAnimationFrame(tick);
  }
  chartAnimationFrame = requestAnimationFrame(tick);
}

const distributionController = createStepController(".distribution-step", step => {
  const mode = step.dataset.distribution;
  distributionStage.dataset.distributionMode = mode;
  const [label, stat, note] = distributionCopy[mode];
  distributionStatLabel.textContent = label;
  distributionStat.textContent = stat;
  distributionNote.textContent = note;
  animateChartView(distributionViews[mode]);
});

/* The shared 400 metre thought experiment */
const trackSection = document.querySelector(".track__scrolly");
const trackSteps = [...document.querySelectorAll(".track-step")];
const trackClock = document.querySelector("#track-clock");
const trackCaption = document.querySelector("#track-caption");
const lanePaths = {
  four: document.querySelector("#lane-four"),
  record: document.querySelector("#lane-record"),
  almgren: document.querySelector("#lane-almgren")
};
const trackNodes = {
  four: { marker: document.querySelector("#runner-four"), glow: document.querySelector("#runner-four-glow") },
  record: { marker: document.querySelector("#runner-record"), glow: document.querySelector("#runner-record-glow") },
  almgren: { marker: document.querySelector("#runner-almgren"), glow: document.querySelector("#runner-almgren-glow") }
};
const trackDistanceNodes = {
  four: document.querySelector("#distance-four"),
  record: document.querySelector("#distance-record"),
  almgren: document.querySelector("#distance-almgren")
};
const trackSpeeds = {
  four: 42195 / (4 * 60 * 60),
  record: 42195 / (2 * 60 * 60 + 4 * 60 + 58),
  almgren: 21097.5 / (58 * 60 + 41)
};

function placeOnTrack(key, distance) {
  const path = lanePaths[key];
  const { marker, glow } = trackNodes[key];
  const length = path.getTotalLength();
  const fraction = ((distance % 400) + 400) % 400 / 400;
  const point = path.getPointAtLength(fraction * length);
  const nextPoint = path.getPointAtLength(((fraction + .002) % 1) * length);
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI + 90;
  const markerTransform = key === "four" ? `translate(${point.x} ${point.y})` : `translate(${point.x} ${point.y}) rotate(${angle})`;
  marker.setAttribute("transform", markerTransform);
  glow.setAttribute("transform", `translate(${point.x} ${point.y})`);
}

function updateTrackAtTime(seconds) {
  trackClock.textContent = formatClock(seconds);
  Object.entries(trackSpeeds).forEach(([key, speed]) => {
    const distance = speed * seconds;
    placeOnTrack(key, distance);
    trackDistanceNodes[key].textContent = formatSwedishNumber(distance);
  });
}

function trackTimeFromScroll() {
  if (reduceMotion) {
    const active = closestStep(trackSteps, .72);
    return Number(active.dataset.trackTime);
  }
  const activationY = window.scrollY + window.innerHeight * (window.innerWidth <= 820 ? .72 : .54);
  const anchors = trackSteps.map(step => ({
    y: step.getBoundingClientRect().top + window.scrollY + step.offsetHeight / 2,
    time: Number(step.dataset.trackTime)
  }));
  if (activationY <= anchors[0].y) return anchors[0].time;
  if (activationY >= anchors.at(-1).y) return anchors.at(-1).time;
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const start = anchors[index];
    const end = anchors[index + 1];
    if (activationY >= start.y && activationY <= end.y) {
      return lerp(start.time, end.time, (activationY - start.y) / (end.y - start.y));
    }
  }
  return 0;
}

const trackCaptions = [
  "Alla står på startlinjen.",
  "Almgrens halvmaratonfart: ett varv på 1:06,8.",
  "Almgrens halvmaratonfart varvar fyratimmarslöparen.",
  "New Yorks banrekordstempo varvar fyratimmarslöparen."
];
const trackController = createStepController(".track-step", (_step, index) => {
  trackCaption.textContent = trackCaptions[index];
});

function updateTrack() {
  if (!trackSection) return;
  const rect = trackSection.getBoundingClientRect();
  if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return;
  updateTrackAtTime(trackTimeFromScroll());
}

/* Body and training scenes */
const physiologyStage = document.querySelector(".physiology__stage");
const physiologyLabel = document.querySelector("#physiology-label");
const physiologyCaption = document.querySelector("#physiology-caption");
const physiologyContent = {
  mechanics: ["01 · Mekanik", "Muskler och senor tar emot och återför kraft i varje steg."],
  oxygen: ["02 · Syretransport", "Syre går från luft till blod och vidare till de arbetande musklerna."],
  economy: ["03 · Löpekonomi", "Samma fart kan kräva olika mycket syre från två löpare."],
  durability: ["04 · Uthållighet", "Den illustrativa kurvan visar vad som händer när förmågan börjar avta."]
};
const physiologyController = createStepController(".physiology-step", step => {
  const mode = step.dataset.physiology;
  physiologyStage.dataset.physiologyMode = mode;
  physiologyLabel.textContent = physiologyContent[mode][0];
  physiologyCaption.textContent = physiologyContent[mode][1];
});

const trainingStage = document.querySelector(".training__stage");
const trainingLabel = document.querySelector("#training-label");
const trainingCaption = document.querySelector("#training-caption");
const trainingContent = {
  volume: ["01 · Mängd", "Omkring 200 kilometer motsvarar nästan fem maraton på en vecka."],
  threshold: ["02 · Dubbeltröskel", "Två tröskelpass på samma dag ger stor mängd kontrollerat arbete."],
  lactate: ["03 · Laktat", "Blodprovet används för att styra intensiteten under passet."],
  longrun: ["04 · Långpass", "Efter 90–100 minuter kan farten skruvas upp i ett 35–40 kilometer långt pass."]
};
const trainingController = createStepController(".training-step", step => {
  const mode = step.dataset.training;
  trainingStage.dataset.trainingMode = mode;
  trainingLabel.textContent = trainingContent[mode][0];
  trainingCaption.textContent = trainingContent[mode][1];
});

const stepControllers = [distributionController, trackController, physiologyController, trainingController];
let scrollFrame = 0;

if ("IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
  }, { rootMargin: "30% 0px" });
  document.querySelectorAll(".history, .physiology").forEach(section => motionObserver.observe(section));
}

function updateEverything() {
  scrollFrame = 0;
  updateHistory();
  stepControllers.forEach(controller => controller.update());
  updateTrack();
}

function requestUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateEverything);
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
document.addEventListener("visibilitychange", () => {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
});

updateEverything();
