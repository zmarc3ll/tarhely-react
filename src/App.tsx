import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Row, Col,} from 'react-bootstrap'

interface State {
  newStorage: Storage[];
  newName: string;
  newSize: number;
  newPrice: number;
}

interface Storage {
  id: number;
  name: string;
}

interface StorageResponse {
  storage: Storage[];
}
class App extends Component <{}, State>{

  constructor(props: {}) {
    super(props);

    this.state = {
      newName: '',
      newSize: 0,
      newPrice: 0,
      newStorage: [],
    }
  }

  async storageLoad() {
    let response = await fetch('http://localhost:3000/api/tarhely');
    let data = await response.json() as StorageResponse;
    this.setState({
      newStorage: data.storage,
    })
  }
  componentDidMount() {
    this.storageLoad();
  }

  newStorageHandler = async () => {
    const { newName: newName, newSize: newSize, newPrice: newPrice } = this.state;
    if (newName.trim() == '' || newSize <= 0 || newPrice <= 0) {
      return;
    }

    const data = {
      nev: newName,
      meret: newSize,
      ar: newPrice,
    };

    let response = await fetch('http://localhost:3001/api/tarhely', {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    this.setState({
      newName: '',
      newSize: 0,
      newPrice: 0,
    })

    await this.storageLoad();
  }

  render() {
    const { newName: name, newSize: size, newPrice: price } = this.state;

    return <Container>
      <Row>
        <Col md><h1>Tárhely létrehozása</h1></Col>
      </Row>
      <Row id='form'>
        <Col md>Név: <input type='text' value={name} 
        onChange={e => this.setState({ newName: e.currentTarget.value })} /><br /></Col>
        <Col md>Méret: <input type='number' value={size} 
        onChange={e => this.setState({ newSize: parseInt(e.currentTarget.value) })} /> Gb<br /></Col>
        <Col md>Ár: <input type='number' value={price} 
        onChange={e => this.setState({ newPrice: parseInt(e.currentTarget.value) })} /> Ft<br /></Col>
      </Row>
      <Row id='button'>
        <Col md><button onClick={this.newStorageHandler}>Új felvétele</button></Col>
      </Row>
      <Row>
        <Col md><h1>Meglévő tárhelyek</h1></Col>
      </Row>
      <Row id='listView'>
        <Col md>
          <ul>
            {
              this.state.newStorage.map(tarhely => <li>{tarhely.name}</li>)
            }
          </ul>
        </Col>
      </Row>
    </Container>
  }
}

export default App;