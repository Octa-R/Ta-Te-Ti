interface Props {
  children: React.ReactNode;
}

export const InnerContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-around">
      {children}
    </div>
  );
};
