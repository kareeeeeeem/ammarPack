export interface QuoteData {
  category: string;
  boxType: string;
  intendedUse: string;
  length: string;
  width: string;
  height: string;
  quantity: string;
  printing: string;
  colors: string;
  material: string;
  city: string;
  notes: string;
}

export const emptyQuote: QuoteData = {
  category: '', boxType: 'Not sure', intendedUse: '', length: '', width: '', height: '',
  quantity: '', printing: 'Not sure', colors: '', material: 'Not sure', city: '', notes: '',
};

export function validateQuote(data: QuoteData, step: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (!data.category) errors.category = 'Choose a packaging category.';
    if (!data.intendedUse) errors.intendedUse = 'Choose the intended use.';
  }
  if (step === 1) {
    const dimensions = [data.length, data.width, data.height];
    if (dimensions.some(Boolean) && !dimensions.every(Boolean)) errors.dimensions = 'Enter all three dimensions, or leave all three blank.';
    if (dimensions.every(Boolean) && dimensions.some(value => !Number.isFinite(Number(value)) || Number(value) <= 0 || Number(value) > 10000)) errors.dimensions = 'Dimensions must be positive numbers in cm.';
    if (data.quantity && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0)) errors.quantity = 'Quantity must be a positive whole number.';
  }
  if (step === 2 && !data.city.trim()) errors.city = 'Enter a delivery city, or type “Not sure”.';
  return errors;
}

export function quoteMessage(data: QuoteData): string {
  const value = (text: string) => text.trim() || 'Not sure';
  const dimensions = data.length && data.width && data.height
    ? `${data.length} × ${data.width} × ${data.height} cm (L × W × H)` : 'Not sure';
  return [
    'Hello Ammar Pack,', '', 'I would like to request a quotation.', '',
    `Packaging category: ${value(data.category)}`,
    `Box type: ${value(data.boxType)}`,
    `Intended use: ${value(data.intendedUse)}`,
    `Dimensions: ${dimensions}`,
    `Quantity: ${data.quantity.trim() ? `${data.quantity.trim()} pieces` : 'Not sure'}`,
    `Custom printing: ${value(data.printing)}`,
    `Printing colors: ${value(data.colors)}`,
    `Material preference: ${value(data.material)}`,
    `Delivery city: ${value(data.city)}`,
    `Additional requirements: ${value(data.notes)}`,
    '', 'Please advise on available options, lead time, and any minimum order requirements.', '', 'Thank you.',
  ].join('\n');
}
