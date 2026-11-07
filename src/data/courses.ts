import type { Course } from "@/lib/types";
import { baCourse } from "./ba";
import { amoaCourse } from "./spec/amoa";
import { bpmnCourse } from "./spec/bpmn";
import { dataSqlCourse } from "./spec/data-sql";
import { recetteCourse } from "./spec/recette";
import { entretiensCourse } from "./spec/entretiens";

/** Courses authored in the app (never generated). */
export const specializations: Course[] = [
  amoaCourse,
  bpmnCourse,
  dataSqlCourse,
  recetteCourse,
  entretiensCourse,
];
export const builtInCourses: Course[] = [baCourse, ...specializations];
