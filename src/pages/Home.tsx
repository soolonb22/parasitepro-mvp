import ParaGuide from '../components/ParaGuide';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Found something concerning in your stool?</h1>
      
      {/* This is where you put it */}
      <ParaGuide 
        variant="hero" 
        onStartAnalysis={() => navigate('/upload')} 
      />
    </div>
  );
};

export default Home;
