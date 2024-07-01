import moment from "moment";

export function getInitials(name: string) {
  // Split the name into words
  const words = name.split(" ");

  // Handle cases with no middle name
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  // Extract first letter of first and last name
  return `${words[0].charAt(0).toUpperCase()}${words[words.length - 1]
    .charAt(0)
    .toUpperCase()}`;
}

export const getValueFromSet = (set: any) => {
  // Convert the Set to an array and get the first element
  return Array.from(set)[0] || "";
};
export const getValuesFromSet = (set: any) => {
  // Convert the Set to an array and get the first element
  const array = Array.from(set) || "";
  return JSON.stringify(array);
};

export const calculateAge = (dob: string) => {
  var birthDate = moment(dob, "YYYY-MM-DD");
  var today = moment();
  var age = today.diff(birthDate, "years");
  return age;
};
