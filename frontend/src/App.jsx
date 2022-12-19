import logo from './logo.svg';
import './App.css';
import { Container, Button, Table, Modal, Row, Col, Card } from 'react-bootstrap';
import React, { useState, useEffect, useCallback, Fragment, useMemo, useRef, } from "react";
import axios from 'axios';
import _ from "lodash";
//import Table from "./Table";

const Spinner = () => (
  <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
);

function App() {
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const [isupdate, setisupdate] = React.useState(0);

  const [nestPage, setNextPage] = useState(1);
  const [isnext, setisNext] = useState(false);

  const [prevPage, setPrevPage] = useState(0);
  const [isprev, setisPage] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedUser, setSelectedUser] = useState({});
  const [homeWorld, setHomeWorld] = useState({});
  const [species, setSpecies] = useState([]);
  const [filimData, setFilimData] = useState([]);



  // const [currPpage, setCurrPpage] = useState(1);

  const fetchAPIData = async (nestPage) => {
    try {
      // console.log(curr_page, 'page page page')
      // setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/list/${nestPage}`
      );
      const data = await response.json();
      console.log(data, 'data data data data data data ');

      setData(data.results);

      if (data.previous !== null) {
        setisPage(true)
        let url = new URL(data.previous)
        let params = new URLSearchParams(url.search);
        let sourceid = params.get('page') // 'chrome-instant'
        console.log(sourceid, '11111111111111111 sourceid sourceid')
        setPrevPage(sourceid)
      }

      if (data.next !== null) {
        setisNext(true)
        let url = new URL(data.next)
        let params = new URLSearchParams(url.search);
        let sourceid = params.get('page') // 'chrome-instant'
        console.log(sourceid, 'sourceid sourceid sourceid')
        setNextPage(sourceid)
      }

      setPageCount(data.count);
      // setTotalRow(data.paging.total);
      // setLoading(false);
    } catch (e) {
      console.log("Error while fetching", e);
      // setLoading(false)
    }
  };

  useEffect(() => {
    fetchAPIData(nestPage);
  }, [isupdate]);

  // const fetchData = useCallback(
  //   ({ curr_page }) => {
  //     console.log(curr_page, '111111111111111111e page')
  //     const fetchId = ++fetchIdRef.current;
  //     setLoading(true);
  //     if (fetchId === fetchIdRef.current) {
  //       fetchAPIData({
  //         curr_page: curr_page
  //       });
  //     }
  //   },
  //   [isupdate]
  // );

  // const columns = useMemo(() => [
  //   { Header: "SL NO", accessor: "name", show: true },
  //   { Header: "height CODE", accessor: "height", show: true },


  // ]);

  const getNextPage = () => {
    fetchAPIData(nestPage)
  }
  const getPrevPage = () => {
    fetchAPIData(prevPage)
  }

  const _handleSearch = _.debounce(
    async (search) => {
      console.log(search, '111111111111111111e page')
      if(search.length > 0) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/get-user/${search}`
        );
        const data = await response.json();
        console.log(data, 'search search searchsearch search ');
  
        setData(data.results);
  
        if (data.previous !== null) {
          setisPage(true)
          let url = new URL(data.previous)
          let params = new URLSearchParams(url.search);
          let sourceid = params.get('page') // 'chrome-instant'
          console.log(sourceid, '11111111111111111 sourceid sourceid')
          setPrevPage(sourceid)
        }
  
        if (data.next !== null) {
          setisNext(true)
          let url = new URL(data.next)
          let params = new URLSearchParams(url.search);
          let sourceid = params.get('page') // 'chrome-instant'
          console.log(sourceid, 'sourceid sourceid sourceid')
          setNextPage(sourceid)
        }
  
        setPageCount(data.count);
      } else {
        fetchAPIData(1);
      }
   



    },
    1500,
    {
      maxWait: 1500,
    }
  );

  const getUserDetails = async (url) => {
    setLoading(true);
    let urls = new URL(url)
    let path = urls.pathname.split("/").filter(e => Number(e))
    console.log(urls.pathname, 'pathname', path)
    try {

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/user/${path[0]}`
      );
      const data = await response.json();
      console.log(data, 'data data data data data data ');
      setSelectedUser(data.user)
      setHomeWorld(data.homeWorld)
      setFilimData(data.filimData)
      setShow(true);
      setLoading(false)
    } catch (e) {
      console.log("Error while fetching", e);
      // setLoading(false)
    }
  }


  return (
    <div className="App">
      <Container>

      {
        loading ? 
         <Spinner>hi</Spinner>
        : ''
      }

        <Row className="justify-content-md-left">
          <Col xs={8} md={8}></Col>
          <Col xs={4} md={4}>
            <div className="mt-3">
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                onChange={(e) => _handleSearch(e.target.value)}
                placeholder="Search By Name"
                className="appearance-none block w-1/4 float-right px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </Col>
        </Row>


        <Row className="justify-content-md-center">
          <Col xs={10} md={10}>

            {
              data.length > 0 ?
                data.map((row, indx) => (

                    <Card className='userCard' key={indx} style={{ width: '14rem' }}>
                    <Card.Body>
                      <Card.Title className='custom-card-title'>{row.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{row.birth_year}</Card.Subtitle>
                      <Card.Text>
                      <span className='tagsss'> <strong> Hair Color:</strong> </span>{row.hair_color}<br></br>
                     <span className='tagsss'> <strong>Skin Color:</strong> {row.skin_color}</span>
                      </Card.Text>
                  
                      <Card.Link className='link-tag' onClick={() => { getUserDetails(row.url) }}>Details</Card.Link>
                    </Card.Body>
                  </Card>

                  // <tr key={indx}>
                  //   <td> <p onClick={() => { getUserDetails(row.url) }}>{row.name}</p></td>
                  //   <td>{row.height}</td>
                  // </tr>
                ))
                :
                <div>
                  <p></p>
                </div>
            }


            {/* <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
              {
                data.length > 0 ?
                data.map((row, indx) => (
                  <tr key={indx}>
                      <td> <p onClick={ () => { getUserDetails(row.url) } }>{row.name}</p></td>     
                      <td>{row.height}</td>     
                  </tr>
                ))
                : 
                <tr >
                    <th></th>
                </tr>
                }
              </tbody>
            </Table> */}

            




          </Col>
        </Row>


        <Row className="justify-content-md-center">
          <Col xs={10} md={10}>
            <div className='pageClass'>
            <Button size="sm" onClick={getPrevPage} disabled={!isprev}>Prev Page</Button>
            <Button size="sm" onClick={getNextPage} disabled={!isnext}>Next Page</Button>
            </div>
       

          </Col>
        </Row>


      </Container>


      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Card className='model-card' style={{ width: '16rem' }}>
            <Card.Body>
              <Card.Title className='custom-card-title'>{selectedUser.name} Bio</Card.Title>
              <Card.Text>
                <span className='tagsss'> <strong> Gender:</strong> </span>{selectedUser.gender}<br></br>
                <span className='tagsss'> <strong> DOB:</strong> </span>{selectedUser.birth_year}<br></br>
                <span className='tagsss'> <strong> Height:</strong> </span>{selectedUser.height}<br></br>
                <span className='tagsss'> <strong> Weight:</strong> </span>{selectedUser.mass}<br></br>
                <span className='tagsss'> <strong> Hair Color:</strong> </span>{selectedUser.hair_color}<br></br>
                <span className='tagsss'> <strong>Skin Color:</strong> {selectedUser.skin_color}</span><br></br>
                <span className='tagsss'> <strong>Eye Color:</strong> {selectedUser.eye_color}</span>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className='model-card' style={{ width: '16rem' }}>
            <Card.Body>
              <Card.Title className='custom-card-title'> Home World</Card.Title>
              <Card.Text>
                <span className='tagsss'> <strong> Planet Name:</strong> </span>{homeWorld.name}<br></br>
                <span className='tagsss'> <strong> Climate:</strong> </span>{homeWorld.climate}<br></br>
                <span className='tagsss'> <strong> Diameter:</strong> </span>{homeWorld.diameter}<br></br>
                <span className='tagsss'> <strong> Gravity:</strong> </span>{homeWorld.gravity}<br></br>
                <span className='tagsss'> <strong> Population:</strong> </span>{homeWorld.population}<br></br>
                <span className='tagsss'> <strong>Rotation Period:</strong> {homeWorld.rotation_period}</span><br></br>
                <span className='tagsss'> <strong>Surface Water:</strong> {homeWorld.surface_water}</span>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className='model-card' style={{ width: '26rem' }}>
            <Card.Body>
              <Card.Title className='custom-card-title'> Filim List</Card.Title>
              <Card.Text>
              {
              filimData.length > 0 ?
              filimData.map((row, indx) => (
                  <span key={row.episode_id} className='tagsss'><span > <strong> {row.title}</strong> </span>Director: {row.director}<br></br></span>
                ))
              :
              ''
              }
               
              </Card.Text>
            </Card.Body>
          </Card>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;



