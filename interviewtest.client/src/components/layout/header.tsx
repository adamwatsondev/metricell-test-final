export default function Header() {
  return (
    <div className="flex w-full h-28 justify-center items-center bg-gradient-animate shadow-md relative">
      <img
        src="/images/metricell-logo.png"
        alt="Logo"
        width={100}
        height={100}
      />
      <span className="text-white text-2xl font-bold ml-4">
        Metricell Coding Challenge
      </span>
    </div>
  );
}
