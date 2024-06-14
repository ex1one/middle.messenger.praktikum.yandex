const renderIf = (
  condition: unknown,
  trueValue: unknown,
  falseValue: unknown = '',
) => {
  return condition ? trueValue : falseValue;
};

export default renderIf;
