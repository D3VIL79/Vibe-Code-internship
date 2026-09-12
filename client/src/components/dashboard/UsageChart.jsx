import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UsageChart = () => {
  const data = [
    { name: 'Mon', tokens: 1200 },
    { name: 'Tue', tokens: 3000 },
    { name: 'Wed', tokens: 800 },
    { name: 'Thu', tokens: 4500 },
    { name: 'Fri', tokens: 2100 },
    { name: 'Sat', tokens: 400 },
    { name: 'Sun', tokens: 0 },
  ];

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="tokens" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
