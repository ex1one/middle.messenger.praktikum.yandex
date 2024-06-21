export const isValidJSON = (str: string) => {
  return (
    typeof str === 'string' &&
    str.trim() !== '' &&
    (str.trim().startsWith('{') || str.trim().startsWith('['))
  );
};
