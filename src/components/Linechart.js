import React, { FC, useEffect, useState } from "react"
import { Chart } from "chart.js";
import { LuzResponse } from '../interfaces/luzResponse';

export const LineChart = ({ data, enabled, borderColor, backgroundColor, inKilowatts }) => {

    const labels = Object.keys(data);
    const [chartCreated, setchartCreated] = useState(false);
    const [myChart, setMyChart] = useState({});
    const chartRef = React.createRef();

    useEffect(() => {
        const myChartRef = chartRef.current.getContext('2d');
        //if(myChartRef.canvas.$chartjs != null && !chartCreated) return;

        const values = Object.values(data).map(value => inKilowatts ? (value.price / 100).toFixed(2) : value.price);
        
        if (chartCreated) {
            console.log("cleaning chart");
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
        else{
            console.log("creating chart");
            setchartCreated(true);
            setMyChart(new Chart(myChartRef, {
                type: 'line',
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
    return (
        <>
            <canvas id="myChart" ref={chartRef}></canvas>
        </>
    )
}