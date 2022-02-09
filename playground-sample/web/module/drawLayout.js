function initNav() {
  addRootNav(navItems);
}

function addRootNav(navItems) {
  const ul = createNavUl([navItems.title]);
  sideNav.appendChild(ul);
  if (navItems.children) {
    const children = addNavChildren(navItems.children);
    ul.children[0].append(children);
  }
}

function createNavUl(titles) {
  const ul = document.createElement("ul");
  ul.classList.add("list-unstyled");
  ul.classList.add("ps-0");
  createNavli(ul, titles);
  return ul;
}

function createNavli(ul, titles) {
  titles.forEach((title) => {
    const li = document.createElement("li");
    li.classList.add("mb-1");
    ul.appendChild(li);
    const button = document.createElement("button");
    const btnClassList = [
      "btn",
      "btn-toggle",
      "align-items-center",
      "rounded",
      "collapsed",
    ];
    btnClassList.forEach((c) => button.classList.add(c));
    button.innerText = title;
    li.appendChild(button);
  });
}

function addNavChildren(children) {
  const childContainer = document.createElement("div");
  childContainer.classList.add("indent");
  const ul = createNavUl(children.map((c) => c.title));
  children.forEach((c, i) => {
    if (c.children) {
      const children = addNavChildren(c.children);
      ul.children[i].append(children);
    }
  });
  childContainer.append(ul);
  return childContainer;
}

function drawFacilityBtns() {
  const div = document.getElementById("facility-btn-list");
  let sensorList = document.getElementById("sensor-list");
  drawSensorsBtn(facilities[0].utilities[0].sensors, sensorList);
  facilities.forEach((fa) => {
    const btn = document.createElement("button");
    btn.classList.add('btn-sm');
    if (!fa.siteViewKey) btn.classList.add("disabled");
    btn.innerText = fa.title;
    btn.classList.add("list-group-item");
    btn.classList.add("list-group-item-action");
    btn.setAttribute("id", fa.id);

    btn.addEventListener("click", async () => {
      const cSensorList = sensorList.cloneNode(false);
      sensorList.parentNode.replaceChild(cSensorList, sensorList);
      drawSensorsBtn(fa.utilities[0].sensors, cSensorList);
      sensorList = cSensorList;
      resetDatalist('annotation-id');
      resetDatalist('annotation-layer-id');
      await CupixApi.goSiteView(fa.siteViewKey);
      Array
        .from(document.getElementById("facility-btn-list").children)
        .forEach((e) => e.classList.remove("active"));
      Array
        .from(document.getElementById("sensor-list").children)
        .forEach((e) => e.classList.remove("active"));
      document.getElementById(fa.id).classList.add("active");
      activeFacilities = fa;
    });
    div.appendChild(btn);
  });
  div.children[0].classList.add("active");
}

function drawSensorsBtn(sensors, parentNode) {
  sensors?.forEach((sensor) => {
    const sensorBtn = document.createElement("button");
    sensorBtn.innerText = sensor.title;
    sensorBtn.classList.add('btn-sm');
    sensorBtn.classList.add("list-group-item");
    sensorBtn.classList.add("list-group-item-action");
    sensorBtn.addEventListener("click", (e) => {
      onClickSensorBtn(e, sensor.lookAt, sensor.normal);
    });

    parentNode.appendChild(sensorBtn);
  });
}

async function onClickSensorBtn(e, lookAt, normal) {
  Array.from(document.getElementById("sensor-list").children).forEach((c) => c.classList.remove("active"));
  e.target.classList.add("active");
  const result = await CupixApi.findNearestPanos(
    activeFacilities.levelId,
    activeFacilities.captureId,
    lookAt[0],
    lookAt[1],
    normal[0],
    normal[1],
    6
  )
  CupixApi.changePano(result.panos[0].id, [
    lookAt[0] - normal[0],
    lookAt[1] - normal[1],
    result.panos[0].position[2],
  ]);
}