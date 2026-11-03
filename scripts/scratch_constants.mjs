async function extractConstants() {
  const chunkRes = await fetch('https://belgradearbor.rs/_next/static/chunks/0rr1c7aibu-sx.js?dpl=dpl_9PbnYLnqXqZkh1h7HWCqGjn4Y78y');
  const text = await chunkRes.text();
  
  const startIdx = text.indexOf('function er()');
  if (startIdx !== -1) {
    console.log('CONSTANTS BEFORE FUNCTION:\n');
    console.log(text.slice(startIdx - 1500, startIdx));
  }
}
extractConstants();

