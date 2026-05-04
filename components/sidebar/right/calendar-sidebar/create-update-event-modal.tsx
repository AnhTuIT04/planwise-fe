"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { MapPin, Users } from "lucide-react";

import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import useModal from "@/hooks/use-modal";
import { useCalendar } from "@/hooks/use-calendar";
import { useCalendarIntegration } from "@/hooks/use-calendar-integration";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

export default function CreateUpdateEventModal() {
  const { connections } = useCalendarIntegration("GOOGLE_CALENDAR");

  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(connections?.[0]?.id ?? null);

  const { data, isSubmitting, onSubmit, closeModal } = useModal<"CREATE_UPDATE_EVENT">();
  const { createEvent, updateEvent, deleteEvent } = useCalendar("GOOGLE_CALENDAR");

  const [title, setTitle] = useState(data.event.title);
  const [description, setDescription] = useState(data.event.description || ""); // default to empty string if undefined

  const [allDay, setAllDay] = useState(data.event.isAllDay || false); // default to false if undefined

  const [startDate, setStartDate] = useState<Date>(new Date(data.event.startTime));
  const [endDate, setEndDate] = useState<Date>(new Date(data.event.endTime));

  const [location, setLocation] = useState(data.event.location);

  const [attendeeInput, setAttendeeInput] = useState("");
  const [attendees, setAttendees] = useState<string[]>(data.event.attendees ?? []);

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
      connectionId: selectedConnectionId!,
      title,
      description,
      isAllDay: allDay,
      startTime: formatInTimeZone(
        startDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX",
      ),
      endTime: formatInTimeZone(endDate, Intl.DateTimeFormat().resolvedOptions().timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      location,
      attendees,
    };
    if (data.action === "CREATE") {
      await createEvent(payload);
    } else {
      await updateEvent({
        externalId: data.externalEventId!,
        provider: "GOOGLE_CALENDAR",
        data: {
          title,
          description,
          startTime: payload.startTime,
          endTime: payload.endTime,
          location,
        },
      });
    }
    await onSubmit();
    closeModal();
  };

  const handleDelete = async () => {
    if (!data.externalEventId) return;

    await deleteEvent({
      externalId: data.externalEventId,
      provider: "GOOGLE_CALENDAR",
    });

    await onSubmit();
    closeModal();
  };

  useEffect(() => {
    if (connections?.length && !selectedConnectionId) {
      setSelectedConnectionId(connections[0].id);
    }
  }, [connections]);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{data.action === "CREATE" ? "Create" : "Update"} Calendar Event</DialogTitle>
      </DialogHeader>

      <div className={`space-y-1 ${data.action === "UPDATE" ? "hidden" : ""}`}>
        <span className="text-sm font-medium">Calendar Account</span>

        <Select value={selectedConnectionId ?? ""} onValueChange={(value) => setSelectedConnectionId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>

          <SelectContent>
            {connections?.map((conn) => (
              <SelectItem key={conn.id} value={conn.id}>
                {conn.email || conn.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            onChange={(e) => {
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
            onChange={(e) => {
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
        <div className={`space-y-2 ${data.action === "UPDATE" ? "hidden" : ""}`}>
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Attendees</span>
          </div>

          <div className="flex gap-2">
            <Input
              disabled={data.action === "UPDATE"}
              placeholder="Enter attendee email"
              value={attendeeInput}
              onChange={(e) => setAttendeeInput(e.target.value)}
            />

            <Button
              disabled={!attendeeInput}
              className="bg-green-500 hover:bg-green-600"
              type="button"
              onClick={addAttendee}
            >
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

      <DialogFooter className="flex justify-between">
        {data.action === "UPDATE" && (
          <Button className="cursor-pointer bg-gray-500" disabled={isSubmitting} onClick={handleDelete}>
            Delete Event
          </Button>
        )}

        <Button
          className="inline-flex items-center rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-3 py-1 font-semibold text-white shadow-sm transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808] sm:px-4 sm:py-2"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {data.action === "CREATE" ? "Create" : "Update"} Event
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
