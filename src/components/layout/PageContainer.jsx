export default function PageContainer({ children }) {
  return (
    <div
      className="
        mx-auto
        flex
        min-h-screen
        w-full
        max-w-[1100px]
        flex-col
      "
    >
      {children}
    </div>
  );
}