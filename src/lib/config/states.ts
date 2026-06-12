export const NORTH_EAST_STATES = [
  { value: "Assam", label: "Assam", labelAs: "অসম" },
  { value: "ArunachalPradesh", label: "Arunachal Pradesh", labelAs: "অৰুণাচল প্ৰদেশ" },
  { value: "Manipur", label: "Manipur", labelAs: "মণিপুৰ" },
  { value: "Meghalaya", label: "Meghalaya", labelAs: "মেঘালয়" },
  { value: "Mizoram", label: "Mizoram", labelAs: "মিজোৰাম" },
  { value: "Nagaland", label: "Nagaland", labelAs: "নাগালেণ্ড" },
  { value: "Sikkim", label: "Sikkim", labelAs: "ছিক্কিম" },
  { value: "Tripura", label: "Tripura", labelAs: "ত্ৰিপুৰা" },
  { value: "AllIndia", label: "All India", labelAs: "ভাৰত" },
] as const;

export const STATE_LABELS: Record<string, string> = {
  Assam: "Assam",
  ArunachalPradesh: "Arunachal Pradesh",
  Manipur: "Manipur",
  Meghalaya: "Meghalaya",
  Mizoram: "Mizoram",
  Nagaland: "Nagaland",
  Sikkim: "Sikkim",
  Tripura: "Tripura",
  AllIndia: "All India",
};
