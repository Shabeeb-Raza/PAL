export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">PAL Portal</h1>
      <p className="text-lg text-gray-600">
        Student Advisory System - CS Department, IOBM
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-500">Coming soon</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          <p className="text-gray-500">Coming soon</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Risk Analysis</h2>
          <p className="text-gray-500">Coming soon</p>
        </div>
      </div>
    </main>
  );
}
