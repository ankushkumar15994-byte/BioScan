export function Stats() {
  const stats = [
    { value: "50,000+", label: "Plants Scanned" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "200+", label: "Disease Types" },
    { value: "24/7", label: "Availability" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
