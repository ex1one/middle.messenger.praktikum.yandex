//TODO: Доработать TypeScript

interface UseFormProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema: Record<string, { messageError: string; regexp: RegExp }>;
  onSubmit: (values: T) => void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) => {
  const values = { ...initialValues };

  const validationField = (value: string, { name, component }) => {
    if (!validationSchema[name]) return;

    const { messageError, regexp } = validationSchema[name];

    if (regexp.test(value)) {
      component.setProps({ error: null });
    } else {
      component.setProps({ error: messageError });
    }
  };

  const handleChange = (event: Event, { component }) => {
    const target = event.target as HTMLInputElement;

    component.setProps({ value: target.value });
  };

  const handleBlur = (event: FocusEvent, { name, component }) => {
    const target = event.target as HTMLInputElement;

    validationField(target.value, { name, component });
  };

  // TODO: Выводить поля value с данными. Сделаю на 3 этапе
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    Object.entries(values).forEach(([name, component]) => {
      // TODO: Тут не должно быть такой проверки - ?? ''
      validationField(component.props.value ?? '', { name, component });
    });

    for (const component of Object.values(values)) {
      if (component.props.error) {
        return;
      }
    }

    onSubmit(values);
  };

  Object.entries(values).forEach(([name, component]) => {
    if (component) {
      component.setProps({
        //TODO: Починить 2 ререндера компонента. Потому что мы под капотом вызываем InputElement и передаем пропсы Input, который передает InputElement
        inputEvents: {
          blur: (event) => handleBlur(event, { name, component }),
          change: (event) => handleChange(event, { name, component }),
        },
      });
    }
  });

  return { values, handleBlur, handleChange, handleSubmit };
};
