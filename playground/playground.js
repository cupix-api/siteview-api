const isProd = /cupix-api.github.io/.test(window.location.href);

/**
 * @type {Window | null | undefined} cupixWindow
*/
var cupixWindow;

window.onload = function () {
  var elem = document.getElementById("cupix-container");
  if (elem) {
    var iframe = document.createElement("iframe");
    iframe.classList.add("w-100");
    iframe.classList.add("h-100");
    iframe.src = isProd ? "https://apidemo.cupix.works" : "http://cupix.local.cupix.works:4200";
    iframe.onload = () => {
      cupixWindow = iframe.contentWindow;
    };
    elem.appendChild(iframe);
  }
};

/**
 * @param {string} id
 * @param {string} content
*/
function setContent(id, content) {
  var elem = document.getElementById(id);
  if (elem) elem.innerText = content;
}

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

function setPostContent(postType, postContent) {
  setContent("event-post-timestamp", `Updated: ${new Date().toLocaleString()}`);
  setContent("event-post-type", postType || "--");
  setContent("event-post-content", getJSONContent(postContent));
}

function setResponseContent(responseType, response, errorMessage, errorArgs) {
  setContent("event-resp-timestamp", `Updated: ${new Date().toLocaleString()}`);
  setContent("event-resp-type", responseType || "--");
  setContent("event-resp-content", getJSONContent(response));
  setContent("event-error-msg", errorMessage || "--");
  setContent("event-error-args", getJSONContent(errorArgs));
}

function setOutputErrorMessage(operationType, errorMessage, errorArgs) {
  setResponseContent(operationType, undefined, errorMessage, errorArgs);
}

window.addEventListener(
  "message",
  function (e) {
    const response = e && e.data;
    if (response == undefined) return;
    if (response.header != "CUPIXWORKS_API") return;
    console.log("[CUPIXWORKS_API]", JSON.stringify(response || {}));
    setResponseContent(
      e.data.responseType,
      e.data.response,
      e.data.errorMessage,
      e.data.errorArgs
    );
  },
  false
);

var CupixUI = CupixUI || {};

CupixUI.isEmptyString = (str) => str == undefined || str.length < 1;

CupixUI.promptString = (operationType, valueName, defaultValue) => {
  let str = prompt(
    `Please enter ${valueName}`,
    sessionStorage.getItem(valueName) || defaultValue || ""
  );
  if (str) sessionStorage.setItem(valueName, str);
  if (CupixUI.isEmptyString(str)) {
    let errorMessage = `empty ${valueName}`;
    setOutputErrorMessage(operationType, errorMessage, {
      input: str
    });
    throw new Error(errorMessage);
  }
  return str;
};

CupixUI.promptNumber = (operationType, valueName, defaultValue) => {
  let str = CupixUI.promptString(operationType, valueName, defaultValue);
  try {
    str = str.replace(/\s/g, "");
    let x = Number(str);
    if (isNaN(x)) throw "invalid number";
    return x;
  } catch (ec) {
    console.warn(ec);
    let errorMessage = `invalid ${valueName}`;
    setOutputErrorMessage(operationType, errorMessage, {
      input: str
    });
    throw new Error(errorMessage);
  }
  return num;
};

CupixUI.promptVector2 = (operationType, valueName, defaultValue) => {
  let str = CupixUI.promptString(operationType, valueName, defaultValue);
  try {
    str = str.replace(/\s/g, "");
    let token = str.split(",");
    if (token.length !== 2) throw "invalid vector size";
    let x = Number(token[0]);
    let y = Number(token[1]);
    if (isNaN(x) || isNaN(y)) throw "invalid number";
    return {
      x: x,
      y: y
    };
  } catch (ec) {
    console.warn(ec);
    let errorMessage = `invalid ${valueName}`;
    setOutputErrorMessage(operationType, errorMessage, {
      input: str
    });
    throw new Error(errorMessage);
  }
};

