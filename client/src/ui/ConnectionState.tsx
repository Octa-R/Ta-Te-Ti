type Props = {
  isConnected: boolean;
};

export const ConnectionState: React.FC<Props> = ({ isConnected }) => (
  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
)

