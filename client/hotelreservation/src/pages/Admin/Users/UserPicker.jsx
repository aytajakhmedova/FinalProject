import Combobox from '../../../components/common/Select/Combobox';

export default function UserPicker({ label, options, value, onChange, placeholder, searchable, icon, tone = '', disabled }) {
  return <Combobox label={label} options={options} value={value} onChange={onChange}
    placeholder={placeholder} searchable={searchable} searchLabel="Otel axtar…"
    icon={icon} tone={tone} className="um-picker" disabled={disabled} />;
}
