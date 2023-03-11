import fs from 'fs'
import crypto from 'crypto'

function changeEnvVariable(key) {
    const randomBytes = crypto.randomBytes(64);
    const secret = randomBytes.toString("hex");

    let data = fs.readFileSync(".env", "utf8");

    let lines = data.split("\n");
    let updatedLines = lines.map((line) => {
        let parts = line.split(/\s*=\s*/);
        if (parts[0] === key) {
            return `${key} = "${secret}"`;
        } else {
            return line;
        }
    });

    fs.writeFileSync(".env", updatedLines.join("\n"), "utf8");
}

changeEnvVariable("ACCESS_TOKEN_SECRET");
changeEnvVariable("REFRESH_TOKEN_SECRET");
console.log('\x1b[32m%s\x1b[0m', "Token geneated");