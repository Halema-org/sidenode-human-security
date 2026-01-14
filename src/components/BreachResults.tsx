import { BreachData } from '../types';

interface BreachResultsProps {
  breaches: BreachData[];
}

const BreachResults = ({ breaches }: BreachResultsProps) => {
  if (breaches.length === 0) {
    return (
      <div className="results">
        <div className="breach-card safe">
          <div className="breach-header">
            <div className="breach-title">
              <h3>✅ Good News!</h3>
              <p className="breach-domain">No breaches found</p>
            </div>
          </div>
          <p className="breach-description">
            Your email address was not found in any known data breaches. However,
            it's still important to maintain good security practices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results">
      <div className="results-header">
        <h2>⚠️ Breach Alert</h2>
        <p className="breach-count">
          Found in {breaches.length} data breach{breaches.length > 1 ? 'es' : ''}
        </p>
      </div>

      {breaches.map((breach, index) => (
        <div key={index} className="breach-card">
          <div className="breach-header">
            <div className="breach-title">
              <h3>{breach.Title || breach.Name}</h3>
              <p className="breach-domain">{breach.Domain}</p>
            </div>
            <div className="breach-date">
              <strong>Breach Date:</strong>
              <br />
              {new Date(breach.BreachDate).toLocaleDateString()}
            </div>
          </div>

          <p
            className="breach-description"
            dangerouslySetInnerHTML={{ __html: breach.Description }}
          />

          <div className="data-types">
            {breach.DataClasses.map((dataClass, idx) => (
              <span key={idx} className="data-type">
                {dataClass}
              </span>
            ))}
          </div>

          <div className="breach-stats">
            <span>
              👥 {breach.PwnCount.toLocaleString()} affected accounts
            </span>
            {breach.IsVerified && <span>✅ Verified</span>}
            {breach.IsSensitive && <span>⚠️ Sensitive</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BreachResults;
