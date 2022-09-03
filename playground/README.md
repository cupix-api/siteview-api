- [SiteView API for Embeds](#siteview-api-for-embeds)
  - [Getting Started](#getting-started)
  - [Initialize](#initialize)
    - [Start](#start)
    - [Stop](#stop)
  - [Authenticate](#authenticate)
    - [Sign In](#sign-in)
    - [Sign Out](#sign-out)
  - [Navigate](#navigate)
    - [Go Home](#go-home)
    - [Go SiteView](#go-siteview)
  - [Get Info](#get-info)
    - [Get Siteview](#get-siteview)
    - [Get Level](#get-level)
    - [Get Level All](#get-level-all)
    - [Get Capture](#get-capture)
    - [Get Capture All](#get-capture-all)
    - [Get Pano](#get-pano)
    - [Get Pano All](#get-pano-all)
    - [Get Room](#get-room)
    - [Get Room All](#get-room-all)
    - [Get Form Template](#get-form-template)
    - [Get Form Template All](#get-form-template-all)
  - [Change](#change)
    - [Change Level](#change-level)
    - [Change Capture](#change-capture)
    - [Change Pano](#change-pano)
  - [Camera](#camera)
    - [Get Camera Parameter](#get-camera-parameter)
    - [Set Camera Rotate](#set-camera-rotate)
    - [Set Camera Zoom](#set-camera-zoom)
    - [Set Camera Lookat](#set-camera-lookat)
    - [Set Camera Reset](#set-camera-reset)
    - [Set Camera Move](#set-camera-move)
  - [Annotation](#annotation)
    - [Add Annotation Form](#add-annotation-form)
    - [Delete Annotation](#delete-annotation)
    - [Get Annotation Group](#get-annotation-group)
    - [Get Annotation Group All](#get-annotation-group-all)
    - [Get Annotation](#get-annotation)
    - [Get Annotation All](#get-annotation-all)
    - [Toggle Resolve Annotation](#toggle-resolve-annotation)
    - [Update Annotation Form](#update-annotation-form)
  - [Utility](#utility)
    - [Find Nearest Panos](#find-nearest-panos)

# SiteView API for Embeds

## Getting Started

### Include the SDK library

Please add this javascript SDK library to your web application, allowing you to use the `siteView4embed` namespace as described in this document for quick integration. You can skip this step and directly use `window.postMessage` or `window.addEventListener` methods if you prefer basic level controls.

```html
<script src="siteView4embed.js"></script>
```

### Add the SiteView iframe in your HTML page

**Method 1:**

Add a wrapper div in your HTML page.

```html
<div id="cupix-container" style="width:100%; height:100%;"></div>
```

Then, calling `init()` SDK method with the div id and the SiteView URL will insert the iframe block programmatically.

```js
siteView4embed.init("cupix-container", "[your SiteView URL]");
```

[Check a live sample](https://stackblitz.com/edit/js-aap1v1?file=index.html)

**Method 2:**

Add an iframe div in your HTML page with the SiteView URL as the source and an `onload()` callback method.

```html
<iframe src="[your SiteView URL]" onload="onSiteViewLoaded(this)"></iframe>
```

Then, assign the iframe object's **contentWindow** to the **cupixWindow** global variable that is declared in the SDK.

```js
function onSiteViewLoaded(iframe) {
  ...
  siteView4embed.cupixWindow = iframe.contentWindow;
  ...
}
```

## **Initialize**

### **Start**

Initialize the API calls. The `running` state should be `true` to be able to call APIs.

```ts
siteView4embed.start(timeout);
```

| Property | Type   | Description             |
| -------- | ------ | ----------------------- |
| timeout  | number | timeout in milliseconds |

Response

```ts
{
  running: boolean;
}
```

| Property | Type    | Description                       |
| -------- | ------- | --------------------------------- |
| running  | boolean | Whether the API is started or not |

### **Stop**

Stop an API call. APIs cannot be used when `running` is `false`.

```ts
siteView4embed.stop();
```

Response

```ts
{
  running: boolean;
}
```

| Property | Type    | Description                       |
| -------- | ------- | --------------------------------- |
| running  | boolean | Whether the API is started or not |

## **Authenticate**

### **Sign In**

When the SiteView appears from the iframe, users are prompted to enter the login credentials unless the SiteView is publically published. Alternatively, you can use this `signin` method to authenticate the access programmatically.

- Sign in with an email

```ts
CupixApi.signin(teamDomain, email, password);
```

| Property   | Type   | Description       |
| ---------- | ------ | ----------------- |
| email      | string | User email.       |
| password   | string | User password.    |
| teamDomain | string | User team domain. |

- Sign in with user's personal API token, which is available from the CupixWorks Account Settings page.

```ts
CupixApi.signinWithToken(token);
```

| Property | Type   | Description        |
| -------- | ------ | ------------------ |
| token    | string | Personal API token |

### **Sign Out**

```ts
siteView4embed.signout();
```

## **Navigate**

### **Go Home**

Load the project dashboard page.

```ts
siteView4embed.goHome();
```

### **Go SiteView**

Load the SiteView page.

```ts
siteView4embed.goSiteView(siteViewKey, hideTopBar);
```

| Property    | Type    | Description                        |
| ----------- | ------- | ---------------------------------- |
| siteViewKey | string  | The key (id) of the SiteView       |
| hideTopBar  | boolean | Hide the top GUI bar. Default=true |

## **Get Info**

### **Get Siteview**

Get information on the current SiteView.

```ts
siteView4embed.getSiteView();
```

Response

```ts
{
  key: string;
  name: string;
}
```

| Property | Type   | Description   |
| -------- | ------ | ------------- |
| key      | string | SiteView key  |
| name     | string | SiteView name |

### **Get Level**

Get information on a specific level.

```ts
siteView4embed.getLevel(levelId);
```

| Property | Type   | Description | Requred |
| -------- | ------ | ----------- | ------- |
| levelId  | number | Level ID    | true    |

Response

```ts
{
  level: {
    id: number,
    name: string,
    isGroundLevel: boolean,
    elevation: number,
    height: number,
  },
}
```

| Property      | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| id            | number  | Level ID                                 |
| name          | string  | Name of the level                        |
| isGroundLevel | boolean | Ground level or not                      |
| elevation     | number  | The height of the level in meter         |
| height        | number  | The ceiling height of the level in meter |

### **Get Level All**

Get information on all levels.

```ts
siteView4embed.getLevelAll();
```

Response

```ts
{
  levels: [
    {
      id: number,
      name: string,
      isGroundLevel: boolean,
      elevation: number,
      height: number,
    },
  ],
}
```

| Property | Type  | Description     |
| -------- | ----- | --------------- |
| levels   | array | Array of levels |

| level Property | Type    | Description                              |
| -------------- | ------- | ---------------------------------------- |
| id             | number  | Level ID                                 |
| name           | string  | Name of the level                        |
| isGroundLevel  | boolean | Ground level or not                      |
| elevation      | number  | The height of the level in meter         |
| height         | number  | The ceiling height of the level in meter |

### **Get Capture**

Get information on a specific capture.

```ts
siteView4embed.getCapture(captureId);
```

| Property  | Type   | Description | Requred |
| --------- | ------ | ----------- | ------- |
| captureId | number | Capture ID  | true    |

Response

```ts
{
  capture: {
    id: number,
    name: string,
    startDate: date,
    endDate: date,
  },
}
```

| Property | Type   | Description              |
| -------- | ------ | ------------------------ |
| id       | number | Capture ID               |
| name     | string | The label of the capture |
| date     | Date   | Date of the capture      |

### **Get Capture All**

Get information on all captures.

```ts
siteView4embed.getCaptureAll();
```

Response

```ts
{
  captures: [
    {
      id: number,
      name: string,
      startDate: date,
      endDate: date,
    },
  ],
}
```

| Property | Type  | Description       |
| -------- | ----- | ----------------- |
| captures | array | Array of captures |

| Property | Type   | Description              |
| -------- | ------ | ------------------------ |
| id       | number | Capture ID               |
| name     | string | The label of the capture |
| date     | Date   | Date of the capture      |

### **Get Pano**

Get information on a specific pano.

```ts
siteView4embed.getPano(panoId);
```

| Property | Type   | Description | Requred |
| -------- | ------ | ----------- | ------- |
| panoId   | number | Pano ID     | true    |

Response

```ts
{
  pano: {
    id: number,
    name: string,
    filename: string,
    appCapturedAt: date,
    publishedAt: date,
    measureReadyAt: date,
    position: [],
    levelId: number,
    captureId: number,
  },
}
```

| Property       | Type   | Description                      |
| -------------- | ------ | -------------------------------- |
| id             | number | Pano ID                          |
| name           | string | Name of the pano                 |
| filename       | string | Pano image file name             |
| appCapturedAt  | date   | Date the capture was started     |
| publishedAt    | date   | Published date                   |
| measureReadyAt | date   | Measure ready status change date |
| position       | []     | [x,y,z] coordinates of the pano  |
| levelId        | number | Level ID                         |
| captureId      | number | Capture ID                       |

### **Get Pano All**

Get information on all panos.

```ts
siteView4embed.getPanoAll();
```

Response

```ts
{
  panos: [
    {
      id: number,
      name: string,
      filename: string,
      appCapturedAt: date,
      publishedAt: date,
      measureReadyAt: date,
      position: [],
      levelId: number,
      captureId: number,
    },
  ],
}
```

| Property | Type  | Description    |
| -------- | ----- | -------------- |
| panos    | array | Array of panos |

| Property       | Type   | Description                      |
| -------------- | ------ | -------------------------------- |
| id             | number | Pano ID                          |
| name           | string | Name of the pano                 |
| filename       | string | Pano image file name             |
| appCapturedAt  | date   | Date taken in the app            |
| publishedAt    | date   | Published date                   |
| measureReadyAt | date   | Measure ready status change date |
| position       | []     | [x,y,z] coordinates of pano      |
| levelId        | number | Level ID                         |
| captureId      | number | Capture ID                       |

### **Get Room**

Get information on a specific room.

```ts
siteView4embed.getRoom(roomId);
```

| Property | Type   | Description | Requred |
| -------- | ------ | ----------- | ------- |
| roomId   | number | Room ID     | true    |

Response

```ts
{
  room: {
    id: number,
    name: string,
    minBound: [],
    maxBound: [],
  },
}
```

| Property   | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| id         | number   | Room ID                                     |
| name       | string   | Name of the room                            |
| bimId      | number   | BIM ID                                      |
| baseMatrix | number[] | Transformation 4x4 matrix                   |
| minBound   | number[] | [x,y,z] min coordinates of the bounding box |
| maxBound   | number[] | [x,y,z] max coordinates of the bounding box |

### **Get Room All**

Get information on all rooms.

```ts
siteView4embed.getRoomAll();
```

Response

```ts
{
  room: [
    {
      id: number,
      name: string,
      minBound: [],
      maxBound: [],
    },
  ],
}
```

| Property | Type  | Description           |
| -------- | ----- | --------------------- |
| rooms    | array | Array of room objects |

| Property   | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| id         | number   | Room ID                                     |
| name       | string   | Name of the room                            |
| bimId      | number   | BIM ID                                      |
| baseMatrix | number[] | Transformation 4x4 matrix                   |
| minBound   | number[] | [x,y,z] min coordinates of the bounding box |
| maxBound   | number[] | [x,y,z] max coordinates of the bounding box |

### **Get Form Template**

Get information on a specific form template.

```ts
siteView4embed.getFormTemplate(formTemplateId);
```

| Property       | Type   | Description      | Requred |
| -------------- | ------ | ---------------- | ------- |
| formTemplateId | number | Form template ID | true    |

Response

```ts
{
  formTemplate: {
    id: number,
    name: string,
    description: string,
    created_at: string,
    updated_at: string,
  },
  formFields: [
    {
      id: number;
      type: string;
      name: string;
      kind: string;
    },
  ],
}
```

| Property     | Type   | Description                |
| ------------ | ------ | -------------------------- |
| formTemplate | object | Form template object       |
| formFields   | array  | Array of all field objects |

| formTemplate Property | Type   | Description                       |
| --------------------- | ------ | --------------------------------- |
| id                    | number | Form template ID                  |
| name                  | string | Name of the form template         |
| description           | string | Description of the form template  |
| created_at            | string | Created date of the form template |
| updated_at            | string | Updated date of the form template |

| formField Property | Type                                                                                                                                     | Description            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| id                 | number                                                                                                                                   | Form field ID          |
| type               | string                                                                                                                                   | Type of form field     |
| name               | string                                                                                                                                   | Name of the form field |
| kind               | `"select_boxes" \| "text_field" \| "number" \| "description" \| "member" \| "text_area" \| "check_box" \| "select" \| "radio" \| "date"` | Types of form field    |

### **Get Form Template All**

Get information on all templates.

```ts
siteView4embed.getFormTemplates();
```

Response

```ts
{
  formTemplates: [
    {
      id: string,
      name: string,
      description: string,
      created_at: string,
      updated_at: string,
    },
  ],
}
```

| Property      | Type  | Description                    |
| ------------- | ----- | ------------------------------ |
| formTemplates | array | Array of form template objects |

| Property    | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| id          | number | Form template ID                  |
| name        | string | Name of the form template         |
| description | string | Description of the form template  |
| created_at  | string | Created date of the form template |
| updated_at  | string | Updated date of the form template |

## **Change**

### **Change Level**

Change to a specific level

```ts
siteView4embed.changeLevel(levelId);
```

| Property | Type   | Description        | Requred |
| -------- | ------ | ------------------ | ------- |
| levelId  | number | Level ID to change | true    |

### **Change Capture**

Change to a specific capture.

```ts
siteView4embed.changeCapture(captureId);
```

| Property  | Type   | Description          | Requred |
| --------- | ------ | -------------------- | ------- |
| captureId | number | Capture ID to change | true    |

### **Change Pano**

Navigate to a specific pano.

```ts
siteView4embed.changePano(panoId);
```

| Property | Type     | Description            | Requred |
| -------- | -------- | ---------------------- | ------- |
| panoId   | number   | Pano ID                | true    |
| lookAt   | number[] | [x,y,z] look-at vector | false   |

## **Camera**

### **Get Camera Parameter**

Get camera parameters.

```ts
siteView4embed.getCameraParameters();
```

Response

```ts
{
  cameraParameters: {
    viewMode: string,
    walkMode: true,
    orthoMode: false,
    tm: {
      elements: []
    },
    fov: number,
    zoom: number,
    orthoWidth: number,
    orthoHeight: number,
    orthoZoom: number
  }
}
```

| Property    | Type     | Description                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------------- |
| viewMode    | string   | `"walk" \| "fly" \| "overhead"`                                              |
| walkMode    | boolean  | whether the view mode is "walk" or not                                       |
| orthoMode   | boolean  | whether the camera is Orthographic or not (perspective)                      |
| tm          | number[] | Camera world transform 4x4 matrix                                            |
| fov         | number   | Frustum vertical FOV (Field of View), from bottom to top of view, in degrees |
| zoom        | number   | Camera zoom factor w.r.t the default zoom factor                             |
| orthoWidth  | number   | Orthogonal camera frustum width                                              |
| orthoHeight | number   | Orthogonal camera frustum height                                             |
| orthoZoom   | number   | Orthogonal camera zoom factor                                                |
| pivot       | []       | [x,y,z] Camera rotation pivot point w.r.t the world coordinate system        |
| pivotAtPano | []       | [x,y,z] Camera rotation pivot point w.r.t the pano coordinate system         |
| panoId      | number   | Current pano id                                                              |

### **Set Camera Rotate**

Rotate the camera.

```ts
siteView4embed.setCameraRotate(direction, angle);
```

| Property  | Type                                  | Description               | Requred |
| --------- | ------------------------------------- | ------------------------- | ------- |
| direction | `'UP' \| 'DOWN' \| 'LEFT' \| 'RIGHT'` | Camera rotation direction | true    |
| angle     | number                                | Angles in degree          | true    |

### **Set Camera Zoom**

Change the zoom level of the camera.

```ts
siteView4embed.setCameraZoom(angleInDegree);
```

| Property      | Type   | Description                | Requred |
| ------------- | ------ | -------------------------- | ------- |
| angleInDegree | number | Camera FOV (Field of View) | true    |

### **Set Camera Lookat**

Make the camera to look at a specific point.

```ts
siteView4embed.setCameraLookAt(x, y, z);
```

| Property | Type   | Description  | Requred |
| -------- | ------ | ------------ | ------- |
| lookAtX  | number | X coordinate | true    |
| lookAtY  | number | Y coordinate | true    |
| lookAtZ  | number | Z coordinate | true    |

### **Set Camera Reset**

Reset camera parameters to the default values.

```ts
siteView4embed.setCameraReset();
```

### **Set Camera Move**

```ts
siteView4embed.setCameraMove(direction);
```

Move the camera. The nearest pano will be searched to the given direction, and the pano will be changed.

Request
| Property | Type | Description |
| - | - | - |
| direction | `'FORWARD' \| 'BACK' \| 'LEFT' \| 'RIGHT` | Camera move direction |

## **Annotation**

### **Add Annotation Form**

Add an annotation to an annotation group.

```ts
siteView4embed.addAnnotation(formTemplateId, annotationGroupId, name, values);
```

| Property          | Type   | Description                                                                                                | Requred |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------- | ------- |
| formTemplateId    | number | Annotation form template ID                                                                                | true    |
| annotationGroupId | number | Annotation group ID in which the annotation will be added                                                  | false   |
| name              | string | The name of the annotation. default: 'New form'                                                            | false   |
| values            | string | A stringified array (using `JSON.stringify`) of values ​​for annotation fields like `'["text1", "text2"]'` | false   |

### **Delete Annotation**

Delete an annotation.

```ts
siteView4embed.deleteAnnotation(annotationId);
```

| Property     | Type   | Description                    | Requred |
| ------------ | ------ | ------------------------------ | ------- |
| annotationId | number | ID of annotation to be deleted | true    |

### **Get Annotation Group**

Get information on a specific annotation group.

```ts
siteView4embed.getAnnotationGroup(annotationGroupId);
```

| Property          | Type   | Description         | Requred |
| ----------------- | ------ | ------------------- | ------- |
| annotationGroupId | number | Annotation group ID | true    |

Response

```ts
{
  annotationGroup: {
    id: number,
    reviewKey: string,
    name: string,
  },
}
```

| Property  | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| id        | number | Annotation group ID                  |
| reviewKey | string | SiteView key of the annotation group |
| name      | string | The name of the annotation group     |

### **Get Annotation Group All**

Get information on all annotation groups.

```ts
siteView4embed.getAnnotationGroupAll();
```

Response

```ts
{
  annotationGroupList: [
    {
      id: number,
      reviewKey: string,
      name: string,
    },
  ];
}
```

| Property            | Type  | Description                      |
| ------------------- | ----- | -------------------------------- |
| annotationGroupList | array | Array of annotationGroup objects |

| Property  | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| id        | number | Annotation group ID                  |
| reviewKey | string | SiteView key of the annotation group |
| name      | string | The name of the annotation group     |

### **Get Annotation**

Get information on a specific annotation.

```ts
siteView4embed.getAnnotation(annotationId);
```

| Property     | Type   | Description   | Requred |
| ------------ | ------ | ------------- | ------- |
| annotationId | number | Annotation ID | true    |

Response

```ts
{
  annotation: {
    id: number,
    name: string,
    formName: string,
    formTemplateId: number,
    children: [],
  },
}
```

| Property       | Type   | Description                         |
| -------------- | ------ | ----------------------------------- |
| id             | number | Annotation ID                       |
| name           | string | The name of the annotation          |
| formName       | string | formTemplate name of the annotation |
| formTemplateId | number | formTemplateId of the annotation    |
| children       | array  | Array of child annotations          |

### **Get Annotation All**

Get information on all annotations.

```ts
siteView4embed.getAnnotationAll();
```

Response

```ts
{
  annotations: [
    {
      id: number,
      name: string,
      formName: string,
      formTemplateId: number,
      children: [],
    },
  ],
}
```

| Property    | Type  | Description                 |
| ----------- | ----- | --------------------------- |
| annotations | array | Array of annotation objects |

| Property       | Type   | Description                         |
| -------------- | ------ | ----------------------------------- |
| id             | number | Annotation ID                       |
| name           | string | The name of the annotation          |
| formName       | string | formTemplate name of the annotation |
| formTemplateId | number | formTemplateId of the annotation    |
| children       | array  | Array of child annotations          |

### **Toggle Resolve Annotation**

Toggle the annotation resolution status.

```ts
siteView4embed.toggleResolveAnnotation(annotationId);
```

| Property     | Type   | Description   | Requred |
| ------------ | ------ | ------------- | ------- |
| annotationId | number | Annotation ID | true    |

### **Update Annotation Form**

Update an annotation.

```ts
siteView4embed.updateAnnotation(annotationId, name, values);
```

| Property     | Type   | Description                                                                                                | Requred |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------- | ------- |
| annotationId | number | Annotation ID annotation                                                                                   | true    |
| name         | string | New name of the annotation                                                                                 | false   |
| values       | string | A stringified array (using `JSON.stringify`) of values ​​for annotation fields like `'["text1", "text2"]'` | false   |

## **Utility**

### **Find Nearest Panos**

Find the nearest panos from the given coordinates.

```ts
siteView4embed.findNearestPanos(
  levelId,
  captureId,
  coordX,
  coordY,
  normalX,
  normalY,
  maxCount
);
```

| Property  | Type   | Description                                                                                                   | Requred |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------- | ------- |
| levelId   | number | Level ID                                                                                                      | true    |
| captureId | number | Capture ID                                                                                                    | true    |
| coordX    | number | X coordinate of the searching center                                                                          | true    |
| coordY    | number | Y coordinate of the searching center                                                                          | true    |
| maxCount  | number | Maximum number of panos to find. default: 6                                                                   | false   |
| normalX   | number | Direction vector X value. When it is given, panos within 45 degrees of the direction vector will be searched. | false   |
| normalY   | number | Direction vector Y value.                                                                                     | false   |

Response

```ts
{
  panos: [
    {
      id: number,
      name: string,
      filename: string,
      appCapturedAt: date,
      publishedAt: date,
      measureReadyAt: date,
      position: [],
      levelId: number,
      captureId: number,
    },
  ],
}
```

| Property | Type  | Description                                  |
| -------- | ----- | -------------------------------------------- |
| panos    | array | Array of panos searched by given conditions. |

| Property       | Type   | Description                      |
| -------------- | ------ | -------------------------------- |
| id             | number | Pano ID                          |
| name           | string | Name of the pano                 |
| filename       | string | Pano image file name             |
| appCapturedAt  | date   | Date the capture was started     |
| publishedAt    | date   | Published date                   |
| measureReadyAt | date   | Measure ready status change date |
| position       | []     | [x,y,z] coordinates of the pano  |
| levelId        | number | Level ID                         |
| captureId      | number | Capture ID                       |
