const formatDate = require('./dateFormat');

const timestamp = Date.now();

const formattedDate = formatDate(timestamp);

console.log('Formatted Date:', formattedDate);

