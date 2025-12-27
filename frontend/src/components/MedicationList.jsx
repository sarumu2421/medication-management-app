import { useState } from 'react';
import { medicationService } from '../services/api';
import './MedicationList.css';

function MedicationList({ medications, onMedicationDeleted }) {
  const [checking, setChecking] = useState(false);
  const [interactions, setInteractions] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await medicationService.deleteMedication(id);
        onMedicationDeleted(id);
      } catch (err) {
        console.error('Failed to delete medication:', err);
        alert('Failed to delete medication');
      }
    }
  };

  const handleCheckInteractions = async () => {
    if (medications.length < 2) {
      alert('You need at least 2 medications to check for interactions');
      return;
    }

    setChecking(true);
    try {
      const medNames = medications.map((med) => med.name);
      const result = await medicationService.checkInteractions(medNames);
      setInteractions(result);
    } catch (err) {
      console.error('Failed to check interactions:', err);
      alert('Failed to check interactions');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="medication-list">
      <div className="list-header">
        <h2>My Medications</h2>
        {medications.length >= 2 && (
          <button 
            className="check-interactions-btn" 
            onClick={handleCheckInteractions}
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Check Drug Interactions'}
          </button>
        )}
      </div>

      {interactions && (
        <div className={`interactions-result ${interactions.has_interactions ? 'warning' : 'safe'}`}>
          <h3>{interactions.has_interactions ? '⚠️ Interactions Found' : '✓ No Known Interactions'}</h3>
          <p>{interactions.message}</p>
          {interactions.interactions && interactions.interactions.length > 0 && (
            <div className="interaction-details">
              {interactions.interactions.map((interaction, index) => (
                <div key={index} className="interaction-item">
                  <strong>{interaction.medication1} + {interaction.medication2}</strong>
                  <p>{interaction.description}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setInteractions(null)} className="close-btn">Close</button>
        </div>
      )}

      {medications.length === 0 ? (
        <p className="no-medications">No medications added yet. Add your first medication above!</p>
      ) : (
        <div className="medications-grid">
          {medications.map((medication) => (
            <div key={medication.id} className="medication-card">
              <div className="medication-header">
                <h3>{medication.name}</h3>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(medication.id)}
                  title="Delete medication"
                >
                  ×
                </button>
              </div>
              <div className="medication-details">
                {medication.dosage && (
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                )}
                <p><strong>Frequency:</strong> {medication.frequency.replace(/_/g, ' ')}</p>
                <p><strong>Schedule:</strong> {medication.schedule_time}</p>
                <p className="added-date">
                  <small>Added: {new Date(medication.created_at).toLocaleDateString()}</small>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicationList;
