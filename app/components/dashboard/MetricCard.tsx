type MetricCardProps = {
  label: string;
  value: number;
  valueClassName: string;
};

export function MetricCard({ label, value, valueClassName }: MetricCardProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
      <div className={`text-3xl font-bold ${valueClassName}`}>{value}</div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">{label}</div>
    </div>
  );
}
