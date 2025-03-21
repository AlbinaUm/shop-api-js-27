import {promises as fs} from 'fs';

const fileName = './test.json';

interface FileContent {
    message: string;
}

const run = async () => {
    try {
        const fileContent = await fs.readFile(fileName);
        const result = JSON.parse(fileContent.toString()) as FileContent;
        console.log(result);
    } catch (e) {
        console.error(e);
    }
};

run().catch(console.error);