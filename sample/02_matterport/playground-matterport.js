import * as Cupix from './cupix.js';
import * as Matterport from './matterport.js';
import * as Utils from './utils.js';

let currentSample;

// cupix
const cupixDom = 'cupix-viewer';
const cupixApiToken = 'VqTjqpJiADq6sojUZaLky3RmwCE0phz9';
let currentViewLayoutMode;

// matterport
const matterportDom = 'matterport-viewer';
const matterportApplicationKey = 'w8k8c9hqbw8bhqfq2rti4rxdc';
let prevMatterportZoomLevel = 1;

let cameraSync = true;

const samples = [
  {
    label: 'PAT - July 26, 2022',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1719961,
      levelId: 9158,
      captureId: 9198
    },
    matterportModelSid: 'KVs5Soa1Hos', // PAT - July 26, 2022
    samplingPoints: [
      {
        cupix: { x: 19.787616, y: -24.158448, z: 2 },
        matterport: { x: 4.3740877065857084, y: 0, z: 2.6406465170025 }
      },
      {
        cupix: { x: 16.117824, y: -31.046928, z: 2 },
        matterport: { x: 0.5912911437628832, y: 0, z: 9.261218431057 }
      }
    ]
  },
  {
    label: 'PAT - Phase 1',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1719134,
      levelId: 9158,
      captureId: 9191
    },
    matterportModelSid: 'f6kSPagqKbJ', // PAT - Phase 1
    samplingPoints: [
      {
        cupix: { x: 13.459968, y: -23.28672, z: 2 },
        matterport: { x: -1.545627263073751, y: 0, z: 0.7899259964932916 }
      },
      {
        cupix: { x: 19.376136, y: -28.535376, z: 2 },
        matterport: { x: 4.267123510909958, y: 0, z: 6.961323548858628 }
      }
    ]
  },
  {
    label: 'CT and Fluoro - 6.8.2022',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1719382,
      levelId: 9158,
      captureId: 9192
    },
    matterportModelSid: 'd3p5Z2Ut4ju', //CT and Fluoro - 6.8.2022
    samplingPoints: [
      {
        cupix: { x: 15.919704, y: -5.45592, z: 2 },
        matterport: { x: -27.953939619709843, y: 0, z: 7.985852673813811 }
      },
      {
        cupix: { x: 52.142136, y: -1.441704, z: 2 },
        matterport: { x: 8.083187018140919, y: 0, z: 3.7907419030787324 }
      }
    ]
  },
  {
    label: 'CT and Fluoro - Phase 1 Abatement',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1720071,
      levelId: 9158,
      captureId: 9191
    },
    matterportModelSid: '3dPHsXvcDcY', // CT and Fluoro - Phase 1 Abatement
    samplingPoints: [
      {
        cupix: { x: 37.837872, y: -13.2588, z: 2 },
        matterport: { x: 6.7282955111805975, y: 0, z: -3.204285205498706 }
      },
      {
        cupix: { x: 34.35096, y: -8.455152, z: 2 },
        matterport: { x: 10.477422215545207, y: 0, z: 2.04032460064622 }
      }
    ]
  },
  {
    label: 'CT and Fluoro - Phase 1 PAT Rescan',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1719154,
      levelId: 9158,
      captureId: 9191
    },
    matterportModelSid: 's4qqMTi7cP3', // CT and Fluoro - Phase 1 PAT Rescan
    samplingPoints: [
      {
        cupix: { x: 13.47216, y: -23.024592, z: 2 },
        matterport: { x: -1.1487840471512822, y: 0, z: -14.105321855164282 }
      },
      {
        cupix: { x: 19.376136, y: -28.535376, z: 2 },
        matterport: { x: 4.688783538691739, y: 0, z: -8.790091695379179 }
      }
    ]
  },
  {
    label: 'CT and Fluoro - Phase 1',
    cupixSiteViewURL: 'https://cupix.stage.cupix.works/sv/q8gnw1',
    initialPano: {
      id: 1719828,
      levelId: 9158,
      captureId: 9191
    },
    matterportModelSid: 'XRgfoSLJRs8', // CT and Fluoro - Phase 1
    samplingPoints: [
      {
        cupix: { x: 34.424112, y: 1.200912, z: 2 },
        matterport: { x: 1.0715161709563226, y: 0, z: -17.2024102266762 }
      },
      {
        cupix: { x: 32.022288, y: -8.446008, z: 2 },
        matterport: { x: 0.7698799394721896, y: 0, z: -7.495763378102184 }
      }
    ]
  }
];

