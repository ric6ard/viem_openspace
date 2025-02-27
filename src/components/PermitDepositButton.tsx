import React, { useState } from 'react';
import { permitDeposit } from '../utils/permitDeposit';
import { useAccount } from 'wagmi';

interface PermitDepositButtonProps {
  tokenAddress: string;
  spender: string;
  value: number;
  deadline: number;
}

const PermitDepositButton: React.FC<PermitDepositButtonProps> = ({ tokenAddress, spender, value, deadline }) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePermitDeposit = async () => {
    setLoading(true);
    setError(null);
    try {
      await permitDeposit(tokenAddress, address!, spender, value, deadline);
      alert('Permit deposit successful');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePermitDeposit} disabled={loading}>
        {loading ? 'Processing...' : 'Permit Deposit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PermitDepositButton;
