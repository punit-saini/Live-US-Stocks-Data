"use client";
import React, { useState, useEffect, Fragment, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import usStockSymbols from '../usStockSymbols';
import initialRender from '../initialRender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { Router } from 'next/router';



const StockTable = () => {

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY
  const [outputData, setOutputData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [gainerData, setGainerData] = useState([])
  const [loserData, setLosserData] = useState([])
  const [defaultData, setDefaultData]=useState([])
  const [filterChangeLoader, setFilterChangeLoader]= useState(false)
  const [isDefaultFilter, setIsDefaultFilter] = useState(true)
  const [outputLength, setOutputLength] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [filteredData, setFilteredData] = useState()
  const [inputValue, setInputValue]= useState('')
  const [nameSearchValue, setNameSearchValue]=useState('')


  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = usStockSymbols.slice((page - 1) * 50, page * 50).map(async (stock) => {
        setOutputLength(page * 50);
        const dataURL = `https://financialmodelingprep.com/api/v3/quote/${stock}?apikey=${API_KEY}`;
        const response = await axios.get(dataURL);
        const companyData = response.data[0];

        if (companyData && companyData.marketCap && companyData.marketCap !== 'null' && companyData.marketCap !== '0') {
          const formattedData = {
            symbol: stock,
            market_cap: companyData?.marketCap,
            price: companyData?.price,
            volume: companyData?.volume,
            name: companyData?.name,
            percent_change: companyData?.changesPercentage,
          };
          return formattedData;
        } else {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const filteredResults = results.filter((item) => item !== null);
      setPage(page + 1);
      setDefaultData((prevData) => [...prevData, ...filteredResults]);
      setOutputData((prevData) => [...prevData, ...filteredResults]);
      setIsLoading(false);
      setErrorMessage('');
    } catch (error) {
      console.error('API request failed:', error);
      setIsLoading(false);
      setErrorMessage('API limit exceeded. Retrying in 30 seconds.');
      setTimeout(() => {
        setErrorMessage('API limit exceeded. Retrying in 15 seconds.');
        setTimeout(() => {
          setErrorMessage('API limit exceeded. Retrying in 5 seconds.');
          setTimeout(() => {
            setErrorMessage('');
            fetchData();
          }, 5000);
        }, 15000);
      }, 30000);
    }
  };

  const handleClick = async () => {
    if (defaultData.length >= 1 && !isDefaultFilter) {
    setIsDefaultFilter(true);
      console.log('already present')
      setOutputData(defaultData);
      return 
    }
    setIsDefaultFilter(true)
    console.log('it should not be her');
    setIsLoading(true);
    fetchData();
  };

  const sortByMarketCap = (data) => {
    return data.sort((a, b) => b.market_cap - a.market_cap);
  };

  useEffect(() => {
    setOutputData((prevData) => sortByMarketCap([...prevData]));
  }, [outputData]);
  // Search 
 

  // const filteredData = defaultData.filter((item) => {
  //   const regex = new RegExp(searchValue, 'i');
  //   return regex.test(item.symbol) || regex.test(item.name);
  // });

  // Gainers 


async function gainer(){
  setIsDefaultFilter(false)
  setFilterChangeLoader(true)
      if(gainerData.length>=1){
        // console.log('gainer data is already present')
        setOutputData(gainerData)
        setFilterChangeLoader(false)
        return;
      }
      setIsLoading(true)
      const symbolFetcher = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`
      const response = await axios.get(symbolFetcher)
        //    console.log('initial response is : ', response.data)
        // const stockSymbols =   response.data.map((stock)=> stock.symbol)
        const promises = response.data.slice(0,30).map(async (stock) => {
          const dataURL = `https://financialmodelingprep.com/api/v3/profile/${stock.symbol}?apikey=${API_KEY}`;
          const response = await axios.get(dataURL);
          const companyData = response.data[0];
    
          if (companyData) {
            const formattedData = {
              symbol: stock.symbol,
              logo: companyData?.image,
              market_cap: companyData?.mktCap,
              price: stock?.price,
              volume: companyData?.volAvg,
              name: companyData?.companyName,
              percent_change: stock?.changesPercentage,
              description: companyData?.description,
              industry: companyData?.industry,
            };
            return formattedData;
          } else {
            return null;
          }
        });
        const results = await Promise.all(promises);
        const filteredResults = results.filter((item) => item !== null);
        setGainerData([...filteredResults])
        setOutputData([...filteredResults]);
        setIsLoading(false)
        setFilterChangeLoader(false)
    }


async function loser(){
  setIsDefaultFilter(false)
  setFilterChangeLoader(true)
    
      if(loserData.length>=1){
        // console.log('loser data is already present')
        setOutputData(loserData)  
         setFilterChangeLoader(false)
        return;
      }
      setIsLoading(true)
      
      const symbolFetcher = `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`
      const response = await axios.get(symbolFetcher)
          //  console.log('initial response is : ', response.data)
        // const stockSymbols =   response.data.map((stock)=> stock.symbol)
        // console.log(stockSymbols, 'is final stock data')
        const promises = response.data.slice(0,30).map(async (stock) => {
          const dataURL = `https://financialmodelingprep.com/api/v3/profile/${stock.symbol}?apikey=${API_KEY}`;
          const response = await axios.get(dataURL);
          const companyData = response.data[0];
    
          if (companyData) {
            const formattedData = {
              symbol: stock.symbol,
              logo: companyData?.image,
              market_cap: companyData?.mktCap,
              price: stock.price,
              volume: companyData?.volAvg,
              name: companyData?.companyName, 
              percent_change: stock?.changesPercentage,
              description: companyData?.description,
              industry: companyData?.industry,
            };
            return formattedData;
          } else {
            return null;
          }
        });
        const results = await Promise.all(promises);
        const filteredResults = results.filter((item) => item !== null);
        setLosserData([...filteredResults])
        setOutputData([...filteredResults]);
        setIsLoading(false)
        setFilterChangeLoader(false)
    }
  

    const handleSearch = async(e) => {
      console.log('inside it , yeah!!')
      // e.preventDefault()
      console.log('e targe tca ', e)
      const dataURL = `https://financialmodelingprep.com/api/v3/profile/${e.toUpperCase()}?apikey=${API_KEY}`;
      const response = await axios.get(dataURL)
      // console.log('this is value : ', e.target.query.value)
      console.log('this is : ', response)
      const companyData = response.data[0]
      if(companyData){
        const formattedData = {
          symbol: e.toUpperCase(),
          market_cap: companyData?.mktCap,
          price: companyData?.price,
          volume: companyData?.volAvg,
          name: companyData?.companyName,
          percent_change: companyData?.changes,
        };
        // setSearchValue([formattedData])
        setShowSearch(true)
        setFilteredData([formattedData])
        console.log('filtered data is  : ', filteredData)
        // console.log('search value data is : ', seJarchValue)
      }
      else {
        setShowSearch(true)
        console.log('symbol not found, filtered data is set to empty')
        setFilteredData('')
      }
    }

  const formatMarketCap = (value) => {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixIndex = 0;

    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
      value /= 1000;
      suffixIndex++;
    }

    return `${value.toFixed(1)} ${suffixes[suffixIndex]}`;
  };

  const formatPercentChange = (value) => {
    return parseFloat(value).toFixed(2);
  };

  
const formatPercentChangeColor = (value) => {
  return value >= 0 ? 'green' : 'red';
  };
  
  const getArrowIcon = (value) => {
  return value >= 0 ? faArrowUp : faArrowDown;
  };

  const formatVolume = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };



  const columns = [
  {
  name: 'Logo',
  selector: (row) => (
    <a target='_self' href={`/stock/${row.symbol}`}>
  <img
  
  src={`https://financialmodelingprep.com/image-stock/${row.symbol}.png`}
  style={{ width: '60px', padding: '10px' , margin : '4px', cursor : 'pointer' }} 
  alt={row.symbol}
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop in case fallback image fails to load
    e.target.src = 'https://img.icons8.com/color/48/error--v1.png'; // Set the fallback image URL here
  }}
  />
  </a>
  ),
  wrap: true,
  },
    {
      name: 'Symbol',
      selector: (row) => (
        <span style={{cursor : 'pointer'}} >
         <a  href={`/stock/${row.symbol}`}>{row.symbol}</a> 
        </span>
      ),
     
    },
    {
      name: 'Name',
      selector: (row) => (
        <span style={{cursor : 'pointer', textDecoration : 'underline'}} >
          <a href={`/stock/${row.symbol}`}>{row.name}</a>
        </span>
      ),
      
    },
    
  {
    name: 'Volume',
    selector: (row) => formatVolume(row.volume),
  },
  {
  name: 'Market Cap',
  selector: (row) => formatMarketCap(row.market_cap),
  },
  {
  name: 'Percent Change',
  selector: (row) => (
  <span style={{ color: formatPercentChangeColor(row.percent_change) }}>
  {formatPercentChange(row.percent_change)}%
  <FontAwesomeIcon
  icon={getArrowIcon(row.percent_change)}
  style={{ marginLeft: '5px' }}
  />
  </span>
  ),
  },
  {
  name: 'Price',
  selector: (row) => (
  <span style={{ color: 'voilet', fontWeight : 'bold' }}>$ {row.price} </span>
  ),
  },
  ];

  const handleFilterOptionChange = (e)=>{
    if(e.target.value == 'gainers'){
       gainer()
       setIsDefaultFilter(false)
    }
    else if(e.target.value == 'losers'){
      loser()
      setIsDefaultFilter(false)
      // console.log('loser')
    }
    else {
      handleClick()
      setIsDefaultFilter(true)
      // console.log('default');
    }
  }

  const tableCustomStyles = {
   
    rows: {
      style: {
        color: "STRIPEDCOLOR",
        backgroundColor: "#e8eded"
      },
    }
  }

  const handleInputChange = (e)=> {
    setInputValue(e.target.value)
    console.log(e.target.value , 'is valvue')
      if(e.target.value== null || e.target.value==''){
        console.log('value is empty now')
         setShowSearch(false)
         return;
      }
      handleSearch(e.target.value);
  }

  const handleNameSearchChange = (e)=>{
    setNameSearchValue(e.target.value)
      console.log('triggered search name')
      const filteredResults = outputData.filter((item) => {
        return (
          item.symbol.toLowerCase().includes(nameSearchValue.toLowerCase()) ||
          item.name.toLowerCase().includes(nameSearchValue.toLowerCase())
        );
      });
      setFilteredData([...filteredResults]);
  }


  
  
  
  return (
  <>

  <div className=" mx-auto">
  <div className="shadow-2xl">
    { errorMessage.length>=1 && <h1 style={{position : 'fixed', top : '20px', zIndex : '999', marginLeft : '20px', marginTop : '60px', padding : '12px 20px', backgroundColor : 'greenyellow' , borderRadius : '12px'}} className='top-6 fixed'>{errorMessage}</h1>}
    <div style={{ display : 'flex'}}>
        <select style={{ cursor : 'pointer', backgroundColor : '#e8eded', padding  : '7px 7px'}} onChange={handleFilterOptionChange}>
          <option style={{cursor : 'pointer'}} value="default">Default</option>
          <option style={{cursor : 'pointer'}} value="gainers">Top Gainers</option>
          <option style={{cursor : 'pointer'}} value="losers">Top Losers</option>
        </select>
   { filterChangeLoader && <img style={{  textAlign : 'center', width : '40px'}} src='loading.svg' />}

    </div>
      
  <DataTable
  columns={columns}
  data= { nameSearchValue.length>=1? filteredData : showSearch ? filteredData : outputData}
  highlightOnHover
  // fixedHeaderScrollHeight="490px"
  // fixedHeader={modalIsOpen ? false : true}
  customStyles={tableCustomStyles}
  subHeader
  subHeaderComponent={isDefaultFilter &&
  <div className='flex gap-12 search-inputs'>
    {/* <form style={{ display: 'flex', alignItems: 'center' }}> */}
    <input
      name="query"
      onChange={(e) => handleInputChange(e)}
      type="text"
      value={inputValue}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        boxShadow: 'none',
        marginRight: '6px',
      }}
      placeholder="Search symbol..."
    />
    
  {/* </form> */}
  
  <input
      name="nameSearch"
      onChange={(e) => handleNameSearchChange(e)}
      type="text"
      value={nameSearchValue}
      style={{
        padding: '8px 12px',
        
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        boxShadow: 'none',
        marginLeft : '40px',
        marginRight: '10px',
      }}
      placeholder="Internal Search"
    />
    
 </div>
  }
  />
  </div>

  
  {isDefaultFilter ? (
  isLoading ? (
    <img
      style={{
        width: '35px',
        textAlign: 'center',
        margin: '10px auto 0 auto',
      }}
      src="/loading.svg"
      alt="Loading"
    />
  ) : (
    outputData && !showSearch && (
      <p
        onClick={handleClick}
        style={{
          textAlign: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px 20px',
          border: '1px solid #ccc',
          backgroundColor: '#000',
          borderRadius: '5px',
          width: 'fit-content',
          margin: '10px auto 0 auto',
        }}
      >
        Load More
      </p>
    )
  )
) : (
  <div></div>
)}


  </div>
</>
);
};


export default StockTable;
