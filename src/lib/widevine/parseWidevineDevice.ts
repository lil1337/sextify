
export function parseWidevineDevice(device: Buffer){
    
    if (device.subarray(0, 3).toString() !== "WVD") throw new Error("Invalid WVD magic");
    let version = device[3];
    if (version !== 2) throw new Error(`Unsupported WVD version: ${version}`);



    let type = ["Chrome", "Android"][device[4]-1];
    let securityLevel = device[5];

   
    let pad = device[6] ? 8 : 0;

    let privateKeyLength = device.subarray(pad+7, pad+9).readUInt16BE();
    let privateKeyStart = pad+9; let privateKeyEnd = privateKeyStart + privateKeyLength;
    let privateKey = device.subarray(privateKeyStart, privateKeyEnd);
    
    let clientIdLength = device.subarray(privateKeyEnd, privateKeyEnd+2).readUInt16BE();
    let clientIdStart = privateKeyEnd+2; let clientIdEnd = clientIdStart + clientIdLength;
    let clientId = device.subarray(clientIdStart, clientIdEnd);
   
    return {type, securityLevel, privateKey, clientId};

}