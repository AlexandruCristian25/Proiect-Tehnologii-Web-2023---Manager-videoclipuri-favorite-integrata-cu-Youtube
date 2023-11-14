import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MeniuSite from './Nav';
import Artists from './Components/Artists';
import Artist from './Components/Artist';
import NewArtist from './Components/NewArtist';
import AddSong from './Components/AddSong';

function App() {
  return (

    <BrowserRouter>

      <MeniuSite />
      <Routes>

        <Route path="/" element={<Artists />} />
        <Route path="/Artists/:id_artist" element={<Artist />} />
        <Route path="/NewArtist" element={<NewArtist />} />
        <Route path="/AddSong" element={<AddSong />} />

      </Routes>
    </BrowserRouter >
  );
}


export default App;
