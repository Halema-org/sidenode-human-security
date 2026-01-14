const SecurityTips = () => {
  const tips = [
    {
      icon: '🔐',
      title: 'Use Strong Passwords',
      description:
        'Create unique, complex passwords for each account. Use a password manager to keep track.',
    },
    {
      icon: '🔑',
      title: 'Enable 2FA',
      description:
        'Two-factor authentication adds an extra layer of security to your accounts.',
    },
    {
      icon: '📧',
      title: 'Monitor Your Accounts',
      description:
        'Regularly check your accounts for suspicious activity and enable security alerts.',
    },
    {
      icon: '⚠️',
      title: 'Change Compromised Passwords',
      description:
        'If your email was found in a breach, immediately change passwords for affected accounts.',
    },
    {
      icon: '🛡️',
      title: 'Be Wary of Phishing',
      description:
        'Never click suspicious links or provide sensitive information via email.',
    },
    {
      icon: '🔄',
      title: 'Keep Software Updated',
      description:
        'Regularly update your operating system, browsers, and applications for security patches.',
    },
  ];

  return (
    <div className="security-tips">
      <h2>🛡️ Security Best Practices</h2>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className="tip">
            <div className="tip-icon">{tip.icon}</div>
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityTips;
