import { Children, isValidElement, useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import Combobox from './Combobox';

function textOf(children) {
  return Children.toArray(children).map((child) => isValidElement(child) ? textOf(child.props.children) : String(child)).join('');
}

function optionsOf(children, groupDisabled = false) {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === 'option') return [{ value: String(child.props.value ?? textOf(child.props.children)),
      label: textOf(child.props.children), disabled: groupDisabled || child.props.disabled }];
    return optionsOf(child.props.children, groupDisabled || child.props.disabled);
  });
}

// Retain a real form control for existing change handlers, FormData, reset and native validation.
export default function Select({ children, value, defaultValue, onChange, onInvalid, onBlur, onFocus,
  className = '', searchable = false, searchLabel, placeholder, ...props }) {
  const native = useRef(null);
  const wrapper = useRef(null);
  const generatedId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [invalid, setInvalid] = useState(false);
  const options = optionsOf(children);
  const current = value ?? uncontrolled ?? options[0]?.value ?? '';
  const descriptionId = generatedId + '-validation';

  useLayoutEffect(() => {
    const control = native.current;
    const trigger = wrapper.current.querySelector('.ae-select-trigger');
    const explicit = props['aria-label'] || props['aria-labelledby'];
    if (explicit) return;
    const label = control.closest('label') || wrapper.current.previousElementSibling;
    const text = label?.tagName === 'LABEL' ? [...label.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).join(' ').trim() : '';
    if (text) trigger.setAttribute('aria-label', text);
  });

  useEffect(() => {
    const form = native.current.form;
    const reset = () => { setUncontrolled(defaultValue); setInvalid(false); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [defaultValue]);

  return <span className="ae-select" ref={wrapper}>
    <select {...props} id={props.id ? props.id + '-native' : undefined} ref={native}
      className="ae-select-native" tabIndex={-1} aria-hidden="true" value={value} defaultValue={defaultValue}
      onChange={(event) => { setUncontrolled(event.target.value); setInvalid(false); onChange?.(event); }}
      onInvalid={(event) => {
        event.preventDefault();
        onInvalid?.(event);
        setInvalid(event.currentTarget.validationMessage);
        wrapper.current.querySelector('.ae-select-trigger').focus();
      }}>{children}</select>
    <Combobox id={props.id} className={className} options={options} value={current} disabled={props.disabled}
      labelledBy={props['aria-labelledby']} label={props['aria-label'] || props.name || options[0]?.label} required={props.required}
      invalid={invalid || props['aria-invalid']} describedBy={[props['aria-describedby'], invalid ? descriptionId : ''].filter(Boolean).join(' ') || undefined}
      searchable={searchable || options.length > 8} searchLabel={searchLabel} placeholder={placeholder}
      onFocus={onFocus} onBlur={onBlur} onChange={(next) => {
        const control = native.current;
        control.value = String(next);
        control.dispatchEvent(new Event('change', { bubbles: true }));
      }} />
    {invalid && <span id={descriptionId} className="ae-select-validation" role="alert">{invalid}</span>}
  </span>;
}



