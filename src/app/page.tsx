import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Hero section */}
          <div className="space-y-8 mb-16">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-20 rounded-full transform -rotate-6"></div>
                <h1 className="relative text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight leading-none">
                  PRAXIX
                  <span className="absolute -top-3 -right-3 w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span className="absolute -bottom-2 -left-2 w-3 h-3 bg-indigo-500 rounded-full"></span>
                </h1>
              </div>
              <div className="mt-4 text-2xl md:text-3xl font-medium text-gray-600">School Management System</div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your educational institution with our comprehensive, AI-powered management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link 
                href="/auth/school/signin"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="relative">
                  Sign In to Test Our System
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              
              <Link 
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/10 border-2 border-blue-100 hover:border-blue-200"
              >
                Contact Sales
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 mt-1">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">20k+</div>
              <div className="text-gray-600 mt-1">Students</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="text-gray-600 mt-1">Support</div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Tenant Platform</h3>
              <p className="text-gray-600 leading-relaxed">Securely manage multiple schools from a single dashboard with complete data isolation and customization.</p>
            </div>
            
            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-indigo-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Features</h3>
              <p className="text-gray-600 leading-relaxed">Leverage advanced AI for automated lesson planning, smart assessments, and predictive analytics.</p>
            </div>
            
            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Tools</h3>
              <p className="text-gray-600 leading-relaxed">From attendance to finance, access all the tools you need to run your institution efficiently.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
