'use client'

export default function AdminSettings() {
  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Platform Settings</h1>
        <p className="text-base text-seaweed-600">
          Configure Noor Ul Fityan platform settings and preferences
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl border-l-4 border-seaweed-500">
        <h2 className="text-xl font-bold text-seaweed-800 mb-4">Organization Settings</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Manage platform settings and organization information.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Name
            </label>
            <input
              type="text"
              defaultValue="Noor Ul Fityan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-seaweed-500 focus:border-seaweed-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Mode
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Enable maintenance mode
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Notifications
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Send email notifications
              </label>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="bg-seaweed-600 text-white px-4 py-2 rounded-md hover:bg-seaweed-700 transition-colors font-medium">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

