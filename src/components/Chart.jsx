import React, { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";

export default function Chart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    // Safety check: If ref doesn't exist, don't run
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: { 
        background: { type: ColorType.Solid, color: "#111827" }, 
        textColor: "white" 
      },
      grid: { vertLines: { color: "#374151" }, horzLines: { color: "#374151" } },
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    // FIX: In v5, use addSeries(LineSeries, options) instead of addLineSeries(options)
    const lineSeries = chart.addSeries(LineSeries, { 
      color: "#10b981",
      lineWidth: 2,
    });
    
    // Ensure data is valid before setting
    if (data && data.length > 0) {
        lineSeries.setData(data.map((p, i) => ({ time: i, value: p })));
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div className="w-full h-[300px] mt-4" ref={chartContainerRef}></div>;
}