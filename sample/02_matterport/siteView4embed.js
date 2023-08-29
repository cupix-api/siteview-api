/**
 * @readonly
 * @enum {string}
 */
const OPERATION_TYPE = {
  API_READY: "API_READY",
  APP_API_START: "APP_API_START",
  APP_API_STOP: "APP_API_STOP",
  SIGNIN: "SIGNIN",
  SIGNOUT: "SIGNOUT",
  SIGNEDIN: "SIGNEDIN",
  GO_HOME: "GO_HOME",
  GO_SITEVIEW: "GO_SITEVIEW",
  GET_SITEVIEW: "GET_SITEVIEW",
  GET_LEVEL: "GET_LEVEL",
  GET_LEVEL_ALL: "GET_LEVEL_ALL",
  GET_CAPTURE: "GET_CAPTURE",
  GET_CAPTURE_ALL: "GET_CAPTURE_ALL",
  GET_PANO: "GET_PANO",
  GET_PANO_ALL: "GET_PANO_ALL",
  GET_ANNOTATION: "GET_ANNOTATION",
  GET_ANNOTATION_ALL: "GET_ANNOTATION_ALL",
  GET_ROOM: "GET_ROOM",
  GET_ROOM_ALL: "GET_ROOM_ALL",
  GET_CAMERA_PARAMETERS: "GET_CAMERA_PARAMETERS",
  SET_CAMERA_ROTATE: "SET_CAMERA_ROTATE",
  SET_CAMERA_ZOOM: "SET_CAMERA_ZOOM",
  SET_CAMERA_LOOKAT: "SET_CAMERA_LOOKAT",
  SET_CAMERA_RESET: "SET_CAMERA_RESET",
  SET_CAMERA_MOVE: "SET_CAMERA_MOVE",
  CHANGE_LEVEL: "CHANGE_LEVEL",
  CHANGE_CAPTURE: "CHANGE_CAPTURE",
  CHANGE_PANO: "CHANGE_PANO",
  FIND_NEAREST_PANOS: "FIND_NEAREST_PANOS",
  ADD_ANNOTATION_FORM: "ADD_ANNOTATION_FORM",
  DELETE_ANNOTATION: "DELETE_ANNOTATION",
  UPDATE_ANNOTATION_FORM: "UPDATE_ANNOTATION_FORM",
  TOGGLE_RESOLVE_ANNOTATION: "TOGGLE_RESOLVE_ANNOTATION",
  GET_FORM_TEMPLATE_ALL: "GET_FORM_TEMPLATE_ALL",
  GET_FORM_TEMPLATE: "GET_FORM_TEMPLATE",
  GET_ANNOTATION_GROUP: "GET_ANNOTATION_GROUP",
  GET_ANNOTATION_GROUP_ALL: "GET_ANNOTATION_GROUP_ALL",
  SET_ACTIVE_ANNOTATION: "SET_ACTIVE_ANNOTATION",
  RESET_ACTIVE_ANNOTATION: "RESET_ACTIVE_ANNOTATION",
  CHANGE_LAYOUT: "CHANGE_LAYOUT"
}

/**
 * @typedef {Object} CupixMessageRequest
 * @property {OPERATION_TYPE} operationType
 * @property {"CUPIXWORKS_API"} header
 * @property {string} uuid
 * @property {number} timestamp
 */
/**
 * @typedef {Object} ErrorType
 * @property {string} error
 */

const resolvers = {};

/**
 * @typedef {Object} siteView4embed
 * @property {number} uuid
 * @property {boolean} quiet
 * @property {boolean} ready
 */
const siteView4embed = {
  uuid: 0,
  quiet: false,
  ready: false
};

window.siteView4embed = siteView4embed;

/**
 * @param {string} htmlDivId
 * @param {string} siteviewUrl
 */
siteView4embed.init = async function (htmlDivId, siteviewUrl) {
  const elem = document.getElementById(htmlDivId);
  let resolver;
  if (elem) {
    const iframe = document.createElement("iframe");
    iframe.onload = () => {
      siteView4embed.cupixWindow = iframe.contentWindow;
      if (resolver) resolver();
    };
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.src = siteviewUrl ?? "https://apidemo.cupix.works";

    elem.appendChild(iframe);
  }
  const result = new Promise((res, rej) => {
    resolver = res;
  });
  return result;
}

