import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LogIn, SignUp, HomePage, CreateTournament, UserHub} from './components';
import './index.css';

function App() {
  return (

    
        

      <Router>
        <div className="App">        
          {/*<Header/>*/}
            <div>
            <ul className='content'>

            <Routes>
              <Route exact path='/' element={<LogIn/>}></Route>
              <Route path='/register' element={<SignUp/>}></Route>
              <Route path='/home' element={<HomePage/>}></Route>
              <Route path='/createTournament' element={<CreateTournament/>}></Route>
              <Route path='/userHub' element={<UserHub/>}></Route>
            </Routes>

            </ul>
            </div>
          {/*<Footer/>*/}
        </div>
      </Router>
    
  );
}

export default App;
