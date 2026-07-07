import React from 'react';
import { TrespassingAlert } from '../App'; // Import the type from App.tsx

interface Props {
  alerts: TrespassingAlert[];
}

const TrespassingLog: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Trespassing & Anomaly Alerts</h1>
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Tourist ID</th>
                <th className="p-4">Alert / Area</th>
                <th className="p-4">Location (Lon, Lat)</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/20">
                  <td className="p-4">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-mono">{alert.tourist_id}</td>
                  <td className="p-4 font-semibold">{alert.area_name}</td>
                  <td className="p-4 font-mono">{alert.location.coordinates.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              <p>No trespassing or anomaly alerts have been generated yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrespassingLog;