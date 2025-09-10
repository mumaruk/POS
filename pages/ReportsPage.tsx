
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sale } from '../types';

const ReportsPage: React.FC = () => {
  const { sales, products } = useData();

  const totalRevenue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);
  const totalSales = sales.length;

  const salesByDay = useMemo(() => {
    const data: { [key: string]: number } = {};
    sales.forEach(sale => {
      const day = new Date(sale.date).toLocaleDateString(undefined, { weekday: 'short' });
      if (!data[day]) data[day] = 0;
      data[day] += sale.total;
    });
    return Object.entries(data).map(([name, value]) => ({ name, sales: value }));
  }, [sales]);

  const topSellingProducts = useMemo(() => {
    const productSales: { [key: string]: number } = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.name]) productSales[item.name] = 0;
        productSales[item.name] += item.quantity;
      });
    });
    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales]);
  
  const categoryDistribution = useMemo(() => {
     const categoryCount: { [key: string]: number } = {};
      sales.forEach(sale => {
          sale.items.forEach(item => {
              if(!categoryCount[item.category]) categoryCount[item.category] = 0;
              categoryCount[item.category] += item.quantity;
          });
      });
      return Object.entries(categoryCount).map(([name, value]) => ({name, value}));
  }, [sales]);

  const COLORS = ['#6A3FF8', '#00F5A0', '#F7049A', '#3498db', '#f1c40f'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-bolt-gray mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-bolt-green">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card>
          <h3 className="text-bolt-gray mb-2">Total Sales</h3>
          <p className="text-4xl font-bold text-bolt-accent">{totalSales}</p>
        </Card>
        <Card>
          <h3 className="text-bolt-gray mb-2">Avg. Sale Value</h3>
          <p className="text-4xl font-bold text-bolt-pink">${(totalRevenue / totalSales || 0).toFixed(2)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1D23" />
              <XAxis dataKey="name" stroke="#E0E0E0" />
              <YAxis stroke="#E0E0E0" />
              <Tooltip contentStyle={{ backgroundColor: '#13151A', border: '1px solid #1A1D23' }} />
              <Legend />
              <Bar dataKey="quantity" fill="#6A3FF8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
         <Card>
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
               <Tooltip contentStyle={{ backgroundColor: '#13151A', border: '1px solid #1A1D23' }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
