import StockTable from '../../components/StockTable';

export default function Home() {
  return (
    <main className="min-h-screen flex  justify-center bg-white">
      <div id='main-container' className="w-full mx-auto bg-white rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Stocks Data</h1>
        <StockTable
         />
      </div>
    </main>
  );
}
