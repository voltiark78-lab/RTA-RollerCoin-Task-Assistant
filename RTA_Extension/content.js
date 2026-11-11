(() => {
  if (window.__RTA_SCANNER_INSTALLED__) return;
  window.__RTA_SCANNER_INSTALLED__ = true;
  const clean = value => (value || "").replace(/\s+/g, " ").trim();
  const providerNames = ["CPX research", "BitLabs", "Torox", "Adtowall", "Ayet", "Lootably", "Timewall", "AdGem"];
  const ignored = new Set(["featured surveys", "featured tasks", "all surveys", "all tasks", "task wall", "survey", "task", "start", "play now", "learn more"]);

  function candidates(card, type) {
    const out = [];
    // Survey cards use the image alt text "survey image" as decoration;
    // the actual visible provider label is in .surveys-info-container > p.
    if (type === "survey") {
      for (const node of card.querySelectorAll(".surveys-info-container > p, .surveys-info-container [class*=\"title\"], .surveys-info-container [class*=\"name\"]")) {
        const value = clean(node.innerText || node.textContent);
        if (value) out.push(value);
      }
    }
    for (const selector of ['[class*="title"]','[class*="name"]','h1','h2','h3','h4','a[title]','a','[aria-label]']) {
      for (const node of card.querySelectorAll(selector)) {
        const value = clean(node.getAttribute("title") || node.getAttribute("aria-label") || node.innerText || node.textContent);
        if (value) out.push(value);
      }
    }
    // Deliberately do not use img[alt]: RollerCoin's survey image says only
    // "survey image", which is not the name of the offer.
    return [...new Set(out)];
  }
  function readCards(selector, type) {
    return [...document.querySelectorAll(selector)].map(card => {
      const lines = (card.innerText || "").split("\n").map(clean).filter(Boolean);
      const reward = lines.find(s => /^\d[\d,.]*\s*RLT$/i.test(s)) || "";
      const duration = lines.find(s => /^\d+\s*(min|mins|minutes)$/i.test(s)) || "";
      const provider = lines.find(s => providerNames.some(p => p.toLowerCase() === s.toLowerCase())) || "";
      const titleCandidates = [...candidates(card, type), ...lines].map(clean).filter(value => value && value !== reward && value !== duration && value.toLowerCase() !== provider.toLowerCase() && !ignored.has(value.toLowerCase()) && !/^\d[\d,.]*\s*RLT$/i.test(value) && !/^\d+\s*(min|mins|minutes)$/i.test(value));
      const title = titleCandidates.find(value => value.length >= 2 && value.length <= 90) || (type === "survey" && provider ? `${provider} – Umfrage` : (provider || "Unbekanntes Angebot"));
      return {type, title, provider, duration, reward};
    }).filter(item => item.reward);
  }
  function scan() {
    const surveys = readCards(".surveys-container-item", "survey");
    const tasks = readCards(".offer-tasks-container-item", "task");
    return {source:"rollercoin-taskwall", url:location.href, scannedAt:new Date().toISOString(), counts:{surveys:surveys.length,tasks:tasks.length}, offers:[...surveys,...tasks]};
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "RTA_SCAN") {
      try { sendResponse({ok:true,data:scan()}); }
      catch (error) { sendResponse({ok:false,error:String(error)}); }
    }
    return true;
  });
})();
