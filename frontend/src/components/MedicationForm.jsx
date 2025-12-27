import { useState } from 'react';
import { medicationService } from '../services/api';
import './MedicationForm.css';

function MedicationForm({ onMedicationAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    schedule_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newMedication = await medicationService.createMedication(formData);
      onMedicationAdded(newMedication);
      
      // Reset form
      setFormData({
        name: '',
        dosage: '',
        frequency: 'daily',
        schedule_time: '',
      });
    } catch (err) {
      setError('Failed to add medication. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medication-form">
      <h2>Add Medication</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Medication Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Aspirin, Lisinopril"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dosage">Dosage</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g., 10mg, 1 tablet"
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency *</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          >
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="three_times_daily">Three Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="as_needed">As Needed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="schedule_time">Schedule Time(s) *</label>
          <input
            type="text"
            id="schedule_time"
            name="schedule_time"
            value={formData.schedule_time}
            onChange={handleChange}
            required
            placeholder="e.g., 09:00 or 09:00,21:00 for multiple times"
          />
          <small>Format: HH:MM (use comma for multiple times)</small>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medication'}
        </button>
      </form>
    </div>
  );
}

export default MedicationForm;
