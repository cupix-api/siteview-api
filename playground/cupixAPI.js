const resolvers = {};

var CupixApi = CupixApi || {};

CupixApi.uuid = 0;

CupixApi.sendToCupix = function (event, timeout) {
  console.log(`sendToCupix: [${event.operationType}]`, JSON.stringify(event));
  if (cupixWindow) {
    event.header = "CUPIXWORKS_API";
    event.uuid = CupixApi.uuid.toString();
    event.timestamp = Date.now();
    cupixWindow.postMessage(event, "*");
    const promise = new Promise((resolve) => {
      resolvers[CupixApi.uuid] = resolve;
      if (!isNaN(timeout)) {
        setTimeout(() => {
          resolve({error: `timeout: ${event.operationType}`});
        }, timeout);
      }
    });
    CupixApi.uuid++;
    return promise;
  }
};

CupixApi.start = (timeout) =>
  CupixApi.sendToCupix({
    operationType: "APP_API_START"
  }, timeout);

CupixApi.stop = () =>
  CupixApi.sendToCupix({
    operationType: "APP_API_STOP"
  });

CupixApi.signin = (teamDomain, email, password) =>
  CupixApi.sendToCupix({
    operationType: "SIGNIN",
    operationArgs: {
      email: email,
      password: password,
      teamDomain: teamDomain
    }
  });

CupixApi.signinWithToken = (token) =>
  CupixApi.sendToCupix({
    operationType: "SIGNIN",
    operationArgs: {
      token
    }
  });

CupixApi.signout = () =>
  CupixApi.sendToCupix({
    operationType: "SIGNOUT"
  });

CupixApi.goHome = () =>
  CupixApi.sendToCupix({
    operationType: "GO_HOME"
  });

CupixApi.goSiteView = (siteViewKey) =>
  CupixApi.sendToCupix({
    operationType: "GO_SITEVIEW",
    operationArgs: {
      siteViewKey: siteViewKey
    }
  });

CupixApi.getSiteView = () =>
  CupixApi.sendToCupix({
    operationType: "GET_SITEVIEW"
  });

CupixApi.getLevel = (levelId) =>
  CupixApi.sendToCupix({
    operationType: "GET_LEVEL",
    operationArgs: {
      levelId: levelId
    }
  });

CupixApi.getLevelAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_LEVEL_ALL"
  });

CupixApi.getCapture = (captureId) =>
  CupixApi.sendToCupix({
    operationType: "GET_CAPTURE",
    operationArgs: {
      captureId: captureId
    }
  });

CupixApi.getCaptureAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_CAPTURE_ALL"
  });

CupixApi.getPano = (panoId) =>
  CupixApi.sendToCupix({
    operationType: "GET_PANO",
    operationArgs: {
      panoId: panoId
    }
  });

CupixApi.getPanoAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_PANO_ALL"
  });

CupixApi.getAnnotation = (annotationId) =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION",
    operationArgs: {
      annotationId: annotationId
    }
  });

CupixApi.getAnnotationAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION_ALL"
  });

CupixApi.getRoom = (roomId) =>
  CupixApi.sendToCupix({
    operationType: "GET_ROOM",
    operationArgs: {
      roomId: roomId
    }
  });

CupixApi.getRoomAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_ROOM_ALL"
  });

CupixApi.getCameraParameters = () =>
  CupixApi.sendToCupix({
    operationType: "GET_CAMERA_PARAMETERS"
  });

CupixApi.setCameraRotate = (direction, angle) =>
  CupixApi.sendToCupix({
    operationType: "SET_CAMERA_ROTATE",
    operationArgs: {
      direction: direction,
      angle: angle
    }
  });

CupixApi.setCameraZoom = (angleInDegree) =>
  CupixApi.sendToCupix({
    operationType: "SET_CAMERA_ZOOM",
    operationArgs: {
      angleInDegree: angleInDegree
    }
  });

