import axios from "axios";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";

import moment from "moment";

export const getIpInfo = async () => {
  return axios.get("https://ipinfo.io?token=e5cc45f901573f").then((res) => {
    return res.data;
  });
};

const firebaseConfig = {
  apiKey: "AIzaSyB26hEuEZJ_D1jelpLbIjtrLBLeIGgGpfE",
  authDomain: "prine-naif-chair.firebaseapp.com",
  projectId: "prine-naif-chair",
  storageBucket: "prine-naif-chair.appspot.com",
  messagingSenderId: "283592202186",
  appId: "1:283592202186:web:452c290da89a0008632133",
  measurementId: "G-Q62EGNKWG7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const reformatArrayToString = (elements) => {
  // console.log(array);
  let result = "";
  if (!elements) return result;
  elements.forEach((item) => {
    result += item + ",";
  });
  //console.log(result,elements)
  return result;
};

export const reformatArrayOfObjectsToString = (elements) => {
  let result = "";
  if (elements.length === 0) return result;

  elements.forEach((item) => {
    result += item.name + ",";
  });
  return result;
};

export const checkMediaDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasAudio = devices.some((device) => device.kind === "audioinput");
    const hasVideo = devices.some((device) => device.kind === "videoinput");
    return {
      hasAudio: hasAudio,
      hasVideo: hasVideo,
    };
  } catch (error) {
    console.error("Error enumerating devices:", error);
  }
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf("Chrome") !== -1) {
    return "Google Chrome";
  } else if (userAgent.indexOf("Firefox") !== -1) {
    return "Mozilla Firefox";
  } else if (userAgent.indexOf("Safari") !== -1) {
    return "Apple Safari";
  } else if (userAgent.indexOf("Edge") !== -1) {
    return "Microsoft Edge";
  } else if (
    userAgent.indexOf("Opera") !== -1 ||
    userAgent.indexOf("OPR") !== -1
  ) {
    return "Opera";
  } else if (
    userAgent.indexOf("MSIE") !== -1 ||
    userAgent.indexOf("Trident") !== -1
  ) {
    return "Internet Explorer";
  } else {
    return "Unknown";
  }
};

export const fetchVpnInfo = async (ipInfo) => {
  try {
    const response = await fetch(
      `https://vpnapi.io/api/${ipInfo}?key=1d3dcc5bcaff4a81871aedba3ee82f78`
    ).then((res) => {
      return res;
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching VPN info:", error);
  }
};

export function saveDb(
  ipInfo,
  VpnInfo,
  result,
  mediaDevices,
  Incognito,
  visitorId
) {
  console.log("vpninfo", VpnInfo);
  const data = {
    location: { ...ipInfo },
    Incognito: { Incognito },
    visitorId: visitorId,
    VpnInfo: { ...VpnInfo },
    userComponents: {
      applePay: { ...result?.components?.applePay },
      architecture: { ...result?.components?.architecture },
      audio: { ...result?.components?.audio },
      canvas: {
        value: { ...result?.components?.canvas?.value },
        duration: result?.components?.canvas?.duration,
      },
      colorDepth: { ...result?.components?.colorDepth },
      colorGamut: { ...result?.components?.colorGamut },
      contrast: {
        value: result?.components?.contrast?.value
          ? result?.components?.contrast?.value
          : "Not Available",
        duration: result?.components?.contrast?.duration,
      },
      cookiesEnabled: {
        value: result?.components?.cookiesEnabled?.value
          ? result?.components?.cookiesEnabled?.value
          : "Not Available",
        duration: result?.components?.cookiesEnabled?.duration,
        cpuClass: {
          value: result?.components?.cpuClass.value
            ? result?.components?.cpuClass.value
            : "Not Available",
          duration: result?.components?.cpuClass.duration,
        },
        deviceMemory: {
          value: result?.components?.deviceMemory?.value
            ? result?.components?.deviceMemory?.value
            : "Not Available",
          duration: result?.components?.deviceMemory?.duration,
        },
        domBlockers: {
          value: result?.components?.domBlockers?.value
            ? result?.components?.domBlockers?.value
            : "Not Available",
          duration: result?.components?.domBlockers?.duration,
        },
        fontPreferences: {
          value: { ...result?.components?.fontPreferences?.value },
          duration: result?.components?.fontPreferences?.duration,
        },
        fonts: {
          value: reformatArrayToString(result?.components?.fonts?.value),
          duration: result?.components?.fonts?.duration,
        },
        forcedColors: { ...result?.components?.forcedColors },
        hardwareConcurrency: {
          ...result?.components?.hardwareConcurrency,
        },
        hdr: { ...result?.components?.hdr },
        indexedDb: { ...result?.components?.indexedDB },
        invertedColors: {
          value: result?.components?.invertedColors?.value
            ? result?.components?.invertedColors?.value
            : "Not Available",
          duration: result?.components?.invertedColors?.duration,
        },
        languages: {
          value: reformatArrayToString(result?.components?.languages?.value),
          duration: result?.components?.languages?.duration,
        },
        localStorage: { ...result?.components?.localStorage },
        math: {
          value: { ...result?.components?.math?.value },
          duration: result?.components?.math?.duration,
        },
        monochrome: { ...result?.components?.monochrome },
        openDatabase: { ...result?.components?.openDatabase },
        osCPU: {
          value: result?.components?.osCpu?.value
            ? result?.components?.osCpu?.value
            : "Not Available",
          duration: result?.components?.osCpu?.duration,
        },
        pdfViewerEnabled: { ...result?.components?.pdfViewerEnabled },
        platform: { ...result?.components?.platform },
        plugins: {
          value: reformatArrayOfObjectsToString(
            result?.components?.plugins?.value
          ),
          duration: result?.components?.plugins?.duration,
        },
        privateClickMeasurement: {
          value: result?.components?.privateClickMeasurement?.value
            ? result?.components?.privateClickMeasurement?.value
            : "Not Available",
          duration: result?.components?.privateClickMeasurement?.duration,
        },
        reducedMotion: { ...result?.components?.reducedMotion },
        screenFrame: {
          value: reformatArrayToString(result?.components?.screenFrame?.value),
          duration: result?.components?.screenFrame?.duration,
        },
        screenResolution: {
          value: reformatArrayToString(
            result?.components?.screenResolution?.value
          ),
          duration: result?.components?.screenResolution?.duration,
        },
        sessionStorage: { ...result?.components?.sessionStorage },
        timezone: {
          value: result?.components?.timezone?.value
            ? result?.components?.timezone?.value
            : "Not Available",
          duration: result?.components?.timezone?.duration,
        },
        touchSupport: {
          value: { ...result?.components?.touchSupport?.value },
          duration: result?.components?.touchSupport?.duration,
        },
        vendor: { ...result?.components?.vendor },
        vendorFlavors: {
          value: reformatArrayToString(
            result?.components?.vendorFlavors?.value
          ),
          duration: result?.components?.vendorFlavors?.duration,
        },
        webGLBasics: {
          value: { ...result?.components?.webGlBasics?.value },
          duration: result?.components?.webGlBasics?.duration,
        },
        webGLExtensions: {
          value: { ...result?.components?.webGlExtensions?.value },
          duration: result?.components?.webGlExtensions?.duration,
        },
      },
      devicesInfo: {
        ...mediaDevices,
      },
    },
    browser: getBrowserInfo() ? getBrowserInfo() : "Not Available",
    created_at: moment().unix(),
    confidence: {
      score: result?.confidence?.score,
      comment: result?.confidence?.comment,
    },
  };

  addDoc(collection(db, "Users"), data);
}
