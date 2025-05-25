import { SeekTable } from "../types/SeekTable";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import EndpointsBase from "../endpoints/EndpointsBase";
export const getSeekTable = (f: EndpointsBase, fileId: string) => 
    f.getRequest<SeekTable>(`https://seektables.scdn.co/seektable/${fileId}.json`)