export default function TokensTableLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <p>Hang tight...</p>
      <svg className="max-w-1/2" viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'>
        <circle
          className='spin2'
          cx='400'
          cy='400'
          fill='none'
          r='200'
          stroke-width='37'
          stroke='#E387FF'
          stroke-dasharray='505 1400'
          stroke-linecap='round'
        />
      </svg>
      <p className="animate-pulse">Coins are being loaded...</p>
    </div>
  );
}
