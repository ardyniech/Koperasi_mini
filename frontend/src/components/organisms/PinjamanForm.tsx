import React, { useState } from 'react';
import PinjamanFormFields from '../molecules/PinjamanFormFields';
import PinjamanSubmitButton from '../molecules/PinjamanSubmitButton';
import PinjamanFormMessage from '../molecules/PinjamanFormMessage';

interface PinjamanFormProps {
onSubmit: (data: { anggota_id: string; nominal: string; margin_persen: string; tenor_bulan: string }) => void;
message: string;
}

export default function PinjamanForm({ onSubmit, message }: PinjamanFormProps) {
const [form, setForm] = useState({
anggota_id: '',
nominal: '',
margin_persen: '5.0',
tenor_bulan: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
onSubmit(form);
};

return (
<form onSubmit={handleSubmit} style={styles.form}>
<PinjamanFormFields form={form} handleChange={handleChange} />
<PinjamanSubmitButton />
<PinjamanFormMessage message={message} />
</form>
);
}

const styles = {
form: {
display: 'flex' as const,
flexDirection: 'column' as const,
gap: 16,
},
};
