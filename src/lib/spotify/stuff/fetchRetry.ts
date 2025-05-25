export async function fetchRetry(url: string, init?: RequestInit & {
    maxRetries?: number,
    retryDelay?: number, 
    onFailure?: (e: Error) => void | "throw" | Promise<void | "throw">
}){
    let retries = 0;
    if (!init) init = {};
    if (!init.maxRetries) init.maxRetries = 10;
    if (!init.retryDelay) init.retryDelay = 150;
    while (true){
        try{
            const result = await fetch(url, init);
            return result
        }
        catch (e){
            console.log(`[fetch] ${url} retries: ${retries} / ${init.maxRetries}`, e)
            if (init.onFailure && (await init.onFailure(e)) == "throw") throw e;
            if (retries >= init.maxRetries) throw e;
            await new Promise(r => setTimeout(r, init.retryDelay ?? 500));

            retries ++;
        }
    }
}