function updateCurrentSample(sample) {
  const cupixSiteViewURL = sample.cupixSiteViewURL;
  const initialPano = sample.initialPano;
  const matterportModelSid = sample.matterportModelSid;
  const samplingPoints = sample.samplingPoints;
  const tmM2C = Utils.Conversion.getConversionTransformMatrixM2C(
    samplingPoints[0].cupix,
    samplingPoints[1].cupix,
    samplingPoints[0].matterport,
    samplingPoints[1].matterport
  );
  currentSample = {
    cupixSiteViewURL: cupixSiteViewURL,
    initialPano: initialPano,
    matterportModelSid: matterportModelSid,
    tmM2C: tmM2C,
    tmC2M: Utils.Geom.toInverseMatrix4(tmM2C)
  };
}

function loadSampleByMatterportModelSid(matterportModelSid) {
  if (matterportModelSid == undefined) return;
  if (Matterport.currentModelSid !== matterportModelSid) {
    const found = samples.find(it => it.matterportModelSid === matterportModelSid);
    if (found) loadSample(found);
  }
}

async function loadSample(sample) {
  updateCurrentSample(sample);
  const movePano = currentSample.initialPano && Cupix.activePano?.id !== currentSample.initialPano.id;
  await load(
    currentSample.cupixSiteViewURL,
    cupixApiToken,
    movePano ? currentSample.initialPano : undefined,
    currentSample.matterportModelSid,
    matterportApplicationKey
  );
}

async function load(cupixSiteViewURL, apiToken, initialPano, matterportModelSid, applicationKey) {
  await Promise.all([
    initializeCupix(cupixSiteViewURL, apiToken),
    initializeMatterport(matterportModelSid, applicationKey)
  ]);
  if (initialPano) {
    await Cupix.moveTo(initialPano.id);
  }
}

async function initializeCupix(cupixSiteViewURL, apiToken) {
  if (Cupix.currentSiteViewURL !== cupixSiteViewURL) {
    await Cupix.initialize(cupixDom, cupixSiteViewURL, apiToken);
    addCupixEventListeners();
  }
}

async function initializeMatterport(matterportModelSid, applicationKey) {
  if (Matterport.currentModelSid !== matterportModelSid) {
    await Matterport.initialize(matterportDom, matterportModelSid, applicationKey);
    addMatterportEventListers();
    prevMatterportZoomLevel = 1;
  }
}

function addCupixEventListeners() {
  Cupix.activePanoChangedEvent$
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      if (Cupix.activePano) {
        const p = Utils.Geom.arrayToXYZ(Cupix.activePano.position);
        Matterport.moveToPoint(Utils.Conversion.toMatterportPosition(p, currentSample.tmC2M));
      }
    });
  Cupix.cameraPoseEvent$
    .pipe(rxjs.operators.throttleTime(50, rxjs.asyncScheduler, { leading: true, trailing: true }))
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      const tm = event.cameraParameters?.tm;
      if (tm) {
        Matterport.setRotation(Utils.Conversion.toMatterportRotation(Utils.Geom.arrayToMatrix4(tm), currentSample.tmC2M));
      }
    });
  Cupix.cameraZoomEvent$
    .pipe(rxjs.operators.throttleTime(50, rxjs.asyncScheduler, { leading: true, trailing: true }))
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      const fov = event.cameraParameters?.fov;
      if (!isNaN(fov)) {
        Matterport.setZoom(Utils.Conversion.toMatterportZoom(fov));
      }
    });
}

