import { useState } from 'react';
import { BreachData, ApiResponse } from './types';
import EmailCheckForm from './components/EmailCheckForm';
import BreachResults from './components/BreachResults';
import SecurityTips from './components/SecurityTips';

function App() {
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const checkEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setChecked(false);

    try {
      const response = await fetch(
        `https://api.xposedornot.com/v1/check-email/${email}`
      );

      if (!response.ok) {
        throw new Error('Failed to check email');
      }

      const data: ApiResponse = await response.json();

      if (data.Error) {
        setBreaches([]);
        setChecked(true);
      } else {
        const breachList = data.BreachDetails || [];
        setBreaches(breachList);
        setChecked(true);
      }
    } catch (err) {
      setError('Unable to check email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <div className="container">
          <h1>🔒 Sidenode Human Security</h1>
          <p>Check if your email has been compromised in data breaches</p>
        </div>
      </header>

      <main className="container">
        <EmailCheckForm onCheck={checkEmail} loading={loading} />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {checked && !loading && (
          <BreachResults breaches={breaches} />
        )}

        <SecurityTips />
      </main>

      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Sidenode. Built with privacy in mind.</p>
          <p>Powered by XposedOrNot API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
