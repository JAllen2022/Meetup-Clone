export default function formatDateString(string) {
  const date = new Date(string);
  const dateArray= date.toString().split(" ");
  const firstHalf = dateArray[0] + ", " + dateArray[1] + ' ' + dateArray[2];
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let ampm;
  if (hour > 12) {
    ampm = "PM";
  } else {
    ampm = "AM";
  }
    hour = hour > 12 ? hour - 12 : hour;
    if (hour.toString.length < 2) {
        hour = '0' + hour.toString();
    }
    if (minutes.toString.length < 2) {
      minutes = "0" + minutes.toString();
    }
  const timeZone =
    dateArray[dateArray.length - 3][1] +
    dateArray[dateArray.length - 2][0] +
    dateArray[dateArray.length - 1][0];

  // Format Fri, Jan 20 · 7:00 AM PST
  return `${firstHalf} · ${hour}:${minutes} ${ampm} ${timeZone}`;
}
