import ParaGuide from '../components/ParaGuide';

const Report = () => {
  return (
    <div>
      {/* ... your report content ... */}

      {/* PARA explanation on the report page */}
      <ParaGuide 
        variant="report" 
        message="This moderate result suggests a possible parasite. Here’s what it means and when you should see your GP." 
      />
    </div>
  );
};

export default Report;
