const Spinner = () => {
  const spinnerStyles = {
    display: 'block',
    width: '50px',
    height: '50px',
    border: '3px solid #000',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s infinite ease-in-out',
  };

  const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const spinnerContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};


    return (
      <>
        <style>{keyframes}</style>
        <div style={spinnerContainerStyles}>
          <div style={spinnerStyles} />
        </div>
      </>
    );
  };


export default Spinner;