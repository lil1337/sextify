export function netscapeCookiesToString(cookieJar: string) {
    let cookies: { name: string, value: string, domain: string, path: string, flag: string, expires: number, secure: boolean }[] = [];
    let lines = cookieJar.split("\n");

    for (const element of lines) {
        let line = element.trim();

        if (line.startsWith("#") || line === "") {
            continue;
        }

        let parts = line.split("\t");
        let domain = parts[0],
            flag = parts[1],
            path = parts[2],
            secure = parts[3],
            expires = parts[4],
            name = parts[5],
            value = parts[6];

        cookies.push({
            name: name,
            value: value,
            domain: domain,
            path: path,
            flag: flag,
            expires: Number(expires),
            secure: secure === "TRUE",
        });
    }

    const cookieStrings = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
    return cookieStrings.join('; ');
}