function initializeReadyPromise() {
  siteView4embed.readyPromise = new Promise((res, rej) => {
    resolvers[-1] = res;
  });
}

/**
 * @param {CupixMessageRequest} event
 * @param {number} waitReady
 * @return {Promise<ErrorType>}
*/
siteView4embed.sendToCupix = async function (event, waitReady) {
  if (siteView4embed.cupixWindow) {
    event.header = "CUPIXWORKS_API";
    event.uuid = siteView4embed.uuid.toString();
    event.timestamp = Date.now();
    const error = { error: `timeout: ${event.operationType} ${waitReady}ms` };

    /** @type {Promise<ErrorType>} */
    const promise = new Promise((resolve) => {
      const id = siteView4embed.uuid
      resolvers[id] = resolve;
      setTimeout(() => {
        if (resolvers[id]) {
          resolve(error);
        };
        if (!siteView4embed.ready) {
          resolvers[-1](false);
        }
      }, waitReady ?? 5000);
    });

    await siteView4embed.readyPromise;
    siteView4embed.cupixWindow.postMessage(event, "*");
    if (!siteView4embed.quiet) console.log(`sendToCupix: [${event.operationType}]`, JSON.stringify(event));

    siteView4embed.uuid++;
    return promise;
  }
};

/**
 * @param {number} timeout
*/
siteView4embed.start = (timeout) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.APP_API_START
  }, timeout);

siteView4embed.stop = () => siteView4embed.sendToCupix({
  operationType: OPERATION_TYPE.APP_API_STOP
});

siteView4embed.disconnect = () => {
  siteView4embed.ready = false;
  initializeReadyPromise();
};

/**
 * @param {string} teamDomain
 * @param {string} email
 * @param {string} password
 * */
siteView4embed.signin = (teamDomain, email, password) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SIGNIN,
    operationArgs: {
      email: email,
      password: password,
      teamDomain: teamDomain
    }
  });

siteView4embed.signinWithToken = (token) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SIGNIN,
    operationArgs: {
      token
    }
  });

siteView4embed.signout = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SIGNOUT
  });

siteView4embed.signedin = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SIGNEDIN
  });

siteView4embed.goHome = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GO_HOME
  });

siteView4embed.goSiteView = (siteViewKey, hideSideBar = false) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GO_SITEVIEW,
    operationArgs: {
      siteViewKey: siteViewKey,
      hideSideBar: hideSideBar
    }
  });

siteView4embed.getSiteView = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_SITEVIEW,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getLevel = (levelId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_LEVEL,
    operationArgs: {
      levelId: levelId,
      caller: caller
    }
  });

siteView4embed.getLevelAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_LEVEL_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getCapture = (captureId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAPTURE,
    operationArgs: {
      captureId: captureId,
      caller: caller
    }
  });

siteView4embed.getCaptureAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAPTURE_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getPano = (panoId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_PANO,
    operationArgs: {
      panoId: panoId,
      caller: caller
    }
  });

siteView4embed.getPanoAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_PANO_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getAnnotation = (annotationId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION,
    operationArgs: {
      annotationId: annotationId,
      caller: caller
    }
  });

siteView4embed.getAnnotationAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getRoom = (roomId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ROOM,
    operationArgs: {
      roomId: roomId,
      caller: caller
    }
  });

siteView4embed.getRoomAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ROOM_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getCameraParameters = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAMERA_PARAMETERS,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.setCameraRotate = (direction, angle, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_ROTATE,
    operationArgs: {
      direction: direction,
      angle: angle,
      caller: caller
    }
  });

siteView4embed.setCameraZoom = (angleInDegree, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_ZOOM,
    operationArgs: {
      angleInDegree: angleInDegree,
      caller: caller
    }
  });

siteView4embed.setCameraLookAt = (x, y, z, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_LOOKAT,
    operationArgs: {
      lookAtX: x,
      lookAtY: y,
      lookAtZ: z,
      caller: caller
    }
  });

