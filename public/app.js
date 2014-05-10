/** @jsx React.DOM */
var React = require('react');
var request = require('superagent');

var RepoList = React.createClass({

  itemClicked: function(item) {
    return function() {
    };
  },

  render: function() {
    return (
      <div>
        <ul className='repos'>
        {this.props.repos.map(function(repo) {
          return (
            <li>
              <a href={'#' + repo.name} onClick={this.itemClicked(repo)}>{repo.name}</a>
            </li>
          );
        }.bind(this))}
        </ul>
        <p className='repo-stats'>{this.props.repos.length} repos.</p>
      </div>
    );
  }
});

var CreateRepoInput = React.createClass({
  onSubmit: function() {
    var name = this.refs.name.getDOMNode().value.trim();
    request.post('/api/repos').send({name: name}).end(function(res) {
      if (!res.ok) {
        alert(res.body.error);
      } else {
        this.props.repoAdded(res.body);
      }
      this.refs.name.getDOMNode().value = '';
    }.bind(this));
    return false;
  },

  render: function() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type='text' placeholder='New repository name' ref='name' />
      </form>
    );
  }
})

var App = React.createClass({

  getInitialState: function() {
    return {
      repos: [],
    };
  },

  componentWillMount: function() {
    this.loadRepos();
  },

  loadRepos: function() {
    request.get('/api/repos').end(function(res) {
      this.setState({repos: res.body});
    }.bind(this));
  },

  repoAdded: function(repo) {
    this.setState({repos: this.state.repos.concat([repo])});
  },

  render: function() {
    return (
      <div>
        <CreateRepoInput repoAdded={this.repoAdded} />
        <RepoList repos={this.state.repos} />
      </div>
    );
  }
});

React.renderComponent(
  <App />,
  document.getElementById('app')
);
