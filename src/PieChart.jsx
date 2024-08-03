import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart( {labels, values} ) {


  const data = {

    labels: labels,

    datasets: [
      {
        data: values,
        backgroundColor: [
          "#7FFFD4",
          "#6495ED",
          "#F5F5DC",
          "pink",
          "yellow",
          "gray",
          "cyan",
          "#5F9EA0",
          "#D2691E",
          "#DC143C",
          "#B8860B",
          "#20B2AA"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Pie data={data} />
    </div>
  );
}

export default PieChart