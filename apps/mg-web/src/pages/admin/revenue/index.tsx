import React, { useEffect, useRef } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

type RevenueRecord = {
  key: string;
  type: string;
  users: number;
  orders: number;
  amount: number;
  trend: 'up' | 'down';
};

type MonthlyRevenue = {
  month: string;
  current: number;
  last: number;
};

const dataSource: RevenueRecord[] = [
  {
    key: 'normal',
    type: '普通会员',
    users: 120,
    orders: 320,
    amount: 9800,
    trend: 'up',
  },
  {
    key: 'vip',
    type: '至尊会员',
    users: 35,
    orders: 140,
    amount: 16800,
    trend: 'up',
  },
];

const monthlyRevenue: MonthlyRevenue[] = [
  { month: '01', current: 12000, last: 9000 },
  { month: '02', current: 13500, last: 9500 },
  { month: '03', current: 15000, last: 10000 },
  { month: '04', current: 16000, last: 11000 },
  { month: '05', current: 18000, last: 11500 },
  { month: '06', current: 19000, last: 11800 },
  { month: '07', current: 21000, last: 12000 },
  { month: '08', current: 22500, last: 12500 },
  { month: '09', current: 23000, last: 13000 },
  { month: '10', current: 24000, last: 14000 },
  { month: '11', current: 25000, last: 15000 },
  { month: '12', current: 26000, last: 16000 },
];

const columns = [
  {
    title: '会员类型',
    dataIndex: 'type',
    key: 'type',
    render: (text: string) => <Tag>{text}</Tag>,
  },
  {
    title: '人数',
    dataIndex: 'users',
    key: 'users',
  },
  {
    title: '订单数',
    dataIndex: 'orders',
    key: 'orders',
  },
  {
    title: '收入金额（元）',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '趋势',
    dataIndex: 'trend',
    key: 'trend',
    render: (trend: 'up' | 'down') =>
      trend === 'up' ? (
        <span style={{ color: '#3f8600' }}>
          <ArrowUpOutlined /> 上升
        </span>
      ) : (
        <span style={{ color: '#cf1322' }}>
          <ArrowDownOutlined /> 下降
        </span>
      ),
  },
];

