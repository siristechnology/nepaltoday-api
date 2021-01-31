import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class StackedColumnChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    height: 359,
                    type: "bar",
                    stacked: !0,
                    toolbar: {
                        show: 1
                    },
                    zoom: {
                        enabled: !0
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: !1,
                        columnWidth: "15%",                          
                        // endingShape: "rounded"
                    }
                },
                dataLabels: {
                    enabled: !1
                },
                xaxis: {
                    categories: ['headline','politics','entertainment','news','business','social', 'sports', 'health', 'technology','agriculture','share','cartoon']
                },
                colors: ["#556ee6", "#f1b44c", "#34c38f"],
                legend: {
                    position: "bottom"
                },
                fill: {
                    opacity: 1
                }
            }
        }
    }

    render() {
        const stat = this.props.stat || []
        const series = [{name: "Read Category", data: stat.map(x => x.data)}]
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={series} type="bar" height="359" />
            </React.Fragment>
        );
    }
}

export default StackedColumnChart;