CupixUI.signin = () => {
  try {
    const op = "signin";
    const teamDomain = CupixUI.promptString(op, "team domain");
    const email = CupixUI.promptString(op, "email");
    const password = CupixUI.promptString(op, "password");
    CupixApi.signin(teamDomain, email, password);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.signinWithToken = () => {
  try {
    const op = "signinWithToken";
    const token = CupixUI.promptString(op, "personal API token");
    CupixApi.signinWithToken(token);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.goSiteView = () => {
  try {
    const op = "goSiteView";
    const key = CupixUI.promptString(op, "SiteView key");
    CupixApi.goSiteView(key);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getLevel = () => {
  try {
    const op = "getLevel";
    const id = CupixUI.promptNumber(op, "level id");
    CupixApi.getLevel(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getCapture = () => {
  try {
    const op = "getCapture";
    const id = CupixUI.promptNumber(op, "capture id");
    CupixApi.getCapture(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getPano = () => {
  try {
    const op = "getPano";
    const id = CupixUI.promptNumber(op, "pano id");
    CupixApi.getPano(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getAnnotation = () => {
  try {
    const op = "getAnnotation";
    const id = CupixUI.promptNumber(op, "annotation id");
    CupixApi.getAnnotation(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getRoom = () => {
  try {
    const op = "getRoom";
    const id = CupixUI.promptNumber(op, "room id");
    CupixApi.getRoom(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changeLevel = () => {
  try {
    const op = "changeLevel";
    const id = CupixUI.promptNumber(op, "level id");
    CupixApi.changeLevel(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changeCapture = () => {
  try {
    const op = "changeCapture";
    const id = CupixUI.promptNumber(op, "capture id");
    CupixApi.changeCapture(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changePano = () => {
  try {
    const op = "changePano";
    const id = CupixUI.promptNumber(op, "pano id");
    CupixApi.changePano(id);
  } catch (ec) {
    console.warn(ec);
  }
};

function promptStringOptional(...rest) {
  try {
    return CupixUI.promptString(...rest);
  } catch {
    return "";
  }
}

function promptNumberOptional(...rest) {
  try {
    return CupixUI.promptNumber(...rest);
  } catch {
    return "";
  }
}

CupixUI.addAnnotation = () => {
  try {
    const op = "addAnnotation";
    const formTemplateId = CupixUI.promptNumber(op, "form template id");
    const annotationGroupId = CupixUI.promptNumber(op, "annotation group id");
    const name = CupixUI.promptString(op, "annotation name");
    const values = promptStringOptional(op, "form fields");
    CupixApi.addAnnotation(formTemplateId, annotationGroupId, name, values);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.deleteAnnotation = () => {
  try {
    const op = "deleteAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    CupixApi.deleteAnnotation(annotationId);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.updateAnnotation = () => {
  try {
    const op = "updateAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    const name = promptStringOptional(op, "annotation name");
    const values = promptStringOptional(op, "form fields");
    CupixApi.updateAnnotation(annotationId, name, values);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.toggleResolveAnnotation = () => {
  try {
    const op = "toggleResolveAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    CupixApi.toggleResolveAnnotation(annotationId);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getFormTemplate = () => {
  try {
    const op = "getFormTemplate";
    const formTemplateId = CupixUI.promptNumber(op, "form template id");
    CupixApi.getFormTemplate(formTemplateId);
  } catch (ec) {
    console.warn(ec);
  }
};

function promptVector2Optional(...rest) {
  try {
    return CupixUI.promptVector2(...rest);
  } catch {
    return {};
  }
}

CupixUI.getAnnotationGroup = () => {
  try {
    const op = "getAnnotationGroup";
    const annotationGroupId = CupixUI.promptNumber(op, "annotation group id");
    CupixApi.getAnnotationGroup(annotationGroupId);
  } catch (ec) {
    console.warn(ec);
  }
};


CupixUI.findNearestPanos = () => {
  try {
    const op = "findNearestPanos";
    const levelId = CupixUI.promptNumber(op, "level id");
    const captureId = CupixUI.promptNumber(op, "capture id");
    const coord = CupixUI.promptVector2(op, "coordinate (x, y)", "0, 0");
    const normal = promptVector2Optional(op, "normal vector (x, y) (optional)");
    const maxCount = CupixUI.promptNumber(op, "max search count", "8");
    CupixApi.findNearestPanos(
      levelId,
      captureId,
      coord.x,
      coord.y,
      normal.x,
      normal.y,
      maxCount
    );
  } catch (ec) {
    console.warn(ec);
  }
};
