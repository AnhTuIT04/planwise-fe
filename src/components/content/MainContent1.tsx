"use client";

import { useState, useEffect, useRef } from "react";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TaskModal from "@/components/ui/TaskModal";
import {useSection} from "@/hooks/useSection";
import { useProject } from "@/hooks/userProject";
import { ISection } from "@/types/section.type";
import { IProject } from "@/types/project.type";