function addMatterportEventListers() {
  Matterport.activeSweepChangedEvent$
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      const p = event.sweep?.position;
      if (p == undefined) return;
      Cupix.moveToPoint(Utils.Conversion.toCupixPosition(p, currentSample.tmM2C));
    });
  Matterport.cameraPoseEvent$
    .pipe(rxjs.operators.throttleTime(100, rxjs.asyncScheduler, { leading: true, trailing: true }))
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      const rotation = event?.pose?.rotation;
      const currentPosition = Utils.Geom.arrayToXYZ(Cupix.activePano?.position);
      if (currentPosition && rotation) {
        Cupix.setCameraLookAt(Utils.Conversion.toCupixDirectionLookAt(currentPosition, rotation, currentSample.tmM2C));
      }
    });
  Matterport.cameraZoomEvent$
    .pipe(rxjs.operators.throttleTime(100, rxjs.asyncScheduler, { leading: true, trailing: true }))
    .subscribe((event) => {
      if (!cameraSync) return;
      if (!event.mouseInside) return;
      const diff = event.zoomLevel - prevMatterportZoomLevel;
      prevMatterportZoomLevel = event.zoomLevel;
      if (!isNaN(diff)) {
        Cupix.setZoom(-diff * Utils.Conversion.ZOOM_RATIO_C2M);
      }
    });
}

function setCurrentLayoutMode(mode) {
  const cupixViewerElem = document.getElementById('cupix-viewer');
  const matterportViewerWrapperElem = document.getElementById('matterport-viewer-wrapper');

  switch (mode) {
    case 'BASIC':
      currentViewLayoutMode = 'BASIC';
      cupixViewerElem.setAttribute('style', undefined);
      matterportViewerWrapperElem.setAttribute('style', undefined);
      break;
    case 'BIM_COMPARE':
      currentViewLayoutMode = 'BIM_COMPARE';
      cupixViewerElem.setAttribute('style', 'width: calc(200% / 3) !important');
      matterportViewerWrapperElem.setAttribute('style', 'width: calc(100% / 3) !important');
      break;
  }
}

function initializeUI() {
  // sample list
  let activeA;
  const listWrapper = document.getElementById('sample-list');
  const addSample = (sample, active = false) => {
    if (listWrapper == undefined) return;
    if (sample == undefined) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.className = active ? 'nav-link link-dark active' : 'nav-link link-dark';
    a.textContent = sample.label;
    a.onclick = () => {
      if (activeA) activeA.className = 'nav-link link-dark';
      a.className = 'nav-link link-dark active';
      activeA = a;
      loadSampleByMatterportModelSid(sample.matterportModelSid);
    };
    if (active) {
      activeA = a;
    }
    li.appendChild(a);
    listWrapper.appendChild(li);
  };

  if (listWrapper) {
    for (let i = 0; i < samples.length; i++) {
      addSample(samples[i], i === 0);
    }
  }

  // layout view mode toggle button
  const toggleViewLayoutButton = document.getElementById('toggle-view-layout-button');
  if (toggleViewLayoutButton) {
    const setBasicViewLayout = () => {
      toggleViewLayoutButton.innerText = 'Bim Compare View';
      setCurrentLayoutMode('BASIC');
    };
    const setBimCompareViewLayout = () => {
      toggleViewLayoutButton.innerText = 'Default View';
      setCurrentLayoutMode('BIM_COMPARE');
    };

    setBasicViewLayout();
    toggleViewLayoutButton.onclick = () => {
      if (currentViewLayoutMode === 'BASIC') {
        setBimCompareViewLayout();
      } else {
        setBasicViewLayout();
      }
    };
  }
}

loadSample(samples[0]);
initializeUI();
