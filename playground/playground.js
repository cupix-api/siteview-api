const isProd = true
const target = isProd ? "https://apidemo.cupix.works/sv/9hivpe82w8" : "http://cupix.local.cupix.works:4200";
const apiToken = isProd ? '' : '';
const accessCode = isProd ? '' : '';

/**
 * @type {Window | null | undefined} cupixWindow
*/
var cupixWindow;

window.onload = function () {
  siteView4embed.init("cupix-container", target, { accessCode: accessCode, apiToken: apiToken });
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

function promptVector2Optional(...rest) {
  try {
    return CupixUI.promptVector2(...rest);
  } catch {
    return {};
  }
}

function promptVector3Optional(...rest) {
  try {
    return CupixUI.promptVector3(...rest);
  } catch {
    return undefined;
  }
}

function promptBimGridInfo(op) {
  const start = CupixUI.promptString(op, "Start grid label.");
  const end = CupixUI.promptString(op, "End grid label.");
  const offset = promptVector3Optional(op, "normal vector (x, y, z) (optional)");
  return {
    coordinate: [start, end],
    offset
  };
}

window.addEventListener(
  "message",
  function (e) {
    const response = e && e.data;
    if (response == undefined) return;
    if (response.header != "CUPIXWORKS_API") return;
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

CupixUI.promptVector3 = (operationType, valueName, defaultValue) => {
  let str = CupixUI.promptString(operationType, valueName, defaultValue);
  try {
    str = str.replace(/\s/g, "");
    let token = str.split(",");
    if (token.length !== 3) throw "invalid vector size";
    let x = Number(token[0]);
    let y = Number(token[1]);
    let z = Number(token[2]);
    if (isNaN(x) || isNaN(y) || isNaN(z)) throw "invalid number";
    return {
      x: x,
      y: y,
      z: z
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

CupixUI.signinWithToken = () => {
  try {
    const op = "signinWithToken";
    const token = CupixUI.promptString(op, "personal API token");
    siteView4embed.signinWithToken(token);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.goSiteView = () => {
  try {
    const op = "goSiteView";
    const key = CupixUI.promptString(op, "SiteView key");
    const hideSideBar = promptNumberOptional(op, "hide sidebar. hide: 1, show: 0")
    const mapViewPosition = promptStringOptional(op, "map view position. 'top' or 'bottom'")
    siteView4embed.goSiteView(key, hideSideBar, mapViewPosition);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.goSiteViewWithLevelAndRecord = () => {
  try {
    const op = "goSiteView";
    const key = CupixUI.promptString(op, "SiteView key");
    const hideSideBar = promptNumberOptional(op, "hide sidebar. hide: 1, show: 0")
    const mapViewPosition = promptStringOptional(op, "map view position. 'top' or 'bottom'")
    const openingLevelId = promptNumberOptional(op, "level id (optional)");
    const openingLevelName = promptStringOptional(op, "level name (optional)");
    const openingCaptureId = promptNumberOptional(op, "capture id (optional)");
    const openingCaptureDate = promptStringOptional(op, "capture date (optional, ex: YYYY-MM-DD)");
    const openingPosition = promptVector3Optional(op, "opening position with normal vector (x, y, z) (optional)");
    siteView4embed.goSiteView(
      key,
      hideSideBar,
      mapViewPosition,
      undefined,
      openingLevelId,
      openingLevelName,
      openingCaptureId,
      openingCaptureDate,
      openingPosition
    );
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.goSiteViewWithGeolocation = () => {
  try {
    const op = "goSiteView";
    const key = CupixUI.promptString(op, "SiteView key");
    const hideSideBar = promptNumberOptional(op, "hide sidebar. hide: 1, show: 0")
    const mapViewPosition = promptStringOptional(op, "map view position. 'top' or 'bottom'")

    const epsg = CupixUI.promptString(op, "espg code");
    const xOrLon = CupixUI.promptString(op, "x or longitude");
    const yOrLat = CupixUI.promptString(op, "y or latitude");

    const openingGeoloation = {
      epsg: epsg,
      xOrLon: xOrLon,
      yOrLat: yOrLat
    };

    siteView4embed.goSiteView(key, hideSideBar, mapViewPosition, openingGeoloation);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.goSiteViewWithBimGridInfo = () => {
  try {
    const op = "goSiteView";
    const key = CupixUI.promptString(op, "SiteView key");
    const hideSideBar = promptNumberOptional(op, "hide sidebar. hide: 1, show: 0")
    const mapViewPosition = promptStringOptional(op, "map view position. 'top' or 'bottom'")
    const openingLevelId = promptNumberOptional(op, "level id (optional)");
    const openingLevelName = promptStringOptional(op, "level name (optional)");
    const openingCaptureId = promptNumberOptional(op, "capture id (optional)");
    const openingCaptureDate = promptStringOptional(op, "capture date (optional, ex: YYYY-MM-DD)");
    const openingPosition = promptVector3Optional(op, "opening position with normal vector (x, y, z) (optional)");
    const openingBimGrid = promptBimGridInfo(op);

    siteView4embed.goSiteView(
      key,
      hideSideBar,
      mapViewPosition,
      undefined,
      openingLevelId,
      openingLevelName,
      openingCaptureId,
      openingCaptureDate,
      openingPosition,
      openingBimGrid
    );
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getLevel = () => {
  try {
    const op = "getLevel";
    const id = CupixUI.promptNumber(op, "level id");
    siteView4embed.getLevel(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getCapture = () => {
  try {
    const op = "getCapture";
    const id = CupixUI.promptNumber(op, "capture id");
    siteView4embed.getCapture(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getPano = () => {
  try {
    const op = "getPano";
    const id = CupixUI.promptNumber(op, "pano id");
    siteView4embed.getPano(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getAnnotation = () => {
  try {
    const op = "getAnnotation";
    const id = CupixUI.promptNumber(op, "annotation id");
    siteView4embed.getAnnotation(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getRoom = () => {
  try {
    const op = "getRoom";
    const id = CupixUI.promptNumber(op, "room id");
    siteView4embed.getRoom(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changeLevel = () => {
  try {
    const op = "changeLevel";
    const id = CupixUI.promptNumber(op, "level id");
    siteView4embed.changeLevel(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changeCapture = () => {
  try {
    const op = "changeCapture";
    const id = CupixUI.promptNumber(op, "capture id");
    siteView4embed.changeCapture(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.changePano = () => {
  try {
    const op = "changePano";
    const id = CupixUI.promptNumber(op, "pano id");
    siteView4embed.changePano(id);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.moveToBimGrid = () => {
  try {
    const op = "moveToBimGrid";
    const bimGridInfo = promptBimGridInfo(op);
    siteView4embed.moveToBimGrid(bimGridInfo);
  } catch (ec) {
    console.warn(ec);
  }
}

CupixUI.changePreset = () => {
  try {
    const op = "changePreset";
    const name = CupixUI.promptString(op, "preset name");
    siteView4embed.changePreset(name);
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
    siteView4embed.addAnnotation(formTemplateId, annotationGroupId, name, values);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.deleteAnnotation = () => {
  try {
    const op = "deleteAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    siteView4embed.deleteAnnotation(annotationId);
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
    siteView4embed.updateAnnotation(annotationId, name, values);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.toggleResolveAnnotation = () => {
  try {
    const op = "toggleResolveAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    siteView4embed.toggleResolveAnnotation(annotationId);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.setActiveAnnotation = () => {
  try {
    const op = "setActiveAnnotation";
    const annotationId = CupixUI.promptNumber(op, "annotation id");
    siteView4embed.setActiveAnnotation(annotationId);
  } catch (ec) {
    console.warn(ec);
  }
}

CupixUI.resetActiveAnnotation = () => {
  try {
    siteView4embed.resetActiveAnnotation();
  } catch (ec) {
    console.warn(ec);
  }
}

CupixUI.getFormTemplate = () => {
  try {
    const op = "getFormTemplate";
    const formTemplateId = CupixUI.promptNumber(op, "form template id");
    siteView4embed.getFormTemplate(formTemplateId);
  } catch (ec) {
    console.warn(ec);
  }
};

CupixUI.getAnnotationGroup = () => {
  try {
    const op = "getAnnotationGroup";
    const annotationGroupId = CupixUI.promptNumber(op, "annotation group id");
    siteView4embed.getAnnotationGroup(annotationGroupId);
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
    siteView4embed.findNearestPanos(
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
