# Complete Source Files - Copy & Paste Guide

Create these files locally after cloning the repo. Each section below is a complete file.

---

## 1. `src/main.tsx` - React Entry Point

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. `src/App.tsx` - Main Dashboard

```typescript
import { useState } from 'react';
import { BreachList } from './components/BreachList';
import { RiskBadge } from './components/RiskBadge';
import { TaskChecklist } from './components/TaskChecklist';
import type { BreachEvent, RemediationTask } from './types';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [breaches, setBreaches] = useState<BreachEvent[]>([]);
  const [tasks, setTasks] = useState<RemediationTask[]>([]);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  const handleLookup = async () => {
    if (!email) return;
    setLoading(true);
    
    try {
      // Call XposedOrNot API (free)
      const response = await fetch(
        `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform API response to our BreachEvent format
        const breachData: BreachEvent[] = data.breaches?.map((b: any) => ({
          id: b.Name || b.name,
          personId: email,
          source: b.Name || b.name,
          breachDate: new Date(b.BreachDate || b.breach_date),
          exposedDataTypes: b.DataClasses || b.data_classes || [],
          severity: calculateSeverity(b.DataClasses || b.data_classes || []),
          status: 'OPEN'
        })) || [];
        
        setBreaches(breachData);
        setRiskLevel(calculateRisk(breachData));
        setTasks(generateTasks(breachData, email));
      }
    } catch (error) {
      console.error('Breach lookup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛡️ Human Security Monitor</h1>
        <p>Check your email for data breaches and security risks</p>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            border: '2px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleLookup}
          disabled={loading || !email}
          style={{
            marginTop: '1rem',
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check for Breaches'}
        </button>
      </div>

      {breaches.length > 0 && (
        <>
          <RiskBadge level={riskLevel} breachCount={breaches.length} />
          <BreachList breaches={breaches} />
          <TaskChecklist tasks={tasks} onTaskComplete={(id) => {
            setTasks(tasks.map(t => 
              t.id === id ? { ...t, status: 'COMPLETED' } : t
            ));
          }} />
        </>
      )}
    </div>
  );
}

function calculateSeverity(dataTypes: string[]): 'LOW' | 'MEDIUM' | 'HIGH' {
  const high = ['Passwords', 'Credit Cards', 'Bank Account', 'SSN'];
  if (dataTypes.some(t => high.includes(t))) return 'HIGH';
  if (dataTypes.length > 3) return 'MEDIUM';
  return 'LOW';
}

function calculateRisk(breaches: BreachEvent[]): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (breaches.some(b => b.severity === 'HIGH')) return 'HIGH';
  if (breaches.length > 5) return 'MEDIUM';
  return 'LOW';
}

function generateTasks(breaches: BreachEvent[], email: string): RemediationTask[] {
  return [
    {
      id: '1',
      personId: email,
      type: 'PASSWORD_CHANGE',
      recommendedAction: 'Change passwords on all affected accounts',
      status: 'OPEN'
    },
    {
      id: '2',
      personId: email,
      type: 'MFA_ENABLE',
      recommendedAction: 'Enable 2FA/MFA where available',
      status: 'OPEN'
    },
    {
      id: '3',
      personId: email,
      type: 'MONITOR',
      recommendedAction: 'Monitor accounts for suspicious activity',
      status: 'OPEN'
    }
  ];
}

export default App;
```

---

## 3. `src/types.ts` - TypeScript Interfaces

```typescript
export interface Person {
  id: string;
  primaryEmail: string;
  createdAt: Date;
}

export interface BreachEvent {
  id: string;
  personId: string;
  source: string;
  breachDate: Date;
  exposedDataTypes: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'REMEDIATED';
}

export interface RemediationTask {
  id: string;
  personId: string;
  type: string;
  recommendedAction: string;
  status: 'OPEN' | 'COMPLETED';
}
```

---

## 4. `src/components/BreachList.tsx`

```typescript
import type { BreachEvent } from '../types';

interface Props {
  breaches: BreachEvent[];
}

export function BreachList({ breaches }: Props) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🚨 Found {breaches.length} Breach{breaches.length !== 1 ? 'es' : ''}</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {breaches.map((breach) => (
          <div
            key={breach.id}
            style={{
              padding: '1.5rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: getSeverityColor(breach.severity)
            }}
          >
            <h3>{breach.source}</h3>
            <p><strong>Date:</strong> {breach.breachDate.toLocaleDateString()}</p>
            <p><strong>Severity:</strong> {breach.severity}</p>
            <p><strong>Exposed Data:</strong> {breach.exposedDataTypes.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'HIGH': return '#fee';
    case 'MEDIUM': return '#ffe';
    case 'LOW': return '#efe';
    default: return '#fff';
  }
}
```

---

## 5. `src/components/RiskBadge.tsx`

```typescript
interface Props {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  breachCount: number;
}

export function RiskBadge({ level, breachCount }: Props) {
  const colors = {
    LOW: '#28a745',
    MEDIUM: '#ffc107',
    HIGH: '#dc3545'
  };

  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: '8px',
      backgroundColor: colors[level] + '22',
      border: `3px solid ${colors[level]}`,
      marginBottom: '2rem'
    }}>
      <h2 style={{ margin: 0, color: colors[level] }}>
        Risk Level: {level}
      </h2>
      <p style={{ margin: '0.5rem 0 0 0' }}>
        {breachCount} breach{breachCount !== 1 ? 'es' : ''} found affecting your email
      </p>
    </div>
  );
}
```

---

## 6. `src/components/TaskChecklist.tsx`

```typescript
import type { RemediationTask } from '../types';

interface Props {
  tasks: RemediationTask[];
  onTaskComplete: (id: string) => void;
}

export function TaskChecklist({ tasks, onTaskComplete }: Props) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>✅ Recommended Actions</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: '1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              opacity: task.status === 'COMPLETED' ? 0.5 : 1
            }}
          >
            <input
              type="checkbox"
              checked={task.status === 'COMPLETED'}
              onChange={() => onTaskComplete(task.id)}
              style={{ width: '20px', height: '20px' }}
            />
            <div>
              <strong>{task.recommendedAction}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. `src/index.css` - Basic Styling

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f5f5f5;
}

* {
  box-sizing: border-box;
}
```

---

## 8. `tsconfig.json` - TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 9. `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Quick Start

1. Clone the repo and install:
```bash
git clone https://github.com/Halema-org/sidenode-human-security.git
cd sidenode-human-security
npm install
```

2. Create all the files above in their respective paths

3. Run locally:
```bash
npm run dev
```

4. Visit http://localhost:5173

The dashboard will use the **free XposedOrNot API** to check emails for breaches!
