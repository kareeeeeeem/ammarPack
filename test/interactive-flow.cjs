const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadTs(file, imports = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', js)(module, module.exports, name => {
    if (name in imports) return imports[name];
    throw new Error(`Unexpected import: ${name}`);
  });
  return module.exports;
}

const { emptyQuote, validateQuote, quoteMessage } = loadTs('src/lib/quote.ts');
const { recommendSlugs } = loadTs('src/lib/finder.ts');
const { whatsappUrl, inquiryMessage } = loadTs('src/lib/whatsapp.ts', { '../../site.config': { __esModule: true, default: { whatsapp: '201155053159' } } });

const quote = { ...emptyQuote, category: 'Shipping Cartons', intendedUse: 'Shipping', length: '40', width: '30', height: '20', quantity: '1000', printing: 'One-color printing', colors: 'Orange', city: 'Cairo', notes: 'Please advise on options.' };
for (const step of [0, 1, 2]) assert.deepEqual(validateQuote(quote, step), {});
assert.match(quoteMessage(quote), /Dimensions: 40 × 30 × 20 cm/);
assert.match(quoteMessage(quote), /Quantity: 1000 pieces/);
assert.match(quoteMessage(quote), /Delivery city: Cairo/);
assert.equal(validateQuote({ ...quote, length: '', width: '30' }, 1).dimensions, 'Enter all three dimensions, or leave all three blank.');
assert.ok(validateQuote({ ...quote, quantity: '-1' }, 1).quantity);
assert.ok(validateQuote({ ...quote, city: '' }, 2).city);
const url = new URL(whatsappUrl(quoteMessage(quote)));
assert.equal(url.hostname, 'wa.me');
assert.equal(url.pathname, '/201155053159');
assert.equal(url.searchParams.get('text'), quoteMessage(quote));
assert.match(inquiryMessage('product', 'Shipping Cartons'), /Shipping Cartons/);
assert.ok(recommendSlugs({ item: 'glass jars', fragile: 'Yes', purpose: 'Retail display', printing: 'Yes', knowsDimensions: 'No' }).includes('printed-cartons'));
console.log('Quote validation, structured messages, WhatsApp URL, and product recommendations passed.');
