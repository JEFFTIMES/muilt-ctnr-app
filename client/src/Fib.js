import React, { Component } from 'react';
import axios from 'axios';

class Fibonacci extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seenIndics: [],
      values: {}, 
      index: '',
      isPost: false,
      status: 0,
    };
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.fetchSeenIndics = this.fetchSeenIndics.bind(this);
    // this.fetchValues = this.fetchValues.bind(this);
    // this.postIndex = this.postIndex.bind(this);

  }
  
  componentDidMount() {
    this.fetchSeenIndics();
    this.fetchValues();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.isPost !== prevState.isPost) {
      if(this.state.isPost) {
        this.postIndex(this.state.index);
      }
    }
  }

  async postIndex(index){
    const response = await axios.post(
      '/api/values',
      {
        index: parseInt(index)
      }
    );
    this.setState({ isPost:false, status: response.status });

    // try to lift up the status to Component App.
    this.props.setStatus(response.status.toString());
    
  }

  async fetchValues() {
    const result = await axios.get('/api/values/current');
    this.setState({ values: result.data });
    console.log('fetchValues(): ',this.props.getStatus());
  }

  async fetchSeenIndics() {
    const result = await axios.get('/api/values/all');
    this.setState({ seenIndics: result.data });
    console.log('fetchSeenIndics(): ',this.props.getStatus());
  }

  renderSeenIndics() {
    return this.state.seenIndics.map(({number}) => number).join(', ');
  }

  renderCachedValues() {
    const list = Object.entries(this.state.values).map(([index, value]) => {
      return (
        <div key={index}>
          Seen Index: {index} with value: {value}
        </div>
      )
    }); 
    return list;
  }

  renderStatus() { 
    return this.props.getStatus();
  }

  handleInputChange = (event) => {
    event.preventDefault();
    this.setState({ index: event.target.value });
  }

  handleSubmit = (event) => {
    this.setState({ isPost: true });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>please input your index:</label>
          <input 
            value={this.state.index}
            onChange={this.handleInputChange}
          />
          <button>Find</button>
        </form>
        <h3>Seen Indices:</h3>
        {this.renderSeenIndics()}
        <h3>Cached values:</h3>
        {this.renderCachedValues()}
        <h3>Status: {this.renderStatus()}</h3>
      </div>
    )
  }
}

export default Fibonacci;