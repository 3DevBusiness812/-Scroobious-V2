export default function AssistantHeader() {
  return (
    <div className="px-6 py-3 space-y-4 bg-gray-50 border sm:sticky sm:top-6 z-10 border-b-gray-300 rounded-md shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full border border-gray-200 shadow-sm bg-white">
          <img src="/favicon.png" className="h-full w-16" />
        </div>
        <div className="py-2">
          <h1 className="text-lg font-medium text-gray-900">
            Pipstant: Your Scroobious AI Assistant
          </h1>
          <p>
            Hi, I'm Pipstant - the Scroobious AI Assistant, and I am here to help you prepare and improve your
            Scroobious Investor Portal listing to attract more investors.
          </p>
        </div>
      </div>
      <hr />
      <p className="text-xs text-gray-500">
        Powered by OpenAI.{" "}
      </p>
    </div>
  );
}
