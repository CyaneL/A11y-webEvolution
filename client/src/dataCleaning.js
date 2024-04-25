// Date converter as we always need one in JavaScript LOL and yike
//Convert the timestamp from yyyyMMdd to one that can be handled by chart.js
const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  // Manually correct the year by subtracting the offset if it's far in the future
  const yearOffset = date.getFullYear() > 2500 ? 587 : 0;
  let correctedYear = date.getFullYear() - yearOffset;

  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); 

  return `${correctedYear}-${month}-${day}`; 
};

const processDataForChart = (jsonData) => {
  const chartData = jsonData.map((data) => {
    return {
      date: formatDate(data.timestamp), // Ensure formatDate can handle your date format correctly
      violationCount: data.violations.length, // Count violations
    };
  });
  console.log(`I am CharData: ${chartData}`)
  // Sort by date
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Extract the labels
  const labels = chartData.map((data) => data.date);
  const dataPoints = chartData.map((data) => data.violationCount);

  console.log('I am lables', labels);
  console.log('I am dataPoints', dataPoints);

  return { labels, dataPoints };
};

export default processDataForChart;
