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
  if (window.innerWidth <= 820) {
    // Keep this scene visible through the gap, until the next card enters.
    let current = steps[0];
    for (const step of steps) {
      const card = step.querySelector('.story-card, .bib') || step;
      if (card.getBoundingClientRect().top <= activationY) current = step;
    }
    return current;
  }
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

function createStepController(selector, onChange, mobileActivationRatio = .5) {
  const steps = [...document.querySelectorAll(selector)];
  const section = steps[0]?.closest('section');
  let active = null;

  function update() {
    if (!steps.length) return;
    const bounds = section.getBoundingClientRect();
    if (active && (bounds.bottom < 0 || bounds.top > innerHeight)) return;
    const next = closestStep(steps, window.innerWidth <= 820 ? mobileActivationRatio : .54);
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
const routeD = "M117 700 L205 624 L270 520 L330 391 L430 316 L527 297 L578 275 L615 241 L681 208 L753 79 L813 70 L835 108 L783 155 L732 173 L708 270 L684 375 L672 441 L653 530 L685 550 L713 521 L722 493";
const stopCoordinates = [[117,700], [578,275], [813,70], [722,493]];
const stopKilometres = [0, 21.1, 32, 42.195];
[routeRoad, routeShadow, routeProgress, routeCentre].forEach(path => path.setAttribute("d", routeD));
const routeLength = routeProgress.getTotalLength();
// Read SVG geometry once, before animation writes, rather than during scroll.
const routeSamples = Array.from({ length: 3001 }, (_, n) => routeProgress.getPointAtLength(routeLength * n / 3000));
function routePoint(fraction) {
  const position = clamp(fraction) * 3000;
  const index = Math.min(2999, Math.floor(position));
  const a = routeSamples[index], b = routeSamples[index + 1];
  return { x: lerp(a.x, b.x, position - index), y: lerp(a.y, b.y, position - index) };
}
const milestoneFractions = stopCoordinates.map(([x,y]) => {
  let nearest = 0, distance = Infinity;
  for (let n = 0; n <= 3000; n++) {
    const p = routeSamples[n];
    const d = Math.hypot(p.x-x, p.y-y);
    if (d < distance) { distance = d; nearest = n / 3000; }
  }
  return nearest;
});
routeProgress.style.strokeDasharray = `${routeLength}`;
routeProgress.style.strokeDashoffset = `${routeLength}`;

const milestoneNodes = milestoneFractions.map((fraction, index) => {
  const point = routePoint(fraction);
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
let historyProgress = null;
let historyTarget = 0;
let historyFrame = 0;
let historyTime = 0;
const historyStage = document.querySelector('.history__stage');

function animateHistory(now) {
  // A frame timestamp can precede performance.now() from the scheduling event.
  const delta = clamp(now - historyTime, 0, 64);
  historyTime = now;
  historyProgress = lerp(historyProgress, historyTarget, 1 - Math.exp(-delta / 65));
  if (Math.abs(historyProgress - historyTarget) < .00002) historyProgress = historyTarget;
  renderHistory(historyProgress);
  historyFrame = historyProgress === historyTarget ? 0 : requestAnimationFrame(animateHistory);
}

function updateHistory() {
  if (!historySection) return;
  const rect = historySection.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) {
    cancelAnimationFrame(historyFrame);
    historyFrame = 0;
    historyProgress = null;
    return;
  }
  const mobile = innerWidth <= 820;
  // The browser toolbar changes innerHeight while scrolling; svh stays stable.
  const viewportHeight = mobile ? historyStage.clientHeight / .62 : innerHeight;
  const travel = Math.max(1, rect.height - viewportHeight);
  const progress = clamp(-rect.top / travel);
  historyTarget = progress;
  if (!mobile || reduceMotion || historyProgress === null) {
    cancelAnimationFrame(historyFrame);
    historyFrame = 0;
    historyProgress = progress;
    renderHistory(progress);
  } else if (!historyFrame) {
    historyTime = performance.now();
    historyFrame = requestAnimationFrame(animateHistory);
  }
}

function renderHistory(progress) {
  const segmentCount = milestoneFractions.length - 1;
  // Stops activate halfway between narrative positions. Arrive at that same
  // boundary: a shorter first leg, then steady travel, with time at the finish.
  const firstArrival = .5 / segmentCount;
  const travelProgress = progress < firstArrival ? progress * 2 : Math.min(1, progress + firstArrival);
  const segment = Math.min(segmentCount - 1, Math.floor(travelProgress * segmentCount));
  const local = travelProgress * segmentCount - segment;
  const routeFraction = lerp(milestoneFractions[segment], milestoneFractions[segment + 1], local);
  const activeIndex = Math.min(historySteps.length - 1, Math.max(0, Math.round(progress * (historySteps.length - 1))));

  routeProgress.style.strokeDashoffset = `${routeLength * (1 - routeFraction)}`;
  packNodes.forEach(({ node, offset }) => {
    const fraction = clamp(routeFraction - offset, 0, 1);
    const point = routePoint(fraction);
    node.setAttribute("cx", point.x);
    node.setAttribute("cy", point.y);
  });
  const kilometres = lerp(stopKilometres[segment], stopKilometres[segment + 1], local).toFixed(1).replace(".", ",");
  if (routeReadout.textContent !== kilometres) routeReadout.textContent = kilometres;
  historyBar.style.transform = `scaleX(${progress})`;
  const point = routePoint(routeFraction);
  const mobile = window.innerWidth <= 820;
  const w = mobile ? 460 : 530, h = mobile ? 430 : 420;
  routeMap.setAttribute("viewBox", `${point.x - w / 2} ${point.y - h / 2} ${w} ${h}`);

  if (activeHistoryIndex !== activeIndex) {
    activeHistoryIndex = activeIndex;
    const streets = [
      ["VERRAZZANO BRIDGE", "Över sundet. In mot staden."],
      ["PULASKI BRIDGE", "Från Brooklyn till Queens"],
      ["THE BRONX", "Sedan söderut längs Fifth Avenue"],
      ["CENTRAL PARK", "Sista svängarna. Snart målrakan."]
    ];
    document.querySelector("#street-name").textContent = streets[activeIndex][0];
    document.querySelector("#street-detail").textContent = streets[activeIndex][1];
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
  chartAxis.append(svgElement("text", { x, y: plot.bottom + 30, "text-anchor": "middle", "data-hour": hour }, `${hour}:00`));
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
  const text = svgElement("text", { x: labelX, y: labelY, "text-anchor": anchor });
  const [time, context] = label.split("  ");
  text.append(svgElement("tspan", {}, time));
  if (context) text.append(svgElement("tspan", { class: "chart-marker-context" }, `  ${context}`));
  group.append(text);
  chartMarkers.append(group);
}

addMarker(2 + 4 / 60 + 58 / 3600, "2:04:58  BANREKORD", "chart-marker--record", 474);
addMarker(3, "3:00", "chart-marker--three", 345);
addMarker(4, "4:00", "chart-marker--four", 158);
addMarker(4 + 32 / 60 + 45 / 3600, "4:32:45  URVALETS MEDEL", "chart-marker--average", 118);

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

function sizeChartLabels() {
  const scale = finishChart.getScreenCTM()?.a;
  if (scale > 0) finishChart.style.setProperty("--mobile-chart-font", `${12 / scale}px`);
}

function animateChartView(target) {
  cancelAnimationFrame(chartAnimationFrame);
  const start = [...currentChartView];
  if (reduceMotion) {
    currentChartView = [...target];
    finishChart.setAttribute("viewBox", target.join(" "));
    sizeChartLabels();
    return;
  }
  const started = performance.now();
  const duration = 760;

  function tick(now) {
    const raw = clamp((now - started) / duration);
    const eased = 1 - Math.pow(1 - raw, 3);
    currentChartView = start.map((value, index) => lerp(value, target[index], eased));
    finishChart.setAttribute("viewBox", currentChartView.join(" "));
    sizeChartLabels();
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
}, 1);

/* The shared 400 metre thought experiment */
const trackSection = document.querySelector(".track__scrolly");
const trackSteps = [...document.querySelectorAll(".track-step")];
const trackClock = document.querySelector("#track-clock");
const trackCaption = document.querySelector("#track-caption");
const lanePaths = {
  six: document.querySelector("#lane-six"),
  four: document.querySelector("#lane-four"),
  record: document.querySelector("#lane-record"),
  almgren: document.querySelector("#lane-almgren")
};
const trackNodes = {
  six: { marker: document.querySelector("#runner-six"), glow: document.querySelector("#runner-six-glow") },
  four: { marker: document.querySelector("#runner-four"), glow: document.querySelector("#runner-four-glow") },
  record: { marker: document.querySelector("#runner-record"), glow: document.querySelector("#runner-record-glow") },
  almgren: { marker: document.querySelector("#runner-almgren"), glow: document.querySelector("#runner-almgren-glow") }
};
const trackDistanceNodes = {
  six: document.querySelector("#distance-six"),
  four: document.querySelector("#distance-four"),
  record: document.querySelector("#distance-record"),
  almgren: document.querySelector("#distance-almgren")
};
const trackSpeeds = {
  six: 42195 / (6 * 60 * 60),
  four: 42195 / (4 * 60 * 60),
  record: 42195 / (2 * 60 * 60 + 4 * 60 + 58),
  almgren: 21097.5 / (58 * 60 + 6)
};

function placeOnTrack(key, distance) {
  const path = lanePaths[key];
  const { marker, glow } = trackNodes[key];
  const length = path.getTotalLength();
  const fraction = ((distance % 400) + 400) % 400 / 400;
  const point = path.getPointAtLength(fraction * length);
  const nextPoint = path.getPointAtLength(((fraction + .002) % 1) * length);
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI + 90;
  const markerTransform = ["four", "six"].includes(key) ? `translate(${point.x} ${point.y})` : `translate(${point.x} ${point.y}) rotate(${angle})`;
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
    const active = closestStep(trackSteps, window.innerWidth <= 820 ? .5 : .54);
    return Number(active.dataset.trackTime);
  }
  const activationY = window.scrollY + window.innerHeight * (window.innerWidth <= 820 ? .72 : .54);
  const anchors = trackSteps.map(step => ({
    y: step.getBoundingClientRect().top + window.scrollY + (window.innerWidth <= 820 ? window.innerHeight * .14 : step.offsetHeight / 2),
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
  "Almgrens halvmaratonfart: ett varv på 1:06,1.",
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
  mechanics: ["01 · Mekanik", "Hälsenan överför kraft från vadmusklerna till hälen och kan återföra lagrad energi."],
  oxygen: ["02 · Syretransport", "Syre går från luft till blod och vidare till de arbetande musklerna."],
  economy: ["03 · Löpekonomi", "Samma fart kan kräva olika mycket syre från två löpare."],
  durability: ["04 · Uthållighet", "Den illustrativa kurvan visar vad som händer när förmågan börjar avta."]
};
const physiologyController = createStepController(".physiology-step", step => {
  const mode = step.dataset.physiology;
  physiologyStage.dataset.physiologyMode = mode;
  physiologyStage.querySelectorAll(".phys-layer").forEach(layer => {
    layer.setAttribute("aria-hidden", String(!layer.classList.contains(`phys-layer--${mode}`)));
  });
  physiologyLabel.textContent = physiologyContent[mode][0];
  physiologyCaption.textContent = physiologyContent[mode][1];
}, 1); // On mobile, reveal the anatomy scene as its card enters the viewport.

const trainingStage = document.querySelector(".training__stage");
const trainingLabel = document.querySelector("#training-label");
const trainingCaption = document.querySelector("#training-caption");
const trainingContent = {
  volume: ["01 · Måndag", "Lugn mängdträning. Veckodagar och mellanpass är illustrativa."],
  threshold: ["02 · Tisdag", "Dubbeltröskel från grundträningen, inlagd som exempel här."],
  lactate: ["03 · Torsdag", "LT1 betonas i Almgrens maratonblock. Torsdagen är ett exempel."],
  longrun: ["04 · Söndag", "Almgrens beskrivna 35-km-pass, placerat på söndag i exempelveckan."]
};
const calendar = document.querySelector("#training-calendar");
const calendarOverview = document.querySelector(".calendar-overview");
const calendarDays = { volume: 0, threshold: 1, lactate: 3, longrun: 6 };
let calendarView = [0, 0, 1540, 780];
let calendarFrame = 0;
let calendarKey = "";
let showCalendarOverview = false;
function updateCalendar() {
  const bounds = trainingStage.closest('section').getBoundingClientRect();
  if (bounds.bottom < 0 || bounds.top > innerHeight) return;
  const mode = trainingStage.dataset.trainingMode;
  const mobile = innerWidth <= 820;
  const beforeNotes = document.querySelector(".training-step .story-card").getBoundingClientRect().top > innerHeight * (mobile ? 1 : .5);
  const overview = showCalendarOverview || beforeNotes;
  const key = `${mode}-${overview}-${mobile}`;
  if (key === calendarKey) return;
  calendarKey = key;
  calendar.dataset.overview = String(overview);
  const day = calendarDays[mode];
  const width = mobile ? 430 : 780;
  const center = 42 + day * 208 + 104;
  const target = overview ? [0, 0, 1540, 780] : [clamp(center - width / 2, 0, 1540 - width), 92, width, 650];
  calendar.querySelectorAll(".calendar-day").forEach((node, index) => node.classList.toggle("is-selected", !overview && index === day));
  calendarOverview.setAttribute("aria-pressed", String(showCalendarOverview));
  calendarOverview.textContent = showCalendarOverview ? "Till dagens pass" : "Visa hela veckan";
  cancelAnimationFrame(calendarFrame);
  const start = [...calendarView], started = performance.now();
  function frame(now) {
    const t = reduceMotion ? 1 : clamp((now - started) / 850);
    const eased = 1 - Math.pow(1 - t, 3);
    calendarView = start.map((n, i) => lerp(n, target[i], eased));
    calendar.setAttribute("viewBox", calendarView.join(" "));
    if (t < 1) calendarFrame = requestAnimationFrame(frame);
  }
  calendarFrame = requestAnimationFrame(frame);
}
calendarOverview.addEventListener("click", () => {
  showCalendarOverview = !showCalendarOverview;
  updateCalendar();
});
const trainingController = createStepController(".training-step", step => {
  const mode = step.dataset.training;
  trainingStage.dataset.trainingMode = mode;
  showCalendarOverview = false;
  trainingLabel.textContent = trainingContent[mode][0];
  trainingCaption.textContent = trainingContent[mode][1];
  updateCalendar();
}, 1); // On mobile, start the zoom as soon as the next card enters the viewport.

const stepControllers = [distributionController, trackController, physiologyController, trainingController];
let scrollFrame = 0;

if ("IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
  }, { rootMargin: "30% 0px" });
  document.querySelectorAll(".history, .physiology, .finish").forEach(section => motionObserver.observe(section));
}

function updateEverything() {
  scrollFrame = 0;
  updateHistory();
  stepControllers.forEach(controller => controller.update());
  updateTrack();
  updateCalendar();
}

function requestUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateEverything);
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", () => { sizeChartLabels(); requestUpdate(); });
document.addEventListener("visibilitychange", () => {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
});

sizeChartLabels();
updateEverything();
