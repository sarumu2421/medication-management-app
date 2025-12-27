import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  
  
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  async function loadMedications() {
    const res = await fetch(`${API}/medications`);
    const data = await res.json();
    setMedications(data);

    data.forEach(scheduleReminder);
  }

  async function addMedication() {
    if (!name || !time) return;

    await fetch(`${API}/medications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, time }),
    });

    setName("");
    setTime("");
    loadMedications();
  }

  useEffect(() => {
    loadMedications();
  }, []); 

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []); 

  function scheduleReminder(med) {
    const [hours, minutes] = med.time.split(":").map(Number);

    const now = new Date();
    const reminder = new Date();
    reminder.setHours(hours, minutes, 0, 0);

    // if time already passed today, schedule for tomorrow
    if (reminder <= now) {
      reminder.setDate(reminder.getDate() + 1);
    }

    const delay = reminder - now;

    setTimeout(() => {
      new Notification("Medication Reminder", {
        body: `Time to take ${med.name}`,
      });
    }, delay);
  } 
  async function deleteMedication(id) {
    await fetch(`${API}/medications/${id}`, {
      method: "DELETE",
    });

    loadMedications();
  }

  return (
    <div className="card">
      <h1>💊 Medication Reminder</h1>
      <p className="subtitle">
        Track your medications and get timely reminders
      </p>

      <div className="form">
        <input
          placeholder="Medication name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addMedication}>+ Add</button>
      </div>

      {medications.length === 0 ? (
        <p className="empty">No medications added yet</p>
      ) : (
        <ul className="med-list">
          {medications.map((m) => (
            <li key={m.id} className="med-item">
              <span className="med-text">
                {m.name} — {m.time}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteMedication(m.id)}
                aria-label="Delete medication"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}