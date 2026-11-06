import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiSearch } from 'react-icons/fi';
import './Select.css';

const normalize = (text) => String(text ?? '').toLocaleLowerCase('az').replaceAll('ı', 'i');

export default function Combobox({
  options, value, onChange, label, placeholder = 'Seçin', searchable = false,
  disabled, labelledBy, className = '', id, required, invalid, describedBy, icon: Icon,
  tone = '', searchLabel = 'Axtar…', inputMode = false, onInputChange,
  inputProps = {}, onBlur, onFocus,
}) {
  const uid = useId();
  const panelId = uid + '-panel';
  const listId = uid + '-list';
  const trigger = useRef(null);
  const panel = useRef(null);
  const search = useRef(null);
  const typeahead = useRef('');
  const timer = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const selected = options.find((option) => String(option.value) === String(value));
  const matches = options.filter((option) => normalize(option.searchText || option.label).includes(normalize(inputMode ? (selected ? '' : value) : query)));
  const enabled = matches.filter((option) => !option.disabled);
  const activeIndex = matches.findIndex((option) => option.value === active);
  const activeId = open && activeIndex >= 0 ? uid + '-option-' + activeIndex : undefined;

  const position = useCallback(() => {
    if (!trigger.current || !panel.current) return;
    const box = trigger.current.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = viewport?.offsetLeft || 0;
    const topEdge = viewport?.offsetTop || 0;
    const right = leftEdge + (viewport?.width || window.innerWidth);
    const bottom = topEdge + (viewport?.height || window.innerHeight);
    const width = Math.min(right - leftEdge - 24, Math.max(box.width, searchable ? 248 : 192));
    const below = bottom - box.bottom;
    const above = below < 280 && box.top - topEdge > below;
    Object.assign(panel.current.style, {
      width: width + 'px', left: Math.max(leftEdge + 12, Math.min(box.left, right - width - 12)) + 'px',
      top: above ? 'auto' : box.bottom + 6 + 'px',
      bottom: above ? window.innerHeight - box.top + 6 + 'px' : 'auto',
      maxHeight: Math.max(48, Math.min(340, (above ? box.top - topEdge : below) - 18)) + 'px',
    });
  }, [searchable]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => position();
    const scroll = (event) => { if (!panel.current?.contains(event.target)) reposition(); };
    const observer = new ResizeObserver(reposition);
    observer.observe(trigger.current);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', reposition);
    window.visualViewport?.addEventListener('resize', reposition);
    window.visualViewport?.addEventListener('scroll', reposition);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', reposition);
      window.visualViewport?.removeEventListener('resize', reposition);
      window.visualViewport?.removeEventListener('scroll', reposition);
    };
  }, [open, position]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function show() {
    if (disabled) return;
    position();
    panel.current.showPopover();
    setActive(selected?.value ?? enabled[0]?.value ?? null);
  }

  function close(restoreFocus = false) {
    panel.current?.hidePopover();
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }

  function choose(option) {
    if (!option || option.disabled) return;
    close(true);
    if (inputMode || String(option.value) !== String(value)) onChange(option.value);
  }

  function keydown(event) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === 'Tab') {
      close();
      // Search is in the top layer. Resume the form's normal tab order.
      if (document.activeElement === search.current) trigger.current.focus({ preventScroll: true });
      return;
    }
    if (['ArrowDown', 'ArrowUp'].includes(event.key) || (open && ['Home', 'End'].includes(event.key) && event.target.tagName !== 'INPUT')) {
      event.preventDefault();
      if (!open) { show(); return; }
      const index = enabled.findIndex((option) => option.value === active);
      let next = event.key === 'ArrowUp' ? (index <= 0 ? enabled.length - 1 : index - 1) : (index + 1) % enabled.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = enabled.length - 1;
      const option = enabled[next];
      setActive(option?.value ?? null);
      const indexInMatches = matches.indexOf(option);
      document.getElementById(uid + '-option-' + indexInMatches)?.scrollIntoView({ block: 'nearest' });
    } else if (open && (event.key === 'Enter' || (event.key === ' ' && event.target.tagName !== 'INPUT'))) {
      event.preventDefault();
      choose(enabled.find((option) => option.value === active) || enabled[0]);
    } else if (!inputMode && !searchable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' ') {
      event.preventDefault();
      clearTimeout(timer.current);
      typeahead.current += event.key;
      const option = options.find((item) => !item.disabled && normalize(item.label).startsWith(normalize(typeahead.current)));
      if (option) {
        if (!open) show();
        setActive(option.value);
      }
      timer.current = setTimeout(() => { typeahead.current = ''; }, 650);
    }
  }

  const aria = {
    id, ref: trigger, role: 'combobox', 'aria-label': label || undefined,
    'aria-labelledby': labelledBy, 'aria-expanded': open, 'aria-controls': listId, 'aria-haspopup': 'listbox',
    'aria-activedescendant': activeId, 'aria-required': required || undefined,
    'aria-invalid': Boolean(invalid) || undefined, 'aria-describedby': describedBy, disabled,
    onKeyDown: keydown, onFocus,
    onBlur: (event) => {
      if (panel.current?.contains(event.relatedTarget)) return;
      close();
      onBlur?.(event);
    },
  };

  return <>
    {inputMode ? <input {...inputProps} {...aria} className={className} value={value} placeholder={placeholder} autoComplete="off"
      aria-autocomplete="list" onClick={show} onFocus={(event) => { onFocus?.(event); show(); }}
      onChange={(event) => { onInputChange(event.target.value); show(); }} /> :
      <button {...aria} type="button" className={`ae-select-trigger ${className} ${tone}`} onClick={() => open ? close() : show()}>
        {Icon && <Icon aria-hidden="true" />}<span>{selected?.label || placeholder}</span><FiChevronDown aria-hidden="true" />
      </button>}
    <div ref={panel} id={panelId} popover="auto" className="ae-select-panel" onKeyDown={keydown}
      onToggle={(event) => {
        const showing = event.currentTarget.matches(':popover-open');
        setOpen(showing);
        if (showing && searchable && !inputMode) search.current?.focus({ preventScroll: true });
        if (!showing) setQuery('');
      }}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== trigger.current) {
          close();
          onBlur?.(event);
        }
      }}>
      {searchable && !inputMode && <label className="ae-select-search"><FiSearch /><input ref={search} value={query} placeholder={searchLabel} aria-label={searchLabel}
        role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
        onChange={(event) => { setQuery(event.target.value); setActive(null); }} /></label>}
      <div id={listId} role="listbox" aria-label={label || placeholder} className="ae-select-list">
        {matches.map((option, index) => {
          const OptionIcon = option.icon;
          return <div key={option.value} id={uid + '-option-' + index} role="option"
            aria-selected={String(option.value) === String(value)} aria-disabled={option.disabled || undefined}
            data-active={option.value === active || undefined} className="ae-select-option"
            onMouseDown={(event) => event.preventDefault()} onMouseMove={() => !option.disabled && setActive(option.value)}
            onClick={(event) => { event.stopPropagation(); choose(option); }}>
            {OptionIcon && <OptionIcon className={option.tone} aria-hidden="true" />}
            <span>{option.label}{option.description && <small>{option.description}</small>}</span>
            {String(option.value) === String(value) && <FiCheck aria-hidden="true" />}
          </div>;
        })}
        {!matches.length && <p className="ae-select-empty" role="status">Nəticə tapılmadı</p>}
      </div>
    </div>
  </>;
}






