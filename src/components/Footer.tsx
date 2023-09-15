export default function Footer() {
  return (
    <div className="w-full py-2 text-center text-gray-300 text-xs">
      © {(new Date()).getFullYear()} Scroobious
    </div>
  );
}
