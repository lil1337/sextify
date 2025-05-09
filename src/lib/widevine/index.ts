import { ContentDecryptionModule, KeyContainer, SERVICE_CERTIFICATE_CHALLENGE } from "./license.js";
import * as protocol from "./proto/widevine.proto.js";


export const LicenseType = {
    1: "STREAMING",
    2: "OFFLINE",
    3: "AUTOMATIC"
}
export { SERVICE_CERTIFICATE_CHALLENGE };
export type { ContentDecryptionModule, KeyContainer };

export { parseWidevineDevice } from "./parseWidevineDevice";
export { defaultWidevineDevice } from "./defaultWidevineDevice";

export { Session as WidevineSession } from "./license";
