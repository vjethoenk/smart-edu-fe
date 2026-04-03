const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
      <p className="mt-4 text-lg font-medium text-gray-600">
        Đang tải dữ liệu...
      </p>
    </div>
  );
};

export default LoadingScreen;
