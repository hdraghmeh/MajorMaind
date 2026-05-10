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
  hobbies: string[];
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
  hobbies: [],
  workPreference: "",
  aspirations: "",
  concerns: "",
  completedAt: "",
};

export function getStudentProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentProfile;
    if (!Array.isArray(parsed.hobbies)) {
      parsed.hobbies = parsed.hobbies ? [parsed.hobbies as unknown as string] : [];
    }
    return parsed;
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

/** Build a compact Arabic context string to inject into the AI system prompt */
export function buildProfileContext(profile: StudentProfile): string {
  const lines: string[] = ["[ملف الطالب — استخدم هذا لتخصيص المقابلة، وتجاهل الأسئلة التي تمت الإجابة عنها]"];

  if (profile.name) lines.push(`الاسم: ${profile.name}`);
  if (profile.age) lines.push(`العمر: ${profile.age}`);
  if (profile.city) lines.push(`المدينة: ${profile.city}، فلسطين`);
  if (profile.tawjihiStream) lines.push(`مسار التوجيهي: ${profile.tawjihiStream}`);
  if (profile.tawjihiAverage) lines.push(`معدل التوجيهي: ${profile.tawjihiAverage}%`);
  if (profile.favoriteSubjects.length) lines.push(`المواد المفضلة: ${profile.favoriteSubjects.join("، ")}`);
  if (profile.leastFavoriteSubjects.length) lines.push(`المواد الأقل تفضيلاً: ${profile.leastFavoriteSubjects.join("، ")}`);
  if (profile.learningStyle) lines.push(`أسلوب التعلم: ${profile.learningStyle}`);
  if (profile.personality) lines.push(`الشخصية: ${profile.personality}`);
  if (profile.careerInterests.length) lines.push(`الاهتمامات المهنية: ${profile.careerInterests.join("، ")}`);
  const hobbiesArr = Array.isArray(profile.hobbies) ? profile.hobbies : (profile.hobbies ? [profile.hobbies as unknown as string] : []);
  if (hobbiesArr.length) lines.push(`الهوايات والاهتمامات: ${hobbiesArr.join("، ")}`);
  if (profile.workPreference) lines.push(`تفضيل بيئة العمل: ${profile.workPreference}`);
  if (profile.aspirations) lines.push(`الطموحات المستقبلية: ${profile.aspirations}`);
  if (profile.concerns) lines.push(`أبرز المخاوف بشأن المستقبل: ${profile.concerns}`);

  return lines.join("\n");
}
