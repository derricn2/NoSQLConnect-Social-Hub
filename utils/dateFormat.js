// format a timestamp
const formatDate = (timestamp) => {
    // create new Date object from the provided timestamp
    const date = new Date(timestamp);

    // get month, day, year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    // get hours, minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // convert to 12-hour format
    hours = hours % 12 || 12;

    // format minutes with leading zero
    minutes = minutes.toString().padStart(2, '0');

    // construct formatted date string in "MM-DD, YYYY at HH:MM AM/PM" format

const formattedDate = `${month}-${day}, ${year} at ${hours}:${minutes} ${amOrPm}`;

return formattedDate;
};

module.exports = formatDate;