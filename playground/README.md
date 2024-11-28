- [SiteView API for Embeds](#siteview-api-for-embeds)
  - [Getting Started](#getting-started)
    - [Include the SDK library](#include-the-sdk-library)
    - [Add the SiteView iframe in your HTML page](#add-the-siteview-iframe-in-your-html-page)
    - [Listen for messages from the SiteView iframe](#listen-for-messages-from-the-siteview-iframe)
  - [Initialize](#initialize)
    - [Start](#start)
    - [Stop](#stop)
  - [Authenticate](#authenticate)
    - [Sign In](#sign-in)
    - [Sign Out](#sign-out)
    - [Signed In](#signed-in)
  - [Navigate](#navigate)
    - [Go Home](#go-home)
    - [Go SiteView](#go-siteview)
      - [When using URL input directly](#when-using-url-input-directly)
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
    - [Change Preset](#change-preset)
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
    - [Set Active Annotation](#set-active-annotation)
    - [Reset Active Annotation](#reset-active-annotation)
  - [Utility](#utility)
    - [Find Nearest Panos](#find-nearest-panos)
    - [Open Captures dialog](#open-captures-dialog)
  - [BroadCast Event](#broadcast-event)
    - [Active Annotation Changed](#active-annotation-changed)
    - [Annotation Updated](#annotation-updated)
    - [API Ready](#api-ready)
    - [Document loaded](#document-loaded)

# SiteView API for Embeds

## Getting Started

### Include the SDK library

Please add this `siteView4embed.js` javascript SDK library downloadable from this folder to your web application, allowing you to use the `siteView4embed` namespace as described in this document for quick integration. You can skip this step and directly use `window.postMessage` or `window.addEventListener` methods if you prefer basic level controls.

```html
<script src="[your hosting URL]/siteView4embed.js"></script>
```

### Add the SiteView iframe in your HTML page

**Method 1:**

Add a wrapper div in your HTML page.

```html
<div id="cupix-container" style="width:100%; height:100%;"></div>
```

Then, calling `init()` SDK method with the div id and the SiteView URL will insert the iframe block programmatically.

```js
siteView4embed.init("cupix-container", "[your SiteView URL]", "[your auth info]");
```
Your auth info is in the form of `{ accessCode: string, apiToken: string }`, with `apiToken` taking priority over `accessCode`.

[Check a live sample](https://stackblitz.com/edit/js-aap1v1?file=index.html)

**Method 2:**

Add an iframe div in your HTML page with the SiteView URL as the source and an `onload()` callback method.<br/>
When using accessCode, append the `access_code` query parameter to your SIteView URL for configuration, and when using apiToken, use the `cupix_api_token` query parameter to construct the URL.

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

### Listen for messages from the SiteView iframe

The result of your API call will be dispatched from the SiteView, and your app can listen for the dispatched messages by executing the following code:

```js
window.addEventListener("message", (event) => {
  let responseType = event.data["responseType"]; // string
  let response = event.data["response"]; // response object
});
```

As well as the result of your API call, the SiteView dispatches various event messages like camera changes, pano transition, etc. and therefore, you can catch the user's input and execute follow-up controls.

## Initialize

### Start

Initialize the API calls. The `running` state should be `true` to be able to call APIs.

```ts
siteView4embed.start(timeout);
```

| Property | Type     | Description             |
| -------- | -------- | ----------------------- |
| timeout  | `number` | timeout in milliseconds |

Response

```ts
{
  running: boolean;
}
```

| Property | Type      | Description                       |
| -------- | --------- | --------------------------------- |
| running  | `boolean` | Whether the API is started or not |

### Stop

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

| Property | Type      | Description                       |
| -------- | --------- | --------------------------------- |
| running  | `boolean` | Whether the API is started or not |

## Authenticate

### Sign In

When the SiteView appears from the iframe, users are prompted to enter the login credentials unless the SiteView is publically published. Alternatively, you can use this `signin` method to authenticate the access programmatically.

- Sign in with user's personal API token, which is available from the CupixWorks Account Settings page.

```ts
siteView4embed.signinWithToken(token);
```

Response

| Property | Type     | Description        |
| -------- | -------- | ------------------ |
| token    | `string` | Personal API token |

### Sign Out

```ts
siteView4embed.signout();
```

### Signed In

Response

| Property | Type      | Description                        |
| -------- | --------- | ---------------------------------- |
| signedIn | `boolean` | True if signed in, false otherwise |

## Navigate

### Go Home

Load the project dashboard page.

```ts
siteView4embed.goHome();
```

### Go SiteView

Load the SiteView page.

```ts
siteView4embed.goSiteView(
  siteViewKey,
  hideSidebar,
  liteMode,
  openingGeolocation,
  openingBimGrid,
  openingLevelId,
  openingLevelName,
  openingCaptureId,
  openingCaptureDate,
  openingPosition
);
```

| Property                  | Type                                  | Description                                                                                         | required | example |
| ------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- | ------- |
| siteViewKey               | `string`                              | The key (id) of the SiteView                                                                        | true     | sv=     |
| hideSideBar               | `boolean`                             | Hide the side GUI bar. Default=true                                                                 |          |
| liteMode                  | `boolean`                             | Toggle Lite mode. Default=false                                                                     |          |
| deepLink                  | `boolean`                             | Whether to use the deepLink feature                                                                 |          |
| openingGeolocation        | `Object`                              | Global location using EPSG code. Use the position value suitable for the type of coordinate system. |          |
| openingGeolocation.epsg   | `number`                              | The code of EPSG coordinates                                                                        | true     |
| openingGeolocation.xOrLon | `number`                              | Location x or longitude                                                                             | true     |
| openingGeolocation.yOrLat | `number`                              | Location y or latitude                                                                              | true     |
| openingBimGridCoordinate | `[string, string]`                    | Start and end grid label                                                                            |          |
| openingBimGridOffset     | `{x: number, y: number, z: number}`   | Offset from the intersection of two grids                                                           |          |
| openingPosition           | `{ x: number, y; number, z: number }` | Position of the point to open                                                                       |
| openingLevelId            | `number`                              | Id of the level to open                                                                             |          |
| openingLevelName          | `string`                              | Name of the level to open (use the openingLevelId if it exists)                                     |          |
| openingCaptureId          | `number`                              | Id of the capture to open                                                                           |          |
| openingCaptureDate        | `string`                              | Name of the capture to open (use the openingCaptureId if it exists) (YYYY-MM-DD)                                |          |


#### When using URL input directly

| Property | Query param key | Available Value | Example |
| -------- | --------------- | --------------- | ------- |
| mapViewPosition | `map_view_position` | 'top', 'bottom' | map_view_position=top
| hideSideBar | `hide_side_bar` | 0, 1 | hide_side_bar=1
| deepLink | `deep` | 0, 1| deep=0
| openingGeolocation | `svog` | epsg,xOrLon,yOrLat | svog=0,0,0 |
| openingBimGridCoordinate | `obgc` | labels in the BIM Grid | obgc=A1,B2 |
| openingBimGridOffset | `obgo` | coordinate | obgo=0,0,0 |
| openingPosition | `op` | oordinate | op=0,0,0 |
| openingLevelId | `sval` | id of the level | sval=1 |
| openingLevelName | `svaln` | name of level | svaln=level2 |
| openingCaptureId | `svor` | id of capture | svor=1 |
| openingCaptureDate | `svord` | date of capture | svord=2023-12-25

## Get Info

### Get Siteview

Get information on the current SiteView.

```ts
siteView4embed.getSiteView();
```

Response

```ts
{
  key: `string`;
  name: `string`;
}
```

| Property | Type     | Description   |
| -------- | -------- | ------------- |
| key      | `string` | SiteView key  |
| name     | `string` | SiteView name |

### Get Level

Get information on a specific level.

```ts
siteView4embed.getLevel(levelId);
```

| Property | Type     | Description | Required |
| -------- | -------- | ----------- | -------- |
| levelId  | `number` | Level ID    | true     |

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

| Property      | Type      | Description                              |
| ------------- | --------- | ---------------------------------------- |
| id            | `number`  | Level ID                                 |
| name          | `string`  | Name of the level                        |
| isGroundLevel | `boolean` | Ground level or not                      |
| elevation     | `number`  | The height of the level in meter         |
| height        | `number`  | The ceiling height of the level in meter |

### Get Level All

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

| level Property | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| id             | `number`  | Level ID                                 |
| name           | `string`  | Name of the level                        |
| isGroundLevel  | `boolean` | Ground level or not                      |
| elevation      | `number`  | The height of the level in meter         |
| height         | `number`  | The ceiling height of the level in meter |

### Get Capture

Get information on a specific capture.

```ts
siteView4embed.getCapture(captureId);
```

| Property  | Type     | Description | Required |
| --------- | -------- | ----------- | -------- |
| captureId | `number` | Capture ID  | true     |

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

| Property | Type     | Description              |
| -------- | -------- | ------------------------ |
| id       | `number` | Capture ID               |
| name     | `string` | The label of the capture |
| date     | `date`   | Date of the capture      |

### Get Capture All

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

| Property | Type     | Description              |
| -------- | -------- | ------------------------ |
| id       | `number` | Capture ID               |
| name     | `string` | The label of the capture |
| date     | `date`   | Date of the capture      |

### Get Pano

Get information on a specific pano.

```ts
siteView4embed.getPano(panoId);
```

| Property | Type     | Description | Required |
| -------- | -------- | ----------- | -------- |
| panoId   | `number` | Pano ID     | true     |

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

| Property       | Type     | Description                      |
| -------------- | -------- | -------------------------------- |
| id             | `number` | Pano ID                          |
| name           | `string` | Name of the pano                 |
| filename       | `string` | Pano image file name             |
| appCapturedAt  | `date`   | Date the capture was started     |
| publishedAt    | `date`   | Published date                   |
| measureReadyAt | `date`   | Measure ready status change date |
| position       | `[]`     | [x,y,z] coordinates of the pano  |
| levelId        | `number` | Level ID                         |
| captureId      | `number` | Capture ID                       |

### Get Pano All

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

| Property       | Type     | Description                      |
| -------------- | -------- | -------------------------------- |
| id             | `number` | Pano ID                          |
| name           | `string` | Name of the pano                 |
| filename       | `string` | Pano image file name             |
| appCapturedAt  | `date`   | Date taken in the app            |
| publishedAt    | `date`   | Published date                   |
| measureReadyAt | `date`   | Measure ready status change date |
| position       | `[]`     | [x,y,z] coordinates of pano      |
| levelId        | `number` | Level ID                         |
| captureId      | `number` | Capture ID                       |

### Get Room

Get information on a specific room.

```ts
siteView4embed.getRoom(roomId);
```

| Property | Type     | Description | Required |
| -------- | -------- | ----------- | -------- |
| roomId   | `number` | Room ID     | true     |

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

| Property   | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| id         | `number`   | Room ID                                     |
| name       | `string`   | Name of the room                            |
| bimId      | `number`   | BIM ID                                      |
| baseMatrix | `number[]` | Transformation 4x4 matrix                   |
| minBound   | `number[]` | [x,y,z] min coordinates of the bounding box |
| maxBound   | `number[]` | [x,y,z] max coordinates of the bounding box |

### Get Room All

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

| Property   | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| id         | `number`   | Room ID                                     |
| name       | `string`   | Name of the room                            |
| bimId      | `number`   | BIM ID                                      |
| baseMatrix | `number[]` | Transformation 4x4 matrix                   |
| minBound   | `number[]` | [x,y,z] min coordinates of the bounding box |
| maxBound   | `number[]` | [x,y,z] max coordinates of the bounding box |

### Get Form Template

Get information on a specific form template.

```ts
siteView4embed.getFormTemplate(formTemplateId);
```

| Property       | Type     | Description      | Required |
| -------------- | -------- | ---------------- | -------- |
| formTemplateId | `number` | Form template ID | true     |

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
      id: number,
      type: string,
      name: string,
      kind: `string`
    },
  ],
}
```

| Property     | Type   | Description                |
| ------------ | ------ | -------------------------- |
| formTemplate | object | Form template object       |
| formFields   | array  | Array of all field objects |

| formTemplate Property | Type     | Description                        |
| --------------------- | -------- | ---------------------------------- |
| id                    | `number` | Form template ID                   |
| name                  | `string` | Name of the form template          |
| description           | `string` | Description of the form template   |
| created_at            | `string` | Created date of the form template  |
| updated_at            | `string` | Updatedd date of the form template |

| formField Property | Type                                                                                                                                     | Description            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| id                 | `number`                                                                                                                                 | Form field ID          |
| type               | `string`                                                                                                                                 | Type of form field     |
| name               | `string`                                                                                                                                 | Name of the form field |
| kind               | `"select_boxes" \| "text_field" \| "number" \| "description" \| "member" \| "text_area" \| "check_box" \| "select" \| "radio" \| "date"` | Types of form field    |

### Get Form Template All

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

| Property    | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| id          | `number` | Form template ID                  |
| name        | `string` | Name of the form template         |
| description | `string` | Description of the form template  |
| created_at  | `string` | Created date of the form template |
| updated_at  | `string` | Updated date of the form template |

## Change

### Change Level

Change to a specific level

```ts
siteView4embed.changeLevel(levelId);
```

| Property | Type     | Description        | Required |
| -------- | -------- | ------------------ | -------- |
| levelId  | `number` | Level ID to change | true     |

### Change Capture

Change to a specific capture.

```ts
siteView4embed.changeCapture(captureId);
```

| Property  | Type     | Description          | Required |
| --------- | -------- | -------------------- | -------- |
| captureId | `number` | Capture ID to change | true     |

### Change Pano

Navigate to a specific pano.

```ts
siteView4embed.changePano(panoId);
```

| Property | Type     | Description | Required |
| -------- | -------- | ----------- | -------- |
| panoId   | `number` | Pano ID     | true     |

### Change Preset

Change to a specific preset.

```ts
siteView4embed.changePreset(presetName);
```

| Property   | Type     | Description          | Required |
| ---------- | -------- | -------------------- | -------- |
| presetName | `string` | Preset of the layout | true     |

## Camera

### Get Camera Parameter

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
    orthoZoom: `number`
  }
}
```

| Property    | Type       | Description                                                                  |
| ----------- | ---------- | ---------------------------------------------------------------------------- |
| viewMode    | `string`   | `"walk" \| "fly" \| "overhead"`                                              |
| walkMode    | `boolean`  | whether the view mode is "walk" or not                                       |
| orthoMode   | `boolean`  | whether the camera is Orthographic or not (perspective)                      |
| tm          | `number[]` | Camera world transform 4x4 matrix                                            |
| fov         | `number`   | Frustum vertical FOV (Field of View), from bottom to top of view, in degrees |
| zoom        | `number`   | Camera zoom factor w.r.t the default zoom factor                             |
| orthoWidth  | `number`   | Orthogonal camera frustum width                                              |
| orthoHeight | `number`   | Orthogonal camera frustum height                                             |
| orthoZoom   | `number`   | Orthogonal camera zoom factor                                                |
| pivot       | `[]`       | [x,y,z] Camera rotation pivot point w.r.t the world coordinate system        |
| pivotAtPano | `[]`       | [x,y,z] Camera rotation pivot point w.r.t the pano coordinate system         |
| panoId      | `number`   | Current pano id                                                              |

### Set Camera Rotate

Rotate the camera.

```ts
siteView4embed.setCameraRotate(direction, angle);
```

| Property  | Type                                  | Description               | Required |
| --------- | ------------------------------------- | ------------------------- | -------- |
| direction | `'UP' \| 'DOWN' \| 'LEFT' \| 'RIGHT'` | Camera rotation direction | true     |
| angle     | `number`                              | Angles in degree          | true     |

### Set Camera Zoom

Change the zoom level of the camera.

```ts
siteView4embed.setCameraZoom(angleInDegree);
```

| Property      | Type     | Description                | Required |
| ------------- | -------- | -------------------------- | -------- |
| angleInDegree | `number` | Camera FOV (Field of View) | true     |

### Set Camera Lookat

Make the camera to look at a specific point.

```ts
siteView4embed.setCameraLookAt(x, y, z);
```

| Property | Type     | Description  | Required |
| -------- | -------- | ------------ | -------- |
| lookAtX  | `number` | X coordinate | true     |
| lookAtY  | `number` | Y coordinate | true     |
| lookAtZ  | `number` | Z coordinate | true     |

### Set Camera Reset

Reset camera parameters to the default values.

```ts
siteView4embed.setCameraReset();
```

### Set Camera Move

```ts
siteView4embed.setCameraMove(direction);
```

Move the camera. The nearest pano will be searched to the given direction, and the pano will be changed.

Request
| Property | Type | Description |
| --------- | ----------------------------------------- | --------------------- |
| direction | `'FORWARD' \| 'BACK' \| 'LEFT' \| 'RIGHT` | Camera move direction |

## Annotation

### Add Annotation Form

Add an annotation to an annotation group.

```ts
siteView4embed.addAnnotation(formTemplateId, annotationGroupId, name, values);
```

| Property          | Type     | Description                                                                                                    | Required |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| formTemplateId    | `number` | Annotation form template ID                                                                                    | true     |
| annotationGroupId | `number` | Annotation group ID in which the annotation will be added                                                      | false    |
| name              | `string` | The name of the annotation. default: 'New form'                                                                | false    |
| values            | `string` | A `string`ified array (using `JSON.`string`ify`) of values ​​for annotation fields like `'["text1", "text2"]'` | false    |

### Delete Annotation

Delete an annotation.

```ts
siteView4embed.deleteAnnotation(annotationId);
```

| Property     | Type     | Description                    | Required |
| ------------ | -------- | ------------------------------ | -------- |
| annotationId | `number` | ID of annotation to be deleted | true     |

### Get Annotation Group

Get information on a specific annotation group.

```ts
siteView4embed.getAnnotationGroup(annotationGroupId);
```

| Property          | Type     | Description         | Required |
| ----------------- | -------- | ------------------- | -------- |
| annotationGroupId | `number` | Annotation group ID | true     |

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

| Property  | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| id        | `number` | Annotation group ID                  |
| reviewKey | `string` | SiteView key of the annotation group |
| name      | `string` | The name of the annotation group     |

### Get Annotation Group All

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

| Property  | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| id        | `number` | Annotation group ID                  |
| reviewKey | `string` | SiteView key of the annotation group |
| name      | `string` | The name of the annotation group     |

### Get Annotation

Get information on a specific annotation.

```ts
siteView4embed.getAnnotation(annotationId);
```

| Property     | Type     | Description   | Required |
| ------------ | -------- | ------------- | -------- |
| annotationId | `number` | Annotation ID | true     |

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

| Property       | Type     | Description                         |
| -------------- | -------- | ----------------------------------- |
| id             | `number` | Annotation ID                       |
| name           | `string` | The name of the annotation          |
| formName       | `string` | formTemplate name of the annotation |
| formTemplateId | `number` | formTemplateId of the annotation    |
| children       | array    | Array of child annotations          |

### Get Annotation All

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

| Property       | Type     | Description                         |
| -------------- | -------- | ----------------------------------- |
| id             | `number` | Annotation ID                       |
| name           | `string` | The name of the annotation          |
| formName       | `string` | formTemplate name of the annotation |
| formTemplateId | `number` | formTemplateId of the annotation    |
| children       | array    | Array of child annotations          |

### Toggle Resolve Annotation

Toggle the annotation resolution status.

```ts
siteView4embed.toggleResolveAnnotation(annotationId);
```

| Property     | Type     | Description   | Required |
| ------------ | -------- | ------------- | -------- |
| annotationId | `number` | Annotation ID | true     |

### Update Annotation Form

Update an annotation.

```ts
siteView4embed.updateAnnotation(annotationId, name, values);
```

| Property     | Type     | Description                                                                                                    | Required |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| annotationId | `number` | Annotation ID annotation                                                                                       | true     |
| name         | `string` | New name of the annotation                                                                                     | false    |
| values       | `string` | A `string`ified array (using `JSON.`string`ify`) of values ​​for annotation fields like `'["text1", "text2"]'` | false    |

### Set Active Annotation

Set Active Annotation

```ts
siteView4embed.setActiveAnnotation(annotationId);
```

### Reset Active Annotation

Reset Active Annotation

```ts
siteView4embed.resetActiveAnnotation();
```

| Property     | Type     | Description              | Required |
| ------------ | -------- | ------------------------ | -------- |
| annotationId | `number` | Annotation ID annotation | true     |

## Utility

### Find Nearest Panos

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

| Property  | Type     | Description                                                                                                   | Required |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| levelId   | `number` | Level ID                                                                                                      | true     |
| captureId | `number` | Capture ID                                                                                                    | true     |
| coordX    | `number` | X coordinate of the searching center                                                                          | true     |
| coordY    | `number` | Y coordinate of the searching center                                                                          | true     |
| maxCount  | `number` | Maximum `number` of panos to find. default: 6                                                                 | false    |
| normalX   | `number` | Direction vector X value. When it is given, panos within 45 degrees of the direction vector will be searched. | false    |
| normalY   | `number` | Direction vector Y value.                                                                                     | false    |

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

| Property       | Type     | Description                      |
| -------------- | -------- | -------------------------------- |
| id             | `number` | Pano ID                          |
| name           | `string` | Name of the pano                 |
| filename       | `string` | Pano image file name             |
| appCapturedAt  | `date`   | Date the capture was started     |
| publishedAt    | `date`   | Published date                   |
| measureReadyAt | `date`   | Measure ready status change date |
| position       | `[]`     | [x,y,z] coordinates of the pano  |
| levelId        | `number` | Level ID                         |
| captureId      | `number` | Capture ID                       |

### Open Captures dialog

Response

| Property | Type      | Description                     |
| -------- | --------- | ------------------------------- |
| success  | `boolean` | True when opening is successful |

## BroadCast Event

### Active Annotation Changed

emitted when active annotation changed.

Response

```ts
{
  reset: boolean;
  prevAnnotationId: number;
  id: number;
  name?: string;
  annotationGroup?: {
    id: number;
    name: string;
  };
  level?: {
    id: number;
    name: string;
    elevation: number;
  };
  capture?: {
    id: number;
    note: string;
    capturedAt: string;
  }
  link?: string;
  position?: number[];
  form?: {
    items: FormItemData[];
  };
}
```

| Property             | Type                    | Description                               |
| -------------------- | ----------------------- | ----------------------------------------- |
| id                   | `number`                | Annotation ID                             |
| name                 | `string`                | The name of the annotation                |
| reset                | `boolean`               | if set active annotation, reset is false. |
| annotationGroup      | `Object`                |                                           |
| annotationGroup.id   | `number`                | Annotation group ID                       |
| annotationGroup.name | `string`                | The name of the annotation group          |
| level                | `Object`                |                                           |
| level.id             | `number`                | Level ID                                  |
| level.name           | `string`                | Name of the level                         |
| level.elevation      | `number`                | The height of the level in meter          |
| capture              | `Object`                |                                           |
| capture.id           | `number`                | Capture ID                                |
| capture.note         | `string`                | Capture's note                            |
| capture.capturedAt   | `string`                | Date of the capture                       |
| link                 | `string \| '(not set)'` | External link                             |
| position             | `number[]`              | [x,y,z] coordinates of annotation         |
| form                 | `Object`                |                                           |
| form.items           | `FormItemData[]`        | Field items of annotation                 |

| FormItemData Property | Type                          | Description                                                   |
| --------------------- | ----------------------------- | ------------------------------------------------------------- |
| id                    | `number`                      | Field ID                                                      |
| label                 | `string`                      | Field label                                                   |
| name                  | `string`                      | Field name                                                    |
| value                 | `string \| number \| boolean` | Field value                                                   |
| options               | `string[]`                    | Field options for radio button, dropdown select, multi-select |

### Annotation Updated

emitted when annotation updated

Response

```ts
{
  reset: boolean;
  prevAnnotationId: number;
  id: number;
  name?: string;
  annotationGroup?: {
    id: number;
    name: string;
  };
  level?: {
    id: number;
    name: string;
    elevation: number;
  };
  capture?: {
    id: number;
    note: string;
    capturedAt: string;
  }
  link?: string;
  position?: number[];
  form?: {
    items: FormItemData[];
  };
}
```

| Property             | Type                    | Description                               |
| -------------------- | ----------------------- | ----------------------------------------- |
| id                   | `number`                | Annotation ID                             |
| name                 | `string`                | The name of the annotation                |
| reset                | `boolean`               | if set active annotation, reset is false. |
| annotationGroup      | `Object`                |                                           |
| annotationGroup.id   | `number`                | Annotation group ID                       |
| annotationGroup.name | `string`                | The name of the annotation group          |
| level                | `Object`                |                                           |
| level.id             | `number`                | Level ID                                  |
| level.name           | `string`                | Name of the level                         |
| level.elevation      | `number`                | The height of the level in meter          |
| capture              | `Object`                |                                           |
| capture.id           | `number`                | Capture ID                                |
| capture.note         | `string`                | Capture's note                            |
| capture.capturedAt   | `string`                | Date of the capture                       |
| link                 | `string \| '(not set)'` | External link                             |
| position             | `number[]`              | [x,y,z] coordinates of annotation         |
| form                 | `Object`                |                                           |
| form.items           | `FormItemData[]`        | Field items of annotation                 |

| FormItemData Property | Type                          | Description                                                   |
| --------------------- | ----------------------------- | ------------------------------------------------------------- |
| id                    | `number`                      | Field ID                                                      |
| label                 | `string`                      | Field label                                                   |
| name                  | `string`                      | Field name                                                    |
| value                 | `string \| number \| boolean` | Field value                                                   |
| options               | `string[]`                    | Field options for radio button, dropdown select, multi-select |

### API Ready

Response

| Property | Type      | Description             |
| -------- | --------- | ----------------------- |
| ready    | `boolean` | Returns true when ready |

### Document loaded

Response

| Property       | Type      | Description                       |
| -------------- | --------- | --------------------------------- |
| hasBim         | `boolean` | True if the project has a BIM     |
| documentLoaded | `boolean` | Returns true when document loaded |
