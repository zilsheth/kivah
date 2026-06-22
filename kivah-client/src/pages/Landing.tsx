function Landing() {
  return (
    <div className="min-h-screen bg-kivah-50 flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        <h1 className="text-5xl font-bold text-kivah-700 mb-4">Kivah</h1>
        <p className="text-xl text-kivah-500 mb-8">
          Your whole life, in one place.
        </p>
        <p className="text-gray-500 mb-10">
          For the full-time professional, part-time creative, and full-time parent 
          who refuses to choose between their ambitions.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/register"
            className="px-6 py-3 bg-kivah-600 text-white rounded-full font-medium hover:bg-kivah-700 transition"
          >
            Get started
            </a>
          <a       
            href="/login"
            className="px-6 py-3 border border-kivah-200 text-kivah-600 rounded-full font-medium hover:bg-kivah-100 transition"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

export default Landing