siteView4embed.setCameraReset = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_RESET,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.setCameraMove = (direction, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_MOVE,
    operationArgs: {
      direction: direction,
      caller: caller
    }
  });

siteView4embed.changeLevel = (levelId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_LEVEL,
    operationArgs: {
      levelId: levelId,
      caller: caller
    }
  });

siteView4embed.changeCapture = (captureId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_CAPTURE,
    operationArgs: {
      captureId: captureId,
      caller: caller
    }
  });

siteView4embed.changePano = (panoId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_PANO,
    operationArgs: {
      panoId: panoId,
      caller: caller
    }
  });

siteView4embed.findNearestPanos = (
  levelId,
  captureId,
  coordX,
  coordY,
  normalX,
  normalY,
  maxCount,
  caller
) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.FIND_NEAREST_PANOS,
    operationArgs: {
      levelId: levelId,
      captureId: captureId,
      coordX: coordX,
      coordY: coordY,
      normalX: normalX,
      normalY: normalY,
      maxCount: maxCount,
      caller: caller
    }
  });

siteView4embed.addAnnotation = (formTemplateId, annotationGroupId, name, values, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.ADD_ANNOTATION_FORM,
    operationArgs: {
      formTemplateId: formTemplateId,
      annotationGroupId: annotationGroupId,
      name: name,
      values: values,
      caller: caller
    }
  });

siteView4embed.deleteAnnotation = (annotationId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.DELETE_ANNOTATION,
    operationArgs: {
      annotationId: annotationId,
      caller: caller
    }
  });

siteView4embed.updateAnnotation = (annotationId, name, values, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.UPDATE_ANNOTATION_FORM,
    operationArgs: {
      annotationId: annotationId,
      name: name,
      values: values,
      caller: caller
    }
  });

siteView4embed.toggleResolveAnnotation = (annotationId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.TOGGLE_RESOLVE_ANNOTATION,
    operationArgs: {
      annotationId,
      caller: caller
    }
  });

siteView4embed.getFormTemplates = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_FORM_TEMPLATE_ALL,
    operationArgs: {
      caller: caller
    }
  });

siteView4embed.getFormTemplate = (formTemplateId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_FORM_TEMPLATE,
    operationArgs: {
      formTemplateId: formTemplateId,
      caller: caller
    }
  });

siteView4embed.getAnnotationGroup = (annotationGroupId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_GROUP,
    operationArgs: {
      annotationGroupId: annotationGroupId,
      caller: caller
    }
  });

siteView4embed.getAnnotationGroupAll = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_GROUP_ALL,
    operationArgs: {
      caller: caller
    }
  });

/** @param {number} annotationId */
siteView4embed.setActiveAnnotation = (annotationId, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_ACTIVE_ANNOTATION,
    operationArgs: {
      annotationId: annotationId,
      caller: caller
    }
  });

siteView4embed.resetActiveAnnotation = (caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.RESET_ACTIVE_ANNOTATION,
    operationArgs: {
      caller: caller
    }
  });

/**
 * @param {"BASIC" | "TIMELINE" | "BIM_COMPARE"} layout
 */
siteView4embed.changeLayout = (layout, caller) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_LAYOUT,
    operationArgs: {
      layout: layout,
      caller: caller
    }
  });

function log(...params) {
  // console.log(`%c${params.join(' ')}`, 'color: #bada55;')
}

function ready() {
  resolvers[-1](true);
  siteView4embed.ready = true;
}

initializeReadyPromise();
window.addEventListener(
  "message",
  /** @param {MessageEvent<CupixMessageResponse>} e */
  function (e) {
    const response = e && e.data;
    if (response == undefined) return;
    if (response.header != "CUPIXWORKS_API") return;
    if (!siteView4embed.quiet) log("[CUPIXWORKS_API]", JSON.stringify(response || {}));
    if (!siteView4embed.ready) ready(response);
    if (
      response.request?.uuid &&
      typeof resolvers[response.request.uuid] === "function"
    ) {
      resolvers[response.request.uuid](response.response || response);
      resolvers[response.request.uuid] = null;
    }
  },
  false
);

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
