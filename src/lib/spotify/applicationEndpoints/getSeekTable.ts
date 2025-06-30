import { SeekTable } from "../types/SeekTable";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import EndpointsBase from "../endpoints/EndpointsBase";
export const getSeekTable = (f: EndpointsBase, fileId: string) => 
    fetch(`https://seektables.scdn.co/seektable/${fileId}.json`).then(maybeThrow).then(r => r.json()).then(orThrow).then(r=>r as SeekTable);