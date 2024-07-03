import moment from "moment";

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

export function formatResponse(response: string) {
  const sections = response.split("\n").map((section, index) => {
    // Apply bold styling
    const formattedSection = section.replace(
      /\*\*(.*?)\*\*/g,
      "<strong className=`font-montserrat`>$1</strong>"
    );

    // Apply numbering and bullet points
    if (formattedSection.match(/^\d+\./)) {
      return (
        <li
          key={index}
          dangerouslySetInnerHTML={{ __html: formattedSection }}
        ></li>
      );
    }

    return (
      <p key={index} dangerouslySetInnerHTML={{ __html: formattedSection }}></p>
    );
  });

  return sections;
}
