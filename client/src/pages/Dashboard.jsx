import React, { useEffect, useState } from 'react';
import api from '../api';
import http from "http";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { withCredentials: true });

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // DEBUG: Check token and user
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Token:', token);
  console.log('User:', user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewRes = await api.get('/dashboard/overview');
        setOverview(overviewRes.data);
        const statsRes = await api.get('/dashboard/stats');
        setStats(statsRes.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !overview || !stats) return <div className="p-8">Chargement du tableau de bord...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-10 px-4">
      {/* DEBUG INFO */}
      <div className="mb-4">
        <div><b>Token:</b> {token ? token.slice(0, 30) + '...' : 'Aucun token'}</div>
        <div><b>Role:</b> {user.role || 'Non défini'}</div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Visites totales" value={overview.totalVisits} icon="📊" color="from-blue-500 to-blue-700" />
        <Card title="Aujourd'hui" value={overview.todayVisits} icon="📅" color="from-green-500 to-green-700" />
        <Card title="À venir" value={overview.upcomingVisits} icon="⏳" color="from-yellow-500 to-yellow-700" />
        <Card title="Terminées" value={overview.completedVisits} icon="✅" color="from-purple-500 to-purple-700" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Prochaines visites</h2>
      <Table data={overview.nextVisits} />
      <h2 className="text-xl font-semibold mt-8 mb-2">Visites passées</h2>
      <Table data={overview.pastVisits} />
      <h2 className="text-xl font-semibold mt-8 mb-2">Statistiques</h2>
      <StatsCharts stats={stats} />
      <ExportButtons />
    </div>
  );
};

const Card = ({ title, value, icon, color }) => (
  <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center bg-gradient-to-br ${color} text-white hover:scale-105 transition-transform`}>
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-lg mt-2">{title}</div>
  </div>
);

const Table = ({ data }) => (
  <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden mb-4">
    <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white sticky top-0">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Visiteur</th>
        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date/Heure</th>
        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Personne à rencontrer</th>
        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Statut</th>
      </tr>
    </thead>
    <tbody>
      {data.map((visit, i) => (
        <tr key={visit._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} >
          <td className="px-6 py-4">{visit.visitor?.name}</td>
          <td className="px-6 py-4">{visit.entryTime ? new Date(visit.entryTime).toLocaleString() : ''}</td>
          <td className="px-6 py-4">{visit.host}</td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                visit.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-200 text-gray-800'}`}>
              {visit.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const StatsCharts = ({ stats }) => (
  <div>
    <div>
      <h3 className="font-semibold">Par type de visite</h3>
      <ul className="flex flex-wrap gap-4 mt-4">
        {stats.byType.map((t) => (
          <li key={t._id} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold shadow">
            {t._id}: {t.count}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="font-semibold mt-4">Respect des consignes</h3>
      <ul>
        {stats.compliance.map((c) => (
          <li key={c._id ? 'Oui' : 'Non'}>
            {c._id ? 'Oui' : 'Non'}: {c.count}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="font-semibold mt-4">Par mois</h3>
      <ul>
        {stats.byMonth.map((m) => (
          <li key={m._id}>{m._id}: {m.count}</li>
        ))}
      </ul>
    </div>
  </div>
);

const ExportButtons = () => {
  const handleExport = (type) => {
    window.open(`/api/dashboard/export?type=${type}`, '_blank');
  };
  return (
    <div className="mt-6 flex gap-4">
      <button onClick={() => handleExport('pdf')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
        <span>📄</span> Exporter PDF
      </button>
      <button onClick={() => handleExport('excel')}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
        <span>📊</span> Exporter Excel
      </button>
    </div>
  );
};

export default Dashboard; 