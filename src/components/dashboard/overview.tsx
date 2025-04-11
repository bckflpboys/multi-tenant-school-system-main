"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function Overview() {
  const data: ChartData<"bar"> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Student Attendance",
        data: [65, 59, 80, 81, 56, 89],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
      {
        label: "Class Performance",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 2,
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'rgb(17, 24, 39)',
        bodyColor: 'rgb(107, 114, 128)',
        borderColor: 'rgb(229, 231, 235)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title(tooltipItems: TooltipItem<"bar">[]) {
            return tooltipItems[0].label;
          },
          label(tooltipItem: TooltipItem<"bar">) {
            return ` ${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}%`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgb(243, 244, 246)',
        },
        ticks: {
          font: {
            size: 12,
          },
          format: {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        },
      },
    },
  }

  return (
    <div className="h-[350px] w-full">
      <Bar options={options} data={data} />
    </div>
  )
}
