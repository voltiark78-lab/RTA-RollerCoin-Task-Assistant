// RTA Local Bridge 0.2 — loopback only, no external network
const http = require('http');
const fs = require('fs');
const path = require('path');
const HOST = '127.0.0.1';
const PORT = 8765;
const ROOT = __dirname;
const DATA = path.join(ROOT, 'latest-scan.json');
const HISTORY = path.join(ROOT, 'scan-history.json');

function send(res, code, body, type='application/json; charset=utf-8') {
  res.writeHead(code, {'Content-Type':type,'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'});
  res.end(body);
}
const server = http.createServer((req,res)=>{
  if(req.method==='OPTIONS') return send(res,204,'');
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  if(url.pathname==='/api/scan' && req.method==='POST'){
    let raw='';
    req.on('data',chunk=>{raw+=chunk;if(raw.length>2_000_000){send(res,413,JSON.stringify({ok:false,error:'Payload zu groß'}));req.destroy();}});
    req.on('end',()=>{
      try{
        const data=JSON.parse(raw);
        if(!data || !Array.isArray(data.offers)) throw new Error('Ungültiger Scan: offers-Array fehlt');
        fs.writeFileSync(DATA,JSON.stringify(data,null,2),'utf8');
        const hist=fs.existsSync(HISTORY)?JSON.parse(fs.readFileSync(HISTORY,'utf8')):[]; hist.push({scannedAt:data.scannedAt||new Date().toISOString(),count:data.offers.length,offers:data.offers}); if(hist.length>100)hist.shift(); fs.writeFileSync(HISTORY,JSON.stringify(hist,null,2),'utf8');
        send(res,200,JSON.stringify({ok:true,count:data.offers.length,scannedAt:data.scannedAt}));
        console.log(`[RTA] Scan empfangen: ${data.offers.length} Angebote`);
      }catch(e){send(res,400,JSON.stringify({ok:false,error:e.message}));}
    });
    return;
  }
  if(url.pathname==='/api/history' && req.method==='GET'){ try{return send(res,200,fs.existsSync(HISTORY)?fs.readFileSync(HISTORY,'utf8'):'[]');}catch(e){return send(res,500,JSON.stringify({ok:false,error:e.message}));} }
  if(url.pathname==='/api/latest' && req.method==='GET'){
    try{return send(res,200,fs.existsSync(DATA)?fs.readFileSync(DATA,'utf8'):JSON.stringify({offers:[],scannedAt:null}));}
    catch(e){return send(res,500,JSON.stringify({ok:false,error:e.message}));}
  }
  if((url.pathname==='/' || url.pathname==='/index.html') && req.method==='GET'){
    return send(res,200,fs.readFileSync(path.join(ROOT,'..','RTA_TestApp','index.html'),'utf8'),'text/html; charset=utf-8');
  }
  if(url.pathname==='/health') return send(res,200,JSON.stringify({ok:true,service:'RTA Local Bridge',port:PORT}));
  send(res,404,JSON.stringify({ok:false,error:'Not found'}));
});
server.listen(PORT,HOST,()=>console.log(`RTA läuft lokal: http://${HOST}:${PORT}\nDieses Fenster geöffnet lassen. Mit Strg+C beenden.`));
server.on('error',e=>{console.error('RTA Local Bridge konnte nicht starten:',e.message);process.exit(1);});
