

import fs from 'fs';
// Define the API URL
const apiUrl = `https://financialmodelingprep.com/api/v3/available-traded/list?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

// Define the US stock exchanges
    const usExchanges = ['NYSE', 'NASDAQ', 'AMEX'];

        const tophund = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JNJ', 'V', 'UNH', 'TSM', 'XOM', 'LLY', 'WMT', 'JPM', 'NVO', 'PG', 'MA', 'MRK', 'CVX', 'HD', 'KO',
        'PEP', 'ORCL', 'AVGO', 'ABBV', 'ASML', 'AZN', 'COST', 'BABA', 'NVS', 'MCD', 'BAC', 'PFE', 'SHEL', 'TMO', 'CRM', 'TM', 'ABT', 'CSCO', 'NKE', 'LIN', 'FMX', 'ACN', 'TMUS', 'CMCSA', 'DIS',
        'DHR', 'VZ', 'NEE', 'AMD', 'ADBE', 'SAP', 'NFLX', 'HSBC', 'PM', 'BHP', 'TTE', 'TXN', 'UPS', 'WFC', 'BMY', 'RTX', 'MS', 'UL', 'SNY', 'RY', 'HON', 'HDB', 'AMGN', 'SBUX', 'T',
        'UNP', 'LOW', 'BUD', 'INTC', 'COP', 'BA', 'INTU', 'MDT', 'SPGI', 'SONY', 'PLD', 'QCOM', 'LMT', 'TD', 'IBM', 'DE', 'AXP', 'ELV', 'SYK', 'CAT', 'GE', 'ISRG', 'GS', 'MDLZ', 'BP', 'BDX', 'PYPL', 'EQIX', 'FISV', 'ITW', 'DUK', 'SNPS', 'NOC', 'EL', 'WM', 'SLB', 'CME', 'PANW', 'EOG', 'HUM', 'CSX', 'BX', 'APD', 'ATVI', 'CL', 'KLAC', 'CDNS', 'MNST', 'SHW', 'TGT', 'ICE', 'KKR', 'MCO', 'VMW', 'GD', 'SNOW', 'CMG', 'MMM', 'EPD', 'FDX', 'WDAY', 'SCCO', 'ORLY', 'MAR', 'FTNT', 'HSY', 'FXX', 'OXY', 'MCK', 'MRVL','EW', 'PSA', 'ANET', 'MRNA', 'GIS', 'CHTR', 'F', 'CCI', 'PNC', 'ECL', 'NSC', 'CTAS', 'ROP', 'USB', 'KVUE', 'PXD', 'GM', 'MSI', 'EMR', 'KHC', 'MPC', 'APH', 'KMB', 'RSG', 'SRE', 'LVS', 'STZ', 'PSX', 'KPD', 'AJG', 'ADSK', 'PH', 'TDG', 'BIIB', 'AZO', 'AEP', 'TFC', 'COF', 'MCHP', 'CPRT', 'D', 'PCG', 'HES', 'MET', 'ET', 'TRV', 'AFL', 'O', 'AIG', 'SPG', 'CTVA', 'PAYX', 'APO', 'VLO', 'EXC','URI', 'ALNY', 'RBLX', 'ALB', 'SBAC', 'ES', 'FANG', 'CBRE', 'STT', 'EQR', 'DAL', 'FTV', 'EBAY', 'MKC', 'VRSN', 'MPWR', 'CDW', 'NET', 'TTWO', 'TSCO', 'ALGN', 'K', 'CHD', 'UDR', 'DTE', 'HR', 'FSLR', 'RCL', 'HIG', 'CQP', 'FE', 'GPC', 'CAH', 'AEE', 'INVH', 'WY', 'ULTA', 'ETR', 'BAX', 'MTB', 'EXR', 'ZS', 'HPE', 'IFF', 'ROL', 'RJF', 'ARE', 'CLX', 'DRI', 'FICO', 'ZM', 'PODD', 'DOV', 'PPL', 'HOLX','HEI', 'HWM', 'LH', 'LYV', 'TDY', 'FCNCA', 'SYM', 'NVR', 'TSN', 'OMC', 'MKL', 'VTR', 'CTRA', 'BRO', 'BR', 'MAA', 'CNP', 'LUV', 'JBHT', 'PAYC', 'FITB', 'COO', 'WAB', 'BMRN', 'EXPD', 'FLT', 'ABMD', 'SUI', 'BALL', 'SPLK', 'CMS', 'RF', 'PFG', 'CAG', 'MOH', 'SNAP', 'SWKS', 'TYL', 'FWONK', 'ATO','STLD', 'TW', 'LW', 'RKT', 'PTC'
        ]


// Filter the US and other stocks by exchange
async function filterStocks() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  const usStocks = data.filter(stock => usExchanges.includes(stock.exchangeShortName));
//   const usStocks = partiallyFiltered.filter(stock => tophun.includes(stock.symbol) )

  return {
    usStocks
  };
}



// Write the stock symbols to their corresponding files
async function writeSymbolsToFile() {
  const { usStocks } = await filterStocks();
  const partialFilter = usStocks.filter(stock=> !tophund.includes(stock.symbol))
  const finalFilter = partialFilter.map(stock => stock.symbol)
  const usStockSymbols = [ ...tophund, ...finalFilter ]
  fs.writeFileSync('usStockSymbols.js', `module.exports = ${JSON.stringify(usStockSymbols)};`);
}




async function main() {
  try {
    await writeSymbolsToFile();
    console.log('Stock symbols saved to file');
  } catch (error) {
    console.error(error);
  }
}
main();
