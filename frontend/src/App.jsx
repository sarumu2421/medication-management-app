import { useState, useEffect } from 'react';
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import { medicationService } from './services/api';
import './App.css';

function App() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getAllMedications();
      setMedications(data);
      setError('');
    } catch (err) {
      setError('Failed to load medications. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicationAdded = (newMedication) => {
    setMedications([...medications, newMedication]);
  };

  const handleMedicationDeleted = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💊 Medication Management</h1>
        <p>Track your medications and check for drug interactions</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <MedicationForm onMedicationAdded={handleMedicationAdded} />

        {loading ? (
          <div className="loading">Loading medications...</div>
        ) : (
          <MedicationList
            medications={medications}
            onMedicationDeleted={handleMedicationDeleted}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>⚠️ This is a demo app. Always consult your healthcare provider for medical advice.</p>
      </footer>
    </div>
  );
}

export default App;
