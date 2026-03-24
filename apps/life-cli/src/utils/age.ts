import dayjs from "dayjs";

export function calculateAgeInYears(options: {
  birthDate: string; // YYYY-MM-DD
  today?: string; // YYYY-MM-DD
}) {
  const today = dayjs(options.today ?? dayjs().format("YYYY-MM-DD"));
  const birth = dayjs(options.birthDate);

  const base = today.year() - birth.year();
  const hasHadBirthdayThisYear =
    today.month() > birth.month() ||
    (today.month() === birth.month() && today.date() >= birth.date());

  return hasHadBirthdayThisYear ? base : base - 1;
}

