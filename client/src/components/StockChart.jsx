import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const StockChart = ({ data, ticker, color = '#6366f1' }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 10,
                    },
                },
            },
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 5,
            },
            line: {
                tension: 0.4,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    };

    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [
            {
                fill: true,
                label: `${ticker} Price`,
                data: data,
                borderColor: color,
                backgroundGradient: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.2), transparent)',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, `${color}33`);
                    gradient.addColorStop(1, `${color}00`);
                    return gradient;
                },
                borderWidth: 2,
            },
        ],
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default StockChart;
