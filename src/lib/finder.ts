export interface FinderAnswers { item: string; fragile: string; purpose: string; printing: string; knowsDimensions: string }

export function recommendSlugs(answers: FinderAnswers): string[] {
  const picks: string[] = [];
  if (answers.purpose === 'Shipping') picks.push('shipping-cartons');
  if (answers.purpose === 'Retail display') picks.push('product-boxes');
  if (answers.purpose === 'Storage') picks.push('corrugated-boxes');
  if (answers.purpose === 'E-commerce delivery') picks.push('ecommerce-boxes');
  if (answers.purpose === 'Industrial handling') picks.push('industrial-cartons');
  if (answers.printing === 'Yes') picks.push('printed-cartons');
  if (answers.fragile === 'Yes' && !picks.includes('shipping-cartons')) picks.push('shipping-cartons');
  if (!picks.length) picks.push('corrugated-boxes', 'product-boxes');
  return Array.from(new Set(picks)).slice(0, 3);
}
