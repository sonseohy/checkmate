//대시 보드/ 도넛 파이 차트 
import ReactApexChart from "react-apexcharts";
import { useMobile } from "@/shared";

export const PieDonutChart: React.FC = () => {
    const isMobile = useMobile();

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut"
        },
        labels: ['분석',' 작성'],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '20px', // 각 항목의 값 크기 설정
                fontFamily: 'Pretendard',
                fontWeight: 'semibold',
            },
            formatter: (val: number) => `${val}개`,
            dropShadow: {
                enabled: true,
                top: 2,
                left: 2,
                blur: 3,
                opacity: 0.5,
            },
        },
        plotOptions: {
            pie: {
                customScale: 0.8,
                donut: {
                    size: "50%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '30px',
                            fontFamily: 'Pretendard',
                            fontWeight: 300,
                            offsetY: -10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        value: {
                            show:true,
                            fontSize: '25px',
                            fontFamily: "Pretendard",
                            fontWeight: 600,
                            offsetY: 16,
                            formatter: function (val) {
                                return val
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '30px',
                            fontFamily: 'Pretendard',
                            fontWeight: 800,
                            color: '#202020',
                            formatter: function (w) {
                                // 전체 합계를 표시하는 부분
                                return w.globals.seriesTotals.reduce((a: number, b:number) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            },
        },
        tooltip: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        colors: ['#B4C7FF', '#FFB4B5'],
        
    };

    const series = [55, 45];

    return (
        <div>
            <ReactApexChart options={options} series={series} type="donut" height={isMobile ? 300 : 400}/>
        </div>
    )
};
