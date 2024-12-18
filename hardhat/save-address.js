const core = require("@nomicfoundation/ignition-core");
const fs = require('fs');
const path = require('path');

async function main() {
    const list = await core.listDeployments("./ignition/deployments");

    const rawData = fs.readFileSync(path.join(process.cwd(), `/ignition/deployments/${list[0]}/deployed_addresses.json`), 'utf8');
    const jsonData = JSON.parse(rawData);

    const addresses = { Attestor: jsonData["Attestor#Attestor"] };

    const sharedDir = "/shared/data";

    if (fs.existsSync(sharedDir)) {
        fs.writeFileSync(
            path.join(sharedDir, 'addresses.json'), 
            JSON.stringify(addresses, null, 2)
        );
    }

}


main().catch(console.error);