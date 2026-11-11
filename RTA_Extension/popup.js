const scanButton=document.getElementById("scan"), exportButton=document.getElementById("export"), sendButton=document.getElementById("send"), statusEl=document.getElementById("status"), summaryEl=document.getElementById("summary"), offersEl=document.getElementById("offers");
let latest=null;
const clean=v=>(v||"").replace(/\s+/g," ").trim();
function rewardNumber(v){const m=String(v||"").match(/[\d,.]+/);return m?Number(m[0].replace(",",".")):0;}
function durationMinutes(v){const m=String(v||"").match(/(\d+)/);return m?Number(m[1]):0;}
function offerKey(x){return [x.type,x.provider,x.title,x.reward].map(v=>clean(v).toLowerCase()).join("|");}
scanButton.addEventListener("click",async()=>{
  statusEl.textContent="Taskwall wird gelesen …"; offersEl.replaceChildren(); summaryEl.replaceChildren(); latest=null; exportButton.disabled=true; sendButton.disabled=true;
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab?.id||!tab.url?.startsWith("https://rollercoin.com/taskwall/")){statusEl.textContent="Bitte öffne zuerst rollercoin.com/taskwall/ in diesem Tab.";return;}
    const response=await chrome.tabs.sendMessage(tab.id,{type:"RTA_SCAN"}); if(!response?.ok)throw new Error(response?.error||"Scan fehlgeschlagen"); latest=response.data;
    const stored=await chrome.storage.local.get({seenOffers:{}}), seen=stored.seenOffers||{}; let newCount=0;
    latest.offers=latest.offers.map(item=>{const key=offerKey(item),isNew=!seen[key];if(isNew)newCount++;seen[key]=Date.now();const mins=durationMinutes(item.duration),reward=rewardNumber(item.reward);return {...item,isNew,rewardValue:reward,rewardPerMinute:mins?reward/mins:null};});
    await chrome.storage.local.set({seenOffers:seen}); latest.offers.sort((a,b)=>b.rewardValue-a.rewardValue);
    statusEl.textContent=`Scan abgeschlossen · ${new Date(latest.scannedAt).toLocaleTimeString("de-DE")} · ${newCount} neu`;
    addPill(`${latest.counts.surveys} Umfragen`);addPill(`${latest.counts.tasks} Tasks`);addPill(`${newCount} neu`);
    latest.offers.forEach(renderOffer);exportButton.disabled=latest.offers.length===0;sendButton.disabled=latest.offers.length===0;
    if(!latest.offers.length)statusEl.textContent+=" · Keine Karten gefunden. Prüfe, ob Angebote geladen sind.";
  }catch(e){statusEl.textContent="Fehler: "+e.message+" – lade die Taskwall neu und versuche es erneut.";}
});
function addPill(text){const el=document.createElement("div");el.className="pill";el.textContent=text;summaryEl.append(el);}
function renderOffer(item){
  const card=document.createElement("div");card.className="offer";const top=document.createElement("div");top.className="top";
  const name=document.createElement("div");name.className="name";name.textContent=item.title||"Unbekanntes Angebot";
  const reward=document.createElement("div");reward.className="reward";reward.textContent=item.reward;top.append(name,reward);
  const tag=document.createElement("div");tag.className="tag";tag.textContent=(item.type==="survey"?"Umfrage":"Task")+(item.isNew?" · NEU":" · bekannt");
  const meta=document.createElement("div");meta.className="meta";const rate=item.rewardPerMinute!==null?`${item.rewardPerMinute.toFixed(2)} RLT/min`:"Zeit nicht angegeben";
  meta.textContent=[item.provider||"Anbieter unbekannt",item.duration||rate].filter(Boolean).join(" · ");if(item.duration&&item.rewardPerMinute!==null)meta.textContent+=` · ${rate}`;
  card.append(tag,top,meta);offersEl.append(card);
}
exportButton.addEventListener("click",()=>{if(!latest)return;const blob=new Blob([JSON.stringify(latest,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob);chrome.downloads.download({url,filename:`RTA/rollercoin-scan-${new Date().toISOString().replace(/[:.]/g,"-")}.json`,saveAs:true},()=>setTimeout(()=>URL.revokeObjectURL(url),10000));});

sendButton.addEventListener("click",async()=>{
  if(!latest)return;
  sendButton.disabled=true;statusEl.textContent="Sende Scan an die lokale RTA-TestApp …";
  try{
    const r=await fetch("http://127.0.0.1:8765/api/scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(latest)});
    const result=await r.json();
    if(!r.ok||!result.ok)throw new Error(result.error||"Lokaler Dienst nicht erreichbar");
    statusEl.textContent=`Erfolgreich an RTA TestApp gesendet · ${result.count} Angebote`;
  }catch(e){
    statusEl.textContent="Verbindung fehlgeschlagen. Starte zuerst RTA_Starten.bat und öffne die TestApp über http://127.0.0.1:8765. ("+e.message+")";
  }finally{sendButton.disabled=false;}
});
