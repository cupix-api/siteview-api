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
  CHANGE_PRESET: "CHANGE_PRESET",
  MOVE_TO_BIM_GRID: "MOVE_TO_BIM_GRID",
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
siteView4embed.init = async function (htmlDivId, siteviewUrl, auth = { accessCode: undefined, apiToken: undefined }) {
  const elem = document.getElementById(htmlDivId);
  let resolver;

  if (auth?.apiToken) siteviewUrl += `?cupix_api_token=${access.apiToken}`;
  else if (auth?.accessCode) siteviewUrl += `?access_code=${access.accessCode}`;

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

siteView4embed.readyPromise = new Promise((res, rej) => {
  resolvers[-1] = res;
});

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

siteView4embed.stop = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.APP_API_STOP
  });

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

siteView4embed.goHome = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GO_HOME
  });

/**
* @param {string} siteViewKey
* @param {boolean} hideSideBar
* @param {'top' | 'bottom'} mapViewPosition
* @param {"BASIC" | "TIMELINE" | "BIM_COMPARE"} layout
* @param {string} openingGeolocation
* @param {object} { coordinate: [string, string], offset?: { x: 0, y: 0, z: 0 } }
* */
siteView4embed.goSiteView = (
  siteViewKey,
  hideSideBar = false,
  mapViewPosition = 'top',
  openingGeolocation = undefined,
  openingLevelId = undefined,
  openingLevelName = undefined,
  openingCaptureId = undefined,
  openingCaptureDate = undefined,
  openingPosition = undefined,
  openingBimGrid = undefined,
  ) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GO_SITEVIEW,
    operationArgs: {
      siteViewKey,
      hideSideBar,
      mapViewPosition,
      openingGeolocation,
      ...(openingLevelId && { openingLevelId }),
      ...(openingLevelName && { openingLevelName }),
      ...(openingCaptureId && { openingCaptureId }),
      ...(openingCaptureDate && { openingCaptureDate }),
      ...(openingPosition && { openingPosition }),
      openingBimGrid,
      deepLink: true
    }
  });

siteView4embed.getSiteView = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_SITEVIEW
  });

siteView4embed.getLevel = (levelId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_LEVEL,
    operationArgs: {
      levelId: levelId
    }
  });

siteView4embed.getLevelAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_LEVEL_ALL
  });

siteView4embed.getCapture = (captureId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAPTURE,
    operationArgs: {
      captureId: captureId
    }
  });

siteView4embed.getCaptureAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAPTURE_ALL
  });

siteView4embed.getPano = (panoId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_PANO,
    operationArgs: {
      panoId: panoId
    }
  });

siteView4embed.getPanoAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_PANO_ALL
  });

siteView4embed.getAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION,
    operationArgs: {
      annotationId: annotationId
    }
  });

siteView4embed.getAnnotationAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_ALL
  });

siteView4embed.getRoom = (roomId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ROOM,
    operationArgs: {
      roomId: roomId
    }
  });

siteView4embed.getRoomAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ROOM_ALL
  });

siteView4embed.getCameraParameters = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_CAMERA_PARAMETERS
  });

siteView4embed.setCameraRotate = (direction, angle) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_ROTATE,
    operationArgs: {
      direction: direction,
      angle: angle
    }
  });

siteView4embed.setCameraZoom = (angleInDegree) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_ZOOM,
    operationArgs: {
      angleInDegree: angleInDegree
    }
  });

siteView4embed.setCameraLookAt = (x, y, z) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_LOOKAT,
    operationArgs: {
      lookAtX: x,
      lookAtY: y,
      lookAtZ: z
    }
  });

siteView4embed.setCameraReset = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_RESET
  });

siteView4embed.setCameraMove = (direction) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_CAMERA_MOVE,
    operationArgs: {
      direction: direction
    }
  });

siteView4embed.changeLevel = (levelId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_LEVEL,
    operationArgs: {
      levelId: levelId
    }
  });

siteView4embed.changeCapture = (captureId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_CAPTURE,
    operationArgs: {
      captureId: captureId
    }
  });

siteView4embed.changePano = (panoId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_PANO,
    operationArgs: {
      panoId: panoId
    }
  });

siteView4embed.changePreset = (presetName) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.CHANGE_PRESET,
    operationArgs: {
      presetName: presetName
    }
  });

siteView4embed.moveToBimGrid = (info) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.MOVE_TO_BIM_GRID,
    operationArgs: {
      bimGrid: {
        coordinate: info.coordinate,
        offset: info.offset
      }
    }
  });

siteView4embed.findNearestPanos = (
  levelId,
  captureId,
  coordX,
  coordY,
  normalX,
  normalY,
  maxCount
) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.FIND_NEAREST_PANOS,
    operationArgs: {
      levelId,
      captureId: captureId,
      coordX,
      coordY,
      normalX,
      normalY,
      maxCount
    }
  });

siteView4embed.addAnnotation = (formTemplateId, annotationGroupId, name, values) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.ADD_ANNOTATION_FORM,
    operationArgs: {
      formTemplateId,
      annotationGroupId,
      name,
      values
    }
  });

siteView4embed.deleteAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.DELETE_ANNOTATION,
    operationArgs: {
      annotationId
    }
  });

siteView4embed.updateAnnotation = (annotationId, name, values) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.UPDATE_ANNOTATION_FORM,
    operationArgs: {
      annotationId,
      name,
      values
    }
  });

siteView4embed.toggleResolveAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.TOGGLE_RESOLVE_ANNOTATION,
    operationArgs: {
      annotationId
    }
  });

siteView4embed.getFormTemplates = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_FORM_TEMPLATE_ALL
  });

siteView4embed.getFormTemplate = (formTemplateId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_FORM_TEMPLATE,
    operationArgs: {
      formTemplateId
    }
  });

siteView4embed.getAnnotationGroup = (annotationGroupId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_GROUP,
    operationArgs: {
      annotationGroupId
    }
  });

siteView4embed.getAnnotationGroupAll = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.GET_ANNOTATION_GROUP_ALL
  });

/** @param {number} annotationId */
siteView4embed.setActiveAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.SET_ACTIVE_ANNOTATION,
    operationArgs: {
      annotationId
    }
  });

siteView4embed.resetActiveAnnotation = () =>
  siteView4embed.sendToCupix({
    operationType: OPERATION_TYPE.RESET_ACTIVE_ANNOTATION
  });

function log(...params) {
  console.log(`%c${params.join(' ')}`, 'color: #bada55;')
}

function ready() {
  resolvers[-1](true);
  siteView4embed.ready = true;
}

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


export default {
  ...siteView4embed
}
