"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarIcon, MapPin, Users } from "lucide-react";

import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import useModal from "@/hooks/useModal";
import { useCalendar } from "@/hooks/useCalendar";

export default function CreateEventModal() {
  const { isSubmitting, onSubmit, closeModal } = useModal<"CREATE_EVENT">();
  const { createEvent } = useCalendar("GOOGLE_CALENDAR");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [allDay, setAllDay] = useState(false);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [location, setLocation] = useState("");

  const [attendeeInput, setAttendeeInput] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);

  const addAttendee = () => {
    if (!attendeeInput) return;

    setAttendees([...attendees, attendeeInput]);
    setAttendeeInput("");
  };

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email));
  };

  const handleSubmit = async () => {
    const payload = {
      provider: "GOOGLE_CALENDAR" as const,
      title,
      description,
      isAllDay: allDay,
      startTime: formatInTimeZone(startDate, Intl.DateTimeFormat().resolvedOptions().timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      endTime: formatInTimeZone(endDate, Intl.DateTimeFormat().resolvedOptions().timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      location,
      attendees,
    };
    await createEvent(payload);
    await onSubmit();
    console.log("Event created:", payload);
    closeModal();
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create Calendar Event</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Title */}
        <Input placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />

        {/* Description */}
        <Textarea
          placeholder="Event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* All Day */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">All Day Event</span>
          <Checkbox checked={allDay} onCheckedChange={() => setAllDay(!allDay)} />
        </div>

        {/* Start Time */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Start Time</span>
          <Input
            type="time"
            value={format(startDate, "HH:mm")}
            onChange={e => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newDate = new Date(startDate);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              setStartDate(newDate);
            }}
          />
        </div>

        {/* End Time */}
        <div className="space-y-1">
          <span className="text-sm font-medium">End Time</span>
          <Input
            type="time"
            value={format(endDate, "HH:mm")}
            onChange={e => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newDate = new Date(endDate);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              setEndDate(newDate);
            }}
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        {/* Attendees */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Attendees</span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter attendee email"
              value={attendeeInput}
              onChange={(e) => setAttendeeInput(e.target.value)}
            />

            <Button className="bg-green-500 hover:bg-green-600" type="button" onClick={addAttendee}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {attendees.map((email) => (
              <Badge key={email} variant="secondary" className="cursor-pointer" onClick={() => removeAttendee(email)}>
                {email} ✕
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button className="inline-flex items-center rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-3 py-1 font-semibold text-white shadow-sm transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808] sm:px-4 sm:py-2" disabled={isSubmitting} onClick={handleSubmit}>
          Create Event
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
