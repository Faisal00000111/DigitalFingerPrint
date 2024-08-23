import { Box, Card, CardContent } from "@mui/material";
import {
  checkMediaDevices,
  saveDb,
  getIpInfo,
  fetchVpnInfo,
} from "../constants/constants";
import { detectIncognito } from "detectincognitojs";
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
  const [VpnInfo, setVpnInfo] = useState(null);

  async function getUserHash() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    setFingerPrint(result);
    setUserComponents(result?.components);
    const visitorId = result.visitorId;
    setUserHash(visitorId);

    const ipInfoPromise = getIpInfo();
    const mediaDevicesPromise = checkMediaDevices();
    const vpnInfoPromise = ipInfoPromise.then((ipInfo) =>
      fetchVpnInfo(ipInfo.ip)
    );
    const IncognitoPromise = detectIncognito();
    const [ipInfo, mediaDevices, vpninfo, Incognito] = await Promise.all([
      ipInfoPromise,
      mediaDevicesPromise,
      vpnInfoPromise,
      IncognitoPromise,
    ]);

    setIpInfoCurrent(ipInfo);
    setVpnInfo(vpninfo);

    return { ipInfo, vpninfo, result, mediaDevices, Incognito, visitorId };
  }

  useEffect(() => {
    let didRun = true;

    getUserHash().then((data) => {
      if (didRun) {
        saveDb(
          data.ipInfo,
          data.vpninfo,
          data.result,
          data.mediaDevices,
          data.Incognito,
          data.visitorId
        );
      }
    });

    return () => {
      didRun = false;
    };
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
              <VPN VpnInfo={VpnInfo} />
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
