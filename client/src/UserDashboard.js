import {  HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from "react-router";
import axios from 'axios';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

const UserDashboard = () => {

  const navigate = useNavigate();
  const Location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const[data,setData]=useState({})
  var n,c,val;
  const[events,setevents] = useState([])
  const[revents,setrevents] = useState([])
  const[cevents,setcevents] = useState([]) 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    var isLoggedIn = localStorage.getItem('isULoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/NotUloggedin');
    }

    fetchdata()
    .then(() => {
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setLoading(false); 
    });
  }, [navigate]);

  const fetchdata = async()=>{
    await fetch(`http://localhost:3001/fetchd?uid=${encodeURIComponent(Location.state.uid)}`, {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(res=>(res.json()))
    .then(json=>{
        setData(json); 
    })
  };

  const [pas, setpas] = useState({
    rpass: '',
    cpass: ''
  });

  const handlePChange = (e) => {
    setpas({
      ...pas,
      [e.target.name]: e.target.value
    });
  };

  const handlePSubmit = (e) => {
    e.preventDefault();

    if(pas.cpass !== pas.rpass){
      setpas({ rpass: '', cpass: '' });
      alert("Password Mismatch");
    }
    else{
    axios.post(' http://localhost:3001/changep', {pass:pas,user : Location.state.uid})
      .then(response => {
       if(response.data.message ==="1"){
        window.location.reload();
       }
       else{
        alert("Error Changing Password");
        setpas({ rpass: '', cpass: '' });
       }
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isULoggedIn', 'false');
    navigate('/user');
  };

  const fetchevents = async()=>{
    const response = await axios.get('http://localhost:3001/getevents', {
      params: {
        club: c
      }
    });
    const json = response.data;
    setevents(json.e);
  };

  const fetchrevents = async()=>{
    const response = await axios.get('http://localhost:3001/getrevents', {
      params: {
        club: c,
        nme:n,
        uid:Location.state.uid
      }
    });
    const json = response.data;
    setrevents(json);
  };

  const fetchcevents = async()=>{
    const response = await axios.get('http://localhost:3001/getcevents', {
      params: {
        club: c,
        nme:n,
        uid:Location.state.uid
      }
    });
    const json = response.data;
    setcevents(json);
  };

  const items = [
    getItem('Home', '1', <HomeOutlined />),
    getItem('Events', 'sub1', <UserOutlined />, [getItem('UpComing', '3'), getItem('Registerd', '4'), getItem('Completed', '5')]),
    getItem('Change Password', '11', <LogoutOutlined />),
    getItem('Log Out', '6', <LogoutOutlined />),
    
  ];

  const handleMenuClick = ({ key }) => {

    if(key ==='6'){
        handleLogout();
      }
    if(key  ==="3"){
        fetchevents();
    }
    if(key ==="4"){
      fetchrevents();
    }

    if(key ==="5"){
      fetchcevents();
    }

    setSelectedKey(key);
  };



  if(data[0] !== undefined){
    
    n=data[0].name
    c=data[0].club
    if(data[0].vaild ==='no'){
        navigate("/Notvalidated");
    }
  }



  const handleReg=(click)=>{
    axios.post(' http://localhost:3001/reg', {data:click,club:c,nme:n,uid:Location.state.uid})
        .then(response=>{
          if(response.data.message === "1"){
            alert("Registerd");
          }

          else{
            alert("Already Registerd");
          }

        });

  }

  const getMenuItems = items => {
    return items.map(item => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {getMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      );
    });
  };



   return (
    <Layout style={{ minHeight: '100vh' }}>
      {loading ? (
        <div>
         <center><h2>Loading...</h2></center> 
          </div>
      ) : (
        <>
          <Sider collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
              {getMenuItems(items)}
            </Menu>
          </Sider>

          {selectedKey ==='1' && Location.state && Location.state.uid && (
            <div>
              <h1>Welcome {n}</h1>
              <h1>Club : {c}</h1>
              <h1>Upcomming Events :{events.length}</h1>
              <h1>Registerd Events :{revents.length}</h1>
              <h1>Completed Events :{cevents.length}</h1>
              
            </div>
          )}

          {selectedKey ==='3' &&(
            <div>
              <div>
                <h1>Events</h1>
                <br />
                    <h2>Name</h2>
                    {events.map((data)=>{
                    return( <p>{data.name}</p>);
                    })}

                    <h2>Description</h2>
                    {events.map((data)=>{
                    return( <p>{data.des}</p>);
                    })}
                    
                    <h2>Date</h2>
                    {events.map((data)=>{
                    return( <p>{data.date}</p>);
                    })}  

                    {events.map((data)=>{
                  return(
                    <div>
                    <button onClick={()=>handleReg(data)}>Register</button>
                    <br />
                    </div>
                  );
                  })}
              </div>
            </div>
          )}

        {selectedKey ==='4' &&(
            <div>
              <div>
                <h1>Registerd Events</h1>
                <br />
                    <h2>Name</h2>
                    {revents.map((data)=>{
                    return( <p>{data.name}</p>);
                    })}

                    <h2>Description</h2>
                    {revents.map((data)=>{
                    return( <p>{data.des}</p>);
                    })}
                    
                    <h2>Date</h2>
                    {revents.map((data)=>{
                    return( <p>{data.date}</p>);
                    })}  
   
              </div>
            </div>
          )}
           {selectedKey ==='5' &&(
            <div>
              <div>
                <h1>Completed Events</h1>
                <br />
                    <h2>Name</h2>
                    {cevents.map((data)=>{
                    return( <p>{data.name}</p>);
                    })}

                    <h2>Description</h2>
                    {cevents.map((data)=>{
                    return( <p>{data.des}</p>);
                    })}
                    
                    <h2>Date</h2>
                    {cevents.map((data)=>{
                    return( <p>{data.date}</p>);
                    })}  
   
              </div>
            </div>
          )}
           {selectedKey === '11' && (
            <div >
              <center><p >CHANGE PASSWORD</p></center>

              <form  onSubmit={handlePSubmit}>
                <label >New Password </label>
                <input  type="password" id="cpass" name="cpass" value={pas.cpass} onChange={handlePChange} required/>
                <label >Retype </label>
                <input  type="text" id="rpass" name="rpass" value={pas.rpass} onChange={handlePChange} required/>
                
                <button className="club-create-button" type='submit'>CHANGE</button>
              </form>
            </div>
          )}
          </>
        )}
      </Layout>
    );
   };
  export default UserDashboard;