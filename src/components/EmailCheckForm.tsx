import { useState, FormEvent } from 'react';

interface EmailCheckFormProps {
  onCheck: (email: string) => void;
  loading: boolean;
}

const EmailCheckForm = ({ onCheck, loading }: EmailCheckFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onCheck(email.trim());
    }
  };

  return (
    <div className="email-form">
      <h2>🔍 Check Your Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Check Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailCheckForm;
