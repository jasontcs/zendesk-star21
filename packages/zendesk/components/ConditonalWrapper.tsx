type ConditonalWrapperProps = {
  children: React.ReactNode;
  condition: boolean;
  wrapper: (children: React.ReactNode) => JSX.Element;
};
export const ConditonalWrapper: React.FC<ConditonalWrapperProps> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children
 