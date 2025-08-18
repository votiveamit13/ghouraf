import React, { useMemo, useRef, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

export default function ActivityChart({
  title,
  subtitle,
  labels,
  series,
  height = 280,
  yLabel = "",
  showLegend = true,
  onPointClick,
}) {
  const chartRef = useRef(null);

const datasets = useMemo(() => {
  return series.map((s, idx) => ({
    label: s.label,
    data: s.data,
    type: s.type || "line",
    borderWidth: 2,
    pointRadius: 2,
    tension: s.tension ?? 0.3,
    fill: s.fill ?? (s.type === "line" ? false : true),
    backgroundColor: s.backgroundColor || `hsl(${idx * 60}, 70%, 55%)`,
  }));
}, [series]);


  const data = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        legend: {
          display: showLegend && series.length > 1,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              return `${ctx.dataset.label}: ${Intl.NumberFormat().format(v)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: Boolean(yLabel),
            text: yLabel,
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
          ticks: {
            callback: (v) => Intl.NumberFormat().format(v),
          },
        },
      },
    }),
    [showLegend, yLabel, series.length]
  );

  useEffect(() => {
    if (!onPointClick) return;
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas;
    const handler = (evt) => {
      const elements = chart.getElementsAtEventForMode(
        evt,
        "nearest",
        { intersect: true },
        false
      );
      if (elements.length) {
        const el = elements[0];
        const datasetIndex = el.datasetIndex;
        const index = el.index;
        onPointClick({
          label: labels[index],
          datasetLabel: datasets[datasetIndex]?.label,
          value: datasets[datasetIndex]?.data[index],
          datasetIndex,
          index,
        });
      }
    };

    canvas.addEventListener("click", handler);
    return () => canvas.removeEventListener("click", handler);
  }, [onPointClick, datasets, labels]);

  const primaryType = series?.[0]?.type || "line";
  const ChartComp = primaryType === "bar" ? Bar : Line;

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div style={{ height }}>
        <ChartComp ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
