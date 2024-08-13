import { Box, Card, CardContent } from "@mui/material";
import {
  checkMediaDevices,
  db,
  getBrowserInfo,
  getIpInfo,
  reformatArrayOfObjectsToString,
  reformatArrayToString,
} from "../constants/constants";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import BasicInfo from "./BasicInfo";
import DevicesList from "./DevicesList";
import LocationInfo from "./LocationInfo";
import Plugins from "./Plugins";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import ScreenInfo from "./ScreenInfo";
import WebGLBasics from "./WebGLBasics";
import WebGLExtensions from "./WebGLExtensions";
import moment from "moment";
import Navbar from "./Navbar";
import VPN from "./VPN";
import IncognitoMode from "./IncognitoMode";
import Cookies from "./Cookies";

const Feed = () => {
  const [userHash, setUserHash] = useState(null);
  const [ipInfoCurrent, setIpInfoCurrent] = useState(null);
  const [fingerPrint, setFingerPrint] = useState(null);
  const [userComponents, setUserComponents] = useState(null);
  useEffect(() => {
    async function getUserHash() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerPrint(result);
      setUserComponents(result?.components);
      const visitorId = result.visitorId;
      setUserHash(visitorId);

      const ipInfo = await getIpInfo();

      setIpInfoCurrent(ipInfo);

      const mediaDevices = await checkMediaDevices();
      const data = {
        location: { ...ipInfo },
        visitorId: visitorId,
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
            hardwareConcurrency: { ...result?.components?.hardwareConcurrency },
            hdr: { ...result?.components?.hdr },
            indexedDb: { ...result?.components?.indexedDB },
            invertedColors: {
              value: result?.components?.invertedColors?.value
                ? result?.components?.invertedColors?.value
                : "Not Available",
              duration: result?.components?.invertedColors?.duration,
            },
            languages: {
              value: reformatArrayToString(
                result?.components?.languages?.value
              ),
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
              value: reformatArrayToString(
                result?.components?.screenFrame?.value
              ),
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
      
      await addDoc(collection(db, "Users"), data);
    }

    getUserHash().then(() => {
      getBrowserInfo();
    });
  }, []);
  return (
    <Box>
      <Navbar fpId={fingerPrint?.visitorId} />
      <Box
        flex={4}
        p={4}
        paddingRight={50}
        paddingLeft={50}
        sx={{
          backgroundColor: "skyblue",
        }}
      >
        <Box p={1}>
          <Card>
            <CardContent>
              <BasicInfo
                userComponents={userComponents}
                fingerPrint={fingerPrint}
              />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <VPN ipInfo={ipInfoCurrent}/>
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <IncognitoMode />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <Cookies />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <DevicesList />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <LocationInfo ipInfoCurrent={ipInfoCurrent} />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <Plugins userComponents={userComponents} />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <ScreenInfo userComponents={userComponents} />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <WebGLBasics userComponents={userComponents} />
            </CardContent>
          </Card>
        </Box>
        <Box p={1}>
          <Card>
            <CardContent>
              <WebGLExtensions userComponents={userComponents} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Feed;
