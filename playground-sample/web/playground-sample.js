/**
 * @typedef {Object} CupixMessageResponse
 * @property {"CUPIXWORKS_API"} header
 * @property {CupixMessageRequest} request
 * @property {any} response
 * @property {string} responseType
 * @property {string} sourceUUID
 */

let activeFacilities = facilities[0];
let sideNav;


async function initCupix() {
  await siteView4embed.init('cupix-container');
  let apiLoaded = false;
  let retryCount = 0;
  do {
    const startApiResult = await siteView4embed.start(1000);
    if (startApiResult?.error) console.error(startApiResult.error);
    else apiLoaded = true;
    retryCount++;
  } while (!apiLoaded && retryCount < 5);
  await siteView4embed.signout();
  signinWithToken();
}

window.onload = function () {
  sideNav = document.getElementById("side-nav");
  initNav();
  initCupix();
  drawFacilityBtns();
};

// Cupix API

siteView4embed.changePano = (panoId, lookAt) =>
  siteView4embed.sendToCupix({
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
    await siteView4embed.signinWithToken(token);
    await siteView4embed.goSiteView(facilities[0].siteViewKey);
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
  /** @param {MessageEvent<CupixMessageResponse>} e */
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
  const result = await siteView4embed.getAnnotationAll();
  const idArr = result.annotations.map(ann => ann.id);
  const datalist = document.getElementById('annotation-id');
  resetDatalist('annotation-id');
  idArr.forEach(id => {
    const option = document.createElement("option");
    option.setAttribute('value', id);
    datalist.appendChild(option);
  });
}

async function updateAnnotationGroupIds() {
  const result = await siteView4embed.getAnnotationGroupAll();
  const idArr = result.annotationGroupList.map(group => group.id);
  const datalist = document.getElementById('annotation-group-id');
  resetDatalist('annotation-group-id');
  idArr.forEach(id => {
    const option = document.createElement("option");
    option.setAttribute('value', id);
    datalist.appendChild(option);
  });
}

async function updateFormTemplates() {
  const result = await siteView4embed.getFormTemplates();
  const formTemplateList = document.getElementById('form-template-select');
  result.formTemplates.forEach(formTemplate => {
    const option = document.createElement("option");
    option.setAttribute('value', formTemplate.attributes.id);
    option.innerText = formTemplate.attributes.name;
    formTemplateList.appendChild(option);
  });
}


function resetDatalist(id) {
  const datalist = document.getElementById(id);
  while (datalist.firstChild) {
    datalist.removeChild(datalist.lastChild);
  }
}

function resetFormTemplateList() {
  const formTemplateList = document.getElementById('form-template-select');
  while (formTemplateList.firstChild) {
    formTemplateList.removeChild(formTemplateList.lastChild);
  }
  const option = document.createElement('option');
  option.setAttribute('selected', true);
  option.innerText = 'Choose Form Template';
  formTemplateList.appendChild(option);
}

async function addAnnotation() {
  const formTemplateId = activeFacilities.annotation.formTemplateId;
  const name = 'Add Annotation Test';
  const values = '["1", "Add Annotation Test"]';
  const groupIdInput = document.getElementById('annotation-group-id-input');
  if (!groupIdInput.value) {
    const result = await siteView4embed.getAnnotationGroupAll();
    const id = result.annotationGroupList[0].id;
    groupIdInput.value = id;
  }
  const result = await siteView4embed.addAnnotation(formTemplateId, Number(groupIdInput.value), name, values);
  if (!result.errorMessage) await updateAnnotationIds();
}

async function updateAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  let name = 'Update Annotation Test';
  const values = '["2", "Update Annotation Test"]';
  if (!/\(\d+\)$/.test(name)) name += `(${annotationId})`;
  await siteView4embed.updateAnnotation(annotationId, name, values);
}

async function getAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  const result = await siteView4embed.getAnnotation(annotationId);
  if (!result.errorMessage) {
    document.getElementById('annotation-values').value = JSON.stringify(result.fields);
  }
}


async function deleteAnnotation() {
  let annotationIdInput = document.getElementById('annotation-id-input');
  const annotationId = annotationIdInput?.value === '' ? undefined : Number(annotationIdInput?.value);
  annotationIdInput.value = '';
  const result = await siteView4embed.deleteAnnotation(annotationId);
  if (!result.errorMessage) {
    await updateAnnotationIds();
  }
}

async function toggleResolveAnnotation() {
  let input = document.getElementById('annotation-id-input')?.value;
  const annotationId = input === '' ? undefined : Number(input);
  siteView4embed.toggleResolveAnnotation(annotationId);
}

async function onChangeFormTemplate(value) {
  const formTemplateId = Number(value);
  if (!isNaN(Number(value))) {
    await siteView4embed.getFormTemplate(formTemplateId);
  }
}

async function getAnnotationGroupAll() {
  updateAnnotationGroupIds();
}
