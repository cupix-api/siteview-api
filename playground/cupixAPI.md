- [CUPIX API](#cupix-api)
  - [**Initialize API**](#initialize-api)
    - [**Start**](#start)
    - [**Stop**](#stop)
  - [**Authenticate API**](#authenticate-api)
    - [**Sign In**](#sign-in)
    - [**Sign Out**](#sign-out)
  - [**Navigate API**](#navigate-api)
    - [**Go Home**](#go-home)
    - [**Go SiteView**](#go-siteview)
  - [**Get Info API**](#get-info-api)
    - [**Get Siteview**](#get-siteview)
    - [**Get Level**](#get-level)
    - [**Get Level All**](#get-level-all)
    - [**Get Capture**](#get-capture)
    - [**Get Capture All**](#get-capture-all)
    - [**Get Pano**](#get-pano)
    - [**Get Pano All**](#get-pano-all)
    - [**Get Room**](#get-room)
    - [**Get Room All**](#get-room-all)
    - [**Get Form Template**](#get-form-template)
    - [**Get Form Template All**](#get-form-template-all)
  - [**Change API**](#change-api)
    - [**Change Level**](#change-level)
    - [**Change Capture**](#change-capture)
    - [**Change Pano**](#change-pano)
  - [**Camera API**](#camera-api)
    - [**Get Camera Parameter**](#get-camera-parameter)
    - [**Set Camera Rotate**](#set-camera-rotate)
    - [**Set Camera Zoom**](#set-camera-zoom)
    - [**Set Camera Lookat**](#set-camera-lookat)
    - [**Set Camera Reset**](#set-camera-reset)
    - [**Set Camera Move**](#set-camera-move)
  - [**Annotation API**](#annotation-api)
    - [**Add Annotation Form**](#add-annotation-form)
    - [**Delete Annotation**](#delete-annotation)
    - [**Get Annotation Group**](#get-annotation-group)
    - [**Get Annotation Group All**](#get-annotation-group-all)
    - [**Get Annotation**](#get-annotation)
    - [**Get Annotation All**](#get-annotation-all)
    - [**Toggle Resolve Annotation**](#toggle-resolve-annotation)
    - [**Update Annotation Form**](#update-annotation-form)
  - [**Utility API**](#utility-api)
    - [**Find Nearest Panos**](#find-nearest-panos)

# CUPIX API

## **Initialize API**

### **Start**

API that need to be run in order to use other APIs

Request

```ts
CupixApi.sendToCupix({
  operationType: "APP_API_START",
});
```

Response

```ts
{
  running: true;
}
```

| Property | Data type | Description                |
| -------- | --------- | -------------------------- |
| running  | boolean   | Whether the API is started |

### **Stop**

Stop using the API. API cannot be used in `running: false` state.

Request

```ts
CupixApi.sendToCupix({
  operationType: "APP_API_STOP",
});
```

Response

```ts
{
  running: true;
  forceMessage: true;
}
```

| Property | Data type | Description                |
| -------- | --------- | -------------------------- |
| running  | boolean   | Whether the API is started |

---

## **Authenticate API**

### **Sign In**

Login API. Must be logged in to use the Go Home / SiteView page API.

Request

- sign in with Email

```ts
CupixApi.sendToCupix({
  operationType: "SIGNIN",
  operationArgs: {
    email: "example@example.com",
    password: "",
    teamDomain: "",
  },
});
```

- sign in with token

```ts
CupixApi.sendToCupix({
  operationType: "SIGNIN",
  operationArgs: {
    token: "",
  },
});
```

| Property   | Data type | Description                                      |
| ---------- | --------- | ------------------------------------------------ |
| email      | string    | Login email. Required if token is not present    |
| password   | string    | Login password. Required if token is not present |
| teamDomain | string    | Team domain. Required if token is not present    |
| token      | string    | If have a token, can login with just the token   |

Response

### **Sign Out**

Logout API.

```ts
CupixApi.sendToCupix({
  operationType: "SIGNOUT",
});
```

## **Navigate API**

### **Go Home**

Go to the dashboard page.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GO_HOME",
});
```

Response

### **Go SiteView**

Go to the siteView page.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GO_SITEVIEW",
  operationArgs: {
    siteViewKey: "",
  },
});
```

| Property    | Data type | Description                                 |
| ----------- | --------- | ------------------------------------------- |
| siteViewKey | string    | The key of the siteView to move the page to |

Response

## **Get Info API**

### **Get Siteview**

Get the information of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_SITEVIEW",
});
```

Response

```ts
{
  key: "";
  name: "";
}
```

| Property | Data type | Description                       |
| -------- | --------- | --------------------------------- |
| key      | string    | SiteView key of the current page  |
| name     | string    | SiteView name of the current page |

### **Get Level**

Get the specific level information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_LEVEL",
  operationArgs: {
    levelId: 1,
  },
});
```

| Property | Data type | Description       | Require |
| -------- | --------- | ----------------- | ------- |
| levelId  | number    | Target's level ID | O       |

Response

```ts
{
  level: {
    id: 1,
    name: "",
    isGroundLevel: true,
    elevation: 1,
    height: 1,
  },
}
```

| Property | Data type | Description       |
| -------- | --------- | ----------------- |
| level    | object    | Level information |

| level Property | Data type | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | number    | ID of level                     |
| name           | string    | Name of level                   |
| isGroundLevel  | boolean   | Ground level or not             |
| elevation      | number    | The height of the level         |
| height         | number    | The ceiling height of the level |

### **Get Level All**

Get all level information of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_LEVEL_ALL",
});
```

Response

```ts
{
  levels: [
    {
      id: 1,
      name: "",
      isGroundLevel: true,
      elevation: 1,
      height: 1,
    },
  ],
}
```

| Property | Data type              | Description             |
| -------- | ---------------------- | ----------------------- |
| levels   | array of level objects | Level information array |

| level Property | Data type | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | number    | ID of level                     |
| name           | string    | Name of level                   |
| isGroundLevel  | boolean   | Ground level or not             |
| elevation      | number    | The height of the level         |
| height         | number    | The ceiling height of the level |

### **Get Capture**

Get the specific capture information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_CAPTURE",
  operationArgs: {
    captureId: 1,
  },
});
```

| Property  | Data type | Description | Require |
| --------- | --------- | ----------- | ------- |
| captureId | number    | Target's ID | O       |

Response

```ts
{
  capture: {
    id: 1,
    name: "",
    startDate: Date,
    endDate: Date,
  },
}
```

| Property | Data type | Description         |
| -------- | --------- | ------------------- |
| capture  | object    | Capture information |

| capture Property | Data type | Description             |
| ---------------- | --------- | ----------------------- |
| id               | number    | ID of capture           |
| name             | string    | The name of the capture |
| date             | Date      | Date of capture         |

### **Get Capture All**

Get all capture information of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_CAPTURE_ALL",
});
```

Response

```ts
{
  captures: [
    {
      id: 1,
      name: "",
      startDate: Date,
      endDate: Date,
    },
  ],
}
```

| Property | Data type                | Description               |
| -------- | ------------------------ | ------------------------- |
| captures | array of capture objects | Capture information array |

| capture Property | Data type | Description             |
| ---------------- | --------- | ----------------------- |
| id               | number    | ID of capture           |
| name             | string    | The name of the capture |
| date             | Date      | Date of capture         |

### **Get Pano**

Get the specific pano information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_PANO",
  operationArgs: {
    panoId: 1,
  },
});
```

| Property | Data type | Description      | Require |
| -------- | --------- | ---------------- | ------- |
| panoId   | number    | Target's pano ID | O       |

Response

```ts
{
  pano: {
    id: 1,
    name: "",
    filename: "",
    appCapturedAt: Date,
    publishedAt: Date,
    measureReadyAt: Date,
    position: [],
    levelId: 1,
    captureId: 1,
  },
}
```

| Property | Data type | Description      |
| -------- | --------- | ---------------- |
| pano     | object    | Pano information |

| pano Property  | Data type | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | number    | ID of the pano                  |
| name           | string    | Name of the pano                |
| filename       | string    | Pano image file name            |
| appCapturedAt  | Date      | Date taken in the app           |
| publishedAt    | Date      | Published date                  |
| measureReadyAt | Date      | Measure ready date              |
| position       | number[]  | [x,y,z] coordinates of pano     |
| levelId        | number    | ID of the level containing pano |
| captureId      | number    | ID of capture containing pano   |

### **Get Pano All**

Get all panos of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_PANO_ALL",
});
```

Response

```ts
{
  panos: [
    {
      id: 1,
      name: "",
      filename: "",
      appCapturedAt: Date,
      publishedAt: Date,
      measureReadyAt: Date,
      position: [],
      levelId: 1,
      captureId: 1,
    },
  ],
}
```

| Property | Data type             | Description            |
| -------- | --------------------- | ---------------------- |
| panos    | array of pano objects | pano information array |

| pano Property  | Data type | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | number    | ID of the pano                  |
| name           | string    | Name of the pano                |
| filename       | string    | Pano image file name            |
| appCapturedAt  | Date      | Date taken in the app           |
| publishedAt    | Date      | Published date                  |
| measureReadyAt | Date      | Measure ready date              |
| position       | number[]  | [x,y,z] coordinates of pano     |
| levelId        | number    | ID of the level containing pano |
| captureId      | number    | ID of capture containing pano   |

### **Get Room**

Get the specific room information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ROOM",
  operationArgs: {
    roomId: 1,
  },
});
```

| Property | Data type | Description      | Require |
| -------- | --------- | ---------------- | ------- |
| roomId   | number    | Target's room ID | O       |

Response

```ts
{
  room: {
    id: 1,
    name: "",
    minBound: [],
    maxBound: [],
  },
}
```

| Property | Data type | Description      |
| -------- | --------- | ---------------- |
| room     | object    | Room information |

| room Property | Data type | Description                             |
| ------------- | --------- | --------------------------------------- |
| id            | number    | ID of room                              |
| name          | string    | Name of the room                        |
| bimId         | number    | Bim ID                                  |
| baseMatrix    | number[]  | Base matrix                             |
| minBound      | number[]  | Min coordinates of bounding box [x,y,z] |
| maxBound      | number[]  | Max coordinates of bounding box [x,y,z] |

### **Get Room All**

Get all room information of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ROOM_ALL",
});
```

Response

```ts
{
  room: [
    {
      id: 1,
      name: "",
      minBound: [],
      maxBound: [],
    },
  ],
}
```

| Property | Data type             | Description            |
| -------- | --------------------- | ---------------------- |
| rooms    | array of room objects | Room information array |

| room Property | Data type | Description                             |
| ------------- | --------- | --------------------------------------- |
| id            | number    | ID of room                              |
| name          | string    | Name of the room                        |
| bimId         | number    | Bim ID                                  |
| baseMatrix    | number[]  | Base matrix                             |
| minBound      | number[]  | Min coordinates of bounding box [x,y,z] |
| maxBound      | number[]  | Max coordinates of bounding box [x,y,z] |

### **Get Form Template**

Get the specific form template.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_FORM_TEMPLATE",
  operationArgs: {
    formTemplateId: 1,
  },
});
```

| Property       | Data type | Description               | Require |
| -------------- | --------- | ------------------------- | ------- |
| formTemplateId | number    | Target's form template ID | O       |

Response

```ts
{
  formTemplate: {
    id: 1,
    name: "",
    description: "",
    created_at: "",
    updated_at: "",
  },
  formFields: [
    {
      id: 1;
      type: "";
      name: "";
      kind: "select_boxes";
    },
  ],
}
```

| Property     | Data type                  | Description               |
| ------------ | -------------------------- | ------------------------- |
| formTemplate | object                     | form Template information |
| formFields   | array of formField objects | form field information    |

| formTemplate Property | Data type | Description                       |
| --------------------- | --------- | --------------------------------- |
| id                    | number    | ID of the form template           |
| name                  | string    | Name of the form template         |
| description           | string    | Description of the form template  |
| created_at            | string    | Created date of the form template |
| updated_at            | string    | Updated date of the form template |

| formField Property | Data type                                                                                                                                | Description            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| id                 | number                                                                                                                                   | ID of the form field   |
| type               | string                                                                                                                                   | Type of form field     |
| name               | string                                                                                                                                   | Name of the form field |
| kind               | `"select_boxes" \| "text_field" \| "number" \| "description" \| "member" \| "text_area" \| "check_box" \| "select" \| "radio" \| "date"` | Types of form field    |

### **Get Form Template All**

Get all available form templates.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_FORM_TEMPLATE_ALL",
});
```

Response

```ts
{
  formTemplates: [
    {
      id: "",
      name: "",
      description: "",
      created_at: "",
      updated_at: "",
    },
  ],
}
```

| Property      | Data type                     | Description               |
| ------------- | ----------------------------- | ------------------------- |
| formTemplates | array of formTemplate Objects | form template information |

| formTemplate Property | Data type | Description                       |
| --------------------- | --------- | --------------------------------- |
| id                    | number    | ID of the form template           |
| name                  | string    | Name of the form template         |
| description           | string    | Description of the form template  |
| created_at            | string    | Created date of the form template |
| updated_at            | string    | Updated date of the form template |

## **Change API**

### **Change Level**

Change to a specific level

Request

```ts
CupixApi.sendToCupix({
  operationType: "CHANGE_LEVEL",
  operationArgs: {
    levelId: 1,
  },
});
```

| Property | Data type | Description               | Require |
| -------- | --------- | ------------------------- | ------- |
| levelId  | number    | ID of the level to change | O       |

Response

### **Change Capture**

Change to a specific capture.

Request

```ts
CupixApi.sendToCupix({
  operationType: "CHANGE_CAPTURE",
  operationArgs: {
    captureId: 1,
  },
});
```

| Property  | Data type | Description             | Require |
| --------- | --------- | ----------------------- | ------- |
| captureId | number    | ID of capture to change | O       |

Response


### **Change Pano**

Focus on a specific pano.

Request

```ts
CupixApi.sendToCupix({
  operationType: "CHANGE_PANO",
  operationArgs: {
    panoId,
    lookAt,
  },
});
```

| Property | Data type | Description                             | Require |
| -------- | --------- | --------------------------------------- | ------- |
| panoId   | number    | ID of the pano to focus on              | O       |
| lookAt   | number[]  | [x,y,z] coordinates looking at the pano | X       |

Response


## **Camera API**

### **Get Camera Parameter**

Get camera parameter information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_CAMERA_PARAMETERS"
});
```

Response

```ts
{
  cameraParameters: {
    viewMode: "",
    walkMode: true,
    orthoMode: false,
    tm: {
      elements: []
    },
    fov: 1,
    zoom: 1,
    orthoWidth: 1,
    orthoHeight: 1,
    orthoZoom: 1
  }
}
```

| Property         | Data type | Description                   |
| ---------------- | --------- | ----------------------------- |
| cameraParameters | object    | Camera Parameters information |

| cameraParameters Property | Data type | Description                                                                   |
| ------------------------- | --------- | ----------------------------------------------------------------------------- |
| viewMode                  | string    | `"walk" \| "fly" \| "overhead"`                                               |
| walkMode                  | boolean   | whether the view mode is "walk"                                               |
| orthoMode                 | boolean   | whether the camera is Orthographic or Perspective                             |
| tm                        | number[]  | camera's world transform matrix                                               |
| fov                       | number    | Camera frustum vertical field of view, from bottom to top of view, in degrees |
| zoom                      | number    | Camera zoom factor w.r.t reset zoom factor                                    |
| orthoWidth                | number    | orthogonal camera frustum width                                               |
| orthoHeight               | number    | orthogonal camera frustum height                                              |
| orthoZoom                 | number    | orthogonal camera zoom factor                                                 |
| pivot                     | number[]  | camera rotation pivot @ world coordinate                                      |
| pivotAtPano               | number[]  | camera rotation pivot @ pano coordinate                                       |
| panoId                    | number    | pano id                                                                       |

### **Set Camera Rotate**

Rotate the camera.

Request

```ts
CupixApi.sendToCupix({
  operationType: "SET_CAMERA_ROTATE",
  operationArgs: {
    direction: "UP",
    angle: 0,
  },
});
```

| Property  | Data type                             | Description                   | Require |
| --------- | ------------------------------------- | ----------------------------- | ------- |
| direction | `'UP' \| 'DOWN' \| 'LEFT' \| 'RIGHT'` | Direction of camera to change | O       |
| angle     | number                                | Camera angle to change        | O       |

Response


### **Set Camera Zoom**

Change the zoom level of the camera.

Request

```ts
CupixApi.sendToCupix({
  operationType: "SET_CAMERA_ZOOM",
  operationArgs: {
    angleInDegree: 0,
  },
});
```

| Property      | Data type | Description  | Require |
| ------------- | --------- | ------------ | ------- |
| angleInDegree | number    | Camera's fov | O       |

Response


### **Set Camera Lookat**

Set the camera to look at specific coordinates.

Request

```ts
CupixApi.sendToCupix({
  operationType: "SET_CAMERA_LOOKAT",
  operationArgs: {
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
  },
});
```

| Property | Data type | Description                                         | Require |
| -------- | --------- | --------------------------------------------------- | ------- |
| lookAtX  | number    | X coordinate of the direction the camera is looking | O       |
| lookAtY  | number    | Y coordinate of the direction the camera is looking | O       |
| lookAtZ  | number    | Z coordinate of the direction the camera is looking | O       |

Response


### **Set Camera Reset**

Reset camera.

Request

```ts
CupixApi.sendToCupix({
  operationType: "SET_CAMERA_RESET",
});
```

Response


### **Set Camera Move**

```ts
CupixApi.sendToCupix({
  operationType: "SET_CAMERA_MOVE",
  operationArgs: {
    direction: "FORWARD",
  },
});
```

"SET_CAMERA_MOVE",
Request
| Property  | Data type                                 | Description                   |
| --------- | ----------------------------------------- | ----------------------------- |
| direction | `'FORWARD' \| 'BACK' \| 'LEFT' \| 'RIGHT` | Direction of camera to change |

Response

## **Annotation API**

### **Add Annotation Form**

Add annotation form to specific annotation group.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'ADD_ANNOTATION_FORM',
  operationArgs: {
    formTemplateId: 1,
    annotationGroupId: 1,
    name: "",
    values: ""
  }
});
```

| Property          | Data type | Description                                                                                | Require |
| ----------------- | --------- | ------------------------------------------------------------------------------------------ | ------- |
| formTemplateId    | number    | Target form template ID of annotation to be added                                          | O       |
| annotationGroupId | number    | Parent annotation group ID of annotation to be added                                       | X       |
| name              | string    | The name of the annotation to add. default: 'New form'                                     | X       |
| values            | string    | Annotation values. stringify JSON `'["text1", "text2"]'`. array of values ​​for each field | X       |

Response

### **Delete Annotation**

Delete specific annotation.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'DELETE_ANNOTATION',
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description                    | Require |
| ------------ | --------- | ------------------------------ | ------- |
| annotationId | number    | ID of annotation to be deleted | O       |

Response

### **Get Annotation Group**

Get specific annotation group information.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_GROUP',
  operationArgs: {
    annotationGroupId: 1
  }
});
```

| Property          | Data type | Description                   | Require |
| ----------------- | --------- | ----------------------------- | ------- |
| annotationGroupId | number    | ID of target annotation group | O       |

Response

```ts
{
  annotationGroup: {
    id: 1,
    reviewKey: "",
    name: "",
  },
}
```

| Property        | Data type | Description                  |
| --------------- | --------- | ---------------------------- |
| annotationGroup | object    | annotation group information |

| annotationGroup Property | Data type | Description                                 |
| ------------------------ | --------- | ------------------------------------------- |
| id                       | number    | ID of annotation group                      |
| reviewKey                | string    | Review key containing this annotation group |
| name                     | string    | The name of the annotation group            |

### **Get Annotation Group All**

Get all annotation group information of current siteView

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_GROUP_ALL',
});
```

Response

```ts
{
  annotationGroupList: [
    {
      id: 1,
      reviewKey: "",
      name: "",
    },
  ]
}
```

| Property            | Data type                        | Description                       |
| ------------------- | -------------------------------- | --------------------------------- |
| annotationGroupList | array of annotationGroup objects | annotation group list information |

| annotationGroup Property | Data type | Description                                 |
| ------------------------ | --------- | ------------------------------------------- |
| id                       | number    | ID of annotation group                      |
| reviewKey                | string    | Review key containing this annotation group |
| name                     | string    | The name of the annotation group            |


### **Get Annotation**

Get specific annotation information.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ANNOTATION",
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description            | Require |
| ------------ | --------- | ---------------------- | ------- |
| annotationId | number    | Target's annotation ID | O       |

Response

```ts
{
  annotation: {
    id: 1,
    name: "",
    formName: "",
    formTemplateId: 1,
    children: [],
  },
}
```

| Property   | Data type | Description            |
| ---------- | --------- | ---------------------- |
| annotation | object    | annotation information |

| annotation Property | Data type                  | Description                         |
| ------------------- | -------------------------- | ----------------------------------- |
| id                  | number                     | ID of the annotation                |
| name                | string                     | The name of the annotation          |
| formName            | string                     | formTemplate name of the annotation |
| formTemplateId      | number                     | formTemplateId of the annotation    |
| children            | array of annotation object | sub-annotation                      |


### **Get Annotation All**

Get all annotations of the current siteView.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ANNOTATION_ALL",
});
```

Response

```ts
{
  annotations: [
    {
      id: 1,
      name: "",
      formName: "",
      formTemplateId: 1,
      children: [],
    },
  ],
}
```

| Property    | Data type                  | Description                  |
| ----------- | -------------------------- | ---------------------------- |
| annotations | array of annotation object | annotation information array |

| annotation Property | Data type                  | Description                         |
| ------------------- | -------------------------- | ----------------------------------- |
| id                  | number                     | ID of the annotation                |
| name                | string                     | The name of the annotation          |
| formName            | string                     | formTemplate name of the annotation |
| formTemplateId      | number                     | formTemplateId of the annotation    |
| children            | array of annotation object | sub-annotation                      |

### **Toggle Resolve Annotation**

Toggles resolve specific annotation.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'TOGGLE_RESOLVE_ANNOTATION',
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description             | Require |
| ------------ | --------- | ----------------------- | ------- |
| annotationId | number    | ID of target annotation | O       |

Response

### **Update Annotation Form**

Update specific annotation form.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'UPDATE_ANNOTATION_FORM',
  operationArgs: {
    annotationId: 1,
    name: "",
    values: "",
  },
});
```

| Property     | Data type | Description                                                                                | Require |
| ------------ | --------- | ------------------------------------------------------------------------------------------ | ------- |
| annotationId | number    | ID of target annotation                                                                    | O       |
| name         | string    | New name of target annotation                                                              | X       |
| values       | string    | Annotation values. stringify JSON `'["text1", "text2"]'`. array of values ​​for each field | X       |

Response

## **Utility API**

### **Find Nearest Panos**

Find the nearest panos based on specific coordinates.

Request

```ts
CupixApi.sendToCupix({
  operationType: "FIND_NEAREST_PANOS",
  operationArgs: {
    levelId: 0,
    captureId: 0,
    coordX: 0,
    coordY: 0,
    maxCount: 0
    normalX: 0,
    normalY: 0,
  }
});
```

| Property  | Data type | Description                                                                            | Require |
| --------- | --------- | -------------------------------------------------------------------------------------- | ------- |
| levelId   | number    | The levelId of pano to find                                                            | O       |
| captureId | number    | pano captureId to find                                                                 | O       |
| coordX    | number    | Based on the target coordinate X, the target coordinate finds the nearest pano         | O       |
| coordY    | number    | Based on the target coordinate Y, the target coordinate finds the nearest pano         | O       |
| maxCount  | number    | Maximum number of panos to find. default: 6                                            | X       |
| normalX   | number    | direction vector X, a vector to find a value within 45 degrees of the direction vector | X       |
| normalY   | number    | Direction vector Y, a vector to find a value within 45 degrees of the direction vector | X       |

Response

```ts
{
  panos: [
    {
      id: 1,
      name: "",
      filename: "",
      appCapturedAt: Date,
      publishedAt: Date,
      measureReadyAt: Date,
      position: [],
      levelId: 1,
      captureId: 1,
    },
  ],
}
```

| Property | Data type            | Description                                                                                                                                                      |
| -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| panos    | array of pano object | The maxCount panos nearest to the target coordinates. If there is a normal value, the camera direction is prioritized within 45 degrees of the normal direction. |

| pano Property  | Data type | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | number    | ID of the pano                  |
| name           | string    | Name of the pano                |
| filename       | string    | Pano image file name            |
| appCapturedAt  | Date      | Captured date on mobile         |
| publishedAt    | Date      | Published date                  |
| measureReadyAt | Date      | Measure ready date              |
| position       | number[]  | Pano's [x,y,z] coordinates      |
| levelId        | number    | ID of the level containing pano |
| captureId      | number    | ID of capture containing pano   |
