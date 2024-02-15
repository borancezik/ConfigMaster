const Index = () => {
  const Applications = [
    { Id: "1", Name: "protein", Status: "1" },
    { Id: "2", Name: "tbs", Status: "0" },
    { Id: "3", Name: "imece", Status: "1" },
  ];
  return (
    <div className="w-full h-full p-20">
      {Applications.map((application, index) => (
        <div className="w-full h-14 flex items-center justify-center gap-x-4 mt-4">
          <div className="w-[95%] h-full bg-green-500 flex flex-row items-center justify-between rounded-lg">
            <span className="h-full w-[5%] flex items-center justify-center bg-pink-500">
              {application.Id}
            </span>
            <div className="w-[85%] h-full flex items-center bg-red-500">
              {application.Name}
            </div>
            <div className="h-full w-[7%] flex items-center justify-center bg-red-500">
              Offline
            </div>
          </div>
          <div className="w-[5%] h-full flex items-center justify-center bg-orange-500">
            Sil
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
