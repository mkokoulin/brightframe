import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormCard } from "../components/FormCard/FormCard";
import { Eyebrow } from "../components/Eyebrow/Eyebrow";
import { Title } from "../components/Title/Title";
import { LabeledField } from "../components/LabeledField/LabeledField";
import { TextareaField } from "../components/TextareaField/TextareaField";
import { SelectField, type SelectOption } from "../components/SelectField/SelectField";
import { GuestsCounter } from "../components/GuestsCounter/GuestsCounter";
import { FormDatePicker, toYMD } from "../components/FormDatePicker/FormDatePicker";
import { TimeRangePicker } from "../components/TimeRangePicker/TimeRangePicker";
import { SubmitButton } from "../components/SubmitButton/SubmitButton";
import { Alert } from "../components/Alert/Alert";

const ROOM_OPTIONS: SelectOption[] = [
  { value: "focus", label: "Focus room (2 people)" },
  { value: "meeting", label: "Meeting room (8 people)" },
  { value: "conference", label: "Conference hall (20 people)" },
];

function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("meeting");
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(toYMD(new Date()));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <FormCard style={{ maxWidth: 420, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <Eyebrow>Coworking</Eyebrow>
        <Title as="h2" style={{ fontSize: 28 }}>
          Book a room
        </Title>
      </div>

      {submitted && <Alert variant="success" title="Request sent">We'll confirm by email shortly.</Alert>}

      <LabeledField label="Name" value={name} onChange={setName} placeholder="Jane Doe" />
      <LabeledField label="Email" value={email} onChange={setEmail} type="email" placeholder="jane@example.com" />

      <SelectField label="Room" value={room} onChange={setRoom} options={ROOM_OPTIONS} />
      <GuestsCounter value={guests} onChange={setGuests} min={1} max={20} />

      <FormDatePicker label="Date" value={date} onChange={setDate} />
      <TimeRangePicker
        date={date}
        onDateChange={setDate}
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />

      <TextareaField
        label="Notes (optional)"
        value={notes}
        onChange={setNotes}
        placeholder="Anything the front desk should know?"
        rows={3}
      />

      <SubmitButton
        onClick={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        Request booking
      </SubmitButton>
    </FormCard>
  );
}

const meta: Meta<typeof BookingForm> = {
  title: "Examples/Booking Form",
  component: BookingForm,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof BookingForm>;

export const Default: Story = {
  render: () => <BookingForm />,
};
