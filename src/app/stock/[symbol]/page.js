'use client'
import React, { useState, useEffect } from 'react';
import '../../globals.css';
import axios from 'axios';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';

export default function Slug({ params }) {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const symbol = params.symbol;

  const [data, setData] = useState([]);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataURL = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`;
        const response = await axios.get(dataURL);
        const companyData = response.data[0];

        if (companyData) {
          setContent({
            symbol: symbol,
            logo: companyData.image,
            market_cap: companyData.mktCap,
            price: companyData.price,
            volume: companyData.volAvg,
            name: companyData.companyName,
            percent_change: ((companyData.changes / companyData.price) * 100).toFixed(2),
          });

          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);

          const historicalURL = `https://financialmodelingprep.com/api/v3/historical-market-capitalization/${symbol}?limit=90&apikey=${API_KEY}`;
          const historicalResponse = await axios.get(historicalURL);
          const historicalData = historicalResponse.data;
          const formattedHistoricalData = historicalData.map((item) => ({
            date: new Date(item.date),
            marketCap: item.marketCap,
          }));

          setData(formattedHistoricalData);
        } else {
          setContent(null);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setContent(null);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const formatVolume = (volume) => {
    return volume ? volume.toLocaleString() : '';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '';

    const units = ['', 'K', 'M', 'B', 'T'];
    const unitIndex = Math.floor(Math.log10(marketCap) / 3);
    const formattedMarketCap = (marketCap / Math.pow(1000, unitIndex)).toFixed(1);

    return `${formattedMarketCap}${units[unitIndex]}`;
  };

  if (!content) {
    return null; // You can render a loading state or message here
  }

  return (
    <div className='container'>
      <div className='content'>
        <div className=''>
          <div className='company-info'>
            <img
              className='company-logo'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://img.icons8.com/color/48/error--v1.png';
              }}
              src={content.logo}
              alt='Company Logo'
            />
            <p className='company-symbol'>{content.symbol}:US</p>
          </div>
        </div>
        <div className='company-details'>
          <h1 className='company-name'>{content.name}</h1>
          <p className='industry'>{content.industry}</p>
          <p className='volume'>
            <strong>Volume:</strong> {formatVolume(content.volume)}
          </p>
          <p className='market-cap'>
            <strong>Market Cap:</strong> {formatMarketCap(content.market_cap)}
          </p>
        </div>
        <div className='price-container'>
          <h1
            className='price'
            style={{ color: content.percent_change >= 0 ? 'green' : 'red' }}
          >
            <span>Price:</span> {content.price}
          </h1>
          <h1
            className='change'
            style={{ color: content.percent_change >= 0 ? 'green' : 'red' }}
          >
            <span>Change:</span> {content.percent_change}%
          </h1>
        </div>
      </div>

      <div className='chart-container'>
        <ResponsiveContainer width='100%' height={350}>
          <AreaChart data={data}>
            <XAxis
              reversed={true}
              dataKey='date'
              tick={true}
              axisLine={true}
              tickLine={true}
              tickFormatter={(value) => monthNames[new Date(value).getMonth()]}
              minTickGap={200} // Adjust the gap as needed to center the labels
            />
            <YAxis
              tickFormatter={(value) => formatMarketCap(value)}
              domain={['dataMin', 'dataMax']}
              tickCount={5}
            />
            <Tooltip
              formatter={(value) => formatMarketCap(value)}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              contentStyle={{ lineHeight : '20px', padding : '20px', color : 'black' }}
              
    />
            <Area type='monotone' dataKey='marketCap' stroke='#8884d8' fill='#8884d8' />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
