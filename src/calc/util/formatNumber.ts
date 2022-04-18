const formatOptions: any = {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
};

const fmt = new Intl.NumberFormat('de-DE', formatOptions);

export default function formatNumber(number: number): string {
  return fmt.format(number);
}