CupixApi.setCameraLookAt = (x, y, z) =>
  CupixApi.sendToCupix({
    operationType: "SET_CAMERA_LOOKAT",
    operationArgs: {
      lookAtX: x,
      lookAtY: y,
      lookAtZ: z
    }
  });

CupixApi.setCameraReset = () =>
  CupixApi.sendToCupix({
    operationType: "SET_CAMERA_RESET"
  });

CupixApi.setCameraMove = (direction) =>
  CupixApi.sendToCupix({
    operationType: "SET_CAMERA_MOVE",
    operationArgs: {
      direction: direction
    }
  });

CupixApi.changeLevel = (levelId) =>
  CupixApi.sendToCupix({
    operationType: "CHANGE_LEVEL",
    operationArgs: {
      levelId: levelId
    }
  });

CupixApi.changeCapture = (captureId) =>
  CupixApi.sendToCupix({
    operationType: "CHANGE_CAPTURE",
    operationArgs: {
      captureId: captureId
    }
  });

CupixApi.changePano = (panoId) =>
  CupixApi.sendToCupix({
    operationType: "CHANGE_PANO",
    operationArgs: {
      panoId: panoId
    }
  });

CupixApi.findNearestPanos = (
  levelId,
  captureId,
  coordX,
  coordY,
  normalX,
  normalY,
  maxCount
) =>
  CupixApi.sendToCupix({
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

CupixApi.addAnnotation = (formTemplateId, annotationGroupId, name, values) =>
  CupixApi.sendToCupix({
    operationType: "ADD_ANNOTATION_FORM",
    operationArgs: {
      formTemplateId,
      annotationGroupId,
      name,
      values
    }
  });

CupixApi.deleteAnnotation = (annotationId) =>
  CupixApi.sendToCupix({
    operationType: "DELETE_ANNOTATION",
    operationArgs: {
      annotationId
    }
  });

CupixApi.updateAnnotation = (annotationId, name, values) =>
  CupixApi.sendToCupix({
    operationType: "UPDATE_ANNOTATION_FORM",
    operationArgs: {
      annotationId,
      name,
      values
    }
  });

CupixApi.toggleResolveAnnotation = (annotationId) =>
  CupixApi.sendToCupix({
    operationType: "TOGGLE_RESOLVE_ANNOTATION",
    operationArgs: {
      annotationId
    }
  });

CupixApi.getFormTemplates = () =>
  CupixApi.sendToCupix({
    operationType: "GET_FORM_TEMPLATE_ALL"
  });

CupixApi.getFormTemplate = (formTemplateId) =>
  CupixApi.sendToCupix({
    operationType: "GET_FORM_TEMPLATE",
    operationArgs: {
      formTemplateId
    }
  });

CupixApi.addAnnotationGroup = (
  name,
  levelId,
  captureId,
  annotationGroupTemplateId
) =>
  CupixApi.sendToCupix({
    operationType: "ADD_ANNOTATION_GROUP",
    operationArgs: {
      name,
      levelId,
      captureId,
      annotationGroupTemplateId
    }
  });

CupixApi.getAnnotationGroup = (annotationGroupId) =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP",
    operationArgs: {
      annotationGroupId
    }
  });

CupixApi.getAnnotationGroupAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP_ALL"
  });

CupixApi.updateAnnotationGroup = (annotationGroupId, name) =>
  CupixApi.sendToCupix({
    operationType: "UPDATE_ANNOTATION_GROUP",
    operationArgs: {
      annotationGroupId,
      name
    }
  });

CupixApi.deleteAnnotationGroup = (annotationGroupId) =>
  CupixApi.sendToCupix({
    operationType: "DELETE_ANNOTATION_GROUP",
    operationArgs: {
      annotationGroupId
    }
  });

CupixApi.getAnnotationGroupTemplate = (annotationGroupTemplateId) =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP_TEMPLATE",
    operationArgs: {
      annotationGroupTemplateId
    }
  });

CupixApi.getAnnotationGroupTemplateAll = () =>
  CupixApi.sendToCupix({
    operationType: "GET_ANNOTATION_GROUP_TEMPLATE_ALL"
  });
