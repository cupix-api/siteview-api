import * as Utils from './utils.js';

let mouseInside = false;
const activePanoChangedEvent = new rxjs.Subject();
const cameraPoseEvent = new rxjs.Subject();
const cameraZoomEvent = new rxjs.Subject();

export let currentSiteViewURL;
export let activePano;
export const activePanoChangedEvent$ = activePanoChangedEvent.asObservable();
export const cameraPoseEvent$ = cameraPoseEvent.asObservable();
export const cameraZoomEvent$ = cameraZoomEvent.asObservable();

export function initialize(
  domId,
  siteViewURL,
  apiToken,
  hideTopbar = true) {
  return new Promise(async resolve => {
    currentSiteViewURL = siteViewURL;
    const reg = /([^\/]+)\/sv\/(\w+)/.exec(siteViewURL);
    const subDomains = reg[1].split('.');
    const teamDomain = subDomains[1] ? subDomains[0] : undefined;
    const siteviewKey = reg[2];
    if (teamDomain == undefined) throw new Error('Invalid team domain');
    if (siteviewKey == undefined) throw new Error('Invalid siteview key');

    const elem = document.getElementById(domId);
    if (elem == undefined) throw new Error('DOM element not loaded.');

    window.removeEventListener("message", onMessageEvent);
    await siteView4embed.stop();
    siteView4embed.disconnect();

    const childNodes = elem.childNodes;
    for (const child of childNodes) {
      child.remove();
    }

    if (hideTopbar) {
      siteViewURL += '?hide_topbar=1';
    }

    const iframe = document.createElement('iframe');
    iframe.allow = 'xr-spatial-tracking';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = siteViewURL;

    iframe.addEventListener('mouseleave', _ => mouseInside = false);
    iframe.addEventListener('mouseover', _ => mouseInside = true);
    iframe.addEventListener('mousemove', _ => mouseInside = true);
    iframe.addEventListener('load', () => {
      void (async () => {
        siteView4embed.cupixWindow = iframe.contentWindow;
        await siteView4embed.start();
        await siteView4embed.signout();
        await siteView4embed.signinWithToken(apiToken);
        await siteView4embed.goSiteView(siteviewKey, hideTopbar);
        onLoaded();
        resolve();
      })();
    });

    elem.appendChild(iframe);
  });
}

function print(message, ...optionalsParams) {
  // console.log('[Cupix]', message, optionalsParams);
}

async function onLoaded() {
  window.addEventListener("message", onMessageEvent);
  print('Cupix API Connected!');
}

export function onMessageEvent(event) {
  const data = event && event.data;
  if (data == undefined) return;
  if (data.header != "CUPIXWORKS_API") return;
  const responseType = data['responseType']	// string
  const response = data['response']	// response object

  if (response && mouseInside) response['mouseInside'] = 'cupix';
  print(responseType, response);

  switch (responseType) {
    case 'VIEW_ACTIVE_PANO_CHANGED_RESPONSE':
      void (async () => {
        activePano = await getPano(response.panoId);
        activePanoChangedEvent.next(response);
      })();
      break;
    case 'VIEW_ACTIVE_CAMERA_ROTATED_RESPONSE':
      cameraPoseEvent.next(response);
      break;
    case 'VIEW_ACTIVE_CAMERA_ZOOMED_RESPONSE':
      cameraZoomEvent.next(response);
      break;
  }
}

export function setZoom(zoomLevel) {
  siteView4embed.setCameraZoom(zoomLevel, 'cupix');
}

export function setCameraLookAt(xyz) {
  if (!Utils.Geom.isValidXYZ(xyz)) throw new Error('Invalid point');
  siteView4embed.setCameraLookAt(xyz.x, xyz.y, xyz.z, 'cupix');
}

export async function getPano(panoId) {
  const res = await siteView4embed.getPano(panoId, 'cupix');
  return res?.pano;
}

export async function moveTo(panoId) {
  return siteView4embed.changePano(panoId, 'cupix');
}

export async function getPanoPosition(panoId) {
  const pano = await getPano(panoId);
  return Utils.Geom.arrayToXYZ(pano?.position);
}

async function findNearestPano(xyz) {
  if (activePano == undefined) return undefined;
  const res = await siteView4embed.findNearestPanos(
    activePano.levelId,
    activePano.captureId,
    xyz.x,
    xyz.y,
    undefined,
    undefined,
    1,
    'cupix'
  );
  return res?.panos?.[0];
}

export async function moveToPoint(xyz) {
  if (!Utils.Geom.isValidXYZ(xyz)) throw new Error('Invalid point');
  const pano = await findNearestPano(xyz);
  if (pano) await moveTo(pano.id);
}

export async function changeLayout(layout) {
  siteView4embed.changeLayout(layout, 'cupix');
}