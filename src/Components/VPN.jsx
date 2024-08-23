import React from "react";

const VPN = ({ VpnInfo }) => {
  return (
    <div>
      {VpnInfo ? (
        <div>
          <strong>VPN</strong>
          <p>
            {VpnInfo.security.vpn
              ? "The user is using VPN"
              : "The user is not using VPN"}
          </p>
        </div>
      ) : (
        <p>Loading VPN info...</p>
      )}
    </div>
  );
};

export default VPN;
