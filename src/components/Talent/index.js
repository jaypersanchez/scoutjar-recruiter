import React from 'react';
import '../../App.css';
import TalentDashboard from './TalentDashboard';

function Talent({ user }) {
  return (
    <div className="App">
      <TalentDashboard user={user} />
    </div>
  );
}

export default Talent;
