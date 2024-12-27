interface StatCardProps {
    title: string;
    value: number;
    className?: string;
  }
  
  export function StatCard({ title, value, className }: StatCardProps) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
        <h3 className="text-sm text-gray-600 font-medium mb-4">{title}</h3>
        <p className="text-4xl font-bold text-purple-600">{value}</p>
      </div>
    );
  }
  
  