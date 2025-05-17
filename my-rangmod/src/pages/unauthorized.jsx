export default function UnauthorizedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
          <p className="mt-4">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  