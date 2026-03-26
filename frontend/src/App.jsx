import { useState } from 'react';
import ProjectDashboard from './components/ProjectDashboard';
import GrantReport from './components/GrantReport';
import StudentManager from './components/StudentManager';
import LabManager from './components/LabManager';
import './App.css';

const TABS = ['Projects', 'Grant Report', 'Students', 'Labs'];

function App() {
  const [activeTab, setActiveTab] = useState('Projects');

  return (
    <div>
      <header className="app-header">
        <h1>Purdue Research Lab Manager</h1>
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'Projects' && <ProjectDashboard />}
        {activeTab === 'Grant Report' && <GrantReport />}
        {activeTab === 'Students' && <StudentManager />}
        {activeTab === 'Labs' && <LabManager />}
      </main>
    </div>
  );
}

export default App;
