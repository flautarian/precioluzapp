import React, { FC, useEffect, useState } from "react"
import { Chart } from "chart.js";
import { LuzResponse } from '../interfaces/luzResponse';

export const LineChart = ({ data, enabled, borderColor, backgroundColor, inKilowatts }) => {

    const labels = Object.keys(data);
    const [chartCreated, setchartCreated] = useState(false);
    const [myChart, setMyChart] = useState({});
    const chartRef = React.createRef();

    function fitToContainer(){
        var canvas = document.querySelector('canvas');
        canvas.style.width='100%';
        canvas.style.height='100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

    useEffect(() => {
        const myChartRef = chartRef.current.getContext('2d');

        const values = Object.values(data).map(value => (inKilowatts ? value.price / 100 : value.price).toFixed(2));

        if (chartCreated) {
            myChart.data.labels = labels;
            myChart.data.datasets = [{
                data: values,
                label: inKilowatts ? "Precio €/Kwh" : "Precio €/Mwh",
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                fill: true,
            }
            ]
            myChart.update();
        }
        else {
            fitToContainer();
            setchartCreated(true);
            setMyChart(new Chart(myChartRef, {
                type: 'line',
                maintainAspectRatio: false, // set to false to allow adaptive resizing
                responsive: true,
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        label: inKilowatts ? "Precio €/Kwh" : "Precio €/Mwh",
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        fill: true,
                    }
                    ]
                },
            }));
        }
    }, [enabled, inKilowatts])

    useEffect(() => {
        window.addEventListener('resize', fitToContainer);
        return () => window.removeEventListener('resize', fitToContainer);
      }, []);

    return (
        <>
            <div class="chart-container">
                <canvas id="myChart" ref={chartRef}></canvas>
            </div>
        </>
    )
}