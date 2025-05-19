'use client';

import { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = ({ data }) => {
  const [chartView, setChartView] = useState('activity'); // 'activity', 'users', 'chess', 'todo'
  
  if (!data) {
    return <div>No data available</div>;
  }
  
  // Process data for charts
  const processChartData = () => {
    // Activity by day chart
    const activityLabels = data.loginsByDay.map(item => item._id);
    
    const activityData = {
      labels: activityLabels,
      datasets: [
        {
          label: 'Logins',
          data: data.loginsByDay.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Chess Games',
          data: data.chessGamesByDay.map(item => {
            const matchingDay = activityLabels.findIndex(day => day === item._id);
            return matchingDay >= 0 ? item.count : 0;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
    
    // New users by day
    const newUsersData = {
      labels: data.newUsersByDay.map(item => item._id),
      datasets: [
        {
          label: 'New Users',
          data: data.newUsersByDay.map(item => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
    
    // Todo activity
    const todoTypes = ['todo_create', 'todo_complete', 'todo_delete'];
    const todoLabels = [...new Set(data.todoActivityByDay.map(item => item._id.date))];
    
    const todoData = {
      labels: todoLabels,
      datasets: todoTypes.map((type, index) => {
        const colors = [
          { bg: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
          { bg: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
          { bg: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' }
        ];
        
        return {
          label: type.replace('todo_', '').capitalize(),
          data: todoLabels.map(date => {
            const matchingItem = data.todoActivityByDay.find(
              item => item._id.date === date && item._id.action === type
            );
            return matchingItem ? matchingItem.count : 0;
          }),
          backgroundColor: colors[index].bg,
          borderColor: colors[index].border,
          borderWidth: 1
        };
      })
    };
    
    // Most active users
    const activeUsersData = {
      labels: data.mostActiveUsers.map(user => user.username),
      datasets: [
        {
          label: 'Activity Count',
          data: data.mostActiveUsers.map(user => user.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    return {
      activityData,
      newUsersData,
      todoData,
      activeUsersData
    };
  };
  
  const chartData = processChartData();
  
  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activity by Day',
      },
    },
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'New Users by Day',
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Most Active Users',
      },
    },
  };
  
  const todoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Todo Activity by Day',
      },
    },
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500">Active Sessions</h3>
          <p className="text-3xl font-bold mt-2">{data.activeSessions}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500">Chess Games Today</h3>
          <p className="text-3xl font-bold mt-2">
            {data.chessGamesByDay.find(day => 
              day._id === new Date().toISOString().split('T')[0]
            )?.count || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500">New Users Today</h3>
          <p className="text-3xl font-bold mt-2">
            {data.newUsersByDay.find(day => 
              day._id === new Date().toISOString().split('T')[0]
            )?.count || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500">Todo Items Created</h3>
          <p className="text-3xl font-bold mt-2">
            {data.todoActivityByDay.filter(item => 
              item._id.action === 'todo_create'
            ).reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
      </div>
      
      {/* Chart View Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-4 flex">
          <button 
            className={`py-3 px-4 ${chartView === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setChartView('activity')}
          >
            Activity
          </button>
          <button 
            className={`py-3 px-4 ${chartView === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setChartView('users')}
          >
            Users
          </button>
          <button 
            className={`py-3 px-4 ${chartView === 'chess' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setChartView('chess')}
          >
            Chess Games
          </button>
          <button 
            className={`py-3 px-4 ${chartView === 'todo' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setChartView('todo')}
          >
            Todo Activity
          </button>
        </div>
        
        <div className="p-6 h-96">
          {chartView === 'activity' && (
            <Bar data={chartData.activityData} options={barOptions} />
          )}
          
          {chartView === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div>
                <Line data={chartData.newUsersData} options={lineOptions} />
              </div>
              <div>
                <Pie data={chartData.activeUsersData} options={pieOptions} />
              </div>
            </div>
          )}
          
          {chartView === 'chess' && (
            <Bar 
              data={{
                labels: chartData.activityData.labels,
                datasets: [chartData.activityData.datasets[1]]
              }} 
              options={{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  title: {
                    display: true,
                    text: 'Chess Games by Day'
                  }
                }
              }} 
            />
          )}
          
          {chartView === 'todo' && (
            <Bar data={chartData.todoData} options={todoOptions} />
          )}
        </div>
      </div>
      
      {/* Most Active Users */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Most Active Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.mostActiveUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper to capitalize first letter
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default DashboardStats; 