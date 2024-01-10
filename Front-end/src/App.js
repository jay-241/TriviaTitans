import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import Authentication from './Pages/Authentication';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Verification from './Pages/Verification';
// import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import Leaderboard from './Pages/Leaderboard';
import Quiz from './Pages/Quiz';
// import TeamDetails from './Pages/TeamDetails';
import CreateTeam from './Pages/CreateTeam';
import LobbyPage from './Pages/LobbyPage';
import AddCategoryForm from "./Pages/AddCategoryForm";
import AddGames from "./Pages/AddGames";
import AddQuestionsForm from "./Pages/AddQuestionsForm";
import FilteredGames from "./Pages/FilteredGames";
import FilteredQuestions from "./Pages/FilteredQuestions";
import ShowAllCategories from "./Pages/ShowAllCategories";
import TeamStats from './Pages/TeamStats';


import TeamDetails from './Pages/TeamDe';
function App() {

  useEffect(() => {
    // Amplify.configure({
    //   Auth: {
    //     region: 'us-east-1',
    //     userPoolId: 'us-east-1_1Xcd4lxHQ',
    //     userPoolWebClientId: '6hn9vmanqlt905sa1n0skc8ql6',
    //     oauth: {
    //       domain: 'triviatitans.auth.us-east-1.amazoncognito.com',
    //       scope: ['email', 'profile', 'openid'],
    //       redirectSignIn: 'http://localhost:3000',
    //       responseType: 'code'
    //     }
    //   }
    // });
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Authentication />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/*" element={<Home />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='/teams' element={<TeamDetails />} />
        {/**
         * Mudra's routes
         * */}
        <Route path='/create-team' element={<CreateTeam />} />
        <Route path='/join-game' element={<LobbyPage />} />
        <Route path='/team-stats' element={<TeamStats />} />
        {/**
         * Trusha's routes
         * */}
        <Route path='/admin/category/add' element={<AddCategoryForm />} />
        <Route path='/admin/game/add' element={<AddGames />} />
        <Route path='/admin/questions/add' element={<AddQuestionsForm />} />
        <Route path='/admin/games/filter' element={<FilteredGames />} />
        <Route path='/admin/questions/filter' element={<FilteredQuestions />} />
        <Route path='/admin/categories' element={<ShowAllCategories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;