let activeFacilities = facilities[0];
let sideNav;
let cupixElem;

function initCupix() {
  if (cupixElem) {
    var iframe = document.createElement("iframe");
    iframe.classList.add("w-100");
    iframe.classList.add("h-100");
    iframe.src = target;
    iframe.onload = async () => {
      cupixWindow = iframe.contentWindow;
      await CupixApi.start();
      await CupixApi.signout();
      signinWithToken();
    };
    cupixElem.appendChild(iframe);
  }
}

window.onload = function () {
  sideNav = document.getElementById("side-nav");
  cupixElem = document.getElementById("cupix-container");
  initNav();
  initCupix();
  drawFacilityBtns();
};

// Cupix API

CupixApi.changePano = (panoId, lookAt) =>
  CupixApi.sendToCupix({
    operationType: "CHANGE_PANO",
    operationArgs: {
      panoId,
      lookAt,
    },
  });

// Cupix UI
var CupixUI = CupixUI || {};

async function signinWithToken() {
  try {
    await CupixApi.signinWithToken(token);
    await CupixApi.goSiteView(facilities[0].siteViewKey);
    document.getElementById("cupix-container-loading").classList.add("hide");
    document.getElementById("cupix-container").classList.remove("hide");
    document.getElementById("cupix-container-actions").classList.remove("hide");
  } catch (ec) {
    console.warn(ec);
  }
};

function getJSONContent(json) {
  if (json == undefined) return "{}";
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (ec) {
    parsed = json;
  }
  return JSON.stringify(parsed, null, 2);
}

function log(...params) {
  console.log(`%c${params.join(' ')}`, 'color: #bada55;')
}

window.addEventListener(
  "message",
  function (e) {
    const response = e && e.data;
    if (response == undefined) return;
    if (response.header != "CUPIXWORKS_API") return;
    log("[CUPIXWORKS_API]", JSON.stringify(response || {}));
    if (
      response.request?.uuid &&
      typeof resolvers[response.request.uuid] === "function"
    ) {
      resolvers[response.request.uuid](response.response || response);
    }
    setResponseContent(
      e.data.responseType,
      e.data.response,
      e.data.errorMessage,
      e.data.errorArgs
    );
  },
  false
);

function setResponseContent(responseType, response, errorMessage, errorArgs) {
  log(
    "event-resp-timestamp",
    `Updated: ${new Date().toLocaleString()}`
  );
  log("event-resp-type", responseType);
  log("event-resp-content", getJSONContent(response));
  if (errorMessage) {
    console.error("event-error-msg", errorMessage);
    console.error("event-error-args", getJSONContent(errorArgs));
  }
}

async function updateAnnotationIds() {
  const result = await CupixApi.getAnnotationAll();
  const idArr = result.annotations.map(ann => ann.id);
  const datalist = document.getElementById('annotation-id');
  resetDatalist('annotation-id');
  idArr.forEach(id => {
    const option = document.createElement("option");
    option.setAttribute('value', id);
    datalist.appendChild(option);
  });
}

async function updateAnnotationLayerIds() {
  const result = await CupixApi.getAnnotationLayerAll();
  const idArr = result.annotationLayerList.map(layer => layer.id);
  const datalist = document.getElementById('annotation-layer-id');
  resetDatalist('annotation-layer-id');
  idArr.forEach(id => {
    const option = document.createElement("option");
    option.setAttribute('value', id);
    datalist.appendChild(option);
  });
}

async function updateFormDesigns() {
  const result = await CupixApi.getFormDesigns();
  const formDesignList = document.getElementById('form-design-select');
  result.formDesigns.forEach(formDesign => {
    const option = document.createElement("option");
    option.setAttribute('value', formDesign.attributes.id);
    option.innerText = formDesign.attributes.name;
    formDesignList.appendChild(option);
  });
}


function resetDatalist(id) {
  const datalist = document.getElementById(id);
  while (datalist.firstChild) {
    datalist.removeChild(datalist.lastChild);
  }
}

function resetFormDesignList() {
  const formDesignList = document.getElementById('form-design-select');
  while (formDesignList.firstChild) {
    formDesignList.removeChild(formDesignList.lastChild);
  }
  const option = document.createElement('option');
  option.setAttribute('selected', true);
  option.innerText = 'Choose Form Design';
  formDesignList.appendChild(option);
}

async function addAnnotation() {
  const formDesignId = activeFacilities.annotation.formDesignId;
  const name = 'Add Annotation Test';
  const values = '["1", "Add Annotation Test"]';
  const layerIdInput = document.getElementById('annotation-layer-id-input');
  if (!layerIdInput.value) {
    const result = await CupixApi.getAnnotationLayerAll();
    const id = result.annotationLayerList[0].id;
    layerIdInput.value = id;
  }
  const result = await CupixApi.addAnnotation(formDesignId, Number(layerIdInput.value), name, values);
  if (!result.errorMessage) await updateAnnotationIds();
}

async function updateAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  let name = 'Update Annotation Test';
  const values = '["2", "Update Annotation Test"]';
  if (!/\(\d+\)$/.test(name)) name += `(${annotationId})`;
  await CupixApi.updateAnnotation(annotationId, name, values);
}

async function getAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  const result = await CupixApi.getAnnotation(annotationId);
  if (!result.errorMessage) {
    document.getElementById('annotation-values').value = JSON.stringify(result.fields);
  }
}


async function deleteAnnotation() {
  let annotationIdInput = document.getElementById('annotation-id-input');
  const annotationId = annotationIdInput?.value === '' ? undefined : Number(annotationIdInput?.value);
  annotationIdInput.value = '';
  const result = await CupixApi.deleteAnnotation(annotationId);
  if (!result.errorMessage) {
    await updateAnnotationIds();
  }
}

async function toggleResolveAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  CupixApi.toggleResolveAnnotation(annotationId);
}

async function onChangeFormDesign(value) {
  const formDesignId = Number(value);
  if (!isNaN(Number(value))) {
    await CupixApi.getFormDesign(formDesignId);
  }
}

async function addAnnotationLayer() {
  await CupixApi.addAnnotationLayer('Add Annotation Layer Test', activeFacilities.levelId, activeFacilities.captureId);
  updateAnnotationLayerIds();
}

async function getAnnotationLayerAll() {
  updateAnnotationLayerIds();
}

async function deleteAnnotationLayer() {
  let annotationLayerIdInput = document.getElementById('annotation-layer-id-input');
  const annotationLayerId = annotationLayerIdInput?.value === '' ? undefined : Number(annotationLayerIdInput?.value);
  annotationLayerIdInput.value = '';
  await CupixApi.deleteAnnotationLayer(annotationLayerId);
  await updateAnnotationLayerIds();
}

async function updateAnnotationLayer() {
  let input = document.getElementById('annotation-layer-id-input')?.value;
  const annotationLayerId = input === '' ? undefined : Number(input);
  let name = 'Update Annotation Layer Test';
  if (!/\(\d+\)$/.test(name)) name += `(${annotationLayerId})`;
  await CupixApi.updateAnnotationLayer(annotationLayerId, name);
}