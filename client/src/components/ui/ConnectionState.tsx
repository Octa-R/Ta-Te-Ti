type Props = {
  isConnected: boolean;
};

export const ConnectionState: React.FC<Props> = ({ isConnected }) => (
  <div
    className={`w-2 h-2 p-1 rounded-full border-black 
    ${isConnected ?
        'bg-green-600' :
        'bg-red-600'}`
    } />
)

