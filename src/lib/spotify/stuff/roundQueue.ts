import { Readable } from "node:stream";



export function balance<T>(arr: T[],n: number,shaking?:boolean):T[][]{
    let roll = 0;
    let result:T[][] = Array(n);
    for(let i=0;i<arr.length;i++){

        let o:any = arr[i];
        if (!result[roll])result[roll]=[];
        result[roll].push(o);
        roll++;
        if (roll>=result.length) roll = 0; 
    }
    if (shaking) for(let i = 0;i<result.length;i++){
        if (i%2==0&&result[i]) result[i]=result[i].reverse();
    }
    
    
    return result.filter(e=>e.length);
}

type QuickMapQueueResolver<To, From> = ((value: From, index: number, groupIndex: number, arr: From[], whole: From[][]) => Promise<To>);

export function quickMapQueue<To, From>(
    put: From[], 
    get: QuickMapQueueResolver<To, From>,
    {concurrency = 5, autostart = true}: {concurrency?: number, autostart?: true | false | undefined} = {}
): {out: Promise<To>[], start: () => Promise<void>}{
    let promisesPerChunkExecutors: Array<{ resolve: (r: To) => void, reject: (e: Error) => void }> = [];
    let promisesPerChunk = put.map(() => new Promise<To>((resolve, reject) => promisesPerChunkExecutors.push({ resolve, reject })));
    
    //console.log("start", autostart);
    
    const start = () => {
        balance(put, concurrency).map(async (g, groupIndex, whole) => {
        for (let [localIndex, value] of g.entries()) {

            let globalIndex = (localIndex * concurrency + (groupIndex+1)) - 1;

            //console.log(globalIndex); 

            await get(value, globalIndex, groupIndex, put, whole)
            .then(r => promisesPerChunkExecutors[globalIndex].resolve(r))
            .catch(e => promisesPerChunkExecutors[globalIndex].reject(e));
        }
    });}


    if (autostart) start();
    return {
        out: promisesPerChunk, start: autostart ? undefined : start as any
    };
    
     
}

export function streamQuickMapQueue(
    {out, start}: {
        out: Promise<Buffer>[], 
        start: () => Promise<void>
    }
){
    let started = false;


    const stream = new Readable({read: () => {
        if (started) return;
        started = true;
        start();
    }});
    const wait = (async () => {
        for(let p of out) await p.then(r=>stream.push(r));
        stream.push(null);
    })();
    
    return {stream, wait};
}