const AdminRevenuePage: React.FC = () => {
  const totalAmount = dataSource.reduce((sum, item) => sum + item.amount, 0);
  const normal = dataSource.find((item) => item.key === 'normal');
  const vip = dataSource.find((item) => item.key === 'vip');

  const barRef = useRef<HTMLDivElement | null>(null);
  const pieRef = useRef<HTMLDivElement | null>(null);
  const donutRef = useRef<HTMLDivElement | null>(null);
  const monthlyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!barRef.current || !pieRef.current || !donutRef.current || !monthlyRef.current) return;

    const primaryColor = '#1677ff';
    const vipColor = '#faad14';
    const normalColor = '#36cfc9';
    const textColor = '#1f2933';
    const axisLineColor = '#e5e7eb';

    const barOption: EChartsOption = {
      title: {
        text: '会员收入对比',
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 14,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 0,
        textStyle: {
          color: '#f9fafb',
        },
      },
      xAxis: {
        type: 'category',
        data: dataSource.map((item) => item.type),
        axisLine: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      series: [
        {
          type: 'bar',
          data: dataSource.map((item) => item.amount),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: primaryColor },
                { offset: 1, color: '#93c5fd' },
              ],
            },
            borderRadius: [6, 6, 0, 0],
          },
          barWidth: '40%',
          emphasis: {
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(37, 99, 235, 0.35)',
            },
          },
        },
      ],
    };

    const pieOption: EChartsOption = {
      title: {
        text: '收入占比',
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 14,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 0,
        textStyle: {
          color: '#f9fafb',
        },
        formatter: '{b}<br/>收入：¥{c}<br/>占比：{d}%',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '收入',
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '48%'],
          data: dataSource.map((item) => ({
            name: item.type,
            value: item.amount,
          })),
          color: [primaryColor, vipColor],
          label: {
            show: true,
            position: 'outside',
            color: textColor,
            fontSize: 12,
            formatter: '{b} {d}%',
          },
          labelLine: {
            length: 16,
            length2: 8,
            lineStyle: {
              color: '#e5e7eb',
            },
          },
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          emphasis: {
            scale: true,
            scaleSize: 4,
            itemStyle: {
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowColor: 'rgba(15, 23, 42, 0.35)',
            },
          },
        },
      ],
    };

    const donutOption: EChartsOption = {
      title: {
        text: '会员人数占比',
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 14,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 0,
        textStyle: {
          color: '#f9fafb',
        },
        formatter: '{b}<br/>人数：{c} 人<br/>占比：{d}%',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '人数',
          type: 'pie',
          radius: ['60%', '78%'],
          center: ['50%', '48%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            color: textColor,
            fontSize: 14,
            fontWeight: 600,
            formatter: () => {
              const totalUsers = dataSource.reduce((sum, item) => sum + item.users, 0);
              return `{title|总人数}\n{value|${totalUsers}}`;
            },
            rich: {
              title: {
                fontSize: 12,
                lineHeight: 18,
                color: '#9ca3af',
              },
              value: {
                fontSize: 18,
                lineHeight: 24,
                color: textColor,
                fontWeight: 600,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: dataSource.map((item) => ({
            name: item.type,
            value: item.users,
          })),
          color: ['#22c55e', '#0ea5e9'],
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          emphasis: {
            scale: true,
            scaleSize: 4,
            itemStyle: {
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowColor: 'rgba(15, 23, 42, 0.35)',
            },
          },
        },
      ],
    };

    const months = monthlyRevenue.map((m) => m.month);
    const currentValues = monthlyRevenue.map((m) => m.current);
    const lastValues = monthlyRevenue.map((m) => m.last);

    const monthlyOption: EChartsOption = {
      title: {
        text: '近12个月收入趋势',
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 14,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 0,
        textStyle: {
          color: '#f9fafb',
        },
        formatter: (params: any) => {
          const index = params[0]?.dataIndex ?? 0;
          const currentValue = currentValues[index];
          const lastValue = lastValues[index];
          const prevValue = index > 0 ? currentValues[index - 1] : undefined;
          const yoy =
            lastValue && lastValue !== 0
              ? (((currentValue - lastValue) / lastValue) * 100).toFixed(1) + '%'
              : '-';
          const mom =
            prevValue && prevValue !== 0
              ? (((currentValue - prevValue) / prevValue) * 100).toFixed(1) + '%'
              : '-';
          return [
            '月份：' + months[index],
            '本年收入：¥' + currentValue.toLocaleString(),
            '去年收入：¥' + lastValue.toLocaleString(),
            '同比：' + yoy,
            '环比：' + mom,
          ].join('<br/>');
        },
      },
      legend: {
        top: 32,
        right: 16,
        textStyle: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      grid: {
        top: 64,
        left: 40,
        right: 32,
        bottom: 32,
      },
      xAxis: {
        type: 'category',
        data: months,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      series: [
        {
          name: '本年收入',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: currentValues,
          itemStyle: {
            color: primaryColor,
          },
          lineStyle: {
            width: 3,
            color: primaryColor,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(37, 99, 235, 0.20)' },
                { offset: 1, color: 'rgba(37, 99, 235, 0.02)' },
              ],
            },
          },
        },
        {
          name: '去年收入',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          data: lastValues,
          itemStyle: {
            color: '#9ca3af',
          },
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#9ca3af',
          },
        },
      ],
    };

    const barChart = echarts.init(barRef.current);
    const pieChart = echarts.init(pieRef.current);
    const donutChart = echarts.init(donutRef.current);
    const monthlyChart = echarts.init(monthlyRef.current);

    barChart.setOption(barOption);
    pieChart.setOption(pieOption);
    donutChart.setOption(donutOption);
    monthlyChart.setOption(monthlyOption);

    const handleResize = () => {
      barChart.resize();
      pieChart.resize();
      donutChart.resize();
      monthlyChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      barChart.dispose();
      pieChart.dispose();
      donutChart.dispose();
      monthlyChart.dispose();
    };
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="会员总收入"
              value={totalAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="普通会员收入"
              value={normal?.amount ?? 0}
              precision={2}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="至尊会员收入"
              value={vip?.amount ?? 0}
              precision={2}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <div ref={barRef} style={{ width: '100%', height: 280 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <div ref={pieRef} style={{ width: '100%', height: 280 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <div ref={donutRef} style={{ width: '100%', height: 280 }} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card bordered={false}>
            <div ref={monthlyRef} style={{ width: '100%', height: 320 }} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title="会员收入维度明细" bordered={false}>
          <Table<RevenueRecord>
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="key"
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminRevenuePage;
