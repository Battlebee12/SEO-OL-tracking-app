import React, { useState } from 'react';
// import ubcLogo from '../assets/ubc-logo.png'; // Make sure the logo exists here

function ShiftForm() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [rsd, setRsd] = useState('');
  const [gid, setGid] = useState('');
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !id || !action) {
      setMessage('Please fill in your name, ID, and select IN or OUT.');
      return;
    }

    const endpoint = action === 'in' ? `${process.env.REACT_APP_API_BASE}/api/shifts/signin` : `${process.env.REACT_APP_API_BASE}/api/shifts/signout`;

    const payload = action === 'in' ? { name, id, rsd, gid } : { id, rsd };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${data.error || 'An error occurred'}`);
      } else {
        setMessage(`✅ Successfully ${action === 'in' ? 'signed in' : 'signed out'}.`);
      }
    } catch {
      setMessage('❌ Network error.');
    }
  };

  return (
    <div style={styles.page}>
      {/* UBC Header */}
      <div style={styles.header}>
        {/* <img src={ubcLogo} alt="UBC Logo" style={styles.logo} /> */}
        <h1 style={styles.title}>THE UNIVERSITY OF BRITISH COLUMBIA</h1>
      </div>
      <div style={styles.subHeader}>
        <h2 style={styles.subHeaderText}>OL SHIFT CHECK IN OUT</h2>
      </div>

      {/* Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>OL Student ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Group Number (if applicable)</label>
        <input
          type="text"
          value={gid}
          onChange={(e) => setGid(e.target.value)}
          style={styles.input}
        />

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>IN</label>
          <input
            type="radio"
            name="action"
            value="in"
            checked={action === "in"}
            onChange={() => setAction("in")}
            style={styles.radio}
          />
          <label style={styles.radioLabel}>OUT</label>
          <input
            type="radio"
            name="action"
            value="out"
            checked={action === "out"}
            onChange={() => setAction("out")}
            style={styles.radio}
          />
        </div>

        <label style={styles.label}>
          Reason for Shift Deviation (if applicable):
        </label>
        <input
          type="text"
          value={rsd}
          onChange={(e) => setRsd(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.submitButton}>
          SUBMIT
        </button>
        {message && <p style={styles.message}>{message}</p>}

        
      </form>
      <p style={{ color: "#d8000c", fontSize: "20px", marginTop: "50px" }}>
          ⚠️ <strong>Note:</strong> The hours recorded in this form are for
          internal shift tracking purposes only. You are still responsible for
          submitting your hours separately in Workday.
        </p>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    minHeight: '100vh',
    textAlign: 'center',
    paddingBottom: '50px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    justifyContent: 'center',
    gap: '15px',
  },
  logo: {
    height: '50px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#002145',
    margin: 0,
  },
  subHeader: {
    backgroundColor: '#002145',
    padding: '10px 0',
    marginBottom: '30px',
  },
  subHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    margin: 0,
  },
  form: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontWeight: 'bold',
    color: '#002145',
    textAlign: 'left',
  },
  input: {
    padding: '12px',
    borderRadius: '30px',
    border: '1px solid #000',
    backgroundColor: '#eee',
    fontSize: '16px',
  },
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',
  },
  radioLabel: {
    fontWeight: 'bold',
    color: '#002145',
  },
  radio: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
  },
  submitButton: {
    backgroundColor: '#002145',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  message: {
    fontWeight: 'bold',
    marginTop: '10px',
    color: '#d8000c',
  },
};

export default ShiftForm;
