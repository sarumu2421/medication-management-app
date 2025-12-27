import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

// icons
const PillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
    <path d="m8.5 8.5 7 7"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BellOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.3 5.3a10 10 0 0 0-1.3 4.7C5 13 3.5 14.5 3.5 16H12"/>
    <path d="M13 16h7.5c0-1.5-1.5-3-1.5-6v-.3"/>
    <path d="M18 8a6 6 0 0 0-9.33-5"/>
    <path d="M9.2 21a3 3 0 0 0 5.6 0"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const PackageXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
    <path d="M7.5 4.27l9 5.15"/>
    <polyline points="3.29 7 12 12 20.71 7"/>
    <line x1="12" y1="22" x2="12" y2="12"/>
    <path d="m17 13 5 5m-5 0 5-5"/>
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M12 8v4"/>
    <path d="M12 16h.01"/>
  </svg>
);

export default function App() {
  
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState(""); 

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTime, setEditTime] = useState(""); 
  const [warnings, setWarnings] = useState([]);
  const [dismissedWarnings, setDismissedWarnings] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState("default");

  // Convert 24-hour time to 12-hour AM/PM format
  function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  async function loadMedications() {
    try {
      const res = await fetch(`${API}/medications`);
      const data = await res.json();
      setMedications(data);

      await loadInteractions();
      data.forEach(scheduleReminder);
    } catch (error) {
      console.error("Error loading medications:", error);
    }
  } 

  async function loadInteractions() {
    try {
      const res = await fetch(`${API}/interactions`);
      const data = await res.json();
      console.log("Interaction warnings received:", data);
      setWarnings(data);
      setDismissedWarnings([]);
    } catch (error) {
      console.error("Error loading interactions:", error);
    }
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
    
    const interval = setInterval(() => {
      checkAndNotify();
    }, 60000);

    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          console.log("Notifications enabled!");
        } else if (permission === "denied") {
          alert("Please enable notifications in your browser settings to receive medication reminders.");
        }
      });
    } else {
      alert("Your browser doesn't support notifications.");
    }
  }, []); 

  function scheduleReminder(med) {
    const [hours, minutes] = med.time.split(":").map(Number);

    const now = new Date();
    const reminder = new Date();
    reminder.setHours(hours, minutes, 0, 0);

    if (reminder <= now) {
      reminder.setDate(reminder.getDate() + 1);
    }

    const delay = reminder - now;

    console.log(`Scheduling reminder for ${med.name} at ${med.time} (in ${Math.round(delay/1000/60)} minutes)`);

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Medication Reminder", {
          body: `Time to take ${med.name}`,
          requireInteraction: true,
        });
        
        alert(`⏰ Medication Reminder: Time to take ${med.name}`);
      }
      
      scheduleReminder(med);
    }, delay);
  } 

  function checkAndNotify() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    medications.forEach(med => {
      if (med.time === currentTime && Notification.permission === "granted") {
        new Notification("💊 Medication Reminder", {
          body: `Time to take ${med.name}`,
          requireInteraction: true,
        });
        alert(`⏰ Time to take ${med.name}!`);
      }
    });
  }

  async function deleteMedication(id) {
    await fetch(`${API}/medications/${id}`, {
      method: "DELETE",
    });

    loadMedications();
  } 

  async function updateMedication(id) {
    await fetch(`${API}/medications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        time: editTime,
      }),
    });

    setEditingId(null);
    setEditName("");
    setEditTime("");
    loadMedications();
  }

  function dismissWarning(drug1, drug2) {
    setDismissedWarnings([...dismissedWarnings, `${drug1}-${drug2}`]);
  }

  function showWarningsForDrug(drugName) {
    const relevantWarnings = warnings.filter(
      w => w.drug1 === drugName || w.drug2 === drugName
    );
    
    const newDismissed = dismissedWarnings.filter(
      dismissed => !relevantWarnings.some(w => dismissed === `${w.drug1}-${w.drug2}`)
    );
    
    setDismissedWarnings(newDismissed);
    
    setTimeout(() => {
      const warningElement = document.querySelector('.warning-box');
      if (warningElement) {
        warningElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  function hasInteraction(drugName) {
    return warnings.some(w => w.drug1 === drugName || w.drug2 === drugName);
  }

  const visibleWarnings = warnings.filter(
    w => !dismissedWarnings.includes(`${w.drug1}-${w.drug2}`)
  );

  return (
    <div className="card">
      <div className="header-section">
        <div className="header">
          <div className="header-icon">
            <PillIcon />
          </div>
          <h1>Medication Manager</h1>
        </div>
        <p className="subtitle">
          Track your prescriptions and receive alerts for potential drug interactions
        </p>
      </div>

      <div className="instruction">
        Add medications below with their scheduled times. The system will automatically check for drug interactions using FDA data and send you browser notifications.
      </div>

      {notificationPermission !== "granted" && (
        <div style={{padding: "0 40px", marginTop: "20px"}}>
          <div className="notification-banner">
            <BellOffIcon />
            <div>
              <strong>Notifications Disabled</strong>
              <p>Enable browser notifications to receive medication reminders at scheduled times.</p>
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <div className="form">
          <div className="input-wrapper">
            <label className="input-label">
              <PillIcon />
              Medication Name
            </label>
            <input
              placeholder="e.g., Aspirin, Ibuprofen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMedication()}
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">
              <ClockIcon />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMedication()}
            />
          </div>
          <button onClick={addMedication}>
            <PlusIcon />
            Add Medication
          </button>
        </div>
      </div>
      
      {visibleWarnings.length > 0 && (
        <div className="warning-section">
          {visibleWarnings.map((w, i) => {
            const severityStyles = {
              high: {
                background: "#fef2f2",
                border: "#dc2626",
                textColor: "#991b1b",
              },
              moderate: {
                background: "#fff7ed",
                border: "#ea580c",
                textColor: "#9a3412",
              },
              low: {
                background: "#fefce8",
                border: "#eab308",
                textColor: "#854d0e",
              }
            };
            
            const style = severityStyles[w.severity];
            
            return (
              <div 
                key={i}
                className="warning-box" 
                style={{
                  background: style.background,
                  borderColor: style.border,
                  color: style.textColor,
                }}
              >
                <button
                  className="close-warning"
                  onClick={() => dismissWarning(w.drug1, w.drug2)}
                  style={{ borderColor: style.border }}
                >
                  <XIcon />
                </button>
                
                <div className="warning-header">
                  <ShieldAlertIcon />
                  <div className="warning-title">Drug Interaction Warning</div>
                </div>
                
                <div>
                  <div style={{fontSize: "14px", fontWeight: "600", marginBottom: "8px"}}>
                    {w.drug1} + {w.drug2}
                  </div>
                  <div style={{fontSize: "14px", lineHeight: "1.6", marginBottom: "12px"}}>
                    {w.message}
                  </div>
                  
                  {w.common_reactions && w.common_reactions.length > 0 && (
                    <div style={{
                      fontSize: "13px", 
                      background: "white",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      marginBottom: "12px",
                      border: `1px solid ${style.border}`
                    }}>
                      <strong>Common reactions:</strong> {w.common_reactions.join(", ")}
                    </div>
                  )}
                  
                  <div 
                    className="interaction-badge"
                    style={{
                      background: style.border,
                      color: "white"
                    }}
                  >
                    {w.severity} risk • {w.reports.toLocaleString()} reports
                  </div>
                </div>
                
                <div style={{
                  paddingTop: "12px", 
                  marginTop: "12px",
                  borderTop: `1px solid ${style.border}`,
                  fontSize: "12px",
                  lineHeight: "1.6",
                  color: "#6b7280"
                }}>
                 Always consult your healthcare provider.
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="content-section">
        {medications.length === 0 ? (
          <div className="empty">
            <PackageXIcon />
            <p>No medications added yet</p>
            <p>Add your first medication above</p>
          </div>
        ) : (
          <ul className="med-list">
            {medications.map((m) => (
              <li 
                key={m.id} 
                className={`med-item ${hasInteraction(m.name) ? 'has-interaction' : ''}`}
              >
                {editingId === m.id ? (
                  <div style={{display: "flex", gap: "8px", flex: 1}}>
                    <input
                      className="edit-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateMedication(m.id);
                        }
                      }}
                      autoFocus
                    />
                    <input
                      type="time"
                      className="edit-input"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateMedication(m.id);
                        }
                      }}
                    />
                    <button 
                      onClick={() => updateMedication(m.id)}
                      style={{padding: "8px 16px"}}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="med-content">
                      <div className="med-icon-wrapper">
                        <PillIcon />
                      </div>
                      <div
                        className="med-text"
                        style={{
                          cursor: hasInteraction(m.name) ? "pointer" : "default"
                        }}
                        onClick={() => {
                          if (hasInteraction(m.name)) {
                            showWarningsForDrug(m.name);
                          }
                        }}
                        onDoubleClick={() => {
                          if (!hasInteraction(m.name)) {
                            setEditingId(m.id);
                            setEditName(m.name);
                            setEditTime(m.time);
                          }
                        }}
                        title={hasInteraction(m.name) ? "Click to see interaction warnings" : "Double-click to edit"}
                      >
                        <div className="med-name">
                          {hasInteraction(m.name) && (
                            <AlertTriangleIcon className="interaction-indicator" />
                          )}
                          {m.name}
                        </div>
                        <div className="med-time">
                          <ClockIcon />
                          {formatTime(m.time)}
                        </div>
                      </div>
                    </div>

                    <div className="med-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditName(m.name);
                          setEditTime(m.time);
                        }}
                        title="Edit medication"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteMedication(m.id)}
                        title="Delete medication"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div> 
      <div
        style={{
          marginTop: "40px",
          padding: "24px 28px",  
          borderTop: "1px solid #e5e7eb",
          fontSize: "12px",
          lineHeight: "1.7",  
          color: "#6b7280",
        }}
      >
        <strong>*Medical Disclaimer*</strong>

        <p style={{ margin: "14px 0" }}>
          <strong>What do these numbers mean?</strong> Interaction numbers show how many
          times people reported problems to the FDA when taking these medications
          together. More reports may indicate a higher potential risk, but this is not a
          complete picture.
        </p>

        <p style={{ margin: "14px 0" }}>
          The number represents adverse event reports in which both drugs were present,
          <em> not confirmed interactions, not causation, and not clinical severity</em>.
        </p>

        <ul style={{ paddingLeft: "24px", margin: "14px 0" }}>
          <li>High counts ≠ dangerous interaction (may reflect common co-prescription)</li>
          <li>Low counts ≠ safe</li>
          <li>Zero counts ≠ no interaction</li>
        </ul>

        <p style={{ marginTop: "14px" }}>
          This tool is for informational purposes only. Always consult your healthcare
          provider before making medical decisions.
        </p>
      </div>
    </div>
  );
}