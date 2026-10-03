const zlib = require('zlib');
const https = require('https');
const fs = require('fs');

const mermaidScript = `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'fontSize': '24px'}}}%%
erDiagram
    EventTeam {
        ObjectId _id PK
        string teamId UK
        string teamName
        string college
        string branch
        string year
        string event
        number teamSize
        Date appliedAt
        boolean exported
    }
    Leader {
        string name
        string email
        string mobile
        string whatsapp
    }
    Member {
        string name
        string email
    }
    Counter {
        string _id PK
        number seq
    }
    EventTeam ||--|| Leader : "has one (embedded)"
    EventTeam ||--o{ Member : "has up to 7 (embedded)"
`;

const data = Buffer.from(mermaidScript, 'utf8');
const compressed = zlib.deflateSync(data);
const encoded = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

const url = 'https://kroki.io/mermaid/svg/' + encoded;

https.get(url, (res) => {
    let svg = '';
    res.on('data', chunk => svg += chunk);
    res.on('end', () => {
        fs.writeFileSync('c:\\Users\\amang\\Desktop\\CROSSROADS-2026\\ER_diagram.svg', svg, 'utf8');
        console.log('SVG saved successfully.');
    });
}).on('error', (e) => {
    console.error(e);
});
