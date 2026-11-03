const fs = require('fs');

function inspectFormsAndButtons(fileName) {
  const content = fs.readFileSync(fileName, 'utf8');
  console.log('=== ' + fileName + ' ===');
  
  // Find all buttons
  const buttonRegex = /<button[\s\S]*?<\/button>/gi;
  let match;
  let btnIndex = 0;
  while ((match = buttonRegex.exec(content)) !== null) {
    const btn = match[0];
    const text = btn.replace(/<[^>]+>/g, '').trim();
    const hasAriaLabel = /aria-label=/i.test(btn);
    const hasAriaLabelledBy = /aria-labelledby=/i.test(btn);
    if (!text && !hasAriaLabel && !hasAriaLabelledBy) {
      console.log('Unlabeled Button #' + btnIndex + ': ' + btn.slice(0, 150));
    }
    btnIndex++;
  }

  // Find all inputs
  const inputRegex = /<input[^>]*>/gi;
  let inpIndex = 0;
  while ((match = inputRegex.exec(content)) !== null) {
    const inp = match[0];
    if (/type=["']hidden["']/i.test(inp)) continue;
    const idMatch = inp.match(/id=["']([^"']+)["']/i);
    const hasAriaLabel = /aria-label=/i.test(inp);
    const hasAriaLabelledBy = /aria-labelledby=/i.test(inp);
    const id = idMatch ? idMatch[1] : null;
    let hasLabel = false;
    if (id) {
      const labelRegex = new RegExp('<label[^>]*for=["\']' + id + '["\']', 'i');
      if (labelRegex.test(content)) hasLabel = true;
    }
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      console.log('Unlabeled Input #' + inpIndex + ': ' + inp.slice(0, 150));
    }
    inpIndex++;
  }
}

['index.html', 'ventes.html', 'retail-spaces.html', 'business.html'].forEach(inspectFormsAndButtons);
