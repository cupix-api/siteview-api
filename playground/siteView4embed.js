/**
 * @typedef {Object} CupixMessageRequest
 * @property {string} operationType
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
 * */
var siteView4embed = siteView4embed || {};

siteView4embed.uuid = 0;

/**
 * @param {string} htmlDivId
 * @param {string} siteviewUrl
 */
siteView4embed.init = function (htmlDivId, siteviewUrl) {
  window.siteView4embed = siteView4embed;
  var elem = document.getElementById(htmlDivId);
  let resolver;
  if (elem) {
    var iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.src = siteviewUrl ?? "https://apidemo.cupix.works";
    iframe.onload = () => {
      siteView4embed.cupixWindow = iframe.contentWindow;
      if (resolver) resolver();
    };
    elem.appendChild(iframe);
  }
  return new Promise((res, rej) => {
    resolver = res;
  });
}

/**
 * @param {CupixMessageRequest} event
 * @param {number} timeout
 * @return {Promise<ErrorType>}
*/
siteView4embed.sendToCupix = function (event, timeout) {
  console.log(`sendToCupix: [${event.operationType}]`, JSON.stringify(event));
  if (siteView4embed.cupixWindow) {
    event.header = "CUPIXWORKS_API";
    event.uuid = siteView4embed.uuid.toString();
    event.timestamp = Date.now();
    siteView4embed.cupixWindow.postMessage(event, "*");

    /** @type {Promise<ErrorType>} */
    const promise = new Promise((resolve) => {
      resolvers[siteView4embed.uuid] = resolve;
      if (!isNaN(timeout)) {
        setTimeout(() => {
          resolve({ error: `timeout: ${event.operationType}` });
        }, timeout);
      }
    });
    siteView4embed.uuid++;
    return promise;
  }
};

/**
 * @param {number} timeout
*/
siteView4embed.start = (timeout) =>
  siteView4embed.sendToCupix({
    operationType: "APP_API_START"
  }, timeout);

siteView4embed.stop = () =>
  siteView4embed.sendToCupix({
    operationType: "APP_API_STOP"
  });

/**
 * @param {string} teamDomain
 * @param {string} email
 * @param {string} password
 * */
siteView4embed.signin = (teamDomain, email, password) =>
  siteView4embed.sendToCupix({
    operationType: "SIGNIN",
    operationArgs: {
      email: email,
      password: password,
      teamDomain: teamDomain
    }
  });

siteView4embed.signinWithToken = (token) =>
  siteView4embed.sendToCupix({
    operationType: "SIGNIN",
    operationArgs: {
      token
    }
  });

siteView4embed.signout = () =>
  siteView4embed.sendToCupix({
    operationType: "SIGNOUT"
  });

siteView4embed.goHome = () =>
  siteView4embed.sendToCupix({
    operationType: "GO_HOME"
  });

siteView4embed.goSiteView = (siteViewKey, hideTopBar = true) =>
  siteView4embed.sendToCupix({
    operationType: "GO_SITEVIEW",
    operationArgs: {
      siteViewKey: siteViewKey,
      hideTopBar: hideTopBar
    }
  });

siteView4embed.getSiteView = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_SITEVIEW"
  });

siteView4embed.getLevel = (levelId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_LEVEL",
    operationArgs: {
      levelId: levelId
    }
  });

siteView4embed.getLevelAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_LEVEL_ALL"
  });

siteView4embed.getCapture = (captureId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_CAPTURE",
    operationArgs: {
      captureId: captureId
    }
  });

siteView4embed.getCaptureAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_CAPTURE_ALL"
  });

siteView4embed.getPano = (panoId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_PANO",
    operationArgs: {
      panoId: panoId
    }
  });

siteView4embed.getPanoAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_PANO_ALL"
  });

siteView4embed.getAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_ANNOTATION",
    operationArgs: {
      annotationId: annotationId
    }
  });

siteView4embed.getAnnotationAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_ANNOTATION_ALL"
  });

siteView4embed.getRoom = (roomId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_ROOM",
    operationArgs: {
      roomId: roomId
    }
  });

siteView4embed.getRoomAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_ROOM_ALL"
  });

siteView4embed.getCameraParameters = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_CAMERA_PARAMETERS"
  });

siteView4embed.setCameraRotate = (direction, angle) =>
  siteView4embed.sendToCupix({
    operationType: "SET_CAMERA_ROTATE",
    operationArgs: {
      direction: direction,
      angle: angle
    }
  });

siteView4embed.setCameraZoom = (angleInDegree) =>
  siteView4embed.sendToCupix({
    operationType: "SET_CAMERA_ZOOM",
    operationArgs: {
      angleInDegree: angleInDegree
    }
  });

siteView4embed.setCameraLookAt = (x, y, z) =>
  siteView4embed.sendToCupix({
    operationType: "SET_CAMERA_LOOKAT",
    operationArgs: {
      lookAtX: x,
      lookAtY: y,
      lookAtZ: z
    }
  });

siteView4embed.setCameraReset = () =>
  siteView4embed.sendToCupix({
    operationType: "SET_CAMERA_RESET"
  });

siteView4embed.setCameraMove = (direction) =>
  siteView4embed.sendToCupix({
    operationType: "SET_CAMERA_MOVE",
    operationArgs: {
      direction: direction
    }
  });

siteView4embed.changeLevel = (levelId) =>
  siteView4embed.sendToCupix({
    operationType: "CHANGE_LEVEL",
    operationArgs: {
      levelId: levelId
    }
  });

siteView4embed.changeCapture = (captureId) =>
  siteView4embed.sendToCupix({
    operationType: "CHANGE_CAPTURE",
    operationArgs: {
      captureId: captureId
    }
  });

siteView4embed.changePano = (panoId) =>
  siteView4embed.sendToCupix({
    operationType: "CHANGE_PANO",
    operationArgs: {
      panoId: panoId
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
    operationType: "FIND_NEAREST_PANOS",
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
    operationType: "ADD_ANNOTATION_FORM",
    operationArgs: {
      formTemplateId,
      annotationGroupId,
      name,
      values
    }
  });

siteView4embed.deleteAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: "DELETE_ANNOTATION",
    operationArgs: {
      annotationId
    }
  });

siteView4embed.updateAnnotation = (annotationId, name, values) =>
  siteView4embed.sendToCupix({
    operationType: "UPDATE_ANNOTATION_FORM",
    operationArgs: {
      annotationId,
      name,
      values
    }
  });

siteView4embed.toggleResolveAnnotation = (annotationId) =>
  siteView4embed.sendToCupix({
    operationType: "TOGGLE_RESOLVE_ANNOTATION",
    operationArgs: {
      annotationId
    }
  });

siteView4embed.getFormTemplates = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_FORM_TEMPLATE_ALL"
  });

siteView4embed.getFormTemplate = (formTemplateId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_FORM_TEMPLATE",
    operationArgs: {
      formTemplateId
    }
  });

siteView4embed.getAnnotationGroup = (annotationGroupId) =>
  siteView4embed.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP",
    operationArgs: {
      annotationGroupId
    }
  });

siteView4embed.getAnnotationGroupAll = () =>
  siteView4embed.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP_ALL"
  });
