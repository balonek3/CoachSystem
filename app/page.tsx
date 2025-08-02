export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Coach System</h1>
        <p className="mb-4">System działa!</p>
        <div className="space-y-2">
          <a href="/login" className="block text-blue-500 hover:underline">
            Przejdź do logowania
          </a>
          <a href="/dashboard" className="block text-blue-500 hover:underline">
            Przejdź do dashboard
          </a>
        </div>
      </div>
    </div>
  )
}