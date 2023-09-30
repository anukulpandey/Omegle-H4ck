const originalRTCPeerConnection = window.RTCPeerConnection || window.oRTCPeerConnection;
let apiKey = '<api_key>';

const getLocation = async (ip) => {
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
    const data = await response.json();

    const output = `
      ---------------------
      Country: ${data.country_name}
      State: ${data.state_prov}
      City: ${data.city}
      District: ${data.district}
      Lat / Long: (${data.latitude}, ${data.longitude})
      ---------------------
    `;
    
    console.log(output);
  } catch (error) {
    console.error('Error fetching location:', error);
  }
};

window.RTCPeerConnection = function (...args) {
  const pc = new (window.RTCPeerConnection || originalRTCPeerConnection)(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");
    const ip = fields[4];

    if (fields[7] === "srflx") {
      getLocation(ip);
    }

    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };

  return pc;
};

// Set the innerHTML of elements (if needed)
// document.querySelectorAll('.logbox').forEach((element) => {
//   element.innerHTML = 'Updated content';
// });
