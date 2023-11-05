import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';

import axios from '../../../utils/axios';

// chart options
const barChartOptions = {
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            vertical: true,
            barWidth: '2%'
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['All Vendors', 'Approved Vendors', 'Non Approved Vendors']
    }
};

// ==============================|| BAR CHART ||============================== //

const ApexBarChart = () => {
    const theme = useTheme();
    const { navType } = useConfig();
    const [graphdata, setGraphdata] = useState([]);
    const [series, setSeries] = useState([
        {
            data: []
        }
    ]);
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];

    const successDark = theme.palette.success.dark;

    const vendorData = async () => {
        try {
            const data = ['all', 'approved', 'non-approved'];
            const requests = data.map((item) => axios.get(`/vendors?get=${item}`));
            const responses = await Promise.all(requests);

            const arr = responses.map((response) => response.data.count);
            setGraphdata(arr);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
    useEffect(() => {
        vendorData();
    }, []);
    useEffect(() => {
        const seriesData = [
            {
                data: graphdata
            }
        ];
        setSeries(seriesData);
    }, [graphdata]);

    const [options, setOptions] = useState(barChartOptions);

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [successDark],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            }
        }));
    }, [navType, primary, darkLight, grey200, successDark]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default ApexBarChart;
