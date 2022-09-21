import * as Utils from './utils.js';

let mouseInside = false;
let mpSDK;
let mpSweeps = [];
const activeSweepChangedEvent = new rxjs.Subject();
const cameraPoseEvent = new rxjs.Subject();
const cameraZoomEvent = new rxjs.Subject();

export let currentModelSid;
export let prevSweep;
export let mpActiveSweep;
export const activeSweepChangedEvent$ = activeSweepChangedEvent.asObservable();
export const cameraPoseEvent$ = cameraPoseEvent.asObservable();
export const cameraZoomEvent$ = cameraZoomEvent.asObservable();

export function initialize(domId, modelSid, applicationKey, sdkVersion = '') {
  return new Promise(resolve => {
    currentModelSid = modelSid;

    const elem = document.getElementById(domId);
    if (elem == undefined) throw new Error('DOM element not loaded.');

    if (mpSDK) mpSDK.disconnect();
    const childNodes = elem.childNodes;
    for (const child of childNodes) {
      child.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.allow = 'xr-spatial-tracking';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = `https://my.matterport.com/show?m=${modelSid}&hr=0&play=1&title=0&qs=1&applicationKey=${applicationKey}`;

    iframe.addEventListener('mouseleave', _ => mouseInside = false);
    iframe.addEventListener('mouseover', _ => mouseInside = true);
    iframe.addEventListener('mousemove', _ => mouseInside = true);
    iframe.addEventListener('load', () => {
      window.MP_SDK.connect(iframe, applicationKey, sdkVersion).then(theSdk => {
        print('Matterport SDK Connected!');
        mpSDK = theSdk;
        onLoaded();
        resolve();
      });
    });

    elem.appendChild(iframe);
  });
}

function print(message, ...optionalsParams) {
  // console.log('[Matterport]', message, optionalsParams);
}

function onLoaded() {
  if (mpSDK == undefined) return;

  mpSDK.Sweep.data.subscribe({
    onCollectionUpdated: collection => onSweepCollectionUpdated(collection)
  });
  mpSDK.Sweep.current.subscribe(sweep => onSweepCurrentChanged(sweep));
  mpSDK.Camera.pose.subscribe(pose => onCameraPoseChanged(pose));
  mpSDK.Camera.zoom.subscribe(zoom => onCameraZoomChanged(zoom));
}

function onSweepCollectionUpdated(collection) {
  mpSweeps = Array.from(collection).map(it => it[1]);
  print('the entire up-to-date collection', mpSweeps);
}

function onSweepCurrentChanged(sweep) {
  // Change to the current sweep has occurred.
  if (sweep.sid === '') {
    // print('Not currently stationed at a sweep position');
  } else {
    // print('Currently at sweep', sweep.sid);
    // print('Current position', sweep.position);
    // print('On floor', sweep.floorInfo.sequence);
    prevSweep = mpActiveSweep;
    mpActiveSweep = sweep;
    activeSweepChangedEvent.next({ sweep: sweep, prevSweep: prevSweep, mouseInside: mouseInside });
  }
}

function onCameraPoseChanged(pose) {
  // Changes to the Camera pose have occurred.
  // print('Current position is ', pose.position);
  // print('Rotation angle is ', pose.rotation);
  // print('Sweep UUID is ', pose.sweep);
  // print('View mode is ', pose.mode);
  cameraPoseEvent.next({ pose: pose, mouseInside: mouseInside })
}

function onCameraZoomChanged(zoom) {
  // the zoom level has changed
  // print('Current zoom is ', zoom.level);
  cameraZoomEvent.next({ zoomLevel: zoom.level, mouseInside: mouseInside });
}

export async function setZoom(zoomLevel) {
  await mpSDK.Camera.zoomTo(zoomLevel);
}

export async function setRotation(rotation, speed = 1000) {
  if (rotation == undefined || isNaN(rotation.x) || isNaN(rotation.y)) throw new Error('Invalid rotation');
  await mpSDK.Camera.setRotation(rotation, { speed: speed });
}

export function moveTo(sweepSid, transition = 'transition.fly') {
  mpSDK.Sweep.moveTo(sweepSid, {
    transition: transition
  });
}

function findNearestSweep(xyz) {
  return Utils.Geom.findNearest(xyz, mpSweeps, (sweep) => sweep.position);
}

export function moveToPoint(xyz) {
  if (!Utils.Geom.isValidXYZ(xyz)) throw new Error('Invalid point');
  const found = findNearestSweep(xyz);
  if (found) moveTo(found.id);
}
