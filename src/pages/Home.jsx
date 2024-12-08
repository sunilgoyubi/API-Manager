import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Globe, ArrowRight, Database, Cloud, Code } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            API Manager
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Streamline your API development workflow with powerful management tools and comprehensive documentation
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link to="/admin">
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Settings className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Admin Portal</h2>
                  <p className="text-slate-600">Manage APIs and Configuration</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">API Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">Deployment Control</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8">
                <ArrowRight className="w-6 h-6 text-blue-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link to="/platform">
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <Globe className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Platform</h2>
                  <p className="text-slate-600">Explore and Test APIs</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">API Documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">Testing Interface</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8">
                <ArrowRight className="w-6 h-6 text-emerald-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

       
        
      </div>
    </div>
  );
};

export default Home;