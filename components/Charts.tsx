import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface ChartProps {
  data: any[];
  dataKeyX: string;
  dataKeysY: { key: string; color: string; name?: string }[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-300 text-sm font-semibold mb-2">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }} className="text-sm">
            {p.name}: <span className="font-mono text-white">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SimpleLineChart: React.FC<ChartProps> = ({ data, dataKeyX, dataKeysY, height = 300 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis dataKey={dataKeyX} stroke="#94a3b8" fontSize={12} />
      <YAxis stroke="#94a3b8" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {dataKeysY.map((k) => (
        <Line
          key={k.key}
          type="monotone"
          dataKey={k.key}
          name={k.name || k.key}
          stroke={k.color}
          strokeWidth={3}
          dot={{ r: 4, fill: k.color, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export const StackedAreaChart: React.FC<ChartProps> = ({ data, dataKeyX, dataKeysY, height = 300 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis dataKey={dataKeyX} stroke="#94a3b8" fontSize={12} />
      <YAxis stroke="#94a3b8" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {dataKeysY.map((k) => (
        <Area
          key={k.key}
          type="monotone"
          dataKey={k.key}
          name={k.name || k.key}
          stackId="1"
          stroke={k.color}
          fill={k.color}
          fillOpacity={0.6}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export const SimpleBarChart: React.FC<ChartProps> = ({ data, dataKeyX, dataKeysY, height = 300 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis dataKey={dataKeyX} stroke="#94a3b8" fontSize={12} />
      <YAxis stroke="#94a3b8" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {dataKeysY.map((k) => (
        <Bar key={k.key} dataKey={k.key} name={k.name || k.key} fill={k.color} radius={[4, 4, 0, 0]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);
