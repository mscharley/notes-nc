export const Root: React.FC = (_props: Record<string, unknown>) => {
  const onClick = () => {
    window.cdkEditor.helloWorld();
  };

  return (
    <div>
      Hello world! <button onClick={onClick}> &gt;&gt; </button>
    </div>
  );
};
