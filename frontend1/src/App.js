import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import DisplayItem from './components/DisplayItem/DisplayItem';
import AddItem from './components/AddItem/AddItem';
import UpdateItem from './components/UpdateItem/UpdateItem';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';


function App() {
  return (
    <div>
      <React.Fragment>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/additem" element={<AddItem />} />
          <Route path="/allitems" element={<DisplayItem />} />
          <Route path="/updateitem/:id" element={<UpdateItem />} />
          {/* User MAnagement*/}
          <Route path='/Register' element={<Register />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/UserProfile' element={<UserProfile/>} />
          <Route path='/UpdateProfile/:id' element={<UpdateProfile/>} />

          </Routes>
      </React.Fragment>

      
    </div>
  );
}

export default App;
