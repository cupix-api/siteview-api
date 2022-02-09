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
    - [**Get Form Design**](#get-form-design)
    - [**Get Form Design All**](#get-form-design-all)
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
    - [**Add Annotation Layer**](#add-annotation-layer)
    - [**Add Annotation Form**](#add-annotation-form)
    - [**Delete Annotation Layer**](#delete-annotation-layer)
    - [**Delete Annotation**](#delete-annotation)
    - [**Get Annotation Layer**](#get-annotation-layer)
    - [**Get Annotation Layer All**](#get-annotation-layer-all)
    - [**Get Annotation Layer Template**](#get-annotation-layer-template)
    - [**Get Annotation Layer Template All**](#get-annotation-layer-template-all)
    - [**Get Annotation**](#get-annotation)
    - [**Get Annotation All**](#get-annotation-all)
    - [**Toggle Resolve Annotation**](#toggle-resolve-annotation)
    - [**Update Annotation Layer**](#update-annotation-layer)
    - [**Update Annotation Form**](#update-annotation-form)
  - [**Utility API**](#utility-api)
    - [**Find Nearest Panos**](#find-nearest-panos)

# CUPIX API

## **Initialize API**

### **Start**

API 사용하기 위해 시작 해야 하는 API

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

| Property | Data type | Description   |
| -------- | --------- | ------------- |
| running  | boolean   | API 시작 여부 |

### **Stop**

API 사용을 종료 함. `running: false` 상태에서는 API를 사용할 수 없음.

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

| Property | Data type | Description   |
| -------- | --------- | ------------- |
| running  | boolean   | API 시작 여부 |

---

## **Authenticate API**

### **Sign In**

로그인 API. Home / SiteView 페이지를 사용하기 위해 로그인 해야 함.

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

| Property   | Data type | Description                            |
| ---------- | --------- | -------------------------------------- |
| email      | string    | 로그인 이메일. 토큰이 없을 경우 필수   |
| password   | string    | 로그인 패스워드. 토큰이 없을 경우 필수 |
| teamDomain | string    | 팀 도메인. 토큰이 없을 경우 필수       |
| token      | string    | 토큰이 있으면 토큰만으로 로그인 가능   |

Response

### **Sign Out**

로그아웃 API.

```ts
CupixApi.sendToCupix({
  operationType: "SIGNOUT",
});
```

## **Navigate API**

### **Go Home**

대시보드 페이지로 이동.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GO_HOME",
});
```

Response

### **Go SiteView**

특정 key의 siteView 페이지로 이동.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GO_SITEVIEW",
  operationArgs: {
    siteViewKey: "",
  },
});
```

| Property    | Data type | Description                   |
| ----------- | --------- | ----------------------------- |
| siteViewKey | string    | 페이지 이동할 siteView 의 key |

Response

## **Get Info API**

### **Get Siteview**

현재 siteView의 정보를 조회.

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

| Property | Data type | Description                 |
| -------- | --------- | --------------------------- |
| key      | string    | 현재 페이지의 siteView key  |
| name     | string    | 현재 페이지의 siteView name |

### **Get Level**

특정 ID의 레벨을 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_LEVEL",
  operationArgs: {
    levelId: 1,
  },
});
```

| Property | Data type | Description     | Require |
| -------- | --------- | --------------- | ------- |
| levelId  | number    | 대상의 level ID | O       |

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

| Property | Data type | Description |
| -------- | --------- | ----------- |
| level    | object    | level 정보  |

| level Property | Data type | Description           |
| -------------- | --------- | --------------------- |
| id             | number    | level object의 아이디 |
| name           | string    | level object의 이름   |
| isGroundLevel  | boolean   | 그라운드 레벨의 여부  |
| elevation      | number    | level의 높이          |
| height         | number    | level의 천장 높이     |

### **Get Level All**

현재 siteView의 모든 레벨을 조회.

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

| Property | Data type              | Description      |
| -------- | ---------------------- | ---------------- |
| levels   | array of level objects | level 정보 array |

| level Property | Data type | Description           |
| -------------- | --------- | --------------------- |
| id             | number    | level object의 아이디 |
| name           | string    | level object의 이름   |
| isGroundLevel  | boolean   | 그라운드 레벨의 여부  |
| elevation      | number    | level의 높이          |
| height         | number    | level의 천장 높이     |

### **Get Capture**

특정 ID의 캡쳐를 조회

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_CAPTURE",
  operationArgs: {
    captureId: 1,
  },
});
```

| Property  | Data type | Description        | Require |
| --------- | --------- | ------------------ | ------- |
| captureId | number    | 대상의 캡처 아이디 | O       |

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

| Property | Data type | Description  |
| -------- | --------- | ------------ |
| capture  | object    | capture 정보 |

| capture Property | Data type | Description             |
| ---------------- | --------- | ----------------------- |
| id               | number    | capture object의 아이디 |
| name             | string    | capture object의 이름   |
| date             | Date      | capture의 날짜          |

### **Get Capture All**

현재 siteView의 모든 capture를 조회.

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

| Property | Data type                | Description        |
| -------- | ------------------------ | ------------------ |
| captures | array of capture objects | capture 정보 array |

| capture Property | Data type | Description             |
| ---------------- | --------- | ----------------------- |
| id               | number    | capture object의 아이디 |
| name             | string    | capture object의 이름   |
| date             | Date      | capture의 날짜          |

### **Get Pano**

특정 ID의 파노를 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_PANO",
  operationArgs: {
    panoId: 1,
  },
});
```

| Property | Data type | Description    | Require |
| -------- | --------- | -------------- | ------- |
| panoId   | number    | 대상의 pano ID | O       |

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

| Property | Data type | Description |
| -------- | --------- | ----------- |
| pano     | object    | pano 정보   |

| pano Property  | Data type | Description                 |
| -------------- | --------- | --------------------------- |
| id             | number    | pano object의 아이디        |
| name           | string    | pano object의 이름          |
| filename       | string    | pano 이미지 파일 이름       |
| appCapturedAt  | Date      | 앱에서 촬영한 날짜          |
| publishedAt    | Date      | publish 날짜                |
| measureReadyAt | Date      | measure ready 날짜          |
| position       | number[]  | 파노의 [x,y,z] 좌표         |
| levelId        | number    | pano가 포함된 레벨의 아이디 |
| captureId      | number    | pano가 포함된 캡쳐의 아이디 |

### **Get Pano All**

현재 siteView의 모든 pano를 조회.

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

| Property | Data type             | Description     |
| -------- | --------------------- | --------------- |
| panos    | array of pano objects | pano 정보 array |

| pano Property  | Data type | Description                 |
| -------------- | --------- | --------------------------- |
| id             | number    | pano object의 아이디        |
| name           | string    | pano object의 이름          |
| filename       | string    | pano 이미지 파일 이름       |
| appCapturedAt  | Date      | 앱에서 촬영한 날짜          |
| publishedAt    | Date      | publish 날짜                |
| measureReadyAt | Date      | measure ready 날짜          |
| position       | number[]  | 파노의 [x,y,z] 좌표         |
| levelId        | number    | pano가 포함된 레벨의 아이디 |
| captureId      | number    | pano가 포함된 캡쳐의 아이디 |

### **Get Room**

특정 ID의 room 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ROOM",
  operationArgs: {
    roomId: 1,
  },
});
```

| Property | Data type | Description    | Require |
| -------- | --------- | -------------- | ------- |
| roomId   | number    | 대상의 room ID | O       |

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

| Property | Data type | Description |
| -------- | --------- | ----------- |
| room     | object    | room 정보   |

| room Property | Data type | Description                    |
| ------------- | --------- | ------------------------------ |
| id            | number    | room object의 ID               |
| name          | string    | room object의 이름             |
| bimId         | number    | bim ID                         |
| baseMatrix    | number[]  | base Matrix                    |
| minBound      | number[]  | 바운딩 박스의 min 좌표 [x,y,z] |
| maxBound      | number[]  | 바운딩 박스의 man 좌표 [x,y,z] |

### **Get Room All**

현재 siteView의 모든 room 조회

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

| Property | Data type             | Description     |
| -------- | --------------------- | --------------- |
| rooms    | array of room objects | room 정보 array |

| room Property | Data type | Description                    |
| ------------- | --------- | ------------------------------ |
| id            | number    | room object의 ID               |
| name          | string    | room object의 이름             |
| minBound      | number[]  | 바운딩 박스의 min 좌표 [x,y,z] |
| maxBound      | number[]  | 바운딩 박스의 man 좌표 [x,y,z] |

### **Get Form Design**

특정 ID의 form design 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_FORM_DESIGN",
  operationArgs: {
    formDesignId: 1,
  },
});
```

| Property     | Data type | Description           | Require |
| ------------ | --------- | --------------------- | ------- |
| formDesignId | number    | 대상의 form design ID | O       |

Response

```ts
{
  formDesign: {
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

| Property   | Data type                  | Description      |
| ---------- | -------------------------- | ---------------- |
| formDesign | object                     | form Design 정보 |
| formFields | array of formField objects | form field 정보  |

| formDesign Property | Data type | Description                      |
| ------------------- | --------- | -------------------------------- |
| id                  | number    | form Design object의 ID          |
| name                | string    | form Design object의 이름        |
| description         | string    | form Design object의 description |
| created_at          | string    | form Design object의 생성일      |
| updated_at          | string    | form Design object의 수정일      |

| formField Property | Data type                                                                                                                                | Description              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| id                 | number                                                                                                                                   | form field object의 ID   |
| type               | string                                                                                                                                   | form field object의 타입 |
| name               | string                                                                                                                                   | form field object의 이름 |
| kind               | `"select_boxes" \| "text_field" \| "number" \| "description" \| "member" \| "text_area" \| "check_box" \| "select" \| "radio" \| "date"` | form field object의 종류 |

### **Get Form Design All**

사용할 수 있는 모든 form design을 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_FORM_DESIGN_ALL",
});
```

Response

```ts
{
  formDesigns: [
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

| Property    | Data type                   | Description      |
| ----------- | --------------------------- | ---------------- |
| formDesigns | array of formDesign Objects | form design 정보 |

| formDesign Property | Data type | Description                      |
| ------------------- | --------- | -------------------------------- |
| id                  | number    | form Design object의 ID          |
| name                | string    | form Design object의 이름        |
| description         | string    | form Design object의 description |
| created_at          | string    | form Design object의 생성일      |
| updated_at          | string    | form Design object의 수정일      |

## **Change API**

### **Change Level**

특정 level로 이동.

Request

```ts
CupixApi.sendToCupix({
  operationType: "CHANGE_LEVEL",
  operationArgs: {
    levelId: 1,
  },
});
```

| Property | Data type | Description          | Require |
| -------- | --------- | -------------------- | ------- |
| levelId  | number    | active 할 level의 ID | O       |

Response

### **Change Capture**

특정 capture로 이동.

Request

```ts
CupixApi.sendToCupix({
  operationType: "CHANGE_CAPTURE",
  operationArgs: {
    captureId: 1,
  },
});
```

| Property  | Data type | Description          | Require |
| --------- | --------- | -------------------- | ------- |
| captureId | number    | 이동할 capture 의 ID | O       |

Response


### **Change Pano**

특정 pano를 focus 함

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

| Property | Data type | Description              | Require |
| -------- | --------- | ------------------------ | ------- |
| panoId   | number    | focus 할 pano의 ID       | O       |
| lookAt   | number[]  | pano의 방향 [x,y,z] 좌표 | X       |

Response


## **Camera API**

### **Get Camera Parameter**

카메라의 파라미터 정보를 가져옴

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

| Property         | Data type | Description            |
| ---------------- | --------- | ---------------------- |
| cameraParameters | object    | camera Parameters 정보 |

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

카메라를 회전 시킴

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

| Property  | Data type                             | Description          | Require |
| --------- | ------------------------------------- | -------------------- | ------- |
| direction | `'UP' \| 'DOWN' \| 'LEFT' \| 'RIGHT'` | 변경할 카메라의 방향 | O       |
| angle     | number                                | 변경할 카메라의 각도 | O       |

Response


### **Set Camera Zoom**

카메라의 zoom level을 변경.

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
| angleInDegree | number    | 카메라의 fov | O       |

Response


### **Set Camera Lookat**

카메라를 특정 좌표를 파라보도록 방향을 변경.

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

| Property | Data type | Description            | Require |
| -------- | --------- | ---------------------- | ------- |
| lookAtX  | number    | 카메라가 바라볼 방향 X | O       |
| lookAtY  | number    | 카메라가 바라볼 방향 Y | O       |
| lookAtZ  | number    | 카메라가 바라볼 방향 Z | O       |

Response


### **Set Camera Reset**

카메라의 방향을 특정 방향으로 리셋.

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
| Property  | Data type                                 | Description          |
| --------- | ----------------------------------------- | -------------------- |
| direction | `'FORWARD' \| 'BACK' \| 'LEFT' \| 'RIGHT` | 변경할 카메라의 방향 |

Response

## **Annotation API**

### **Add Annotation Layer**

annotation layer를 추가 함.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'ADD_ANNOTATION_LAYER',
  operationArgs: {
    name: "",
    levelId: 1,
    recordId: 1,
    annotationLayerTemplateId: 1,
  },
});
```

| Property                  | Data type | Description                                                 | Require |
| ------------------------- | --------- | ----------------------------------------------------------- | ------- |
| name                      | string    | 추가할 annotation layer의 이름                              | O       |
| levelId                   | number    | 추가할 annotation layer의 상위 level ID                     | O       |
| recordId                  | number    | 추가할 annotation layer의 상위 record ID                    | O       |
| annotationLayerTemplateId | number    | 추가할 annotation layer의 대상 annotation Layer Template ID | X       |

Response

### **Add Annotation Form**

특정 annotation layer에 annotation form 을 추가 함.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'ADD_ANNOTATION_FORM',
  operationArgs: {
    formDesignId: 1,
    annotationLayerId: 1,
    name: "",
    values: ""
  }
});
```

| Property          | Data type | Description                                                | Require |
| ----------------- | --------- | ---------------------------------------------------------- | ------- |
| formDesignId      | number    | 추가할 annotation의 대상 form design ID                    | O       |
| annotationLayerId | number    | 추가할 annotation의 상위 annotation layer ID               | X       |
| name              | string    | 추가할 annotation의 이름. defulat: 'New form'              | X       |
| values            | string    | annotation values. stringify JSON '[]'. 각 필드 값의 array | X       |

Response


### **Delete Annotation Layer**

```ts
CupixApi.sendToCupix({
  operationType: 'DELETE_ANNOTATION_LAYER',
  operationArgs: {
    annotationLayerId: 1,
  },
});
```

Request
| Property          | Data type | Description                  | Require |
| ----------------- | --------- | ---------------------------- | ------- |
| annotationLayerId | number    | 삭제할 annotation layer의 ID | O       |

Response

### **Delete Annotation**

특정 ID의 annotation을 삭제 함.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'DELETE_ANNOTATION',
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description            | Require |
| ------------ | --------- | ---------------------- | ------- |
| annotationId | number    | 삭제할 annotation의 ID | O       |

Response

### **Get Annotation Layer**

특정 ID의 annotation layer 정보를 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_LAYER',
  operationArgs: {
    annotationLayerId: 1
  }
});
```

| Property          | Data type | Description                | Require |
| ----------------- | --------- | -------------------------- | ------- |
| annotationLayerId | number    | 대상 annotation layer의 ID | O       |

Response

```ts
{
  annotationLayer: {
    id: 1,
    reviewKey: "",
    name: "",
  },
}
```

| Property        | Data type | Description           |
| --------------- | --------- | --------------------- |
| annotationLayer | object    | annotation layer 정보 |

| annotationLayer Property | Data type | Description                               |
| ------------------------ | --------- | ----------------------------------------- |
| id                       | number    | annotation layer object의 ID              |
| reviewKey                | string    | 이 annotation layer를 포함하는 review key |
| name                     | string    | annotation layer object의 이름            |

### **Get Annotation Layer All**

현재 siteView의 모든 annotation layer 정보를 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_LAYER_ALL',
});
```

Response

```ts
{
  annotationLayerList: [
    {
      id: 1,
      reviewKey: "",
      name: "",
    },
  ]
}
```

| Property            | Data type                        | Description                |
| ------------------- | -------------------------------- | -------------------------- |
| annotationLayerList | array of annotationLayer objects | annotation layer list 정보 |

| annotationLayer Property | Data type | Description                              |
| ------------------------ | --------- | ---------------------------------------- |
| id                       | number    | annotation layer object의 아이디         |
| reviewKey                | string    | 이 annotation layer를 포함하는 reviewKey |
| name                     | string    | annotation layer object의 이름           |

### **Get Annotation Layer Template**

특정 ID의 annotation layer template 정보를 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_LAYER_TEMPLATE',
  operationArgs: {
    annotationLayerTemplateId: 1,
  },
});
```

| Property                  | Data type | Description                | Require |
| ------------------------- | --------- | -------------------------- | ------- |
| annotationLayerTemplateId | number    | 대상 annotation layer의 ID | O       |

Response

```ts
{
  annotationLayer: {}
}
```

| Property        | Data type | Description           |
| --------------- | --------- | --------------------- |
| annotationLayer | object    | annotation layer 정보 |

| annotationLayer Property | Data type | Description                           |
| ------------------------ | --------- | ------------------------------------- |
| id                       | number    | annotation layer object의 ID          |
| name                     | string    | annotation layer object의 이름        |
| description              | string    | annotation layer object의 description |
| created_at               | string    | annotation layer object의 생성일      |
| updated_at               | string    | annotation layer object의 수정일      |
| published_at             | string    | annotation layer object 발행일        |

### **Get Annotation Layer Template All**

모든 annotation layer template을 조회

Request

```ts
CupixApi.sendToCupix({
  operationType: 'GET_ANNOTATION_LAYER_TEMPLATE_ALL',
});

```

Response

```ts
{
  annotationLayerTemplates: []
}
```

| Property                 | Data type                                | Description                 |
| ------------------------ | ---------------------------------------- | --------------------------- |
| annotationLayerTemplates | array of annotationLayerTemplate objects | annotation layer 정보 array |

| annotationLayer Property | Data type | Description                           |
| ------------------------ | --------- | ------------------------------------- |
| id                       | number    | annotation layer object의 ID          |
| name                     | string    | annotation layer object의 이름        |
| description              | string    | annotation layer object의 description |
| created_at               | string    | annotation layer object의 생성일      |
| updated_at               | string    | annotation layer object의 수정일      |
| published_at             | string    | annotation layer object 발행일        |

### **Get Annotation**

특정 ID의 annotation 정보를 조회.

Request

```ts
CupixApi.sendToCupix({
  operationType: "GET_ANNOTATION",
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description          | Require |
| ------------ | --------- | -------------------- | ------- |
| annotationId | number    | 대상의 annotation ID | O       |

Response

```ts
{
  annotation: {
    id: 1,
    name: "",
    formName: "",
    formDesignId: 1,
    children: [],
  },
}
```

| Property   | Data type | Description     |
| ---------- | --------- | --------------- |
| annotation | object    | annotation 정보 |

| annotation Property | Data type                  | Description                  |
| ------------------- | -------------------------- | ---------------------------- |
| id                  | number                     | annotation object의 ID       |
| name                | string                     | annotation object의 이름     |
| formName            | string                     | annotation의 formDesign 이름 |
| formDesignId        | number                     | annotation의 formDesignId    |
| children            | array of annotation object | 하위 annotation              |


### **Get Annotation All**

현재 siteView의 모든 annotation을 조회.

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
      formDesignId: 1,
      children: [],
    },
  ],
}
```

| Property    | Data type                  | Description           |
| ----------- | -------------------------- | --------------------- |
| annotations | array of annotation object | annotation 정보 array |

| annotation Property | Data type                  | Description                  |
| ------------------- | -------------------------- | ---------------------------- |
| id                  | number                     | annotation object의 ID       |
| name                | string                     | annotation object의 이름     |
| formName            | string                     | annotation의 formDesign 이름 |
| formDesignId        | number                     | annotation의 formDesignId    |
| children            | array of annotation object | 하위 annotation              |

### **Toggle Resolve Annotation**

특정 ID의 annotation의 resolve를 toggle 함.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'TOGGLE_RESOLVE_ANNOTATION',
  operationArgs: {
    annotationId: 1,
  },
});
```

| Property     | Data type | Description          | Require |
| ------------ | --------- | -------------------- | ------- |
| annotationId | number    | 대상 annotation의 ID | O       |

Response

### **Update Annotation Layer**

특정 ID의 annotation layer를 업데이트 함.

Request

```ts
CupixApi.sendToCupix({
  operationType: 'UPDATE_ANNOTATION_LAYER',
  operationArgs: {
    annotationLayerId: 1,
    name: "",
  },
});
```

| Property          | Data type | Description                 | Require |
| ----------------- | --------- | --------------------------- | ------- |
| annotationLayerId | number    | 대상 annotation의 ID        | O       |
| name              | string    | 대상 annotation의 바뀔 이름 | O       |

Response


### **Update Annotation Form**

특정 ID의 annotation form을 업데이트 함.

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

| Property     | Data type | Description                                                | Require |
| ------------ | --------- | ---------------------------------------------------------- | ------- |
| annotationId | number    | 대상 annotation의 ID                                       | O       |
| name         | string    | 대상 annotation 의 바뀔 이름                               | X       |
| values       | string    | annotation values. stringify JSON '[]'. 각 필드 값의 array | X       |

Response

## **Utility API**

### **Find Nearest Panos**

특정 좌표를 기준으로 가까운 pano를 찾음.

Request

```ts
CupixApi.sendToCupix({
  operationType: "FIND_NEAREST_PANOS",
  operationArgs: {
    levelId: 0,
    recordId: 0,
    coordX: 0,
    coordY: 0,
    maxCount: 0
    normalX: 0,
    normalY: 0,
  }
});
```

| Property | Data type | Description                                                     | Require |
| -------- | --------- | --------------------------------------------------------------- | ------- |
| levelId  | number    | 찾을 파노의 levelId                                             | O       |
| recordId | number    | 찾을 파노의 recordId                                            | O       |
| coordX   | number    | target 좌표 X, target 좌표를 기준으로 가까운 pano를 찾음        | O       |
| coordY   | number    | target 좌표 Y, target 좌표를 기준으로 가까운 pano를 찾음        | O       |
| maxCount | number    | 최대로 찾을 pano 갯수. default: 6                               | X       |
| normalX  | number    | 방향 벡터 X, 방향 벡터 기준으로 45도 이내의 값을 찾기 위한 벡터 | X       |
| normalY  | number    | 방향 벡터 Y, 방향 벡터 기준으로 45도 이내의 값을 찾기 위한 벡터 | X       |

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

| Property | Data type            | Description                                                                                                                           |
| -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| panos    | array of pano object | target 좌표에서 가장 가까운 maxCount 개의 pano. normal 값이 있을 경우 카메라 방향이 normal의 방향과 45도 이내인 값을 우선으로 sort 함 |

| pano Property  | Data type | Description                 |
| -------------- | --------- | --------------------------- |
| id             | number    | pano object의 아이디        |
| name           | string    | pano object의 이름          |
| filename       | string    | pano 이미지 파일 이름       |
| appCapturedAt  | Date      |                             |
| publishedAt    | Date      | publish 날짜                |
| measureReadyAt | Date      | measure ready 날짜          |
| position       | number[]  | 파노의 [x,y,z] 좌표         |
| levelId        | number    | pano가 포함된 레벨의 아이디 |
| captureId      | number    | pano가 포함된 캡쳐의 아이디 |