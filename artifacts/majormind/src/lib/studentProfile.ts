const PROFILE_KEY = "majormind.student-profile.v1";

export type TawjihiStream = "scientific" | "literary" | "commercial" | "industrial" | "other";
export type LearningStyle = "practical" | "visual" | "reading" | "discussion";
export type PersonalityType = "analytical" | "creative" | "balanced";

export interface StudentProfile {
  name: string;
  age: string;
  city: string;
  tawjihiStream: TawjihiStream | "";
  tawjihiAverage: string;
  favoriteSubjects: string[];
  leastFavoriteSubjects: string[];
  learningStyle: LearningStyle | "";
  personality: PersonalityType | "";
  careerInterests: string[];
  hobbies: string;
  workPreference: "alone" | "team" | "both" | "";
  aspirations: string;
  concerns: string;
  completedAt: string;
}

export const EMPTY_PROFILE: StudentProfile = {
  name: "",
  age: "",
  city: "",
  tawjihiStream: "",
  tawjihiAverage: "",
  favoriteSubjects: [],
  leastFavoriteSubjects: [],
  learningStyle: "",
  personality: "",
  careerInterests: [],
  hobbies: "",
  workPreference: "",
  aspirations: "",
  concerns: "",
  completedAt: "",
};

export function getStudentProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, completedAt: new Date().toISOString() }));
}

export function clearStudentProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

/** Build a compact context string to inject into the AI system prompt */
export function buildProfileContext(profile: StudentProfile): string {
  const lines: string[] = ["[STUDENT PROFILE — use this to personalise the interview, skip topics already answered]"];

  if (profile.name) lines.push(`Name: ${profile.name}`);
  if (profile.age) lines.push(`Age: ${profile.age}`);
  if (profile.city) lines.push(`City: ${profile.city}, Palestine`);
  if (profile.tawjihiStream) lines.push(`Tawjihi stream: ${profile.tawjihiStream}`);
  if (profile.tawjihiAverage) lines.push(`Tawjihi average: ${profile.tawjihiAverage}%`);
  if (profile.favoriteSubjects.length) lines.push(`Favourite subjects: ${profile.favoriteSubjects.join(", ")}`);
  if (profile.leastFavoriteSubjects.length) lines.push(`Least favourite subjects: ${profile.leastFavoriteSubjects.join(", ")}`);
  if (profile.learningStyle) lines.push(`Learning style: ${profile.learningStyle}`);
  if (profile.personality) lines.push(`Personality: ${profile.personality}`);
  if (profile.careerInterests.length) lines.push(`Career interests: ${profile.careerInterests.join(", ")}`);
  if (profile.hobbies) lines.push(`Hobbies / passions: ${profile.hobbies}`);
  if (profile.workPreference) lines.push(`Work preference: ${profile.workPreference}`);
  if (profile.aspirations) lines.push(`Long-term aspirations: ${profile.aspirations}`);
  if (profile.concerns) lines.push(`Main concerns about the future: ${profile.concerns}`);

  return lines.join("\n");
}
