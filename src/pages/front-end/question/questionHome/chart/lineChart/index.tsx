import styles from "./index.module.css";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useEffect } from "react";

const LineChart = (props: any) => {
  console.log("@@@@@@@", props);
  useEffect(() => {
    initArticleBarChart();
  }, []);
  const initArticleBarChart = () => {
    let chartDom = document.getElementById("articleBar")!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;

    option = {
      title: {
        left: "center", // 水平居中
        text: "近10次成绩   ",
        textStyle: {
          color: "#4c4948", // 标题颜色
          fontSize: 22,
          fontWeight: "bold", // 标题字体粗细
        },
      },
      grid: {
        top: "35px",
        bottom: "35px",
        left: "35px",
        right: "35px",
      },
      xAxis: {
        type: "category",

        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: props.data,
          type: "line",
          smooth: true,
        },
      ],
    };

    option && myChart.setOption(option);
  };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className={styles["line-chart"]} id="articleBar"></div>
    </div>
  );
};
export default LineChart;
